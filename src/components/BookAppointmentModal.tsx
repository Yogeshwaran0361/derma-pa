import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createPatientAppointment, getUserScanHistory, SavedScanRecord } from '../services/firebase';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: {
    reportId?: string;
    scanId?: string;
    diseaseName?: string;
    confidence?: number;
    imageUrl?: string;
  } | null;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  reportData
}) => {
  const { user, userProfile } = useAuth();

  const todayStr = new Date().toLocaleDateString('en-CA');
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [availableScans, setAvailableScans] = useState<SavedScanRecord[]>([]);

  const [activeReport, setActiveReport] = useState<{
    reportId?: string;
    scanId?: string;
    diseaseName?: string;
    confidence?: number;
    imageUrl?: string;
  }>({
    reportId: reportData?.reportId || 'RPT_GENERAL',
    scanId: reportData?.scanId || reportData?.reportId || 'SCAN_GENERAL',
    diseaseName: reportData?.diseaseName || 'General Dermatology',
    confidence: reportData?.confidence || 95.0,
    imageUrl: reportData?.imageUrl || ''
  });

  const [consultationReason, setConsultationReason] = useState(
    `Consultation for AI screening result: ${reportData?.diseaseName || 'General Dermatology'}`
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookedApptId, setBookedApptId] = useState<string | null>(null);

  // Load saved scan records for report selection dropdown
  useEffect(() => {
    if (user?.uid && isOpen) {
      getUserScanHistory(user.uid).then((scans) => {
        setAvailableScans(scans || []);
      }).catch(() => {});
    }
  }, [user?.uid, isOpen]);

  // Sync activeReport whenever prop reportData changes
  useEffect(() => {
    if (reportData?.diseaseName) {
      setActiveReport({
        reportId: reportData.reportId || 'RPT_GENERAL',
        scanId: reportData.scanId || reportData.reportId || 'SCAN_GENERAL',
        diseaseName: reportData.diseaseName,
        confidence: reportData.confidence || 95.0,
        imageUrl: reportData.imageUrl || ''
      });
      setConsultationReason(`Consultation for AI screening result: ${reportData.diseaseName}`);
    }
  }, [reportData, isOpen]);

  if (!isOpen) return null;

  const handleSelectReport = (scanId: string) => {
    const found = availableScans.find((s) => s.id === scanId || s.scanId === scanId);
    if (found) {
      const conf = (found.confidence * (found.confidence <= 1 ? 100 : 1));
      setActiveReport({
        reportId: found.id,
        scanId: found.scanId || found.id,
        diseaseName: found.displayTitle || found.topClass || 'Skin Lesion',
        confidence: parseFloat(conf.toFixed(1)),
        imageUrl: found.imageUrl || ''
      });
      setConsultationReason(`Consultation for AI screening result: ${found.displayTitle || found.topClass}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('Please sign in to book an appointment.');
      return;
    }

    const activeEmail = userProfile?.email || user?.email || '';
    if (!activeEmail || !activeEmail.includes('@')) {
      setErrorMessage('Your account does not have a valid registered email address. Please update your profile.');
      return;
    }

    if (!appointmentDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }

    if (appointmentDate < todayStr) {
      setErrorMessage('Appointment date cannot be in the past.');
      return;
    }

    if (!appointmentTime) {
      setErrorMessage('Please select an appointment time.');
      return;
    }

    if (!consultationReason.trim()) {
      setErrorMessage('Please provide a reason for your consultation.');
      return;
    }

    setLoading(true);
    try {
      const apptId = await createPatientAppointment({
        patientId: user.uid,
        patientName: userProfile?.name || user.displayName || 'Patient',
        patientEmail: activeEmail,
        reportId: activeReport.reportId || 'RPT_GENERAL',
        scanId: activeReport.scanId || activeReport.reportId || 'SCAN_GENERAL',
        diseaseName: activeReport.diseaseName || 'General Dermatology',
        confidence: activeReport.confidence || 95.0,
        imageUrl: activeReport.imageUrl || '',
        appointmentDate,
        appointmentTime,
        doctorId: 'Awaiting_Doctor',
        doctorName: 'Awaiting Doctor Acceptance (Waiting List)',
        appointmentStatus: 'PENDING_ACCEPTANCE',
        consultationReason
      });

      setBookedApptId(apptId);
    } catch (err: any) {
      console.error('Book Appointment Error:', err);
      setErrorMessage(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Book Doctor Appointment</h2>
              <p className="text-xs text-slate-400">Schedule a consultation linked to your screening report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BOOKED SUCCESS STATE */}
        {bookedApptId ? (
          <div className="flex flex-col items-center justify-center text-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-xl font-extrabold text-white">Appointment Booked Successfully!</h3>
              <p className="text-xs text-slate-400 mt-1">Your consultation request has been broadcasted to the Waiting List.</p>
            </div>

            <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2.5 text-xs text-left font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Appointment ID:</span>
                <span className="text-sky-300 font-bold">{bookedApptId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Assigned Doctor:</span>
                <span className="text-amber-400 font-bold">Awaiting Doctor Acceptance (Waiting List)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-emerald-400 font-bold">{appointmentDate} at {appointmentTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Linked Report:</span>
                <span className="text-slate-200 font-bold">{activeReport.diseaseName || 'General Dermatology'} ({activeReport.confidence || 95}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold uppercase">WAITING_FOR_ACCEPTANCE</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              Done & Return to Report
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Patient & Report Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Patient:
                </span>
                <span className="text-white font-bold">{userProfile?.name || user?.displayName || 'Patient'}</span>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-slate-400 flex items-center gap-1.5 font-medium text-xs">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Select Specific AI Screening Report:
                </label>
                <select
                  value={activeReport.reportId || ''}
                  onChange={(e) => handleSelectReport(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-xs focus:border-sky-500 outline-none cursor-pointer"
                >
                  <option value={activeReport.reportId || 'RPT_CURRENT'}>
                    {activeReport.diseaseName} ({activeReport.confidence}% Confidence) - Current Selected Report
                  </option>
                  {availableScans.map((scan) => (
                    <option key={scan.id} value={scan.id}>
                      {scan.displayTitle || scan.topClass} — ({(scan.confidence * (scan.confidence <= 1 ? 100 : 1)).toFixed(1)}% Conf, {new Date(scan.scanDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Select Appointment Date</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-sky-500 outline-none"
                required
              />
            </div>

            {/* Time Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Select Appointment Time</span>
              </label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-sky-500 outline-none"
                required
              />
            </div>

            {/* Reason for Consultation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Reason for Consultation</label>
              <textarea
                rows={3}
                value={consultationReason}
                onChange={(e) => setConsultationReason(e.target.value)}
                placeholder="Describe any symptoms, duration, or questions for the dermatologist..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-sky-500 outline-none resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking Appointment...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
