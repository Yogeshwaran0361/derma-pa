import React from 'react';
import { Calendar, Clock, User, FileText, Video, Stethoscope, ExternalLink, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AppointmentRecord } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord | null;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const navigate = useNavigate();

  if (!isOpen || !appointment) return null;

  const isMeetingReady = Boolean(appointment) &&
    Boolean((appointment as any)?.consultationStarted === true || (appointment as any)?.meetingActive === true) && 
    appointment?.meetingStatus !== 'NOT_STARTED' && 
    Boolean(appointment?.meetingUrl && appointment.meetingUrl.trim().startsWith('http'));

  // Part 9: Google Calendar Link Generator
  const handleAddToGoogleCalendar = () => {
    if (!appointment?.appointmentDate || !appointment?.appointmentTime) return;

    const title = encodeURIComponent(`DermaVision Consultation - ${appointment.diseaseName || 'Skin Screening'}`);
    const details = encodeURIComponent(
      `Patient: ${appointment.patientName || 'Patient'}\nReport ID: ${appointment.reportId || ''}\nAI Screening Result: ${appointment.diseaseName || ''} (${appointment.confidence || 0}%)\nConsultation Reason: ${appointment.consultationReason || ''}`
    );
    const location = encodeURIComponent('DermaVision Tele-Health Portal');

    // Parse date & time into Google Calendar format (YYYYMMDDTHHMMSSZ)
    const [year, month, day] = (appointment.appointmentDate || '').split('-');
    const [hours, minutes] = (appointment.appointmentTime || '').split(':');
    if (!year || !hours) return;

    const startDateStr = `${year}${month}${day}T${hours}${minutes}00`;
    
    // 30-minute duration
    const endMinutes = (parseInt(minutes || '0', 10) + 30) % 60;
    const endHours = (parseInt(hours || '0', 10) + Math.floor((parseInt(minutes || '0', 10) + 30) / 60)).toString().padStart(2, '0');
    const endDateStr = `${year}${month}${day}T${endHours}${endMinutes.toString().padStart(2, '0')}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Appointment Details</h2>
              <p className="text-xs font-mono text-sky-400">{appointment?.id || ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Doctor Acceptance & Details Box */}
        {appointment?.acceptedByDoctorId || (appointment?.appointmentStatus && appointment.appointmentStatus !== 'PENDING_ACCEPTANCE' && appointment.appointmentStatus !== 'Scheduled') ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{appointment?.doctorName || 'Dr. Sarah Smith, MD'}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACCEPTED BY DOCTOR
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">{appointment?.doctorTitle || 'Attending Senior Dermatologist'}</span>
              <span className="text-[10px] text-slate-400">{appointment?.doctorHospital || 'DermaVision Clinical Center'}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg shrink-0">
              <Clock className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-amber-300 text-sm">Waiting List / Pending Acceptance</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  WAITING LIST
                </span>
              </div>
              <span className="text-xs text-slate-300 mt-0.5">Awaiting any dermatologist in the Doctor Portal to claim and accept your appointment.</span>
            </div>
          </div>
        )}

        {/* Telemetry & Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Appointment Date</span>
            <span className="text-slate-200 font-bold">{appointment?.appointmentDate || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Appointment Time</span>
            <span className="text-emerald-400 font-bold">{appointment?.appointmentTime || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Status</span>
            <span className="text-sky-300 font-bold uppercase">{appointment?.appointmentStatus || 'Scheduled'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Meeting Status</span>
            <span className={`font-bold uppercase ${isMeetingReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isMeetingReady ? 'Ready' : 'Not Started'}
            </span>
          </div>
        </div>

        {/* Linked Screening Report Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-400" />
              Linked Screening Report:
            </span>
            <button
              onClick={() => {
                onClose();
                if (appointment?.reportId) navigate(`/report/${appointment.reportId}`);
              }}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Report</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-semibold">{appointment?.diseaseName || 'Screening Report'}</span>
            <span className="text-sky-400 font-mono font-bold">{appointment?.confidence || 0}% Confidence</span>
          </div>
        </div>

        {/* Consultation Reason */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
          <span className="text-slate-400 font-bold">Consultation Reason:</span>
          <p className="text-slate-300">{appointment?.consultationReason || 'Routine Dermatology Evaluation'}</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-3">
          
          {/* Part 9: Add to Google Calendar Button */}
          <button
            onClick={handleAddToGoogleCalendar}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Add to Google Calendar</span>
          </button>

          {/* Part 5 & Part 7: Google Meet Join Button (Disabled until doctor actually starts meeting) */}
          {isMeetingReady ? (
            <a
              href={appointment?.meetingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all animate-pulse"
            >
              <Video className="w-4 h-4" />
              <span>Join Google Meet (Live Consultation Ready)</span>
            </a>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Join Google Meet</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">
                Disabled (Awaiting Doctor)
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
