import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  subscribeToDoctorProfile,
  subscribeToUserConsultations,
  DoctorProfileData,
  PatientConsultation
} from '../services/firebase';
import { formatConfidencePct } from '../services/diseaseInfo';

import {
  Stethoscope,
  Video,
  MessageSquare,
  FileText,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const DoctorHub: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileData | null>(null);
  const [userConsultations, setUserConsultations] = useState<PatientConsultation[]>([]);
  const [selectedTab, setSelectedTab] = useState<'SERVICES' | 'SPECIALIST' | 'SHARED_REPORTS'>('SERVICES');

  useEffect(() => {
    const unsubDoc = subscribeToDoctorProfile('dr_sarah_smith', (data) => {
      if (data) setDoctorProfile(data);
    });
    return () => unsubDoc();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubConsults = subscribeToUserConsultations(user.uid, (list) => {
      setUserConsultations(list);
    });
    return () => unsubConsults();
  }, [user?.uid]);

  const docName = doctorProfile?.name || 'Dr. Sarah Smith, MD';
  const docTitle = doctorProfile?.title || 'Senior Consultant Dermatologist';
  const docHospital = doctorProfile?.hospital || 'DermaVision General Medical Center';
  const docFee = doctorProfile?.consultationFee || '$45.00';
  const docImg = doctorProfile?.imageUrl || '';
  const docBio = doctorProfile?.bio || 'Board-certified dermatologist with over 14 years of clinical experience specializing in cutaneous oncology, dermoscopy, and AI-assisted skin screening.';
  const docExp = doctorProfile?.experienceYears || 14;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-24 md:pb-12 max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>{t.doctorPage.portalTag}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.doctorPage.title}</h1>
          <p className="text-xs text-slate-400">{t.doctorPage.sub}</p>
        </div>
      </div>

      {/* Top Main Doctor Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          {docImg ? (
            <img src={docImg} alt={docName} className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xl shrink-0">
              DR
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{docName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {t.doctorPage.online}
              </span>
            </div>
            <p className="text-xs text-sky-400 font-medium">{docTitle}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{docHospital}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab('SPECIALIST')}
            className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-sky-500/20"
          >
            <UserCheck className="w-4 h-4 text-slate-950" />
            <span>{t.doctorPage.viewProfileBtn}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setSelectedTab('SERVICES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'SERVICES'
              ? 'bg-sky-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t.doctorPage.servicesTab}
        </button>

        <button
          onClick={() => setSelectedTab('SPECIALIST')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'SPECIALIST'
              ? 'bg-sky-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t.doctorPage.specialistTab}
        </button>

        <button
          onClick={() => setSelectedTab('SHARED_REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'SHARED_REPORTS'
              ? 'bg-sky-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {t.doctorPage.sharedReportsTab} ({userConsultations.length})
        </button>
      </div>

      {/* TAB 1: CLINICAL SERVICES */}
      {selectedTab === 'SERVICES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div
            onClick={() => setSelectedTab('SPECIALIST')}
            className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Board Registered
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-sky-400 transition-colors">{t.doctorPage.findSpecialistTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.doctorPage.findSpecialistSub}</p>
            </div>
            <div className="flex items-center text-xs font-bold text-sky-400 gap-1 pt-2 border-t border-slate-800">
              <span>{t.doctorPage.viewDoctorDetails}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => navigate('/messages')}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Live Chat & Voice
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">{t.doctorPage.messagesTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.doctorPage.messagesSub}</p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-400 gap-1 pt-2 border-t border-slate-800">
              <span>{t.doctorPage.openChatRoom}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => setSelectedTab('SHARED_REPORTS')}
            className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Shared Reports
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors">{t.doctorPage.sharedReportsTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{t.doctorPage.sharedReportsSub}</p>
            </div>
            <div className="flex items-center text-xs font-bold text-rose-400 gap-1 pt-2 border-t border-slate-800">
              <span>{t.doctorPage.viewSharedReports}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DEMO DOCTOR SPECIALIST PROFILE */}
      {selectedTab === 'SPECIALIST' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
            {docImg ? (
              <img src={docImg} alt={docName} className="w-28 h-28 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xl" />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-black text-2xl">
                DR
              </div>
            )}

            <div className="flex flex-col text-center sm:text-left gap-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-white">{docName}</h2>
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-sm font-bold text-emerald-400">{docTitle}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{docHospital}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-400" /> {docExp} {t.doctorPage.expYears}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-emerald-400" /> {t.doctorPage.fee}: {docFee}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.doctorPage.bioTitle}</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">{docBio}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Phone className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">{t.doctorPage.clinicLine}</span>
                <span className="text-white font-mono">{doctorProfile?.phone || '+1 (555) 382-9102'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Official Email</span>
                <span className="text-white font-mono">{doctorProfile?.email || 'dr.sarah.smith@dermavision.ai'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                const meetUrl = doctorProfile?.googleMeetLink || 'https://meet.google.com/new';
                window.open(meetUrl, '_blank');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Video className="w-4 h-4 text-slate-950" />
              <span>Join Live Google Meet Video Call with {docName}</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 3: SHARED CLINICAL REPORTS ONLY */}
      {selectedTab === 'SHARED_REPORTS' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              <span>{t.doctorPage.sharedReportsTitle}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Only reports shared with attending doctor</span>
          </div>

          {userConsultations.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center gap-3">
              <FileText className="w-12 h-12 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-300">No Shared Clinical Reports Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm">When you consult a doctor from your AI skin report, the shared clinical summary will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userConsultations.filter(Boolean).map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.displayTitle} className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                        No Img
                      </div>
                    )}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm truncate">{c.displayTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          c.status === 'COMPLETED' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">Confidence: {formatConfidencePct(c.confidence)}%</span>

                      <span className="text-[10px] text-slate-400">Shared Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {c.doctorDiagnosis && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-col gap-1">
                      <span className="text-sky-400 font-bold">Doctor Diagnosis:</span>
                      <p className="text-slate-300">{c.doctorDiagnosis}</p>
                      {c.prescriptionNote && (
                        <div className="mt-1 pt-1 border-t border-slate-800 text-emerald-400 font-medium">
                          Rx: {c.prescriptionNote}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/report/${c.id}`, { state: { scanRecord: c } })}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>View Full Clinical Report & Prescription</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
