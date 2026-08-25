import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserNotifications, AppNotification, subscribeToUserAppointments, AppointmentRecord } from '../services/firebase';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import { Video, Calendar, Clock, Bell, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppointmentNotificationBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const [selectedAppt, setSelectedAppt] = useState<AppointmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [nowMs, setNowMs] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubNotifs = subscribeToUserNotifications(user.uid, (list) => {
      setNotifications(list.filter(n => Boolean(n) && n.patientId === user.uid));
    });

    const unsubAppts = subscribeToUserAppointments(user.uid, (list) => {
      setAppointments(list.filter(a => Boolean(a) && a.patientId === user.uid));
    });

    return () => {
      unsubNotifs();
      unsubAppts();
    };
  }, [user?.uid]);

  // Loud 2-Tone Audio Chime (C5 -> G5) using Web Audio API
  const playLoudMeetingChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playNote = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      playNote(523.25, 0, 0.4);   // C5
      playNote(783.99, 0.35, 0.6);  // G5
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  };

  // 1. Check for Active Doctor Started Meeting alert (MUST be launched within last 60 seconds / 1 minute!)
  const activeMeetingAppt = appointments.find(a => {
    if (!a) return false;
    if (dismissedIds.includes(a.id || '')) return false;

    // REJECT CANCELLED / DECLINED / COMPLETED APPOINTMENTS STRICTLY
    const apptStat = (a?.appointmentStatus || '').toLowerCase();
    const meetStat = (a?.meetingStatus || '').toLowerCase();
    if (['cancelled', 'declined', 'completed'].includes(apptStat) || ['cancelled', 'declined', 'completed'].includes(meetStat)) {
      return false;
    }

    const isStarted = Boolean((a as any)?.consultationStarted === true || (a as any)?.meetingActive === true || a?.meetingStatus === 'READY');
    const hasUrl = Boolean(a?.meetingUrl && a.meetingUrl.trim().startsWith('http'));

    if (!isStarted || !hasUrl) return false;

    // STRICT REQUIREMENT: MUST HAVE AN EXPLICIT meetingStartedAt TIMESTAMP (DO NOT FALL BACK TO updatedAt)
    const startTimeStr = (a as any)?.meetingStartedAt;
    if (!startTimeStr) return false;

    const startTimeMs = new Date(startTimeStr).getTime();
    if (isNaN(startTimeMs)) return false;

    const elapsedMs = nowMs - startTimeMs;

    // AUTO-CLOSES IN 60 SECONDS (1 MINUTE)
    return elapsedMs >= 0 && elapsedMs <= 60 * 1000;
  });

  // Play loud sound chime when active meeting becomes ready (All hooks MUST run unconditionally before any early returns)
  useEffect(() => {
    if (activeMeetingAppt) {
      playLoudMeetingChime();
    }
  }, [activeMeetingAppt?.id]);

  if (!user) return null;

  // 2. Check for 2-Hour Appointment Reminder (Part 6)
  const now = new Date().getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;

  const upcoming2HAppt = appointments.find(a => {
    if (!a) return false;
    if (a.appointmentStatus !== 'Scheduled') return false;
    const apptTime = new Date(a.appointmentDateTime || `${a.appointmentDate}T${a.appointmentTime}:00`).getTime();
    const diff = apptTime - now;
    return diff > 0 && diff <= twoHoursMs && !dismissedIds.includes(a.id || '');
  });

  const activeNotif = notifications.find(n => Boolean(n) && !n?.read && !dismissedIds.includes(n?.id || ''));

  if (!activeMeetingAppt && !upcoming2HAppt && !activeNotif) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 shadow-xl relative z-40">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* DOCTOR STARTED MEETING ALERT (PART 6 & 7) */}
        {activeMeetingAppt ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 animate-bounce">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white font-bold block text-sm">Consultation Ready! {activeMeetingAppt.doctorName} has started your meeting.</strong>
              <span className="text-emerald-400 font-mono">Linked Report: {activeMeetingAppt.diseaseName}</span>
            </div>
          </div>
        ) : upcoming2HAppt ? (
          /* 2-HOUR APPOINTMENT REMINDER (PART 6) */
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-amber-200 font-bold block">Appointment Reminder: Consultation scheduled in under 2 hours.</strong>
              <span className="text-slate-400 font-mono">{upcoming2HAppt.doctorName} • {upcoming2HAppt.appointmentDate} at {upcoming2HAppt.appointmentTime}</span>
            </div>
          </div>
        ) : activeNotif ? (
          /* GENERAL NOTIFICATION */
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white font-bold block">{activeNotif.title}</strong>
              <span className="text-slate-400">{activeNotif.message}</span>
            </div>
          </div>
        ) : null}

        {/* ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          {activeMeetingAppt ? (
            <a
              href={activeMeetingAppt.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Google Meet</span>
            </a>
          ) : upcoming2HAppt ? (
            <button
              onClick={() => {
                setSelectedAppt(upcoming2HAppt);
                setIsDetailsOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
            >
              View Appointment
            </button>
          ) : (
            <button
              onClick={() => navigate('/appointments')}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer"
            >
              View Schedule
            </button>
          )}

          <button
            onClick={() => {
              const targetId = activeMeetingAppt?.id || upcoming2HAppt?.id || activeNotif?.id;
              if (targetId) setDismissedIds(prev => [...prev, targetId]);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      <AppointmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        appointment={selectedAppt}
      />
    </div>
  );
};
