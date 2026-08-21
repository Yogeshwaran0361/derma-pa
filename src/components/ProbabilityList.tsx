import React from 'react';
import { ProbabilityEntry } from '../services/reportGenerator';
import { getLocalizedDiseaseInfo } from '../services/diseaseInfo';
import { useLanguage } from '../context/LanguageContext';
import { Cpu } from 'lucide-react';

interface ProbabilityListProps {
  probabilities: ProbabilityEntry[];
}

export const ProbabilityList: React.FC<ProbabilityListProps> = ({ probabilities }) => {
  const { currentLang, t } = useLanguage();

  if (!probabilities || probabilities.length === 0) return null;

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const sectionTitle = isTa
    ? 'உயர்ந்த AI பரிசோதனை கணிப்புகள் (நம்பகத்தன்மை ≥ 5%)'
    : isHi
    ? 'शीर्ष एआई स्क्रीनिंग भविष्यवाणियां (संभावना ≥ 5%)'
    : 'TOP AI SCREENING PREDICTIONS (PROBABILITY ≥ 5%)';

  const candidateLabel = isTa ? 'வேட்பாளர்' : isHi ? 'उम्मीदवार' : 'Candidate';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-xs uppercase tracking-wider">
        <Cpu className="w-4 h-4 text-indigo-600" />
        <span>{sectionTitle}</span>
      </div>

      <div className="space-y-3">
        {probabilities.map((item, idx) => {
          const localized = getLocalizedDiseaseInfo(item.diseaseName, currentLang);
          const displayTitle = localized.name || item.diseaseName;

          return (
            <div key={`${item.classId}-${idx}`} className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {idx + 1}. {displayTitle}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    #{idx + 1} {candidateLabel}
                  </span>
                </div>
                <span className="font-mono font-bold text-indigo-600 text-xs">
                  {item.probabilityPct}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(Number(item.probabilityPct), 4)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
