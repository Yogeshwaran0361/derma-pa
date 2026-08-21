import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  subscribeToUserConsultations,
  subscribeToPatientConsultation,
  subscribeToPatientMessages,
  sendPatientMessage,
  PatientConsultation
} from '../services/firebase';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { MessageSquare, Send, ArrowLeft, Volume2, Pill, Check, Copy } from 'lucide-react';

const ChatMessageLinkBox: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
  const url = urlMatch ? urlMatch[0] : null;

  if (!url) return <span className="whitespace-pre-line">{text}</span>;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parts = text.split(url);

  return (
    <div className="leading-relaxed">
      {parts[0]}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-blue-400 hover:text-blue-300 font-bold font-mono underline break-all inline"
      >
        {url}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-[10px] font-bold cursor-pointer transition-all align-middle"
        title="Copy link alone"
      >
        {copied ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" /> Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1 text-blue-300">
            <Copy className="w-3 h-3 text-blue-400" /> Copy Link
          </span>
        )}
      </button>
      {parts[1]}
    </div>
  );
};

export const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();

  const [consultations, setConsultations] = useState<PatientConsultation[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<PatientConsultation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  // 1. Auto-discover active consultations for this patient
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToUserConsultations(user.uid, (list) => {
      setConsultations(list);
      if (list.length > 0 && !activeConsultation) {
        setActiveConsultation(list[0]);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  // 2. Subscribe to active consultation updates & messages
  useEffect(() => {
    if (!activeConsultation?.id) return;

    const unsub1 = subscribeToPatientConsultation(activeConsultation.id, (data) => {
      if (data) setActiveConsultation(data);
    });

    const unsub2 = subscribeToPatientMessages(activeConsultation.id, (msgs: any[]) => {
      setMessages(msgs);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [activeConsultation?.id]);

  const activeId = activeConsultation?.id;

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const txt = inputText;
    setInputText('');

    if (activeId) {
      await sendPatientMessage(
        activeId,
        user?.uid || 'patient_anon',
        userProfile?.name || user?.displayName || 'Patient',
        txt
      );
    }
  };

  const handleSendVoice = async (audioUrl: string) => {
    if (activeId) {
      await sendPatientMessage(
        activeId,
        user?.uid || 'patient_anon',
        userProfile?.name || user?.displayName || 'Patient',
        t.chatPage.voiceNoteFromPatient || '🎙️ Voice Note from Patient',
        audioUrl
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-24 md:pb-12 max-w-3xl mx-auto flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-sm">
              DR
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Dr. Sarah Smith, MD</h1>
              <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Senior Dermatologist • {t.chatPage.title}</span>
              </p>
            </div>
          </div>
        </div>

        {consultations.length > 1 && (
          <select
            value={activeId || ''}
            onChange={(e) => {
              const selected = consultations.find(c => c && c.id === e.target.value);
              if (selected) setActiveConsultation(selected);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none cursor-pointer"
          >
            {consultations.filter(Boolean).map(c => (
              <option key={c.id} value={c.id}>
                {c.displayTitle} ({new Date(c.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Official Doctor Prescription Banner (if issued by Doctor) */}
      {activeConsultation && (activeConsultation.doctorDiagnosis || activeConsultation.prescriptionNote) && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border-2 border-emerald-500/40 flex flex-col gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-emerald-400 font-black text-xs flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-400" />
              OFFICIAL CLINICAL PRESCRIPTION ISSUED
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Verified
            </span>
          </div>

          {activeConsultation.doctorDiagnosis && (
            <div className="text-xs">
              <span className="text-slate-400 font-bold">Diagnosis: </span>
              <span className="text-white font-bold">{activeConsultation.doctorDiagnosis}</span>
            </div>
          )}

          {activeConsultation.prescriptionNote && (
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 font-mono leading-relaxed whitespace-pre-line">
              💊 {activeConsultation.prescriptionNote}
            </div>
          )}
        </div>
      )}

      {/* Messages List Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col gap-3 min-h-[350px] max-h-[500px] overflow-y-auto">
        {!activeConsultation ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2 text-center">
            <MessageSquare className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs font-semibold">{t.chatPage.noConsultationTitle}</span>
            <p className="text-[11px] text-slate-500 max-w-xs">{t.chatPage.noConsultationSub}</p>
            <button
              onClick={() => navigate('/scanner')}
              className="mt-2 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs"
            >
              {t.chatPage.startScanBtn}
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2 text-center">
            <MessageSquare className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs font-semibold">{t.chatPage.chatActiveFor} "{activeConsultation.displayTitle}".</span>
            <span className="text-[11px] text-slate-500">{t.chatPage.chatActiveSub}</span>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = m.senderRole === 'PATIENT';
            return (
              <div key={idx} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'}`}>
                  <span className="text-[10px] font-bold block mb-1 opacity-80">{m.senderName} ({m.senderRole})</span>
                  {m.type === 'AUDIO' && m.audioUrl ? (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <audio src={m.audioUrl} controls className="h-7 max-w-[200px]" />
                    </div>
                  ) : (
                    <ChatMessageLinkBox text={m.text || ''} />
                  )}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input & Voice Recorder Bar */}
      {activeConsultation && (
        <form onSubmit={handleSendText} className="flex gap-2 items-center bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <VoiceRecorder onSendVoiceNote={handleSendVoice} />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.chatPage.inputPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.chatPage.sendBtn}</span>
          </button>
        </form>
      )}

    </div>
  );
};
