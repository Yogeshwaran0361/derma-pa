import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtpEmail, verifyOtpCode } from '../services/otpService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { Shield, MailCheck, AlertCircle, CheckCircle2, Clock, RefreshCw, ArrowLeft } from 'lucide-react';

export const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const [pendingData, setPendingData] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes

  useEffect(() => {
    try {
      const storedDataStr = sessionStorage.getItem('pending_registration_data');
      if (!storedDataStr) {
        console.warn('[REGISTRATION] No pending registration data found. Redirecting to /signup');
        navigate('/signup', { replace: true });
        return;
      }
      const parsed = JSON.parse(storedDataStr);
      setPendingData(parsed);
      setEmail(parsed.email || '');
      setFullName(parsed.fullName || '');

      console.log('[REGISTRATION] OTP page opened');
      console.log('[REGISTRATION] Sending OTP to:', parsed.email);
    } catch (e) {
      navigate('/signup', { replace: true });
    }
  }, [navigate]);

  // Resend Cooldown Countdown Timer
  useEffect(() => {
    let timer: any;
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownSeconds]);

  // 5-Minute OTP Expiry Countdown Timer
  useEffect(() => {
    let timer: any;
    if (expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [expirySeconds]);

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

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || loading) return;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    console.log('[REGISTRATION] Sending OTP to:', cleanEmail);

    try {
      const res = await sendOtpEmail(cleanEmail, fullName.trim());
      if (res.success) {
        setExpirySeconds(300);
        if (res.cooldownSeconds) setCooldownSeconds(res.cooldownSeconds);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessMessage(`✓ New verification code sent to ${cleanEmail}`);
      } else {
        setErrorMessage(res.message || 'Failed to send OTP code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    console.log('[REGISTRATION] OTP verification started');

    if (expirySeconds <= 0) {
      setErrorMessage('OTP expired. Please request a new OTP.');
      return;
    }

    const codeStr = otpDigits.join('');
    if (codeStr.length !== 6) {
      setErrorMessage('Invalid OTP. Please check the code and try again.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await verifyOtpCode(cleanEmail, codeStr);
      if (res.success) {
        console.log('[REGISTRATION] OTP verified successfully');
        console.log('[REGISTRATION] Create Password page unlocked');
        sessionStorage.setItem('email_verified_for_registration', 'true');
        setSuccessMessage('✓ OTP verified successfully');
        setTimeout(() => {
          navigate('/create-password', { replace: true });
        }, 600);
      } else {
        setErrorMessage(res.message || 'Invalid OTP. Please check the code and try again.');
      }
    } catch (err: any) {
      setErrorMessage('Failed to verify OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <p className="text-xs text-slate-400 mt-1">Step 2 of 3 — Secure Patient Onboarding</p>
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
          <div className="h-0.5 flex-1 mx-3 bg-slate-800" />
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-800 text-slate-500">3</span>
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

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          <div className="flex flex-col gap-4 text-center">
            <div className="border-b border-slate-800 pb-3 text-left">
              <h3 className="text-sm font-bold text-white">Verify Your Email</h3>
              <p className="text-xs text-slate-400">Verify your email address before setting up your account password</p>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <MailCheck className="w-7 h-7" />
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed text-left w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">We sent a verification code to:</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires in {formatTime(expirySeconds)}</span>
                  </div>
                </div>
                <p className="font-mono font-bold text-sky-300 text-sm">{email}</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4 items-center">
                <label className="text-xs font-bold text-slate-300 text-left w-full">Enter 6-Digit Verification Code</label>

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
                  {loading ? 'Verifying...' : 'VERIFY OTP & PROCEED TO PASSWORD'}
                </button>
              </form>

              <div className="flex items-center justify-between w-full pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Patient Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || cooldownSeconds > 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{cooldownSeconds > 0 ? `Resend OTP (${cooldownSeconds}s)` : 'Resend OTP'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
