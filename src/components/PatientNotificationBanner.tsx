import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToPatientNotifications,
  markNotificationAsRead,
  PatientNotificationRecord
} from '../services/firebase';
import { Video, X, Bell } from 'lucide-react';

export const PatientNotificationBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PatientNotificationRecord[]>([]);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      return;
    }

    const unsub = subscribeToPatientNotifications(user.uid, (list) => {
      setNotifications(list);
    });

    return () => unsub();
  }, [user?.uid]);

  if (!user || notifications.length === 0) return null;

  const activeNotification = notifications.find(
    (n) => Boolean(n) &&
           ((n.type as any) === 'CONSULTATION_STARTED' || (n.type as any) === 'CALL_STARTED' || (n as any)?.type === 'DOCTOR_STARTED_MEETING') &&
           Boolean((n as any)?.consultationStarted === true || (n as any)?.status === 'active' || (n as any)?.status === 'unread') &&
           Boolean(n.meetUrl && n.meetUrl.trim().startsWith('http')) &&
           n.status !== 'ended' &&
           n.status !== 'read'
  );

  if (!activeNotification) return null;

  const isEnded = activeNotification.status === 'ended';

  const handleDismiss = async () => {
    await markNotificationAsRead(activeNotification.id);
  };

  const handleJoinMeet = async () => {
    await markNotificationAsRead(activeNotification.id);
    if (activeNotification.meetUrl) {
      window.open(activeNotification.meetUrl, '_blank');
    } else {
      navigate('/messages');
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl animate-bounce flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
          <Video className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>DOCTOR LAUNCHED GOOGLE MEET CALL!</span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-200 leading-relaxed">
        <strong>{activeNotification.doctorName}</strong> launched your live video consultation for{' '}
        <strong className="text-emerald-300">{activeNotification.patientName}</strong>. Click Join below to attend.
      </p>

      {isEnded ? (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
          Doctor consultation has ended.
        </div>
      ) : (
        <button
          onClick={handleJoinMeet}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Video className="w-4 h-4 text-slate-950" />
          <span>JOIN GOOGLE MEET CONSULTATION NOW</span>
        </button>
      )}
    </div>
  );
};
