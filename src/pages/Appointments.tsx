import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToUserAppointments, AppointmentRecord } from '../services/firebase';
import { AppointmentDetailsModal } from '../components/AppointmentDetailsModal';
import { Calendar, Clock, Video, FileText, Stethoscope, ChevronRight, AlertCircle, PlusCircle } from 'lucide-react';

export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLang, t } = useLanguage();

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToUserAppointments(user.uid, (list) => {
      // Part 4 & 12 Security Check: Filter ONLY logged-in patient's appointments
      const patientOnly = list.filter(a => Boolean(a) && a.patientId === user.uid);
      setAppointments(patientOnly);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.uid]);

  const handleOpenDetails = (appt: AppointmentRecord) => {
    setSelectedAppointment(appt);
    setIsDetailsOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Patient Tele-Health Schedule</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">My Appointments</h1>
          <p className="text-xs text-slate-400">View and manage your scheduled dermatology consultations</p>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Main Appointments List Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            <Calendar className="w-12 h-12 text-slate-600" />
            <h3 className="text-base font-bold text-slate-200">No Scheduled Appointments</h3>
            <p className="text-xs text-slate-400 max-w-md">You have no upcoming dermatology consultations scheduled. Book an appointment directly from your AI skin report.</p>
            <button
              onClick={() => navigate('/history')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
            >
              View Screening Reports & Book
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((appt) => {
              if (!appt) return null;
              const isReady = Boolean((appt as any)?.consultationStarted === true || (appt as any)?.meetingActive === true) && 
                appt?.meetingStatus !== 'NOT_STARTED' && 
                Boolean(appt?.meetingUrl && appt.meetingUrl.trim().startsWith('http'));

              return (
                <div
                  key={appt.id}
                  onClick={() => handleOpenDetails(appt)}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-lg cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{appt.doctorName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : appt.appointmentStatus === 'Scheduled'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isReady ? 'Ready for Consultation' : appt.appointmentStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          {appt.appointmentDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.appointmentTime}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Report: <strong className="text-slate-200">{appt.diseaseName}</strong> ({appt.confidence}%)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {isReady ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        appointment={selectedAppointment}
      />

    </div>
  );
};
