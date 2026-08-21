import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
        isDragOver
          ? 'border-sky-400 bg-sky-500/10'
          : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 shadow-lg">
        <UploadCloud className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-white">{t.scanner.dropTitle}</h3>
        <p className="text-xs text-slate-400">{t.scanner.dropSubtitle}</p>
      </div>

      <button
        type="button"
        className="mt-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        <span>{t.scanner.browseFiles}</span>
      </button>
    </div>
  );
};
