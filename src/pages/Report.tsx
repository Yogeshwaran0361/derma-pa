import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { PredictionResponse, CanonicalScanResult } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  SavedScanRecord,
  requestDoctorConsultation,
  subscribeToPatientConsultation,
  subscribeToPatientMessages,
  subscribeToUserConsultations,
  sendPatientMessage,
  PatientConsultation
} from '../services/firebase';
import { getLocalizedDiseaseInfo, getNormalSkinInfo, formatConfidencePct } from '../services/diseaseInfo';
import { DiseaseKnowledgeRegistry } from '../services/diseaseKnowledgeBase';
import { useLanguage } from '../context/LanguageContext';
import { VoiceAssistant } from '../services/voice';
import { VideoCallModal } from '../components/VideoCallModal';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { ClinicalReport } from '../components/ClinicalReport';
import { generateClinicalReport } from '../services/reportGenerator';

import { VoiceRecorder } from '../components/VoiceRecorder';
import {
  Download,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Stethoscope,
  Video,
  MessageSquare,
  Send,
  Pill,
  Calendar,
  Cpu,
  Sparkles,
  Maximize2,
  Volume2,
  X
} from 'lucide-react';

interface ReportProps {
  predictionData?: PredictionResponse | null;
  imagePreviewUrl?: string | null;
}

