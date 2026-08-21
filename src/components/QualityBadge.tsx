import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, Focus, Maximize2 } from 'lucide-react';
import { QualityCheckResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QualityBadgeProps {
  quality: QualityCheckResult;
  onRetake?: () => void;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ quality, onRetake }) => {
  const { t } = useLanguage();

  if (quality.passed) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-emerald-300">{t.scanner.qualityPassed}</h4>
          <p className="text-xs text-emerald-400/90 mt-0.5">{quality.reason || t.scanner.qualityPassedDesc}</p>
          {quality.metrics && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-emerald-300/80">
              {quality.metrics.width && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> {quality.metrics.width}x{quality.metrics.height}px
                </span>
              )}
              {quality.metrics.blur_score !== undefined && (
                <span className="flex items-center gap-1">
                  <Focus className="w-3 h-3" /> Focus: {Math.round(quality.metrics.blur_score)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-200">Quality Notice</h4>
          <p className="text-xs text-amber-300/90 mt-0.5">{quality.reason}</p>
        </div>
      </div>

      {quality.suggestion && (
        <div className="flex items-start gap-2 text-xs bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/20 text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{quality.suggestion}</span>
        </div>
      )}

      {onRetake && (
        <button
          onClick={onRetake}
          className="self-start text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 transition-colors"
        >
          {t.scanner.retake}
        </button>
      )}
    </div>
  );
};
