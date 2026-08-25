import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getUserScanHistory,
  SavedScanRecord,
  subscribeToUserConsultations,
  subscribeToPatientMessages,
  sendPatientMessage,
  requestDoctorConsultation,
  PatientConsultation,
  PatientMessage,
  deleteScanRecord,
  deleteAllScanHistory
} from '../services/firebase';
import { getLocalizedDiseaseInfo, getNormalSkinInfo, formatConfidencePct } from '../services/diseaseInfo';
import {
  FileText,
  ArrowRight,
  Calendar,
  Stethoscope,
  MessageSquare,
  Send,
  X,
  Share2,
  CheckCircle2,
  Clock,
  Pill,
  User,
  ShieldCheck,
  Mic,
  Trash2
} from 'lucide-react';
import { VoiceRecorder } from '../components/VoiceRecorder';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { currentLang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'scans' | 'shared'>('scans');
  const [scans, setScans] = useState<SavedScanRecord[]>([]);
  const [consultations, setConsultations] = useState<PatientConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteScan = async (scanId: string) => {
    if (!user?.uid) return;
    const confirmMsg = currentLang === 'ta'
      ? 'இந்த ஸ்கேன் வரலாற்றை நீக்க வேண்டுமா?'
      : currentLang === 'hi'
      ? 'क्या आप इस स्कैन रिकॉर्ड को हटाना चाहते हैं?'
      : 'Are you sure you want to delete this scan record?';

    if (window.confirm(confirmMsg)) {
      await deleteScanRecord(user.uid, scanId);
      setScans((prev) => prev.filter((s) => s.id !== scanId && s.scanId !== scanId));
    }
  };

  const handleClearAllScans = async () => {
    if (!user?.uid) return;
    const confirmMsg = currentLang === 'ta'
      ? 'அனைத்து ஸ்கேன் வரலாற்றையும் நீக்க வேண்டுமா?'
      : currentLang === 'hi'
      ? 'क्या आप सभी स्कैन इतिहास को हटाना चाहते हैं?'
      : 'Are you sure you want to delete ALL scan history? This action cannot be undone.';

    if (window.confirm(confirmMsg)) {
      await deleteAllScanHistory(user.uid);
      setScans([]);
    }
  };

  // Live Chat Modal State
  const [selectedConsultation, setSelectedConsultation] = useState<PatientConsultation | null>(null);
  const [chatMessages, setChatMessages] = useState<PatientMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSharing, setIsSharing] = useState<string | null>(null);

  // Fetch Scan History
  useEffect(() => {
    const fetchScans = async () => {
      if (user?.uid) {
        try {
          const records = await getUserScanHistory(user.uid);
          setScans(records);
        } catch (err) {
          console.warn('History fetchScans notice:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchScans();
  }, [user]);

  // Subscribe to Doctor Consultations / Shared Reports
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserConsultations(user.uid, (consults) => {
      setConsultations(consults);
    });
    return () => unsub();
  }, [user?.uid]);

  // Subscribe to Live Chat Messages when a consultation is selected
  useEffect(() => {
    if (!selectedConsultation?.id) return;
    const unsub = subscribeToPatientMessages(selectedConsultation.id, (msgs) => {
      setChatMessages(msgs);
    });
    return () => unsub();
  }, [selectedConsultation?.id]);

  // Send Message to Doctor
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation?.id || !chatInput.trim() || !user) return;
    const isAccepted = Boolean(
      selectedConsultation.acceptedByDoctorId || 
      (selectedConsultation.doctorName && !selectedConsultation.doctorName.includes('Awaiting'))
    );
    if (!isAccepted) return;
    const msgText = chatInput.trim();
    setChatInput('');
    await sendPatientMessage(
      selectedConsultation.id,
      user.uid,
      userProfile?.name || user.displayName || 'Patient',
      msgText
    );
  };

  const handleSendVoiceNote = async (audioUrl: string) => {
    if (!selectedConsultation?.id || !user) return;
    await sendPatientMessage(
      selectedConsultation.id,
      user.uid,
      userProfile?.name || user.displayName || 'Patient',
      '🎤 Audio Voice Note',
      audioUrl
    );
  };

  // Share Scan Record with Doctor & Open Chat
  const handleShareWithDoctor = async (scan: SavedScanRecord) => {
    if (!user) {
      alert('Please sign in to share reports with a doctor.');
      return;
    }

    const existing = consultations.find(c => c && c.scanId === scan.id);
    if (existing) {
      setSelectedConsultation(existing);
      return;
    }

    setIsSharing(scan.id);
    try {
      const predData = scan.predictionData || {
        success: true,
        filename: scan.filename,
        prediction: {
          classId: scan.topClass,
          top_class: scan.topClass,
          display_title: scan.displayTitle,
          confidence: scan.confidence,
          risk_level: scan.riskLevel,
          is_normal: scan.isNormalSkin
        }
      };

      const cId = await requestDoctorConsultation(
        user.uid,
        userProfile?.name || user.displayName || 'Patient',
        user.email || 'patient@dermavision.ai',
        predData,
        `Shared scan report for ${scan.displayTitle}`,
        scan.imageUrl,
        scan.id
      );

      const newConsult: PatientConsultation = {
        id: cId,
        patientId: user.uid,
        patientName: userProfile?.name || user.displayName || 'Patient',
        patientEmail: user.email || 'patient@dermavision.ai',
        doctorId: 'Awaiting_Doctor',
        doctorName: 'Awaiting Doctor Acceptance (Waiting List)',
        diseaseName: scan.displayTitle,
        confidence: scan.confidence,
        riskLevel: scan.riskLevel,
        imageUrl: scan.imageUrl,
        scanId: scan.id,
        status: 'PENDING',
        requestDate: new Date().toISOString()
      };

      setSelectedConsultation(newConsult);
      setActiveTab('shared');
    } catch (err) {
      console.error('Sharing report error:', err);
      alert('Could not share report with Doctor tele-health server.');
    } finally {
      setIsSharing(null);
    }
  };

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isTa ? 'ஸ்கேன் வரலாறு & மருத்துவ அறிக்கைகள்' : isHi ? 'स्कैन इतिहास और साझा रिपोर्ट' : 'Scan History & Shared Reports'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isTa ? 'உங்கள் AI தோல் பரிசோதனைகள் மற்றும் மருத்துவருடன் பகிரப்பட்ட அறிக்கைகளைக் காண்க' : isHi ? 'अपने एआई त्वचा स्कैन और डॉक्टर के साथ साझा की गई रिपोर्ट देखें' : 'View saved AI scan records and connect directly with Dr. Sarah Smith, MD'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('scans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scans'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isTa ? 'என் ஸ்கேன் வரலாறு' : isHi ? 'मेरे स्कैन रिकॉर्ड' : 'My Scan Records'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {scans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shared')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shared'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{isTa ? 'மருத்துவருடன் பகிரப்பட்டவை' : isHi ? 'डॉक्टर के साथ साझा' : 'Shared Reports & Chat'}</span>
            {consultations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                {consultations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB CONTENT: MY SCAN RECORDS */}
      {activeTab === 'scans' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          {scans.length > 0 && (
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
              <span className="text-xs text-slate-400 font-bold">
                {scans.length} {scans.length === 1 ? 'Saved Scan' : 'Saved Scans'}
              </span>
              <button
                type="button"
                onClick={handleClearAllScans}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isTa ? 'அனைத்தையும் நீக்கு' : isHi ? 'सभी स्कैन हटाएं' : 'Clear All Scan History'}</span>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold">{t.common.loading}</span>
            </div>
          ) : scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-slate-950/50 rounded-2xl border border-slate-800/80 p-6">
              <FileText className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-slate-200">{t.history.emptyTitle}</h3>
              <p className="text-xs text-slate-400 max-w-md">{t.history.emptyDesc}</p>
              <button
                onClick={() => navigate('/scanner')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
              >
                {t.history.startFirstScan}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {scans.filter(Boolean).map((scan: any) => {
                const isNormal = scan.isNormalSkin || scan.topClass === '101' || scan.topClass === 101 || scan.displayTitle === 'Normal / Healthy Skin' || (scan.displayTitle && scan.displayTitle.toLowerCase().includes('normal') && !scan.displayTitle.toLowerCase().includes('acne'));

                const localizedInfo = isNormal
                  ? getNormalSkinInfo(currentLang)
                  : getLocalizedDiseaseInfo(scan.topClass !== undefined && scan.topClass !== null ? scan.topClass : (scan.displayTitle || 'benign_other'), currentLang);

                const scanDateFormatted = new Date(scan.scanDate).toLocaleDateString(currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US');
                const confidencePct = formatConfidencePct(scan.confidence);

                const isSharedWithDoc = consultations.some(c => c && c.scanId === scan.id);

                return (
                  <div
                    key={scan.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      {scan.imageUrl ? (
                        <img src={scan.imageUrl} alt={localizedInfo.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{localizedInfo.name}</h3>
                          {isSharedWithDoc && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              {isTa ? 'பகிரப்பட்டது' : isHi ? 'साझा किया गया' : 'Shared'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-sky-400" />
                            {scanDateFormatted}
                          </span>
                          <span>•</span>
                          <span>{confidencePct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 shrink-0">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase ${
                        localizedInfo.riskLevel === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : localizedInfo.riskLevel === 'Moderate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {localizedInfo.riskLevel === 'High' ? t.common.highRisk : localizedInfo.riskLevel === 'Moderate' ? t.common.moderateRisk : t.common.lowRisk}
                      </span>

                      {/* Share / Chat with Doctor Button */}
                      <button
                        onClick={() => handleShareWithDoctor(scan)}
                        disabled={isSharing === scan.id}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-xs border border-teal-500/30 transition-colors cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                        <span>
                          {isSharedWithDoc
                            ? (isTa ? 'மருத்துவர் சேட்' : isHi ? 'डॉक्टर चैट' : 'Doctor Chat')
                            : (isTa ? 'மருத்துவருடன் பகிர்' : isHi ? 'डॉक्टर से साझा करें' : 'Share with Doctor')}
                        </span>
                      </button>

                      {/* View Report Button */}
                      <button
                        onClick={() => navigate('/report', { state: { scanRecord: scan } })}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                      >
                        <span>{t.history.viewReport}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Scan Record Button */}
                      <button
                        onClick={() => handleDeleteScan(scan.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete Scan Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SHARED REPORTS & DOCTOR CHAT */}
      {activeTab === 'shared' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isTa ? 'மருத்துவருடன் பகிரப்பட்ட அறிக்கைகள்' : isHi ? 'डॉक्टर के साथ साझा की गई रिपोर्ट' : 'Shared Tele-Health Consultations'}
                </h2>
                <p className="text-xs text-slate-400">
                  Dr. Sarah Smith, MD • Senior Board-Certified Dermatologist
                </p>
              </div>
            </div>
          </div>

          {consultations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-slate-950/50 rounded-2xl border border-slate-800/80 p-6">
              <Stethoscope className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-slate-200">
                {isTa ? 'மருத்துவருடன் எந்த அறிக்கையும் பகிரப்படவில்லை' : isHi ? 'डॉक्टर के साथ कोई रिपोर्ट साझा नहीं की गई' : 'No Reports Shared with Doctor Yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                {isTa ? 'உங்கள் ஸ்கேன் வரலாற்றில் "மருத்துவருடன் பகிர்" பொத்தானைக் கிளிக் செய்து நேரடி ஆலோசனையைத் தொடங்குங்கள்.' : isHi ? 'अपने स्कैन इतिहास में "डॉक्टर से साझा करें" पर क्लिक करें।' : 'Go to My Scan Records tab and click "Share with Doctor" on any report.'}
              </p>
              <button
                onClick={() => setActiveTab('scans')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
              >
                {isTa ? 'ஸ்கேன் வரலாற்றைக் காண்க' : isHi ? 'स्कैन इतिहास देखें' : 'View My Scan Records'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultations.map((consult) => {
                const isAccepted = Boolean(
                  consult.acceptedByDoctorId || 
                  (consult.doctorName && !consult.doctorName.includes('Awaiting'))
                );
                const docName = consult.doctorName || 'Attending Dermatologist';
                const docTitle = consult.doctorTitle || 'Senior Dermatologist';

                return (
                  <div
                    key={consult.id}
                    className={`p-5 rounded-2xl bg-slate-950 border flex flex-col justify-between gap-4 transition-colors shadow-lg ${
                      isAccepted ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-amber-500/30 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {consult.imageUrl ? (
                          <img src={consult.imageUrl} alt={consult.diseaseName} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-white">{consult.diseaseName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {isAccepted ? `${docName} (${docTitle})` : 'Awaiting Doctor Acceptance (Waiting List)'}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                        isAccepted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}>
                        {isAccepted ? 'ACCEPTED BY DOCTOR' : 'WAITING LIST'}
                      </span>
                    </div>

                    {consult.prescriptionNote && (
                      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                          <Pill className="w-3.5 h-3.5" />
                          <span>Doctor Prescription Note</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">{consult.prescriptionNote}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedConsultation(consult)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isAccepted
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-md shadow-emerald-500/10'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isAccepted ? (
                        <>
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span>Open Doctor Live Chat ({docName})</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>View Waiting List Status & Chat Lock</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DOCTOR 2-WAY LIVE CHAT MODAL */}
      {selectedConsultation && (() => {
        const isAccepted = Boolean(
          selectedConsultation.acceptedByDoctorId || 
          (selectedConsultation.doctorName && !selectedConsultation.doctorName.includes('Awaiting'))
        );
        const docName = selectedConsultation.doctorName || 'Attending Dermatologist';
        const docTitle = selectedConsultation.doctorTitle || 'Senior Dermatologist';
        const docHospital = selectedConsultation.doctorHospital || 'DermaVision Clinical Center';

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    isAccepted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {isAccepted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        {isAccepted ? docName : 'Waiting List (Awaiting Doctor Acceptance)'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isAccepted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      }`}>
                        {isAccepted ? 'ACCEPTED BY DOCTOR' : 'WAITING LIST'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isAccepted
                        ? `${docTitle} • ${docHospital}`
                        : 'Awaiting an attending dermatologist in the Doctor Portal to claim and accept your report.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Doctor Prescription Note Header (If Available) */}
              {selectedConsultation.prescriptionNote && (
                <div className="p-3 px-5 bg-blue-950/60 border-b border-blue-800/50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Pill className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Rx Note:</strong> {selectedConsultation.prescriptionNote}</span>
                  </div>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-950/40">
                {isAccepted ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>🔒 Direct encrypted 2-way clinical consultation channel active with <strong>{docName}</strong> ({docTitle}).</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 text-center flex flex-col items-center gap-2">
                    <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                    <h4 className="font-bold text-amber-200 text-sm">Live Chat Locked — Awaiting Doctor Acceptance</h4>
                    <p className="text-slate-300 text-[11px] max-w-md">
                      Your report has been broadcasted to the DermaVision Clinical Network. 2-way live chat will automatically unlock as soon as an attending dermatologist accepts your case.
                    </p>
                  </div>
                )}

                {chatMessages.length === 0 && isAccepted ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-8">
                    <MessageSquare className="w-8 h-8 text-slate-600" />
                    <span>No messages exchanged yet. Send a message to {docName} below.</span>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isUserMsg = msg.senderId === user?.uid;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col gap-1 max-w-[80%] ${isUserMsg ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 px-1 font-mono">
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUserMsg
                            ? 'bg-sky-500 text-white rounded-br-none shadow-md shadow-sky-500/10'
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                        }`}>
                          {msg.audioUrl || msg.type === 'AUDIO' ? (
                            <div className="flex flex-col gap-1.5 pt-0.5">
                              <span className="text-[11px] font-bold flex items-center gap-1 text-emerald-300">
                                <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Voice Note Audio
                              </span>
                              <audio
                                src={msg.audioUrl}
                                controls
                                onPlay={(e) => {
                                  const allAudios = document.querySelectorAll('audio');
                                  allAudios.forEach((a) => {
                                    if (a !== e.currentTarget) {
                                      a.pause();
                                    }
                                  });
                                }}
                                className="h-9 max-w-[240px] rounded-xl border border-slate-700 shadow"
                              />
                              {msg.text && msg.text !== '🎤 Audio Voice Note' && <p className="mt-1">{msg.text}</p>}
                            </div>
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
                <VoiceRecorder disabled={!isAccepted} onSendVoiceNote={handleSendVoiceNote} />

                <input
                  type="text"
                  value={chatInput}
                  disabled={!isAccepted}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    isAccepted
                      ? `Type your message or question to ${docName}...`
                      : "Awaiting doctor acceptance to start live chat..."
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!isAccepted || !chatInput.trim()}
                  className="p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
};