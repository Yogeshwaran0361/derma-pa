import React from 'react';
import { ClassProbability } from '../types';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDiseaseInfo, formatConfidencePct } from '../services/diseaseInfo';

interface ProbabilityChartProps {
  probabilities: ClassProbability[];
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ probabilities }) => {
  const { currentLang } = useLanguage();

  // Master Prompt Requirement: Top 3 max, confidence >= 5.0%
  const top3List = probabilities
    .map(item => {
      const pctStr = formatConfidencePct(item.confidence !== undefined ? item.confidence : item.confidence_pct);
      return {
        ...item,
        pctVal: Number(pctStr),
        pctStr
      };
    })
    .filter(item => item.pctVal >= 5.0)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <span>Top Alternative Predictions</span>
        </h3>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Top 3 Max (≥ 5%)
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {top3List.length > 0 ? (
          top3List.map((item, index) => {
            const isTop = index === 0;
            const diseaseDetails = getLocalizedDiseaseInfo(item.class_name || item.display_title, currentLang);
            const displayName = diseaseDetails.name || item.display_title;

            return (
              <div key={item.class_name} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-medium ${isTop ? 'text-sky-300 font-semibold' : 'text-slate-300'}`}>
                    {displayName}
                  </span>
                  <span className="font-mono font-semibold text-slate-200">
                    {item.pctStr}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isTop
                        ? 'bg-gradient-to-r from-sky-500 to-teal-400 shadow-sm shadow-sky-500/50'
                        : 'bg-slate-600/60'
                    }`}
                    style={{ width: `${Math.max(item.pctVal, 1)}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-400 italic py-2">
            No significant alternative predictions above the 5% reporting threshold.
          </div>
        )}
      </div>
    </div>
  );
};

