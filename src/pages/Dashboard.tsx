import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserScanHistory, SavedScanRecord, subscribeToUserConsultations, PatientConsultation } from '../services/firebase';
import { getLocalizedDiseaseInfo, formatConfidencePct } from '../services/diseaseInfo';
import { Activity, ShieldCheck, FileText, ArrowRight, Sparkles, AlertCircle, Stethoscope, Pill, Clock, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { currentLang, t } = useLanguage();

  const [scans, setScans] = useState<SavedScanRecord[]>([]);
  const [consultations, setConsultations] = useState<PatientConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      if (user?.uid) {
        try {
          const records = await getUserScanHistory(user.uid);
          setScans(records);
        } catch (err) {
          console.warn('Dashboard fetchScans notice:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchScans();
  }, [user]);

  // Subscribe to Doctor Consultations & Prescriptions
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserConsultations(user.uid, (data) => {
      setConsultations(data);
    });
    return () => unsub();
  }, [user?.uid]);

  const userName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header Greeting Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.dashboard.greeting}, {userName}!
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {t.dashboard.sub}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
        >
          <Activity className="w-4 h-4" />
          <span>{t.dashboard.startNewScan}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* DOCTOR CONSULTATIONS & PRESCRIPTIONS CARD */}
      {consultations.length > 0 && (
        <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
              <span>Doctor Tele-Health Consultations & Prescriptions</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              {consultations.length} Active Consultations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.filter(Boolean).map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-white">{c.displayTitle}</h3>
                    <p className="text-xs text-slate-400">Doctor: <span className="text-emerald-400 font-bold">{c.doctorName || 'Dr. Sarah Smith, MD'}</span></p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    c.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}>
                    {c.status === 'COMPLETED' ? 'Prescription Ready' : c.status}
                  </span>
                </div>

                {c.prescriptionNote && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-emerald-300 text-xs leading-relaxed whitespace-pre-line">
                    <strong className="block mb-1 text-emerald-400">Rx Prescription:</strong>
                    {c.prescriptionNote}
                  </div>
                )}

                <button
                  onClick={() => navigate('/report', { state: { scanRecord: { topClass: c.topClass, displayTitle: c.displayTitle, confidence: c.confidence, riskLevel: c.riskLevel, riskColor: c.riskColor, imageUrl: c.imageUrl, scanDate: c.createdAt } } })}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Open Full Doctor Report & Live Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scans Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>{t.dashboard.recentScans}</span>
          </h2>
          {scans.length > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{t.nav.history}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : scans.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center gap-4">
            <AlertCircle className="w-10 h-10 text-slate-500" />
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-white text-base">{t.dashboard.noScansYet}</h3>
              <p className="text-xs text-slate-400 max-w-md">{t.dashboard.noScansSub}</p>
            </div>
            <button
              onClick={() => navigate('/scanner')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20"
            >
              {t.dashboard.startNewScan}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scans.filter(Boolean).map((scan) => {
              const localizedInfo = getLocalizedDiseaseInfo(scan.topClass || scan.displayTitle, currentLang);
              const confidencePctStr = formatConfidencePct(scan.confidence);
              const scanDateStr = new Date(scan.scanDate).toLocaleDateString(currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={scan.id}
                  onClick={() => navigate('/report', { state: { scanRecord: scan } })}
                  className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl hover:shadow-sky-500/5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-slate-500">{scanDateStr}</span>
                      <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition-colors mt-0.5">
                        {localizedInfo.name}
                      </h3>
                      <span className="text-xs text-slate-400">{localizedInfo.category}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      scan.riskLevel === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : scan.riskLevel === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {scan.riskLevel === 'High' ? t.common.highRisk : scan.riskLevel === 'Moderate' ? t.common.moderateRisk : t.common.lowRisk}
                    </span>
                  </div>

                  {scan.imageUrl && (
                    <div className="h-36 rounded-2xl overflow-hidden bg-black border border-slate-800">
                      <img src={scan.imageUrl} alt={localizedInfo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                    <span className="text-slate-400">{t.report.confidenceScore}:</span>
                    <span className="text-sky-400 font-bold">{confidencePctStr}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
