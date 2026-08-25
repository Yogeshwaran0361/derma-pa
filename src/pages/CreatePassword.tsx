import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  createUserProfile,
  registerWithEmail
} from '../services/firebase';
import { updatePassword } from 'firebase/auth';
import { sendRegistrationWelcomeEmail } from '../services/emailService';
import { LanguageSelector } from '../components/LanguageSelector';
import { Shield, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

export const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile, setUserMode, setLoginOtpVerified } = useAuth();

  const [pendingData, setPendingData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      const isVerified = sessionStorage.getItem('email_verified_for_registration') === 'true';
      const storedDataStr = sessionStorage.getItem('pending_registration_data');
      
      if (!isVerified || !storedDataStr) {
        console.warn('[REGISTRATION] Blocked direct access to Create Password page. Redirecting to OTP Verification...');
        navigate('/otp-verification', { replace: true });
        return;
      }

      const parsed = JSON.parse(storedDataStr);
      setPendingData(parsed);
    } catch (e) {
      navigate('/otp-verification', { replace: true });
    }
  }, [navigate]);

  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = Boolean(password && password === confirmPassword);

  const passedRulesCount = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial, passwordsMatch].filter(Boolean).length;
  const isPasswordStrong = passedRulesCount === 6;

  const getStrengthProgress = () => {
    if (!password) return { pct: 0, color: 'bg-slate-700', label: '' };
    if (passedRulesCount <= 2) return { pct: 25, color: 'bg-rose-500', label: 'Weak' };
    if (passedRulesCount <= 4) return { pct: 50, color: 'bg-amber-500', label: 'Medium' };
    if (passedRulesCount === 5) return { pct: 75, color: 'bg-sky-500', label: 'Strong' };
    return { pct: 100, color: 'bg-emerald-500', label: 'Very Strong' };
  };

  const strengthInfo = getStrengthProgress();

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isPasswordStrong) {
      setErrorMessage('Please make sure your password meets all strong security requirements and confirmation matches.');
      return;
    }

    if (!pendingData) {
      setErrorMessage('Missing registration data. Please restart registration.');
      return;
    }

    setLoading(true);
    try {
      const email = pendingData.email.trim().toLowerCase();
      const fullName = pendingData.fullName.trim();
      const age = parseInt(pendingData.age, 10);
      const gender = pendingData.gender;
      const mobile = pendingData.mobile;

      let finalUser = auth.currentUser;
      if (!finalUser) {
        finalUser = await registerWithEmail(email, password, fullName, age, gender);
      } else {
        try {
          await updatePassword(finalUser, password);
        } catch (passErr: any) {
          console.warn('[PASSWORD UPDATE NOTICE]', passErr);
        }
      }

      await createUserProfile(finalUser.uid, {
        uid: finalUser.uid,
        name: fullName,
        email: email,
        age: age,
        gender: gender,
        mobile: `+91 ${mobile.replace(/\D/g, '')}`,
        emailVerified: true,
        authProvider: pendingData.isGoogleAccount ? 'google' : 'email',
        role: 'patient',
        accountStatus: 'ACTIVE',
        profileCompleted: true,
        preferredLanguage: 'en'
      });

      try {
        sendRegistrationWelcomeEmail(email, fullName);
      } catch (welcomeErr) {}

      sessionStorage.removeItem('pending_registration_data');
      sessionStorage.removeItem('email_verified_for_registration');

      await refreshProfile();
      setLoginOtpVerified(false);
      setUserMode('UNAUTHENTICATED');

      navigate('/signin', {
        replace: true,
        state: {
          registeredEmail: email,
          message: '🎉 Account registration completed successfully! Please Sign in to access your portal.'
        }
      });
    } catch (err: any) {
      console.error('[ACCOUNT CREATION ERROR]', err);
      if (err?.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email address already exists. Please Sign In.');
      } else {
        setErrorMessage(err?.message || 'Failed to complete account registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="absolute top-1/4 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-xl shadow-sky-500/20 mb-3 hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-sky-400" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create your patient account</h1>
          <p className="text-xs text-slate-400 mt-1">Step 3 of 3 — Secure Patient Onboarding</p>
        </div>

        {/* Multi-Step Indicator Bar */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-sky-500 text-white">1</span>
            <span>Personal Info</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-sky-500" />
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-sky-500 text-white">2</span>
            <span>OTP Verification</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-sky-500" />
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-sky-500 text-white">3</span>
            <span>Password</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">3. Create Strong Account Password</h3>
              <p className="text-xs text-slate-400">Set a high-security password for your patient portal</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {password && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Password Strength</span>
                  <span className={`text-xs ${strengthInfo.color.replace('bg-', 'text-')}`}>{strengthInfo.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthInfo.color}`} style={{ width: `${strengthInfo.pct}%` }} />
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password Requirements:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{hasMinLen ? '✓' : '✕'}</span> <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{hasUpper ? '✓' : '✕'}</span> <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{hasLower ? '✓' : '✕'}</span> <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{hasNumber ? '✓' : '✕'}</span> <span>At least 1 number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{hasSpecial ? '✓' : '✕'}</span> <span>Special character (!@#$)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{passwordsMatch ? '✓' : '✕'}</span> <span>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordStrong}
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? 'Activating Patient Account...' : 'CREATE & ACTIVATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
