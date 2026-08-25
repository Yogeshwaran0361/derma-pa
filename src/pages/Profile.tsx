import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Calendar, Globe, Shield, Edit2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../i18n/translations';

import { Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const { currentLang, setLanguage, t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || user?.displayName || '');
  const [age, setAge] = useState<string>(userProfile?.age !== null && userProfile?.age !== undefined ? String(userProfile.age) : '');
  const [gender, setGender] = useState(userProfile?.gender || 'Female');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(currentLang);
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile?.imageUrl || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setPreferredLanguage(currentLang);
    if (userProfile?.imageUrl) setAvatarUrl(userProfile.imageUrl);
  }, [currentLang, userProfile?.imageUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setErrorMsg('Please enter a valid age (1-120).');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name,
        age: ageNum,
        gender,
        preferredLanguage,
        imageUrl: avatarUrl
      });
      await setLanguage(preferredLanguage);
      setSuccessMsg(t.profile.updateSuccess);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setErrorMsg(t.profile.updateError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
        
        {/* Header with Avatar Photo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Patient Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                  <User className="w-8 h-8" />
                </div>
              )}

              {isEditing && (
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-opacity">
                  <Camera className="w-5 h-5 text-sky-400" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">{t.profile.title}</h1>
              <p className="text-xs text-slate-400">{t.profile.sub}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.profile.editProfile}</span>
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Details or Edit Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.fullName}</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-bold text-white">
                  {userProfile?.name || user?.displayName || 'Not provided'}
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.email}</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-slate-300">
                {userProfile?.email || user?.email || 'N/A'}
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.age}</label>
              {isEditing ? (
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                />
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-bold text-white">
                  {userProfile?.age ? `${userProfile.age}` : 'Not specified'}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.gender}</label>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Female">{t.auth.genderFemale}</option>
                  <option value="Male">{t.auth.genderMale}</option>
                  <option value="Other">{t.auth.genderOther}</option>
                  <option value="Prefer not to say">{t.auth.genderPreferNot}</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-bold text-white">
                  {userProfile?.gender || 'Not specified'}
                </div>
              )}
            </div>

            {/* Preferred Language */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.preferredLanguage}</label>
              {isEditing ? (
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-bold"
                >
                  <option value="en">🌐 English (EN)</option>
                  <option value="ta">🌐 தமிழ் (TA)</option>
                  <option value="hi">🌐 हिन्दी (HI)</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-bold text-sky-400">
                  {currentLang === 'ta' ? '🌐 தமிழ் (TA)' : currentLang === 'hi' ? '🌐 हिन्दी (HI)' : '🌐 English (EN)'}
                </div>
              )}
            </div>

            {/* Auth Provider */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold">{t.profile.authType}</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-semibold text-slate-300 capitalize flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{userProfile?.authProvider || 'Firebase Auth'}</span>
              </div>
            </div>

          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                {t.profile.cancel}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? t.profile.saving : t.profile.saveToFirestore}</span>
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
