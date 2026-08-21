import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Cpu, ShieldAlert, HeartPulse } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DermaVision AI</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.about.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          {t.about.subtitle}
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mission */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">{t.about.missionTitle}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{t.about.missionDesc}</p>
        </div>

        {/* Model Architecture */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white">{t.about.modelTitle}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{t.about.modelDesc}</p>
        </div>

      </div>

      {/* Clinical Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-sm text-amber-300">{t.about.disclaimerTitle}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{t.about.disclaimerDesc}</p>
        </div>
      </div>

    </div>
  );
};
