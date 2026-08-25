import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  subscribeToAllConsultationsForDoctor,
  updateConsultationDoctorDiagnosis,
  subscribeToPatientMessages,
  sendPatientMessage,
  PatientConsultation,
  PatientMessage
} from '../services/firebase';
import { sendAppointmentAcceptedEmail } from '../services/emailService';
import {
  Stethoscope,
  User,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Pill,
  ShieldCheck,
  Award,
  Video,
  X,
  Search,
  Activity,
  Calendar
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentLang } = useLanguage();

  const [consultations, setConsultations] = useState<PatientConsultation[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'REVIEWED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Consultation for Prescription & Review Modal
  const [reviewConsultation, setReviewConsultation] = useState<PatientConsultation | null>(null);
  const [doctorDiagnosis, setDoctorDiagnosis] = useState('');
  const [prescriptionNote, setPrescriptionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Consultation for Live Chat Modal
  const [chatConsultation, setChatConsultation] = useState<PatientConsultation | null>(null);
  const [chatMessages, setChatMessages] = useState<PatientMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Subscribe to all patient consultations in real-time
  useEffect(() => {
    const unsub = subscribeToAllConsultationsForDoctor((list) => {
      setConsultations(list);
    });
    return () => unsub();
  }, []);

  // Subscribe to live chat messages when chat modal is open
  useEffect(() => {
    if (!chatConsultation?.id) return;
    const unsub = subscribeToPatientMessages(chatConsultation.id, (msgs) => {
      setChatMessages(msgs);
    });
    return () => unsub();
  }, [chatConsultation?.id]);

  // Open Review & Prescription Modal
  const handleOpenReview = (c: PatientConsultation) => {
    setReviewConsultation(c);
    setDoctorDiagnosis(c.diseaseName || '');
    setPrescriptionNote(c.prescriptionNote || '');
  };

  // Submit Prescription to Patient
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewConsultation?.id) return;

    setIsSubmitting(true);
    try {
      await updateConsultationDoctorDiagnosis(
        reviewConsultation.id,
        doctorDiagnosis.trim() || reviewConsultation.diseaseName || reviewConsultation.displayTitle || 'Reviewed',
        prescriptionNote.trim(),
        'COMPLETED'
      );

      // Send automated physician message to patient's consultation chat
      if (prescriptionNote.trim()) {
        await sendPatientMessage(
          reviewConsultation.id,
          'dr_sarah_smith',
          'Dr. Sarah Smith, MD',
          `💊 PRESCRIPTION ISSUED: ${prescriptionNote.trim()}`
        );
      }

      // Send EmailJS Notification ONLY when Doctor Accepts & Reviews Report
      if (reviewConsultation.patientEmail && reviewConsultation.patientEmail.includes('@')) {
        try {
          const nowStr = new Date();
          await sendAppointmentAcceptedEmail({
            patientEmail: reviewConsultation.patientEmail,
            patientName: reviewConsultation.patientName || 'Patient',
            doctorName: 'Dr. Sarah Smith, MD',
            diseaseName: doctorDiagnosis.trim() || reviewConsultation.diseaseName || 'Skin Screening Report',
            appointmentDate: nowStr.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            appointmentTime: nowStr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            prescriptionNote: prescriptionNote.trim() || undefined
          });
          console.log('[DOCTOR ACCEPTANCE EMAIL DISPATCHED] Sent to:', reviewConsultation.patientEmail);
        } catch (eErr) {
          console.warn('[DOCTOR ACCEPTANCE EMAIL NOTICE]', eErr);
        }
      }

      alert('Prescription and diagnosis successfully sent to patient portal.');
      setReviewConsultation(null);
    } catch (err) {
      console.error('Prescription Save Error:', err);
      alert('Failed to update consultation diagnosis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send Doctor Message in Live Chat
  const handleSendDoctorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatConsultation?.id || !chatInput.trim()) return;
    const msgText = chatInput.trim();
    setChatInput('');
    await sendPatientMessage(
      chatConsultation.id,
      'dr_sarah_smith',
      'Dr. Sarah Smith, MD',
      msgText
    );
  };

  // Filtered consultations list
  const filteredList = consultations.filter((c) => {
    if (!c) return false;
    const matchesSearch =
      (c.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.diseaseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.patientEmail || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'PENDING') return c.status !== 'reviewed' && c.status !== 'COMPLETED';
    if (filterStatus === 'REVIEWED') return c.status === 'reviewed' || c.status === 'COMPLETED';
    return true;
  });

  const pendingCount = consultations.filter(c => c && c.status !== 'reviewed' && c.status !== 'COMPLETED').length;
  const reviewedCount = consultations.filter(c => c && (c.status === 'reviewed' || c.status === 'COMPLETED')).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Physician Portal Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
              <Stethoscope className="w-8 h-8" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Dr. Sarah Smith, MD</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Physician Portal
              </span>
            </div>
            <p className="text-xs text-sky-400 font-medium mt-0.5">Senior Consultant Dermatologist • Board Certified</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">DermaVision AI Tele-Health Center & Clinical Review Portal</p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-xl font-black text-white">{consultations.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Cases</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-xl font-black text-amber-400">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-400 uppercase">Pending</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-xl font-black text-emerald-400">{reviewedCount}</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Prescribed</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, email, or disease condition..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'ALL' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cases ({consultations.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'PENDING' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('REVIEWED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'REVIEWED' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Prescribed ({reviewedCount})
          </button>
        </div>
      </div>

      {/* Patient Cases Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Patient Tele-Health Clinical Queue</span>
        </h2>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            <Stethoscope className="w-12 h-12 text-slate-600" />
            <h3 className="text-base font-bold text-slate-200">No Patient Consultations Found</h3>
            <p className="text-xs text-slate-400 max-w-md">No patient requests match the current search or status filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList.map((consult) => {
              const isReviewed = consult.status === 'reviewed' || consult.status === 'COMPLETED';

              return (
                <div
                  key={consult.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors shadow-lg relative group"
                >
                  <div className="flex flex-col gap-3">
                    
                    {/* Patient Meta */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{consult.patientName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">{consult.patientEmail}</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        isReviewed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {isReviewed ? 'Prescribed' : 'Pending Review'}
                      </span>
                    </div>

                    {/* Image & AI Screening Output */}
                    <div className="flex items-center gap-3">
                      {consult.imageUrl ? (
                        <img src={consult.imageUrl} alt={consult.diseaseName} className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">AI Screening Target:</span>
                        <h5 className="font-bold text-sm text-emerald-400">{consult.diseaseName}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>Conf: <strong>{consult.confidence}%</strong></span>
                          <span>•</span>
                          <span className="capitalize text-amber-300">{consult.riskLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms Note */}
                    {consult.symptomsNote && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                        "{consult.symptomsNote}"
                      </div>
                    )}

                    {/* Existing Prescription Note if Present */}
                    {consult.prescriptionNote && (
                      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex flex-col gap-1 text-xs">
                        <span className="font-bold text-blue-400 flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5" />
                          Prescription Issued:
                        </span>
                        <p className="text-slate-200">{consult.prescriptionNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenReview(consult)}
                      className="flex-1 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs border border-sky-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>{isReviewed ? 'Edit Prescription' : 'Review & Prescribe'}</span>
                    </button>

                    <button
                      onClick={() => setChatConsultation(consult)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DOCTOR PRESCRIPTION & CASE REVIEW MODAL */}
      {reviewConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Physician Case Review & Rx</h3>
                  <p className="text-xs text-slate-400">Patient: {reviewConsultation.patientName}</p>
                </div>
              </div>

              <button
                onClick={() => setReviewConsultation(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Case Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              {reviewConsultation.imageUrl ? (
                <img src={reviewConsultation.imageUrl} alt={reviewConsultation.diseaseName} className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
              )}
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-slate-400">AI Screening Finding:</span>
                <span className="text-base font-bold text-emerald-400">{reviewConsultation.diseaseName}</span>
                <span className="text-slate-400 font-mono">Confidence: {reviewConsultation.confidence}% • Risk: {reviewConsultation.riskLevel}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePrescription} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Confirmed Clinical Diagnosis</label>
                <input
                  type="text"
                  value={doctorDiagnosis}
                  onChange={(e) => setDoctorDiagnosis(e.target.value)}
                  placeholder="e.g. Acne Vulgaris / Mild Inflammatory Rosacea"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Physician Prescription & Guidance Note</label>
                <textarea
                  rows={4}
                  value={prescriptionNote}
                  onChange={(e) => setPrescriptionNote(e.target.value)}
                  placeholder="Enter topical medications, application instructions, dosage, and preventive care advice for the patient..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving & Transmitting Rx...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue Official Doctor Prescription</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR 2-WAY LIVE CHAT MODAL */}
      {chatConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{chatConsultation.patientName}</h3>
                  <p className="text-xs text-teal-400">
                    Patient Consultation Channel • {chatConsultation.diseaseName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setChatConsultation(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-950/40">
              {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-2 py-8">
                  <MessageSquare className="w-8 h-8 text-slate-600" />
                  <span>No messages exchanged yet with patient {chatConsultation.patientName}.</span>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isDoctor = msg.senderRole === 'doctor' || msg.senderName.includes('Dr.') || msg.senderId === 'dr_sarah_smith';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[80%] ${isDoctor ? 'self-end items-end' : 'self-start items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 px-1 font-mono">
                        {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isDoctor
                          ? 'bg-sky-500 text-white rounded-br-none shadow-md shadow-sky-500/10'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Footer */}
            <form onSubmit={handleSendDoctorMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Reply to patient ${chatConsultation.patientName}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
