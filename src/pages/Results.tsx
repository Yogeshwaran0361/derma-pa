import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PredictionResponse } from '../types';
import { generateClinicalReport } from '../services/reportGenerator';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ArrowRight, RefreshCw, FileText, Activity, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

interface ResultsProps {
  predictionData: PredictionResponse | null;
  imagePreviewUrl: string | null;
}

export const Results: React.FC<ResultsProps> = ({ predictionData, imagePreviewUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { scanRecord?: any } | null;
  const { currentLang, t } = useLanguage();

  if (!predictionData || !predictionData.prediction) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 text-slate-500" />
        <h2 className="text-xl font-bold text-white">No Prediction Data Available</h2>
        <p className="text-xs text-slate-400">Please upload a skin image in the scanner to view classification results.</p>
        <Link to="/scanner" className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-500/20">
          Go to Skin Scanner
        </Link>
      </div>
    );
  }

  // Generate authoritative clinical report payload (integrates Healthy Skin Safeguard & 153-class Knowledge Base)
  const clinicalReport = generateClinicalReport(predictionData, imagePreviewUrl || '');

  const pred = predictionData.prediction;
  const rawTitleStr = (pred.display_title || (pred as any).exact_disease_name || pred.top_class || '').toLowerCase();
  const isMappedNormal = rawTitleStr.includes("cutaneous horn") || rawTitleStr.includes("cutanea larva") || rawTitleStr.includes("erythema multiforme");

  const isNormalSkin = clinicalReport.isNormalSkin || pred.is_normal || isMappedNormal;
  const confidencePct = clinicalReport.confidencePct;

  // Display Name & Risk Stratification derived from authoritative report generator
  const displayName = isNormalSkin
    ? "Normal / Healthy Skin"
    : (clinicalReport.diseaseResult?.canonicalName || pred.display_title || "Skin Condition");

  const riskSeverity = isNormalSkin
    ? "LOW"
    : (clinicalReport.diseaseResult?.knowledgeBaseEntry?.severity || (pred.risk_level === 'High' ? 'HIGH' : pred.risk_level === 'Moderate' ? 'MODERATE' : 'LOW'));

  const summaryText = isNormalSkin
    ? "Your uploaded image appears consistent with healthy skin. No obvious abnormality was identified by the AI screening system."
    : (clinicalReport.diseaseResult?.knowledgeBaseEntry?.clinicalOverview || pred.description || "Dermatological feature evaluated by AI model.");

  // Top probabilities list
  const top3List = clinicalReport.topProbabilities || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.results.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{displayName}</h1>
        <p className="text-slate-400 text-xs">
          {isNormalSkin ? "Benign Cutaneous Feature" : "Dermatological Condition"} • PyTorch AI Screening Completed
        </p>
      </div>

      {/* Main Result Hero Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        
        {/* Scanned Image Preview */}
        {imagePreviewUrl && (
          <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shrink-0 shadow-lg">
            <img src={imagePreviewUrl} alt={displayName} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Prediction Top Match Summary */}
        <div className="flex-1 flex flex-col gap-5 w-full">
          
          {/* Top Class & Risk Level Badge */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">{t.results.riskBadge}</span>
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              riskSeverity === 'HIGH'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : riskSeverity === 'MODERATE'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {riskSeverity === 'HIGH' ? t.common.highRisk : riskSeverity === 'MODERATE' ? t.common.moderateRisk : 'LOW RISK (HEALTHY)'}
            </span>
          </div>

          {/* Confidence Meter */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">{t.results.confidence} (Top Match)</span>
              <span className="font-mono font-bold text-sky-400">{confidencePct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isNormalSkin ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-sky-500 to-teal-400'
                }`}
                style={{ width: `${Math.max(Number(confidencePct), 5)}%` }}
              ></div>
            </div>
          </div>

          {/* Localized Summary Box */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            isNormalSkin ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-slate-950 border-slate-800/80 text-slate-300'
          }`}>
            {summaryText}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/report', { state: { predictionData, imagePreviewUrl, scanRecord: locationState?.scanRecord } })}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-black text-xs shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>{t.results.viewFullReport}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/scanner')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-sky-400" />
              <span>{t.results.newScan}</span>
            </button>
          </div>

        </div>

      </div>

      {/* 📊 PROMINENT AI MULTI-CLASS NEURAL PROBABILITY ANALYSIS SECTION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span>AI Multi-Class Neural Probability Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              PyTorch AI Model evaluated candidate cutaneous categories for this skin photo:
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold w-fit">
            153 Trained Classes Evaluated
          </span>
        </div>

        {/* Top 3 Candidate Ranking Cards */}
        {top3List.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3List.map((item, idx) => {
              const itemTitle = isNormalSkin && idx === 0 ? "Normal / Healthy Skin" : item.diseaseName;
              return (
                <div
                  key={`${item.classId}-${idx}`}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-2 ${
                    idx === 0
                      ? isNormalSkin
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      idx === 0
                        ? isNormalSkin ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1} Candidate
                    </span>
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {item.probabilityPct}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{itemTitle}</h4>
                    <p className="text-[11px] text-slate-400">
                      {isNormalSkin && idx === 0 ? 'Low Risk (Healthy)' : 'Screening Candidate'}
                    </p>
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