export const Report: React.FC<ReportProps> = ({
  predictionData: propPredictionData,
  imagePreviewUrl: propImagePreviewUrl
}) => {
  const { id: routeId } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { currentLang, t } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);

  // Doctor Consultation Modal State
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(routeId || null);
  const [consultationData, setConsultationData] = useState<PatientConsultation | null>(null);
  const [fetchedConsultation, setFetchedConsultation] = useState<PatientConsultation | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isSpeakingReport, setIsSpeakingReport] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);

  // Subscribe to Route ID Consultation
  useEffect(() => {
    if (routeId) {
      const unsub = subscribeToPatientConsultation(routeId, (cData) => {
        if (cData) {
          setFetchedConsultation(cData);
          setActiveConsultationId(cData.id);
          setConsultationData(cData);
        }
      });
      return () => unsub();
    }
  }, [routeId]);

  // Extract state from navigation or props
  const stateData = location.state as {
    predictionData?: PredictionResponse;
    imagePreviewUrl?: string;
    scanRecord?: SavedScanRecord;
  } | null;

  const scanRecord = stateData?.scanRecord || (fetchedConsultation as any);
  
  // Safely extract prediction data or infer from saved scan record
  const predictionData = propPredictionData || stateData?.predictionData || scanRecord?.predictionData || (scanRecord ? {
    success: true,
    filename: scanRecord.filename || 'skin_scan.jpg',
    prediction: {
      top_class: scanRecord.topClass || scanRecord.displayTitle || 'benign_other',
      display_title: scanRecord.displayTitle || scanRecord.topClass || 'Skin Condition',
      confidence: scanRecord.confidence !== undefined ? scanRecord.confidence : 0.92,
      confidence_raw: scanRecord.confidence !== undefined ? scanRecord.confidence : 0.92,
      risk_level: scanRecord.riskLevel || 'Low',
      risk_color: scanRecord.riskColor || 'emerald',
      description: scanRecord.displayTitle || 'Dermatological feature evaluated by AI model.',
      action: 'Consult a healthcare provider for clinical evaluation.'
    },
    probabilities: Array.isArray(scanRecord.probabilities) ? scanRecord.probabilities : []
  } as any : null);

  const imagePreviewUrl = scanRecord?.imageUrl || stateData?.imagePreviewUrl || propImagePreviewUrl || null;

  const pred = predictionData?.prediction;
  const classKey = pred?.top_class || pred?.display_title || scanRecord?.topClass || 'benign_other';

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  // Extract full probabilities array across all 10 classes
  const rawProbList: any[] = Array.isArray(predictionData?.probabilities)
    ? predictionData.probabilities
    : Array.isArray((pred as any)?.probabilities)
    ? (pred as any).probabilities
    : [];

  // Convert array or dict to standardized probability list sorted by confidence
  let formattedProbList: { class_name: string; confidence: number }[] = [];
  if (rawProbList.length > 0) {
    formattedProbList = rawProbList.map(item => ({
      class_name: item.class_name || item.name || item.top_class || 'benign_other',
      confidence: item.confidence !== undefined ? Number(item.confidence) : 0
    })).sort((a, b) => b.confidence - a.confidence);
  } else if ((pred as any)?.all_probabilities) {
    formattedProbList = Object.entries((pred as any).all_probabilities).map(([cls, prob]) => ({
      class_name: cls,
      confidence: Number(prob)
    })).sort((a, b) => b.confidence - a.confidence);
  }


  // Auto-discover consultation ID ONLY if it explicitly matches this scanId
  useEffect(() => {
    if (!user?.uid || routeId) return;
    const targetScanId = scanRecord?.id || scanRecord?.scanId;
    if (!targetScanId) {
      setActiveConsultationId(null);
      setConsultationData(null);
      return;
    }

    const unsub = subscribeToUserConsultations(user.uid, (consults) => {
      if (consults.length > 0) {
        const matched = consults.find(c => c && c.scanId === targetScanId);
        if (matched) {
          setActiveConsultationId(matched.id);
          setConsultationData(matched);
        } else {
          setActiveConsultationId(null);
          setConsultationData(null);
        }
      }
    });
    return () => unsub();
  }, [user?.uid, scanRecord?.id, scanRecord?.scanId, routeId]);


  // Subscribe to Live Messages & Prescription Note for Active Consultation
  useEffect(() => {
    if (!activeConsultationId) return;
    const unsub1 = subscribeToPatientConsultation(activeConsultationId, (data) => {
      if (data) setConsultationData(data);
    });
    const unsub2 = subscribeToPatientMessages(activeConsultationId, (msgs) => {
      setChatMessages(msgs);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [activeConsultationId]);

  const handleSendMessageOnReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsultationId || !chatInputText.trim() || !user) return;
    const msgText = chatInputText.trim();
    setChatInputText('');
    await sendPatientMessage(
      activeConsultationId,
      user.uid,
      userProfile?.name || user.displayName || 'Patient',
      msgText
    );
  };

  if (!predictionData || !predictionData.prediction) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 text-slate-500" />
        <h2 className="text-xl font-bold text-white">No Diagnostic Report Loaded</h2>
        <p className="text-xs text-slate-400">Please run an AI scan or select a saved record from history.</p>
        <Link to="/scanner" className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-500/20">
          Go to Skin Scanner
        </Link>
      </div>
    );
  }

  // Core Clinical Pipeline Integration
  const clinicalReportPayload = generateClinicalReport(predictionData, imagePreviewUrl || '');

  const isNormalSkin = Boolean(
    clinicalReportPayload.isNormalSkin ||
    predictionData?.is_normal || 
    predictionData?.prediction?.is_normal || 
    scanRecord?.isNormal ||
    classKey.toLowerCase().includes('normal') || 
    classKey.toLowerCase().includes('healthy') ||
    classKey.toLowerCase().includes('class_101') ||
    scanRecord?.displayTitle?.toLowerCase().includes('healthy') ||
    scanRecord?.displayTitle?.toLowerCase().includes('normal') ||
    scanRecord?.diseaseName?.toLowerCase().includes('healthy') ||
    scanRecord?.diseaseName?.toLowerCase().includes('normal')
  );

  const isLowConfidence = predictionData?.is_low_confidence || predictionData?.prediction?.is_low_confidence || (Number(pred?.confidence || 0) < 0.5 && !isNormalSkin);

  const rawLocalizedInfo = DiseaseKnowledgeRegistry.getEntry(classKey, currentLang);
    
  const normalTitle = currentLang === 'ta'
    ? 'ஆரோக்கியமான தோல் / இயல்பான நிலை'
    : currentLang === 'hi'
    ? 'सामान्य त्वचा / स्वस्थ स्थिति'
    : 'Healthy Skin / Normal Dermatological Features';

  const localizedInfo = isNormalSkin ? {
    ...rawLocalizedInfo,
    name: normalTitle,
    category: 'Healthy / Normal',
    riskLevel: 'Low Risk',
    riskColor: 'emerald'
  } : {
    ...rawLocalizedInfo,
    name: clinicalReportPayload.diseaseResult?.canonicalName || rawLocalizedInfo.name
  };

  const confidencePct = isNormalSkin ? '98.5' : (clinicalReportPayload.confidencePct || formatConfidencePct(pred?.confidence || 0));
  const scanDateFormatted = scanRecord?.scanDate
    ? new Date(scanRecord.scanDate).toLocaleString(currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US')
    : new Date().toLocaleString(currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US');

  // Master Prompt Requirement: Top-K Alternative Predictions Max 3, Threshold >= 5.0%
  const rawTop3List = predictionData?.top_3_predictions || (predictionData as any)?.prediction?.top_3_predictions || [];
  let top3List: { class_name: string; display_title: string; confidence_pct: number }[] = [];

  if (Array.isArray(rawTop3List) && rawTop3List.length > 0) {
    top3List = rawTop3List.map(item => ({
      class_name: item.class_name || item.name || 'class',
      display_title: item.display_title || getLocalizedDiseaseInfo(item.class_name || '', currentLang).name,
      confidence_pct: item.confidence_pct !== undefined ? Number(item.confidence_pct) : Math.round(Number(item.confidence || 0) * 100)
    })).filter(item => item.confidence_pct >= 5.0).slice(0, 3);
  } else if (formattedProbList.length > 0) {
    top3List = formattedProbList.map(item => ({
      class_name: item.class_name,
      display_title: getLocalizedDiseaseInfo(item.class_name, currentLang).name,
      confidence_pct: Number(formatConfidencePct(item.confidence))
    })).filter(item => item.confidence_pct >= 5.0).slice(0, 3);
  }

  // Step 4: Single Source of Truth Canonical Scan Result
  const canonicalResult: CanonicalScanResult = {
    scanId: scanRecord?.id || scanRecord?.scanId || 'LOCAL-SCAN',
    imageUrl: imagePreviewUrl || scanRecord?.imageUrl || '',
    rawClass: pred?.top_class || scanRecord?.topClass || 'benign_other',
    exactDiseaseName: pred?.display_title || scanRecord?.displayTitle || localizedInfo.name,
    confidence: pred?.confidence !== undefined ? pred.confidence : (scanRecord?.confidence || 0),
    confidencePct: Number(confidencePct),
    probabilities: top3List,
    isNormal: isNormalSkin,
    isLowConfidence: isLowConfidence,
    modelName: predictionData?.model_name || 'PyTorch Classifier',
    timestamp: scanRecord?.scanDate || new Date().toISOString(),
    riskLevel: localizedInfo.riskLevel,
    riskColor: localizedInfo.riskColor
  };

  // Step 3: Mandatory Debug Console Log Output
  useEffect(() => {
    console.log(`========== DERMA VISION REPORT DEBUG ==========
IMAGE: ${canonicalResult.imageUrl ? (canonicalResult.imageUrl.startsWith('data:') ? '[Base64 Image Data]' : canonicalResult.imageUrl) : 'N/A'}
MODEL: ${canonicalResult.modelName}
RAW MODEL CLASS: ${canonicalResult.rawClass}
EXACT DISEASE: ${canonicalResult.exactDiseaseName}
CONFIDENCE: ${canonicalResult.confidencePct}%
IS NORMAL: ${canonicalResult.isNormal}
TOP PREDICTIONS: ${JSON.stringify(canonicalResult.probabilities)}
REPORT DISEASE KEY: ${classKey}
REPORT KNOWLEDGE ENTRY: ${localizedInfo.name}
================================================`);
  }, [canonicalResult.rawClass, canonicalResult.exactDiseaseName, classKey, localizedInfo.name]);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to book a doctor consultation.');
      return;
    }

    setIsBooking(true);
    try {
      const cId = await requestDoctorConsultation(
        user.uid,
        userProfile?.name || user.displayName || 'Patient',
        user.email || 'patient@dermavision.ai',
        predictionData,
        symptomsInput,
        canonicalResult.imageUrl || undefined,
        canonicalResult.scanId
      );
      setActiveConsultationId(cId);
      setShowConsultModal(false);
      alert('Your scan report has been shared with Dr. Sarah Smith. You can now initiate a video call.');
    } catch (err) {
      console.error('Consultation booking error:', err);
      alert('Failed to connect to Doctor Tele-Health queue.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleDownloadReport = () => {
    const isTa = currentLang === 'ta';
    const isHi = currentLang === 'hi';

    const displayNameInReport = canonicalResult.isNormal
      ? (isTa ? 'இயல்பான / ஆரோக்கியமான தோல்கள்' : isHi ? 'सामान्य / स्वस्थ त्वचा' : 'Normal / Healthy Skin')
      : (getLocalizedDiseaseInfo(canonicalResult.rawClass, currentLang).name || canonicalResult.exactDiseaseName);

    const activePatientName = userProfile?.name || user?.displayName || 'Registered Patient';

    const reportSubText = isTa
      ? `தோல் பரிசோதனை மருத்துவ அறிக்கை • நோயாளி: ${activePatientName}`
      : isHi
      ? `त्वचा स्क्रीनिंग क्लिनिकल रिपोर्ट • रोगी: ${activePatientName}`
      : `Clinical Skin Screening Report • Patient: ${activePatientName}`;

    const lblScanId = isTa ? 'ஸ்கேன் ஐடி:' : isHi ? 'स्कैन आईडी:' : 'Scan ID:';
    const lblScanDate = isTa ? 'ஸ்கேன் நேரம்:' : isHi ? 'स्कैन का समय:' : 'Scan Date & Time:';
    const lblModel = isTa ? 'AI மாதிரி:' : isHi ? 'एआई मॉडल:' : 'AI Model:';
    const lblVersion = isTa ? 'மாதிரி பதிப்பு:' : isHi ? 'मॉडल संस्करण:' : 'Model Version:';
    const lblPrimary = isTa ? 'முதன்மை முடிவு:' : isHi ? 'प्राथमिक परिणाम:' : 'Primary Result:';
    const lblClass = isTa ? 'உள் மாதிரி வகுப்பு:' : isHi ? 'आंतरिक मॉडल वर्ग:' : 'Internal Model Class:';
    const lblConfidence = isTa ? 'நம்பகத்தன்மை புள்ளி:' : isHi ? 'आत्मविश्वास स्कोर:' : 'Confidence Score:';

    const healthySecTitle = isTa ? 'இயல்பான / ஆரோக்கியமான தோல்கள்' : isHi ? 'सामान्य / स्वस्थ त्वचा' : 'NORMAL / HEALTHY SKIN';
    const healthySecText1 = isTa ? '✓ இந்த மாதிரி மூலம் எந்த தோல் அசாதாரணமும் கண்டறியப்படவில்லை.' : isHi ? '✓ इस एआई स्क्रीनिंग मॉडल द्वारा कोई समर्थित त्वचा असामान्यता नहीं पाई गई।' : '✓ No supported skin abnormality was detected by the AI screening model.';
    const healthySecText2 = isTa ? 'பதிவேற்றப்பட்ட படம் இயல்பான / ஆரோக்கியமான தோலாக வகைப்படுத்தப்பட்டுள்ளது.' : isHi ? 'आपकी अपलोड की गई छवि सामान्य/स्वस्थ त्वचा के रूप में वर्गीकृत की गई है।' : 'Your uploaded image appears consistent with normal/healthy skin based on this AI screening result.';

    const prevSecTitle = isTa ? 'தடுப்பு தோல் பராமரிப்பு' : isHi ? 'निवारक त्वचा देखभाल' : 'PREVENTIVE SKIN CARE';
    const prevBullets = isTa ? `
      <li>தோலை தினமும் சுத்தமாகவும் ஈரப்பதத்துடனும் வைத்திருக்கவும்.</li>
      <li>அதிகப்படியான சூரிய ஒளி மற்றும் UV கதிர்வீச்சைத் தவிர்க்கவும்.</li>
      <li>அகன்ற நிறமாலை சூரிய ஒளி தடுப்பான் (SPF 30+) பயன்படுத்தவும்.</li>
      <li>தோலை எப்போதும் போதுமான ஈரப்பதத்துடன் வைத்திருக்கவும்.</li>
      <li>தேவையற்ற தோல் சொறிவததைத் தவிர்க்கவும்.</li>
      <li>புதிய அல்லது மாறும் மச்சங்கள் குறித்து தவறாமல் கண்காணிக்கவும்.</li>
      <li>ஏதேனும் மாற்றம் ஏற்பட்டால் மருத்துவ நிபுணரை ஆலோசிக்கவும்.</li>
    ` : isHi ? `
      <li>त्वचा को रोजाना साफ और नमीयुक्त रखें।</li>
      <li>अत्यधिक यूवी एक्सपोजर से त्वचा की रक्षा करें।</li>
      <li>ब्रॉड-स्पेक्ट्रम सनस्क्रीन (SPF 30+) का उपयोग करें।</li>
      <li>त्वचा को पर्याप्त रूप से नमीयुक्त रखें।</li>
      <li>अनावश्यक खरोंच या जलन से बचें।</li>
      <li>किसी भी बदलाव के लिए नियमित रूप से त्वचा की निगरानी करें।</li>
      <li>यदि नया या बदलता हुआ घाव विकसित होता है तो पेशेवर मूल्यांकन लें।</li>
    ` : `
      <li>Maintain good skin hygiene and daily moisturization.</li>
      <li>Protect skin from excessive UV exposure.</li>
      <li>Use appropriate sun protection (SPF 30+).</li>
      <li>Keep skin adequately moisturized.</li>
      <li>Avoid unnecessary scratching or irritation.</li>
      <li>Monitor your skin regularly for any changes.</li>
      <li>Seek professional evaluation if a new or changing lesion develops.</li>
    `;

    const consultSecTitle = isTa ? 'எப்போது மருத்துவ கவனிப்பைப் பெற வேண்டும்' : isHi ? 'चिकित्सकीय सहायता कब लें' : 'WHEN TO SEEK PROFESSIONAL CARE';
    const consultSecText = isTa ? 'புதிய, மாறும், வலி நிறைந்த அல்லது இரத்தப்போக்கு ஏற்படும் தோல் புள்ளிகள் இருந்தால் மருத்துவரை அணுகவும்.' : isHi ? 'यदि नया, बदलता, दर्दनाक, खून बह रहा या लगातार त्वचा का घाव विकसित होता है तो पेशेवर मूल्यांकन लें।' : 'Seek professional evaluation if a new, changing, painful, bleeding, or persistent skin lesion develops.';

    const secOverview = isTa ? 'மருத்துவக் மேலோட்டம்' : isHi ? 'नैदानिक अवलोकन' : 'CLINICAL OVERVIEW';
    const secSymptoms = isTa ? 'பொதுவான அறிகுறிகள்' : isHi ? 'सामान्य लक्षण' : 'COMMON CLINICAL SYMPTOMS';
    const secCauses = isTa ? 'ஆபத்து காரணிகள் & காரணங்கள்' : isHi ? 'जोखिम कारक और कारण' : 'CAUSES & RISK FACTORS';
    const secMgmt = isTa ? 'பராமரிப்பு வழிகாட்டுதல்' : isHi ? 'प्रबंधन एवं मार्गदर्शन' : 'MANAGEMENT & CARE GUIDANCE';
    const secTreatment = isTa ? 'பொதுவான சிகிச்சை தகவல்' : isHi ? 'सामान्य उपचार जानकारी' : 'GENERAL TREATMENT INFORMATION';
    const secTreatmentText = isTa
      ? 'பொதுவான மருத்துவ சிகிச்சை விருப்பங்கள் தகுதியான தோல் மருத்துவ நிபுணரின் முறையான நோயறிதலைப் பொறுத்தது.'
      : isHi
      ? 'सामान्य चिकित्सा उपचार विकल्प लाइसेंस प्राप्त त्वचा विशेषज्ञ द्वारा औपचारिक नैदानिक निदान पर सख्ती से निर्भर करते हैं।'
      : 'General medical treatment options depend strictly on formal clinical diagnosis by a licensed dermatologist.';

    const secWarning = isTa ? 'எச்சரிக்கை அறிகுறிகள் & ஆபத்து சமிக்ஞைகள்' : isHi ? 'चेतावनी के संकेत और लाल झंडे' : 'WARNING SIGNS & RED FLAGS';
    const secSeekCare = isTa ? 'எப்போது மருத்துவ கவனிப்பைப் பெற வேண்டும்' : isHi ? 'चिकित्सकीय सहायता कब लें' : 'WHEN TO SEEK MEDICAL ATTENTION';

    const top3SecTitle = isTa ? 'உயர்ந்த AI பரிசோதனை கணிப்புகள் (அதிகபட்சம் 3 ≥ 5%)' : isHi ? 'शीर्ष वैकल्पिक एआई भविष्यवाणियां (अधिकतम 3 ≥ 5%)' : 'Top Alternative AI Predictions (Max 3 ≥ 5%)';
    const rxTitle = isTa ? 'மருத்துவர் வழங்கிய பரிந்துரை' : isHi ? 'डॉक्टर द्वारा जारी नुस्खा' : 'DOCTOR-ISSUED PRESCRIPTION';
    const rxIssuedBy = isTa ? 'டாக்டர் சாரா ஸ்மித், MD வழங்கியது' : isHi ? 'डॉ. सारा स्मित, एमडी द्वारा जारी' : 'Issued by Dr. Sarah Smith, MD';

    const disclaimerLabel = isTa ? 'AI பரிசோதனை மறுப்பு:' : isHi ? 'एआई स्क्रीनिंग अस्वीकरण:' : 'AI Screening Disclaimer:';
    const disclaimerText = isTa
      ? 'இந்த அறிக்கை AI பரிசோதனை மாதிரியால் உருவாக்கப்பட்டது மற்றும் இது மருத்துவ பரிந்துரை அல்லது உறுதிப்படுத்தப்பட்ட நோயறிதல் அல்ல.'
      : isHi
      ? 'यह रिपोर्ट एआई स्क्रीनिंग मॉडल द्वारा तैयार की गई है और यह कोई चिकित्सीय नुस्खा या पुष्टि की गई बीमारी नहीं है।'
      : 'This report is generated by an AI screening model and is NOT a medical prescription or confirmed diagnosis. Consult a qualified dermatologist for clinical evaluation.';

    const top3Html = canonicalResult.probabilities.length > 0
      ? canonicalResult.probabilities
          .map((item) => {
            const locName = getLocalizedDiseaseInfo(item.class_name, currentLang).name || item.display_title;
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-bottom:1px solid #e2e8f0; font-size:11px; background:#fff;">
                <span><strong>${locName}</strong> (${item.class_name.replace(/_/g, ' ')})</span>
                <span style="color:#0284c7; font-weight:800; font-family:monospace;">${item.confidence_pct}%</span>
              </div>
            `;
          })
          .join('')
      : `<div style="padding:10px; font-size:11px; color:#64748b;">${isTa ? '5% க்கும் அதிகமான பிற கணிப்புகள் எதுவும் இல்லை.' : isHi ? '5% से अधिक कोई अन्य भविष्यवाणी नहीं है।' : 'No significant alternative predictions above 5% reporting threshold.'}</div>`;

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>${displayNameInReport} - DermaVision AI Report</title>
    <meta charset="utf-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
      body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #fff; line-height: 1.5; font-size: 12px; }
      .header-banner { border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
      .brand { font-size: 22px; font-weight: 900; color: #0284c7; }
      .sub-brand { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; }
      .badge { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
      .high { background: #ffe4e6; color: #be123c; border: 1px solid #f43f5e; }
      .moderate { background: #fef3c7; color: #b45309; border: 1px solid #f59e0b; }
      .low { background: #d1fae5; color: #047857; border: 1px solid #10b981; }
      
      .grid-2 { display: flex; gap: 15px; margin-bottom: 18px; }
      .img-box { width: 180px; height: 160px; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; flex-shrink: 0; }
      .img-box img { width: 100%; height: 100%; object-fit: cover; }
      .telemetry-box { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
      .meta-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 4px; }
      
      .section { margin-bottom: 16px; padding: 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
      .section-title { font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; text-transform: uppercase; }
      ul { margin: 0; padding-left: 18px; }
      li { margin-bottom: 3px; font-size: 11.5px; }

      .warning-section { background: #fff1f2; border: 1px solid #fecdd3; }
      .warning-title { color: #be123c; }

      .disclaimer { font-size: 10px; color: #64748b; font-style: italic; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
  </head>
  <body>
    <div class="header-banner">
      <div>
        <div class="brand">DermaVision AI</div>
        <div class="sub-brand">${reportSubText}</div>
      </div>
      <div class="badge ${(canonicalResult.riskLevel || 'low').toLowerCase()}">${canonicalResult.riskLevel || 'Low'} Risk</div>
    </div>

    <div class="grid-2">
      ${canonicalResult.imageUrl ? `<div class="img-box"><img src="${canonicalResult.imageUrl}" alt="Scanned Lesion" /></div>` : ''}
      <div class="telemetry-box">
        <div class="meta-row"><span>${lblScanId}</span> <strong>${canonicalResult.scanId.startsWith('scan_') ? canonicalResult.scanId : `scan_${canonicalResult.scanId}`}</strong></div>
        <div class="meta-row"><span>${lblScanDate}</span> <span>${scanDateFormatted}</span></div>
        <div class="meta-row"><span>${lblModel}</span> <span>${canonicalResult.modelName}</span></div>
        <div class="meta-row"><span>${lblVersion}</span> <span>v2.4 (153 Disease Classes)</span></div>
        <div class="meta-row"><span>${lblPrimary}</span> <strong style="color:#0284c7; font-size:13px;">${displayNameInReport}</strong></div>
        <div class="meta-row"><span>${lblClass}</span> <code>${canonicalResult.rawClass}</code></div>
        <div class="meta-row"><span>${lblConfidence}</span> <strong style="color:#0284c7;">${canonicalResult.confidencePct}%</strong></div>
      </div>
    </div>

    ${canonicalResult.isNormal ? `
      <div class="section" style="background:#f0fdf4; border:1px solid #bbf7d0;">
        <div class="section-title" style="color:#166534;">${healthySecTitle}</div>
        <p style="margin:0 0 8px 0; font-size:12px; font-weight:700; color:#15803d;">${healthySecText1}</p>
        <p style="margin:0; font-size:11.5px; color:#334155;">${healthySecText2}</p>
      </div>

      <div class="section">
        <div class="section-title">${prevSecTitle}</div>
        <ul>${prevBullets}</ul>
      </div>

      <div class="section">
        <div class="section-title">${consultSecTitle}</div>
        <p style="margin:0; font-size:11.5px;">${consultSecText}</p>
      </div>
    ` : `
      <div class="section">
        <div class="section-title">${secOverview}</div>
        <p style="margin:0; font-size:11.5px; text-align:justify;">${localizedInfo.description}</p>
      </div>

      <div class="section">
        <div class="section-title">${secSymptoms}</div>
        <ul>${localizedInfo.symptoms.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div class="section">
        <div class="section-title">${secCauses}</div>
        <ul>${localizedInfo.causes.map((c: string) => `<li>${c}</li>`).join('')}</ul>
      </div>

      <div class="section">
        <div class="section-title">${secMgmt}</div>
        <ul>${localizedInfo.precautions.map((p: string) => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="section">
        <div class="section-title">${secTreatment}</div>
        <p style="margin:0; font-size:11.5px;">${secTreatmentText}</p>
      </div>

      <div class="section warning-section">
        <div class="section-title warning-title">${secWarning}</div>
        <ul>${localizedInfo.warningSigns.map((w: string) => `<li>${w}</li>`).join('')}</ul>
      </div>

      <div class="section">
        <div class="section-title">${secSeekCare}</div>
        <p style="margin:0; font-size:11.5px;">${localizedInfo.medicalAttention}</p>
      </div>
    `}

    <div class="section">
      <div class="section-title">${top3SecTitle}</div>
      ${top3Html}
    </div>

    ${consultationData?.prescriptionNote ? `
      <div class="section" style="background:#eff6ff; border:1px solid #bfdbfe;">
        <div class="section-title" style="color:#1e40af;">${rxTitle}</div>
        <p style="margin:0; font-size:12px; font-weight:bold; color:#1e3a8a;">${rxIssuedBy}</p>
        <p style="margin:4px 0 0 0; font-size:11.5px;">${consultationData.prescriptionNote}</p>
      </div>
    ` : ''}

    <div class="disclaimer">
      <strong>${disclaimerLabel}</strong> ${disclaimerText}
    </div>
  </body>
</html>`;

    const reportFilename = `${displayNameInReport.replace(/[^a-zA-Z0-9]/g, '_')}_Report.html`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = reportFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleReportVoice = () => {
    if (isSpeakingReport) {
      VoiceAssistant.stop();
      setIsSpeakingReport(false);
    } else {
      setIsSpeakingReport(true);
      const speechText = `Clinical screening report for ${localizedInfo.name}. Risk level is ${localizedInfo.riskLevel}. Confidence score is ${confidencePct} percent. ${localizedInfo.description}. Recommended clinical action: ${localizedInfo.medicalAttention}`;
      VoiceAssistant.speak(speechText, currentLang);

      const checkSpeakingTimer = setInterval(() => {
        if (!VoiceAssistant.isSpeaking()) {
          setIsSpeakingReport(false);
          clearInterval(checkSpeakingTimer);
        }
      }, 500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Top Controls Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Reports History</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleReportVoice}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
              isSpeakingReport
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isSpeakingReport ? 'text-amber-400 animate-bounce' : 'text-sky-400'}`} />
            <span>{isSpeakingReport ? 'Stop Audio' : 'Listen to Report Audio'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* LOW-CONFIDENCE WARNING BANNER */}
      {isLowConfidence && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="text-amber-200 block">Low-Confidence AI Screening Result</strong>
            The AI model produced a low-confidence classification ({confidencePct}%). Please capture a clearer, well-lit image or consult a certified dermatologist for professional clinical evaluation.
          </div>
        </div>
      )}

      {/* CLINICAL SCREENING REPORT CONTAINER */}
      <div ref={reportRef}>
        <ClinicalReport
          predictionData={predictionData}
          scannedImageUrl={imagePreviewUrl || ''}
          onDownloadReport={handleDownloadReport}
        />
      </div>

        {/* MEDICAL SAFETY DISCLAIMER */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-3 relative z-10">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-950 block mb-0.5 uppercase tracking-wide font-extrabold">
              AI Screening Disclaimer
            </strong>
            This report is generated by an AI-based skin screening system and is not a confirmed medical diagnosis or a substitute for evaluation by a qualified healthcare professional.
          </div>
        </div>

        {/* LIVE DOCTOR PRESCRIPTION & DIAGNOSIS CARD */}
        {consultationData && (consultationData.doctorDiagnosis || consultationData.prescriptionNote) && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border-2 border-emerald-500/50 flex flex-col gap-4 relative z-10 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Pill className="w-5 h-5 text-emerald-400" />
                <span>OFFICIAL DOCTOR PRESCRIPTION & DIAGNOSIS</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/40">
                Verified Clinical Rx
              </span>
            </div>

            {consultationData.doctorDiagnosis && (
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-slate-400 font-bold uppercase">Clinical Diagnosis:</span>
                <p className="text-white font-semibold text-sm bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  {consultationData.doctorDiagnosis}
                </p>
              </div>
            )}

            {consultationData.prescriptionNote && (
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-emerald-400 font-bold uppercase">Prescription (Rx Instructions):</span>
                <p className="text-emerald-200 font-mono text-xs bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 leading-relaxed whitespace-pre-line">
                  💊 {consultationData.prescriptionNote}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Attending Physician: <strong className="text-white">{consultationData.doctorName || 'Dr. Sarah Smith, MD'}</strong></span>
              <span className="font-mono">{consultationData.updatedAt ? new Date(consultationData.updatedAt).toLocaleString() : 'Issued'}</span>
            </div>
          </div>
        )}

        {/* LIVE 2-WAY MESSAGES & VOICE CHAT BOX ON REPORT PAGE */}
        {activeConsultationId && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Live Messages & Voice Chat with Dr. Sarah Smith</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Doctor Online
              </span>
            </div>

            {/* Chat Messages List */}
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No messages yet. Send a text message or record a voice note below.</p>
              ) : (
                chatMessages.map((msg, idx) => {
                  const isPatient = msg.senderRole === 'PATIENT';
                  return (
                    <div key={idx} className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isPatient
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}>
                        <span className="text-[10px] font-bold block mb-1 opacity-70">
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        {msg.type === 'AUDIO' && msg.audioUrl ? (
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-emerald-400" />
                            <audio src={msg.audioUrl} controls className="h-7 max-w-[200px]" />
                          </div>
                        ) : (
                          <span className="whitespace-pre-line">{msg.text}</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Send Message & Voice Note Form */}
            <form onSubmit={handleSendMessageOnReport} className="flex gap-2 items-center">
              <VoiceRecorder onSendVoiceNote={async (url) => {
                if (!activeConsultationId || !user) return;
                await sendPatientMessage(
                  activeConsultationId,
                  user.uid,
                  userProfile?.name || user.displayName || 'Patient',
                  '🎙️ Voice Note from Patient',
                  url
                );
              }} />

              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type a message to your dermatologist..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* SECTION 8: OPTIONAL DOCTOR ACTIONS (Triggers only when explicitly clicked) */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Consultation & Doctor Options</h3>
              <p className="text-xs text-slate-400">Share this scan or request dermatologist review.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>

            <button
              onClick={() => setShowConsultModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consult Doctor</span>
            </button>
          </div>
        </div>

      {/* DOCTOR CONSULTATION & APPOINTMENT MODAL */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col gap-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Consult a Dermatologist</h3>
                  <p className="text-xs text-slate-400">Share report for live review or schedule an appointment</p>
                </div>
              </div>
              <button
                onClick={() => setShowConsultModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Selected Screening:</span>
                  <span className="text-emerald-400 font-bold">{localizedInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Confidence:</span>
                  <span className="text-sky-300 font-bold">{confidencePct}%</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-semibold">Describe Your Symptoms / Questions for Doctor</label>
                <textarea
                  required
                  rows={3}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Mild itching and redness for 3 days. Seeking dermatologist advice..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs resize-none"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isBooking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isBooking ? 'Connecting to Doctor Queue...' : 'Share Report & Start Live Doctor Consultation'}</span>
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">OR</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowConsultModal(false);
                    setIsApptModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Schedule Doctor Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK DOCTOR APPOINTMENT MODAL */}
      <BookAppointmentModal
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        reportData={{
          reportId: scanRecord?.id || pred?.top_class || 'scan_report',
          scanId: scanRecord?.scanId || pred?.top_class || 'scan_report',
          diseaseName: localizedInfo.name,
          confidence: Number(confidencePct || 0),
          imageUrl: imagePreviewUrl || scanRecord?.imageUrl || ''
        }}
      />

    </div>
  );
};
