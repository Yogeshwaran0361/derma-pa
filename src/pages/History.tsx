import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserScanHistory, SavedScanRecord } from '../services/firebase';
import { getLocalizedDiseaseInfo, formatConfidencePct } from '../services/diseaseInfo';
import { FileText, ArrowRight, Calendar } from 'lucide-react';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLang, t } = useLanguage();

  const [scans, setScans] = useState<SavedScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.history.title}</h1>
        <p className="text-slate-400 text-sm">{t.history.subtitle}</p>
      </div>

      {/* Scans List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        
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
              className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20"
            >
              {t.history.startFirstScan}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {scans.filter(Boolean).map((scan) => {
              const localizedInfo = getLocalizedDiseaseInfo(scan.topClass || scan.displayTitle || 'benign_other', currentLang);
              const scanDateFormatted = new Date(scan.scanDate).toLocaleDateString(currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US');
              const confidencePct = formatConfidencePct(scan.confidence);

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
                      <h3 className="font-bold text-base text-white">{localizedInfo.name}</h3>
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

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase ${
                      localizedInfo.riskLevel === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : localizedInfo.riskLevel === 'Moderate'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {localizedInfo.riskLevel === 'High' ? t.common.highRisk : localizedInfo.riskLevel === 'Moderate' ? t.common.moderateRisk : t.common.lowRisk}
                    </span>

                    <button
                      onClick={() => navigate('/report', { state: { scanRecord: scan } })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      <span>{t.history.viewReport}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
