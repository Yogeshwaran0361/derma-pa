import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLang, setLanguage } = useLanguage();

  const labels: Record<Language, string> = {
    en: 'EN',
    ta: 'தமிழ் (TA)',
    hi: 'हिन्दी (HI)'
  };

  return (
    <div className={`relative flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 rounded-xl px-3 py-1.5 shadow-sm transition-all cursor-pointer ${className}`} title="Change Language / மொழி">
      <span className="text-sm leading-none select-none">🌐</span>
      <span className="text-xs font-bold text-sky-400 select-none">{labels[currentLang] || 'EN'}</span>
      <select
        value={currentLang}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer bg-slate-900 text-white"
        aria-label="Select Application Language"
      >
        <option value="en" className="bg-slate-900 text-white font-sans">English (EN)</option>
        <option value="ta" className="bg-slate-900 text-white font-sans">தமிழ் (Tamil)</option>
        <option value="hi" className="bg-slate-900 text-white font-sans">हिन्दी (Hindi)</option>
      </select>
    </div>
  );
};
