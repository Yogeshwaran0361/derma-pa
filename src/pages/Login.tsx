import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { resetPassword } from '../services/firebase';
import { Shield, Mail, Lock, LogIn, AlertCircle, CheckCircle2, ArrowRight, Activity, Eye, EyeOff, KeyRound, Sparkles, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { sendLoginOtpEmail, verifyLoginOtpCode } from '../services/otpService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userMode, login, signInGoogle, enterDemoMode, loginOtpVerified, setLoginOtpVerified, logout } = useAuth();
  const { currentLang } = useLanguage();

  const isCheckingGoogleRef = React.useRef(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
    }
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    if (user && userMode === 'AUTHENTICATED' && loginOtpVerified && !isCheckingGoogleRef.current) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userMode, loginOtpVerified, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unregisteredEmail, setUnregisteredEmail] = useState<string | null>(null);

  // Login Step State (1: Credentials, 2: Login OTP Verification)
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes

  // Resend Cooldown Countdown Timer
  useEffect(() => {
    let timer: any;
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Expiry Countdown Timer
  useEffect(() => {
    let timer: any;
    if (loginStep === 2 && expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loginStep, expirySeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigit;
    setOtpDigits(newDigits);

    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
    }
  };

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const titleText = isTa ? 'நோயாளி தளத்தில் உள்நுழைக' : isHi ? 'रोगी पोर्टल पर साइन इन करें' : 'Sign In to Patient Portal';
  const subtitleText = isTa ? 'உங்கள் கணக்கு விவரங்களை உள்ளிடவும்' : isHi ? 'अपने खाते के विवरण दर्ज करें' : 'Enter your credentials to access patient portal';
  const emailLabel = isTa ? 'மின்னஞ்சல் முகவரி' : isHi ? 'ईमेल पता' : 'Email Address';
  const passwordLabel = isTa ? 'கடவுச்சொல்' : isHi ? 'पासवर्ड' : 'Password';
  const forgotPasswordBtnText = isTa ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : isHi ? 'पासवर्ड भूल गए?' : 'Forgot Password?';
  const signInBtnText = isTa ? 'உள்நுழைக' : isHi ? 'साइन इन करें' : 'Sign In';
  const googleBtnText = isTa ? 'Google மூலம் உள்நுழைக' : isHi ? 'गूगल के साथ साइन इन करें' : 'Sign in with Google';
  const noAccountText = isTa ? 'கணக்கு இல்லையா?' : isHi ? 'खाता नहीं है?' : "Don't have an account?";
  const registerLinkText = isTa ? 'புதிய கணக்கை உருவாக்கவும்' : isHi ? 'नया खाता बनाएं' : 'Create Account';

  // Brute Force Protection (Max 5 Failed Attempts within 15 Minutes)
  const checkFailedAttempts = (cleanEmail: string): boolean => {
    try {
      const key = `failed_logins_${cleanEmail}`;
      const recordStr = localStorage.getItem(key);
      if (!recordStr) return false;
      const record = JSON.parse(recordStr);
      const now = Date.now();
      if (now - record.firstFailedAt > 15 * 60 * 1000) {
        localStorage.removeItem(key);
        return false;
      }
      return record.count >= 5;
    } catch (e) {
      return false;
    }
  };

  const recordFailedAttempt = (cleanEmail: string) => {
    try {
      const key = `failed_logins_${cleanEmail}`;
      const recordStr = localStorage.getItem(key);
      const now = Date.now();
      let record = recordStr ? JSON.parse(recordStr) : { count: 0, firstFailedAt: now };
      if (now - record.firstFailedAt > 15 * 60 * 1000) {
        record = { count: 1, firstFailedAt: now };
      } else {
        record.count += 1;
      }
      localStorage.setItem(key, JSON.stringify(record));
    } catch (e) {}
  };

  const clearFailedAttempts = (cleanEmail: string) => {
    try {
      localStorage.removeItem(`failed_logins_${cleanEmail}`);
    } catch (e) {}
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(isTa ? 'செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : isHi ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage(isTa ? 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்.' : isHi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your account password.');
      return;
    }

    if (checkFailedAttempts(cleanEmail)) {
      setErrorMessage('Access temporarily blocked due to multiple failed login attempts. Please reset password or try again after 15 minutes.');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate Email + Password with Firebase Auth
      await login(cleanEmail, password);
      clearFailedAttempts(cleanEmail);
      setLoginOtpVerified(false);

      // 2. Dispatch Login OTP Email & Transition to OTP Verification Step
      const otpRes = await sendLoginOtpEmail(cleanEmail);
      if (otpRes.success) {
        setCooldownSeconds(otpRes.cooldownSeconds || 60);
      }
      setExpirySeconds(300);
      setLoginStep(2);
    } catch (err: any) {
      console.error('[SIGN IN ERROR]', err);
      recordFailedAttempt(cleanEmail);
      setErrorMessage('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const codeStr = otpDigits.join('');
    if (codeStr.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit numeric verification code.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await verifyLoginOtpCode(cleanEmail, codeStr);
      if (res.success) {
        setLoginOtpVerified(true);
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMessage(res.message || 'Incorrect verification code.');
      }
    } catch (err: any) {
      setErrorMessage('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLoginOtp = async () => {
    if (cooldownSeconds > 0 || loading) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendLoginOtpEmail(cleanEmail);
      if (res.success) {
        setCooldownSeconds(res.cooldownSeconds || 60);
        setExpirySeconds(300);
        setOtpDigits(['', '', '', '', '', '']);
      } else {
        setErrorMessage(res.message || 'Unable to resend verification code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    isCheckingGoogleRef.current = true;
    try {
      const res = await signInGoogle();
      if (res.notRegistered) {
        const notRegMsg = isTa
          ? '❌ பதிவு செய்யப்படாத மின்னஞ்சல்: முதலில் புதிய கணக்கை உருவாக்கி, பின்னர் உள்நுழையவும்.'
          : isHi
          ? '❌ अपंजीकृत ईमेल: कृपया पहले नया खाता बनाएं, फिर साइन इन करें।'
          : 'Account not found. Please create your DermaVision account first.';
        setErrorMessage(notRegMsg);
        setUnregisteredEmail(res.user?.email || 'Your Google Account');
      } else if (res.user && res.user.email) {
        const googleEmail = res.user.email.trim().toLowerCase();
        setEmail(googleEmail);
        setLoginOtpVerified(false);
        const otpRes = await sendLoginOtpEmail(googleEmail, res.user.displayName || 'User');
        if (otpRes.success) {
          setCooldownSeconds(otpRes.cooldownSeconds || 60);
        }
        setExpirySeconds(300);
        setLoginStep(2);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err?.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      isCheckingGoogleRef.current = false;
      setLoading(false);
    }
  };

  const handleSendResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);

    const cleanResetEmail = resetEmail.trim().toLowerCase();
    if (!cleanResetEmail || !cleanResetEmail.includes('@')) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(cleanResetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setResetError('Failed to send password reset email. Please verify email and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Top Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-xl shadow-sky-500/20 mb-4 hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-sky-400" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DermaVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">AI</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
            {isTa ? 'பாதுகாப்பான நோயாளி தளம்' : isHi ? 'सुरक्षित रोगी पोर्टल' : 'Secure Patient Portal'}
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-6">

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-start gap-3 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-start gap-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* STEP 1: CREDENTIALS AUTHENTICATION */}
          {loginStep === 1 && (
            <>
              <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{titleText}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{subtitleText}</p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  HIPAA
                </div>
              </div>

              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{emailLabel}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white text-xs font-medium placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">{passwordLabel}</label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
                    >
                      {forgotPasswordBtnText}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white text-xs font-medium placeholder-slate-600 focus:outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                >
                  {loading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{signInBtnText}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Google Sign In Option */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
                </svg>
                <span>{googleBtnText}</span>
              </button>

              {/* Golden Flash Try Demo Mode Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    enterDemoMode();
                    navigate('/');
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.55)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] border border-amber-300/40 uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                  <span>⚡ TRY DEMO MODE</span>
                </button>
              </div>

              {/* Footer Create Account Link */}
              <div className="pt-2 text-center border-t border-slate-800/80 flex flex-col gap-2">
                <p className="text-xs text-slate-400">
                  {noAccountText}{' '}
                  <Link to="/register" className="text-sky-400 font-bold hover:underline">
                    {registerLinkText}
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* STEP 2: LOGIN OTP VERIFICATION */}
          {loginStep === 2 && (
            <div className="flex flex-col gap-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">2. Verify Your Login</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enter the 6-digit security code sent to your email</p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  MFA
                </div>
              </div>

              {/* Sent Banner */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-slate-300 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">Login Verification Code Sent!</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires in {formatTime(expirySeconds)}</span>
                  </div>
                </div>
                <p>Sent to <strong>{email}</strong>. Enter the 6-digit security code below to confirm login.</p>
              </div>

              {/* 6-Digit Code Input Form (6 Small Boxes) */}
              <form onSubmit={handleVerifyLoginOtp} className="w-full flex flex-col gap-4 items-center">
                <label className="text-xs font-bold text-slate-300 text-left w-full">Enter 6-Digit Verification Code</label>
                
                {/* 6 Small Digit Boxes */}
                <div className="flex gap-1.5 sm:gap-2.5 justify-center w-full my-1">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onPaste={handleDigitPaste}
                      className={`w-9 sm:w-11 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-950 border text-center text-lg sm:text-xl font-bold font-mono outline-none transition-all ${
                        digit
                          ? 'border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                          : 'border-slate-800 text-white focus:border-sky-500 focus:shadow-lg focus:shadow-sky-500/20'
                      }`}
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 6 || expirySeconds <= 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginStep(1);
                    setEmail('');
                    setOtpDigits(['', '', '', '', '', '']);
                    logout();
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendLoginOtp}
                  disabled={loading || cooldownSeconds > 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{cooldownSeconds > 0 ? `Resend OTP (${cooldownSeconds}s)` : 'Resend OTP'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-sky-400" />
                <span>Reset Password</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div className="flex flex-col gap-4 text-center py-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <p className="font-bold text-sm">Password Reset Email Sent!</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We sent a secure password reset link to <strong>{resetEmail}</strong>. Check your inbox and follow the instructions to set a new password.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetPassword} className="flex flex-col gap-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered email address and we will send you a secure link to reset your password.
                </p>

                {resetError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="patient@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Unregistered Google Account Alert Modal */}
      {unregisteredEmail && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 text-center items-center">
            
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Account Not Registered!</h3>
              <p className="text-xs text-rose-300 font-mono mt-1.5 bg-rose-500/10 py-1.5 px-3 rounded-xl border border-rose-500/20 inline-block">
                {unregisteredEmail}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left">
              This Google account has <strong>not been registered</strong> in the DermaVision AI patient database. You cannot sign in directly until you register your account first on the <strong>Create Account page</strong>.
            </p>

            <div className="flex flex-col gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => {
                  const targetEmail = unregisteredEmail;
                  setUnregisteredEmail(null);
                  navigate('/register', { state: { googleEmail: targetEmail } });
                }}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Go to Create Account Page</span>
              </button>

              <button
                type="button"
                onClick={() => setUnregisteredEmail(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close & Stay on Sign In
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
