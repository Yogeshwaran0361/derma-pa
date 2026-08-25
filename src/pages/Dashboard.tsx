import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  subscribeToUserConsultations,
  subscribeToUserAppointments,
  PatientConsultation,
  AppointmentRecord
} from '../services/firebase';
import { Activity, ArrowRight, Sparkles, Stethoscope, Pill, Clock, MessageSquare, Calendar, Video, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { currentLang, t } = useLanguage();

  const [consultations, setConsultations] = useState<PatientConsultation[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Shared Doctor Consultations & Live Chat
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubConsultations = subscribeToUserConsultations(user.uid, (data) => {
      setConsultations(data);
      setLoading(false);
    });

    const unsubAppointments = subscribeToUserAppointments(user.uid, (list) => {
      const patientOnly = list.filter(a => Boolean(a) && a.patientId === user.uid);
      setAppointments(patientOnly);
    });

    return () => {
      unsubConsultations();
      unsubAppointments();
    };
  }, [user?.uid]);

  const userName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* 1. Header Greeting Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.dashboard.greeting}, {userName}!
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Welcome to your dedicated DermaVision AI Tele-Health Dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
        >
          <Activity className="w-4 h-4" />
          <span>{t.dashboard.startNewScan}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. SECTION 1: DOCTOR SHARED REPORTS & REAL-TIME LIVE CHAT */}
      <div className="bg-slate-900/90 border-2 border-sky-500/30 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white tracking-tight">Doctor Shared Reports & Live Chat</h2>
              <p className="text-xs text-slate-400">Shared AI screening records and direct real-time physician messaging</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Shared Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            <MessageSquare className="w-12 h-12 text-slate-600" />
            <h3 className="text-base font-bold text-slate-200">No Reports Shared with Doctor Yet</h3>
            <p className="text-xs text-slate-400 max-w-md">Share your AI skin screening scan records with certified dermatologists to start a live 2-way consultation.</p>
            <button
              onClick={() => navigate('/history')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
            >
              Share Scan Report with Doctor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.filter(Boolean).map((c) => {
              const doctorDisplayName = c.acceptedByDoctorId || (c.doctorName && !c.doctorName.includes('Awaiting'))
                ? c.doctorName
                : 'Awaiting Doctor Acceptance...';

              const isAccepted = Boolean(c.acceptedByDoctorId || c.status === 'ACCEPTED' || c.status === 'reviewed');

              return (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.displayTitle} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-white">{c.displayTitle}</h4>
                        <p className="text-xs text-slate-400">
                          Doctor: <span className={isAccepted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{doctorDisplayName}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isAccepted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                      {isAccepted ? 'Doctor Accepted' : 'Awaiting Acceptance'}
                    </span>
                  </div>

                  {c.prescriptionNote && (
                    <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                        <Pill className="w-3.5 h-3.5" />
                        <span>Doctor Prescription Note ({c.doctorName})</span>
                      </div>
                      <p className="text-xs text-slate-300 italic">{c.prescriptionNote}</p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/history')}
                    className="w-full py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs border border-sky-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isAccepted ? `Open Live Chat with ${c.doctorName}` : 'View Shared Report Status'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SECTION 2: DOCTOR APPOINTMENTS & SCHEDULED VIDEO CONSULTATIONS */}
      <div className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white tracking-tight">Doctor Appointments & Scheduled Consultations</h2>
              <p className="text-xs text-slate-400">Upcoming tele-dermatology video appointments and meeting links</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Appointments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            <Calendar className="w-12 h-12 text-slate-600" />
            <h3 className="text-base font-bold text-slate-200">No Scheduled Appointments</h3>
            <p className="text-xs text-slate-400 max-w-md">Schedule a formal video consultation with a certified dermatologist directly linked to your screening results.</p>
            <button
              onClick={() => navigate('/appointments')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Book Dermatology Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt) => {
              if (!appt) return null;
              const isAccepted = Boolean(appt.acceptedByDoctorId || (appt.doctorName && !appt.doctorName.includes('Awaiting')));
              const doctorDisplayName = isAccepted ? `Confirmed by ${appt.doctorName}` : '⏳ Awaiting Doctor Acceptance (Waiting List)';

              const isReady = Boolean((appt as any)?.consultationStarted === true || (appt as any)?.meetingActive === true) && 
                appt?.meetingStatus !== 'NOT_STARTED' && 
                Boolean(appt?.meetingUrl && appt.meetingUrl.trim().startsWith('http'));

              return (
                <div key={appt.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-base shrink-0">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{doctorDisplayName}</h4>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <span className="text-slate-200">{appt.appointmentDate}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{appt.appointmentTime}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isReady
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                        : isAccepted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                      {isReady ? 'Ready for Call' : isAccepted ? 'Confirmed' : 'Pending Acceptance'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Linked Report: <strong className="text-slate-200">{appt.diseaseName}</strong> ({appt.confidence}%)</span>
                  </p>

                  <button
                    onClick={() => navigate('/appointments')}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                  >
                    {isReady ? <Video className="w-4 h-4 text-emerald-300 animate-pulse" /> : <Clock className="w-4 h-4" />}
                    <span>{isReady ? 'Join Google Meet Video Call' : 'View Appointment Details'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
