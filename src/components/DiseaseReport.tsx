import React from 'react';
import { ResolvedDiseaseResult } from '../services/diseaseResolver';
import { getLocalizedDiseaseInfo } from '../services/diseaseInfo';
import { HealthySkinReport } from './HealthySkinReport';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, Stethoscope, ShieldAlert, Activity, FileText, CheckSquare, Info } from 'lucide-react';

interface DiseaseReportProps {
  diseaseResult: ResolvedDiseaseResult;
  confidencePct: string;
  scannedImageUrl: string;
}

export const DiseaseReport: React.FC<DiseaseReportProps> = ({ diseaseResult, confidencePct, scannedImageUrl }) => {
  const { currentLang, t } = useLanguage();
  const { classId, internalClassName, canonicalName, knowledgeBaseEntry } = diseaseResult;

  const rawTitle = (canonicalName || internalClassName || '').toLowerCase();
  const isMappedNormal = rawTitle.includes("cutaneous horn") || rawTitle.includes("cutanea larva") || rawTitle.includes("erythema multiforme");

  if (isMappedNormal || classId === 101 || classId === 24 || classId === 25 || classId === 44) {
    return <HealthySkinReport scannedImageUrl={scannedImageUrl} />;
  }
  const {
    category,
    clinicalOverview,
    commonSymptoms,
    commonRiskFactors,
    generalManagement,
    prevention,
    warningSigns,
    whenToSeekMedicalAttention,
    severity,
    requiresDermatologistReview
  } = knowledgeBaseEntry;

  const localizedInfo = getLocalizedDiseaseInfo(canonicalName || internalClassName, currentLang);
  const localizedTitle = localizedInfo.name || canonicalName;

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const riskBadgeText = severity === 'HIGH'
    ? (isTa ? 'அதிக ஆபத்து பரிசோதனை முடிவு' : isHi ? 'उच्च जोखिम स्क्रीनिंग परिणाम' : 'HIGH RISK SCREENING RESULT')
    : severity === 'MODERATE'
    ? (isTa ? 'மிதமான ஆபத்து பரிசோதனை முடிவு' : isHi ? 'मध्यम जोखिम स्क्रीनिंग परिणाम' : 'MODERATE RISK SCREENING RESULT')
    : (isTa ? 'குறைந்த ஆபத்து பரிசோதனை முடிவு' : isHi ? 'कम जोखिम स्क्रीनिंग परिणाम' : 'LOW RISK SCREENING RESULT');

  const dermEvalText = isTa ? 'தோல் நிபுணர் மதிப்பீடு பரிந்துரைக்கப்படுகிறது' : isHi ? 'त्वचा विशेषज्ञ मूल्यांकन अनुशंसित' : 'Dermatologist Evaluation Recommended';
  const internalClassLabel = isTa ? 'உள் வகுப்பு:' : isHi ? 'आंतरिक वर्ग:' : 'INTERNAL CLASS:';
  const categoryLabel = isTa ? 'வகை:' : isHi ? 'श्रेणी:' : 'CATEGORY:';
  const confidenceLabel = isTa ? 'AI நம்பகத்தன்மை' : isHi ? 'एआई आत्मविश्वास' : 'AI Confidence';
  const scannedImgTitle = isTa ? 'ஸ்கேன் செய்யப்பட்ட படம்' : isHi ? 'स्कैन की गई छवि' : 'Scanned Image';

  const overviewTitle = isTa ? 'மருத்துவக் மேலோட்டம்' : isHi ? 'नैदानिक अवलोकन' : 'Clinical Overview';
  const symptomsTitle = isTa ? 'பொதுவான அறிகுறிகள்' : isHi ? 'सामान्य लक्षण' : 'Common Symptoms';
  const riskTitle = isTa ? 'ஆபத்து காரணிகள் & தொடர்புடைய காரணங்கள்' : isHi ? 'जोखिम कारक और संबंधित कारण' : 'Risk Factors & Associated Causes';
  const mgmtTitle = isTa ? 'நோய் சார்ந்த பராமரிப்பு & வழிகாட்டுதல்' : isHi ? 'रोग-विशिष्ट प्रबंधन एवं सामान्य मार्गदर्शन' : 'Disease-Specific Management & General Guidance';
  const prevTitle = isTa ? 'தடுப்பு முறைகள்' : isHi ? 'निवारक उपाय' : 'Prevention';
  const warningTitle = isTa ? 'எச்சரிக்கை அறிகுறிகள் & ஆபத்து சமிக்ஞைகள்' : isHi ? 'चेतावनी के संकेत और लाल झंडे' : 'Warning Signs & Red Flags';
  const seekCareTitle = isTa ? 'எப்போது மருத்துவ கவனிப்பைப் பெற வேண்டும்' : isHi ? 'चिकित्सकीय सहायता कब लें' : 'When to Seek Medical Attention';

  const mgmtNotice = isTa
    ? 'குறிப்பு: மேலே பட்டியலிடப்பட்டுள்ள பராமரிப்பு விருப்பங்கள் பொதுவான மருத்துவ வழிகாட்டுதலாகும். குறிப்பிட்ட சிகிச்சை முடிவுகள் தகுதியான மருத்துவ நிபுணரால் மட்டுமே தீர்மானிக்கப்பட வேண்டும்.'
    : isHi
    ? 'नोट: ऊपर सूचीबद्ध प्रबंधन विकल्प सामान्य नैदानिक मार्गदर्शन का प्रतिनिधित्व करते हैं। विशिष्ट उपचार निर्णय योग्य स्वास्थ्य सेवा पेशेवर द्वारा निर्धारित किए जाने चाहिए।'
    : 'Note: The management options listed above represent general clinical guidance. Specific treatment decisions must be prescribed by a qualified healthcare professional.';

  const severityBadgeColor = severity === 'HIGH'
    ? 'bg-rose-100 text-rose-800 border-rose-300'
    : severity === 'MODERATE'
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  return (
    <div className="space-y-6">
      {/* Primary Result Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadgeColor}`}>
                {riskBadgeText}
              </span>
              {requiresDermatologistReview && (
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {dermEvalText}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              {localizedTitle}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span>{internalClassLabel} <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">{internalClassName}</code></span>
              <span>•</span>
              <span>{categoryLabel} {category}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center shrink-0">
            <span className="text-xs uppercase font-bold text-slate-500 block">{confidenceLabel}</span>
            <span className="text-2xl font-black text-slate-900">{confidencePct}%</span>
          </div>
        </div>
      </div>

      {/* Scanned Image Display */}
      {scannedImageUrl && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{scannedImgTitle}</h3>
          <div className="flex justify-center bg-slate-900/5 rounded-lg overflow-hidden max-h-80 p-2">
            <img
              src={scannedImageUrl}
              alt={localizedTitle}
              className="max-h-76 object-contain rounded-md shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Clinical Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2.5 text-slate-800 font-bold text-base">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3>{overviewTitle}</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          {localizedInfo.description || localizedInfo.summary || clinicalOverview}
        </p>
      </div>

      {/* Common Symptoms */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <Activity className="w-5 h-5 text-rose-600" />
          <h3>{symptomsTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          {(localizedInfo.symptoms && localizedInfo.symptoms.length > 0 ? localizedInfo.symptoms : commonSymptoms).map((symptom, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Factors & Causes */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <Info className="w-5 h-5 text-blue-600" />
          <h3>{riskTitle}</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
          {(localizedInfo.causes && localizedInfo.causes.length > 0 ? localizedInfo.causes : commonRiskFactors).map((factor, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disease-Specific Management */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          <h3>{mgmtTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          {(localizedInfo.precautions && localizedInfo.precautions.length > 0 ? localizedInfo.precautions : generalManagement).map((mgmt, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{mgmt}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-400 mt-3 italic">
          {mgmtNotice}
        </p>
      </div>

      {/* Prevention */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          <h3>{prevTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          {(localizedInfo.prevention && localizedInfo.prevention.length > 0 ? localizedInfo.prevention : prevention).map((prev, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
              <span>{prev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning Signs & Red Flags */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-rose-900 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3>{warningTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-rose-950 font-medium">
          {(localizedInfo.warningSigns && localizedInfo.warningSigns.length > 0 ? localizedInfo.warningSigns : warningSigns).map((sign, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* When to Seek Care */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2.5 text-indigo-950 font-bold text-base">
          <Stethoscope className="w-5 h-5 text-indigo-600" />
          <h3>{seekCareTitle}</h3>
        </div>
        <p className="text-sm text-indigo-900 font-medium leading-relaxed">
          {localizedInfo.medicalAttention || whenToSeekMedicalAttention}
        </p>
      </div>
    </div>
  );
};
