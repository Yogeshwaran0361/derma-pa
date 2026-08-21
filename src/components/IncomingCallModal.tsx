import React from 'react';
import { CallRecord } from '../services/webrtcEngine';
import { useLanguage } from '../context/LanguageContext';
import { Phone, PhoneOff, Video, Mic, Stethoscope, Activity } from 'lucide-react';

interface IncomingCallModalProps {
  call: CallRecord | null;
  onAccept: (callId: string, type: 'VIDEO' | 'VOICE') => void;
  onDecline: (callId: string) => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  onAccept,
  onDecline
}) => {
  const { t } = useLanguage();

  if (!call) return null;

  const isVideo = call.callType === 'VIDEO';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden animate-bounce-short">
        
        {/* Pulsing Ambient Background Halo */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

        {/* Doctor Icon Circle */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-1 shadow-xl shadow-emerald-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
            <Stethoscope className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Incoming Header */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold w-fit mx-auto">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>{isVideo ? t.call.incomingVideoCall : t.call.incomingVoiceCall}</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            {call.doctorName}
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            {call.doctorSpec || 'Dermatology Specialist'}
          </p>
        </div>

        {/* Patient Case Preview Card */}
        <div className="w-full bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs flex flex-col gap-1 text-left font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Case Reference</span>
          <span className="text-sky-400 font-bold">{call.lesionTitle}</span>
          <span className="text-slate-400 text-[11px]">Patient: {call.patientName}</span>
        </div>

        {/* Ringing Text Alert */}
        <p className="text-xs text-slate-300 font-medium">
          {call.doctorName} {t.call.isCallingYou}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full pt-2 border-t border-slate-800">
          <button
            onClick={() => onDecline(call.callId)}
            className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer transition-all hover:scale-105"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{t.call.decline}</span>
          </button>

          <button
            onClick={() => onAccept(call.callId, isVideo ? 'VIDEO' : 'VOICE')}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 cursor-pointer transition-all hover:scale-105"
          >
            {isVideo ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            <span>{isVideo ? t.call.acceptVideo : t.call.acceptVoice}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
