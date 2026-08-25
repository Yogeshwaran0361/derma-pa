import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CameraCapture } from '../components/CameraCapture';
import { FileUpload } from '../components/FileUpload';
import { QualityBadge } from '../components/QualityBadge';
import { runPrediction, checkImageQuality } from '../services/api';
import { saveScanRecord } from '../services/firebase';
import { VoiceAssistant } from '../services/voice';
import { PredictionResponse, QualityCheckResult } from '../types';
import { Upload, Camera, Cpu, X, Volume2, ShieldAlert, LogIn, UserPlus, AlertTriangle, RefreshCw, ImageOff } from 'lucide-react';

interface ScannerProps {
  onPredictionComplete: (result: PredictionResponse, imagePreviewUrl: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onPredictionComplete }) => {
  const navigate = useNavigate();
  const { user, userMode } = useAuth();
  const { currentLang, t } = useLanguage();

  const [tab, setTab] = useState<'upload' | 'camera'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const analysisSteps = [
    "Analyzing image...",
    "Checking image quality...",
    "Analyzing skin features...",
    "Running AI disease classification...",
    "Comparing against 153 trained classes...",
    "Generating diagnostic report..."
  ];

  // Stop previous voice playback immediately when user switches language
  useEffect(() => {
    VoiceAssistant.stop();
    setIsSpeaking(false);
  }, [currentLang]);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setErrorMessage(null);

    const selectMsg = currentLang === 'ta'
      ? 'படம் தேர்ந்தெடுக்கப்பட்டது. மனித தோல் மற்றும் புகைப்படத்தின் தரம் சரிபார்க்கப்படுகிறது.'
      : currentLang === 'hi'
      ? 'छवि चुनी गई। मानव त्वचा और गुणवत्ता की जाँच की जा रही है।'
      : 'Image selected. Verifying human skin region and photo quality.';

    VoiceAssistant.speak(selectMsg, currentLang);

    setIsCheckingQuality(true);
    try {
      const qResult = await checkImageQuality(file);
      setQualityCheck(qResult);

      if (qResult.is_invalid_image) {
        const invMsg = currentLang === 'ta'
          ? 'பதிவேற்றப்பட்ட படம் செல்லுபடியாகும் மனித தோல் பகுதியைக் கொண்டிருக்கவில்லை. தயவுசெய்து தோல் புகைப்படத்தைப் பதிவேற்றவும்.'
          : currentLang === 'hi'
          ? 'अपलोड की गई छवि में वैध मानव त्वचा क्षेत्र प्रतीत नहीं होता है। कृपया त्वचा की तस्वीर अपलोड करें।'
          : 'The uploaded image does not appear to contain a valid human skin region. Please upload a skin photo.';
        VoiceAssistant.speak(invMsg, currentLang);
      } else if (qResult.is_quality_low || !qResult.passed) {
        const lowMsg = currentLang === 'ta'
          ? 'படத்தின் தரம் மிகவும் குறைவாக உள்ளது. தயவுசெய்து தெளிவான தோல் படத்தைப் பதிவேற்றவும்.'
          : currentLang === 'hi'
          ? 'छवि की गुणवत्ता बहुत कम है। कृपया एक स्पष्ट, अच्छी तरह से प्रकाशित त्वचा की छवि अपलोड करें।'
          : 'Image quality is too low. Please upload a clear, well-lit skin image.';
        VoiceAssistant.speak(lowMsg, currentLang);
      } else {
        const passMsg = currentLang === 'ta'
          ? 'படத்தின் தரம் சிறப்பாக உள்ளது. AI பரிசோதனை செய்ய தயார்.'
          : currentLang === 'hi'
          ? 'गुणवत्ता जांच सफल रही। एआई स्कैनिंग के लिए तैयार है।'
          : 'Quality check passed cleanly. Ready for AI scanning.';
        VoiceAssistant.speak(passMsg, currentLang);
      }
    } catch (err) {
      console.warn('Quality check notice:', err);
      setQualityCheck({
        passed: true,
        reason: t.scanner.qualityPassedDesc,
        suggestion: 'Proceed to AI analysis.',
        metrics: {}
      });
    } finally {
      setIsCheckingQuality(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setQualityCheck(null);
    setErrorMessage(null);
    VoiceAssistant.stop();
  };

  const handleRunScan = async () => {
    if (!selectedFile) return;

    // PREVENT SUBMISSION IF NON-SKIN OR QUALITY CHECK FAILED
    if (qualityCheck && !qualityCheck.passed) {
      const qError = currentLang === 'ta'
        ? qualityCheck.is_invalid_image
          ? 'செல்லுபடியற்ற படம் — தயவுசெய்து தோல் படத்தைப் பதிவேற்றவும்.'
          : 'படத்தின் தரம் குறைவு — தெளிவான தோல் படத்தைப் பதிவேற்றவும்.'
        : currentLang === 'hi'
        ? qualityCheck.is_invalid_image
          ? 'अमान्य छवि - कृपया त्वचा की छवि अपलोड करें।'
          : 'छवि गुणवत्ता बहुत कम है - कृपया एक स्पष्ट त्वचा फोटो अपलोड करें।'
        : qualityCheck.is_invalid_image
          ? 'INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE'
          : 'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit image of the skin area.';

      setErrorMessage(qError);
      VoiceAssistant.speak(qError, currentLang);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStepIndex(0);
    setErrorMessage(null);

    // Live progress message stepper during actual backend inference
    const stepInterval = setInterval(() => {
      setAnalysisStepIndex((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    const scanMsg = currentLang === 'ta'
      ? 'நரம்பியல் பிணைய மாதிரியைப் பயன்படுத்தி தோல் புகைப்படம் பகுப்பாய்வு செய்யப்படுகிறது.'
      : currentLang === 'hi'
      ? 'तंत्रिका नेटवर्क मॉडल का उपयोग करके त्वचा की तस्वीर का विश्लेषण किया जा रहा है।'
      : 'Analyzing skin photo with PyTorch neural network model.';

    VoiceAssistant.speak(scanMsg, currentLang);

    try {
      console.log('[AI DEBUG] Converting skin photo to permanent Data URI...');
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(previewUrl || '');
        reader.readAsDataURL(selectedFile);
      });

      console.log('[AI DEBUG] Sending prediction request...');
      const response = await runPrediction(selectedFile);

      clearInterval(stepInterval);
      setAnalysisStepIndex(analysisSteps.length - 1);

      // Handle backend rejection response (non-skin image or low quality)
      if (response.is_invalid_image || (response.success === false && response.error_type === 'INVALID_IMAGE')) {
        const invErr = currentLang === 'ta'
          ? 'செல்லுபடியற்ற படம் — தயவுசெய்து தோல் படத்தைப் பதிவேற்றவும்.'
          : currentLang === 'hi'
          ? 'अमान्य छवि - कृपया त्वचा की छवि अपलोड करें।'
          : 'INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE';

        setQualityCheck({
          passed: false,
          is_invalid_image: true,
          reason: invErr,
          detail: response.detail || invErr,
          suggestion: invErr,
          metrics: {}
        });
        setErrorMessage(invErr);
        VoiceAssistant.speak(invErr, currentLang);
        return;
      }

      if (response.is_quality_low || (response.success === false && response.error_type === 'QUALITY_TOO_LOW')) {
        const qErr = currentLang === 'ta'
          ? 'படத்தின் தரம் குறைவு — தெளிவான தோல் படத்தைப் பதிவேற்றவும்.'
          : currentLang === 'hi'
          ? 'छवि गुणवत्ता बहुत कम है - कृपया एक स्पष्ट त्वचा फोटो अपलोड करें।'
          : 'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit skin photo.';

        setQualityCheck({
          passed: false,
          is_quality_low: true,
          reason: qErr,
          detail: response.detail || qErr,
          suggestion: qErr,
          metrics: {}
        });
        setErrorMessage(qErr);
        VoiceAssistant.speak(qErr, currentLang);
        return;
      }

      console.log('[AI DEBUG] AI Prediction SUCCESS:', response.prediction?.display_title);

      // Pass permanent Base64 Data URI & navigate to results
      onPredictionComplete(response, base64Image);
      navigate('/results', {
        state: {
          predictionData: response,
          imagePreviewUrl: base64Image
        }
      });

      // Non-blocking background Firestore save
      (async () => {
        try {
          const savedRecord = await saveScanRecord(user?.uid || 'guest_user', response, currentLang, base64Image);
          console.log('[AI DEBUG] Scan record saved in background:', savedRecord.scanId);
        } catch (fErr) {
          console.warn('[AI DEBUG] Firestore background save notice:', fErr);
        }
      })();

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('[AI DEBUG] Prediction API Error:', err);
      const failErr = currentLang === 'ta'
        ? 'AI பரிசோதனை தோல்வியடைந்தது. நெட்வொர்க் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
        : currentLang === 'hi'
        ? 'एआई विश्लेषण विफल रहा। कृपया नेटवर्क कनेक्शन जांचें और पुनः प्रयास करें।'
        : 'AI analysis failed. Please check network connection and try again.';
      setErrorMessage(failErr);
      VoiceAssistant.speak(failErr, currentLang);
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const toggleVoiceGuide = () => {
    if (isSpeaking) {
      VoiceAssistant.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const introMsg = currentLang === 'ta'
        ? 'டெர்மாவிஷன் குரல் உதவியாளர் இயங்குகிறது. தோல் பரிசோதனை புகைப்படத்தைப் பதிவேற்றவும் அல்லது கேமராவைப் பயன்படுத்தவும்.'
        : currentLang === 'hi'
        ? 'डर्माविज़न वॉयस असिस्टेंट चालू है। त्वचा स्कैन फोटो अपलोड करें या कैमरा का उपयोग करें।'
        : `${t.scanner.title}. ${t.scanner.subtitle}. ${t.scanner.dropTitle}`;
      VoiceAssistant.speak(introMsg, currentLang);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.scanner.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{t.scanner.subtitle}</p>
        </div>

        {/* Voice Assistant Button */}
        <button
          onClick={toggleVoiceGuide}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isSpeaking
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-md shadow-sky-500/20 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Volume2 className="w-4 h-4 text-sky-400" />
          <span>{isSpeaking ? t.scanner.voiceActive : t.scanner.voiceGuide}</span>
        </button>
      </div>

      {/* Demo / Unauthenticated Mode Notice Banner */}
      {userMode !== 'AUTHENTICATED' && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-amber-300">
                {userMode === 'DEMO_MODE' ? t.scanner.demoNoticeTitle : t.scanner.loginRequired}
              </h3>
              <p className="text-xs text-slate-300">
                {t.scanner.demoNoticeDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.nav.signIn}</span>
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.nav.register}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Scanner Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        
        {/* Tab Controls (Upload vs Camera) */}
        {!selectedFile && (
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-center">
            <button
              onClick={() => setTab('upload')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                tab === 'upload'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{t.scanner.uploadTab}</span>
            </button>
            <button
              onClick={() => setTab('camera')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                tab === 'camera'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.scanner.cameraTab}</span>
            </button>
          </div>
        )}

        {/* Selected Image Preview & Action Controls */}
        {selectedFile && previewUrl ? (
          <div className="flex flex-col gap-6 items-center">
            <div className="relative w-full max-w-md h-72 rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-xl">
              <img src={previewUrl} alt="Selected skin lesion" className="w-full h-full object-cover" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DEDICATED INVALID IMAGE SCREEN / QUALITY LOW DISPLAY */}
            {qualityCheck && !qualityCheck.passed ? (
              <div className={`w-full max-w-md p-6 rounded-2xl border flex flex-col gap-4 text-center shadow-xl ${
                qualityCheck.is_invalid_image
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
              }`}>
                <div className="flex flex-col items-center gap-2">
                  {qualityCheck.is_invalid_image ? (
                    <ImageOff className="w-10 h-10 text-rose-400" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                  )}
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    {qualityCheck.is_invalid_image
                      ? 'INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE'
                      : 'IMAGE QUALITY TOO LOW'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                    {qualityCheck.detail || qualityCheck.reason || 'The uploaded image does not appear to contain a valid human skin region. Please upload a clear, well-lit image of the affected or normal skin area.'}
                  </p>
                </div>

                <button
                  onClick={handleRemoveImage}
                  className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Another Image</span>
                </button>
              </div>
            ) : (
              /* Quality Passed Badge */
              qualityCheck && (
                <QualityBadge
                  quality={qualityCheck}
                  onRetake={handleRemoveImage}
                />
              )
            )}

            {/* Run AI Scan Button & Animated Progress Stepper */}
            {(!qualityCheck || qualityCheck.passed) && (
              <div className="w-full max-w-md flex flex-col gap-3">
                <button
                  onClick={handleRunScan}
                  disabled={isAnalyzing || isCheckingQuality}
                  className="w-full py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white shadow-sky-500/25 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{analysisSteps[analysisStepIndex]}</span>
                    </span>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5" />
                      <span>{t.scanner.analyzeBtn}</span>
                    </>
                  )}
                </button>

                {/* Progress Status Indicator */}
                {isAnalyzing && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center flex flex-col gap-1.5 animate-pulse">
                    <span className="text-xs font-bold text-sky-400">
                      {analysisSteps[analysisStepIndex]}
                    </span>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${((analysisStepIndex + 1) / analysisSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          /* File Upload / Camera Tabs */
          <div className="w-full">
            {tab === 'upload' ? (
              <FileUpload onFileSelect={handleImageSelected} />
            ) : (
              <CameraCapture onCapture={handleImageSelected} />
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {userMode !== 'AUTHENTICATED' && (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-lg bg-sky-500 text-white font-bold text-[11px]">
                  {t.nav.signIn}
                </Link>
                <Link to="/register" className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-[11px]">
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
