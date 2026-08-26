import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToUserAppointments, AppointmentRecord, deletePatientConsultation, deleteAllPatientConsultations } from '../services/firebase';
import { AppointmentDetailsModal } from '../components/AppointmentDetailsModal';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { Calendar, Clock, Video, FileText, Stethoscope, ChevronRight, AlertCircle, PlusCircle, ExternalLink, Trash2 } from 'lucide-react';

export const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLang, t } = useLanguage();

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const handleDeleteAppt = async (apptId: string) => {
    if (window.confirm('Are you sure you want to cancel/delete this appointment?')) {
      await deletePatientConsultation(apptId, user?.uid);
      setAppointments((prev) => prev.filter((a) => a.id !== apptId));
    }
  };

  const handleClearAllAppts = async () => {
    if (!user?.uid) return;
    if (window.confirm('Are you sure you want to delete ALL appointments? This action cannot be undone.')) {
      await deleteAllPatientConsultations(user.uid);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToUserAppointments(user.uid, (list) => {
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

  const activeLiveAppt = appointments.find((appt) => {
    if (!appt) return false;
    const isStarted = Boolean((appt as any)?.consultationStarted === true || (appt as any)?.meetingActive === true || (appt as any)?.meetingStatus === 'READY' || (appt as any)?.meetingStatus === 'IN_PROGRESS');
    const notCompleted = (appt as any)?.meetingStatus !== 'COMPLETED' && appt?.appointmentStatus !== 'Completed';
    const hasUrl = Boolean(appt?.meetingUrl && appt.meetingUrl.trim().startsWith('http'));
    return isStarted && notCompleted && hasUrl;
  });

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const pageTag = isTa ? 'நோயாளி தொலைநிலை சுகாதார அட்டவணை' : isHi ? 'रोगी टेली-स्वास्थ्य अनुसूची' : 'Patient Tele-Health Schedule';
  const pageTitle = isTa ? 'என் சந்திப்புகள்' : isHi ? 'मेरी अपॉइंटमेंट्स' : 'My Appointments';
  const pageSub = isTa ? 'உங்கள் திட்டமிடப்பட்ட தோல் மருத்துவ ஆலோசனைகளைப் பார்த்து நிர்வகிக்கவும்' : isHi ? 'अपनी निर्धारित त्वचा विज्ञान परामर्श देखें और प्रबंधित करें' : 'View and manage your scheduled dermatology consultations';
  const bookBtn = isTa ? 'புதிய சந்திப்பை முன்பதிவு செய்' : isHi ? 'नई अपॉइंटमेंट बुक करें' : 'Book New Appointment';
  const noApptsTitle = isTa ? 'திட்டமிடப்பட்ட சந்திப்புகள் எதுவும் இல்லை' : isHi ? 'कोई निर्धारित अपॉइंटमेंट नहीं' : 'No Scheduled Appointments';
  const noApptsSub = isTa ? 'உங்களுக்கு வரவிருக்கும் தோல் மருத்துவ ஆலோசனைகள் எதுவும் இல்லை.' : isHi ? 'आपकी कोई आगामी परामर्श निर्धारित नहीं है।' : 'You have no upcoming dermatology consultations scheduled. Click below to schedule a telehealth session.';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>{pageTag}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">{pageTitle}</h1>
          <p className="text-xs text-slate-400">{pageSub}</p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{bookBtn}</span>
        </button>
      </div>



      {/* Main Appointments List Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">{isTa ? 'சந்திப்புகள் ஏற்றப்படுகின்றன...' : isHi ? 'अपॉइंटमेंट लोड हो रहे हैं...' : 'Loading appointments...'}</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            <Calendar className="w-12 h-12 text-slate-600" />
            <h3 className="text-base font-bold text-slate-200">{noApptsTitle}</h3>
            <p className="text-xs text-slate-400 max-w-md">{noApptsSub}</p>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{bookBtn}</span>
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
                        <h3 className="font-bold text-base text-white">
                          {appt.acceptedByDoctorId || (appt.doctorName && !appt.doctorName.includes('Awaiting'))
                            ? `Confirmed by ${appt.doctorName}`
                            : '⏳ Awaiting Doctor Acceptance (Waiting List)'}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : appt.acceptedByDoctorId || (appt.doctorName && !appt.doctorName.includes('Awaiting'))
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}>
                          {isReady
                            ? 'Ready for Consultation'
                            : appt.acceptedByDoctorId || (appt.doctorName && !appt.doctorName.includes('Awaiting'))
                            ? 'ACCEPTED BY DOCTOR'
                            : 'WAITING LIST'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          {appt.appointmentDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {appt.appointmentTime}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {appt.diseaseName || 'Report Attached'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (appt.reportId && appt.reportId !== 'RPT_GENERAL') {
                          navigate(`/report/${appt.reportId}`);
                        } else {
                          handleOpenDetails(appt);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      title="Open Attached Screening Report"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Attached Report</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(appt);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold text-xs border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAppt(appt.id);
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Cancel / Delete Appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Appointment Details Modal */}
      {isDetailsOpen && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}

      {/* Book New Appointment Modal */}
      {isBookModalOpen && (
        <BookAppointmentModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          reportData={null}
        />
      )}

    </div>
  );
};
