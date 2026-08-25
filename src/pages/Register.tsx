import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  reloadUserAuth,
  createUserProfile,
  registerWithEmail,
  db
} from '../services/firebase';
import { sendOtpEmail, verifyOtpCode } from '../services/otpService';
import { sendRegistrationWelcomeEmail } from '../services/emailService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  User, Mail, Phone, Lock, CheckCircle2, Shield, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, KeyRound, Check, X, MailCheck, Eye, EyeOff, Clock
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userMode, setUserMode, setLoginOtpVerified, refreshProfile, signUpGoogle } = useAuth();
  const { currentLang } = useLanguage();

  useEffect(() => {
    if (user && userMode === 'AUTHENTICATED') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userMode, navigate]);

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  // Wizard Step: 1 = Personal Info, 2 = Email Verification, 3 = Password Creation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailVerifiedForRegistration, setEmailVerifiedForRegistration] = useState(false);

  useEffect(() => {
    console.log('[REGISTRATION WIZARD STEP CHANGE] Current Step is now:', step);
  }, [step]);

  // Protect Step 3 (Create Password Page): Block direct access unless OTP is verified
  useEffect(() => {
    if (step === 3 && !emailVerifiedForRegistration) {
      console.log('[REGISTRATION] Blocked direct access to Create Password page. Redirecting to OTP Verification...');
      setStep(2);
    }
  }, [step, emailVerifiedForRegistration]);

  // Step 1 Form Data
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Google Sign Up Integration State
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [googleUserObj, setGoogleUserObj] = useState<any>(null);

  // Step 2 Verification & OTP Timers State
  const [verificationSent, setVerificationSent] = useState(false);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes

  // Sync 6 digit boxes with inputOtp
  useEffect(() => {
    setInputOtp(otpDigits.join(''));
  }, [otpDigits]);

  const handleDigitChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigit;
    setOtpDigits(newDigits);

    // Auto-focus next box if digit entered
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

  // Step 3 Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if redirected from Sign In with pre-filled Google account details
  useEffect(() => {
    if (location.state && (location.state as any).googleEmail) {
      const gEmail = (location.state as any).googleEmail;
      const gName = (location.state as any).googleName || '';
      setEmail(gEmail);
      if (gName) setFullName(gName);
      setIsGoogleAccount(true);
      setSuccessMessage(`Google email (${gEmail}) loaded. Complete your profile below.`);
    }
  }, [location.state]);

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
    if (step === 2 && verificationSent && expirySeconds > 0 && !otpVerified) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, verificationSent, expirySeconds, otpVerified]);

  // Strong Password Validation Rules & Visual Strength Calculation
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

  // Handle Google Sign-Up Connection
  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const res = await signUpGoogle();
      if (res.user) {
        setFullName(res.user.displayName || '');
        setEmail(res.user.email || '');
        setIsGoogleAccount(true);
        setGoogleUserObj(res.user);
        setSuccessMessage(`✓ Google Account connected (${res.user.email})! Full Name and Email auto-filled below. Please fill in your Age, Gender, and Mobile Number, then click "CONTINUE TO OTP VERIFICATION".`);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err?.message || 'Failed to connect Google Account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Validation & Proceed to Dedicated OTP Verification Route
  const handleStep1Continue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setErrorMessage('Please enter a valid age between 1 and 120.');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 1. Log Debug Requirements
    console.log('[REGISTRATION] Patient details validated');
    console.log('[REGISTRATION] Pending registration saved');
    console.log('[REGISTRATION] Sending OTP to:', cleanEmail);

    // 2. Save Pending Registration Data
    const pendingInfo = {
      fullName: fullName.trim(),
      age: age.trim(),
      gender,
      mobile: cleanMobile,
      email: cleanEmail,
      isGoogleAccount
    };
    sessionStorage.setItem('pending_registration_data', JSON.stringify(pendingInfo));
    sessionStorage.removeItem('email_verified_for_registration');

    // 3. Dispatch 6-Digit OTP Code & Navigate to Dedicated OTP Verification Route
    setLoading(true);
    try {
      await sendOtpEmail(cleanEmail, fullName.trim());
    } catch (err) {
      console.warn('[OTP DISPATCH NOTICE]', err);
    } finally {
      setLoading(false);
      console.log('[REGISTRATION] OTP page opened');
      navigate('/otp-verification', { replace: true });
    }
  };

  // Step 2: Send Secure 6-Digit Email OTP (Resend Handler)
  const handleSendEmailOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    console.log('[REGISTRATION] Sending OTP to:', cleanEmail);

    const result = await sendOtpEmail(cleanEmail, fullName.trim());
    setLoading(false);

    if (result.success) {
      setVerificationSent(true);
      setExpirySeconds(300);
      if (result.cooldownSeconds) setCooldownSeconds(result.cooldownSeconds);
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message || 'Failed to send OTP code. Please try again.');
    }
  };

  // Verify entered 6-digit OTP code -> PROCEED TO STEP 3 (PASSWORD CREATION) ONLY AFTER SUCCESS
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    console.log('[REGISTRATION] OTP verification started');

    if (expirySeconds <= 0) {
      setErrorMessage('OTP expired. Please request a new OTP.');
      return;
    }

    const codeStr = inputOtp.trim();
    if (codeStr.length !== 6) {
      setErrorMessage('Invalid OTP. Please check the code and try again.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const result = await verifyOtpCode(cleanEmail, codeStr);
    setLoading(false);

    if (result.success) {
      console.log('[REGISTRATION] OTP verified successfully');
      console.log('[REGISTRATION] Create Password page unlocked');
      setEmailVerifiedForRegistration(true);
      setOtpVerified(true);
      setSuccessMessage('✓ OTP verified successfully');
      setTimeout(() => {
        setStep(3);
      }, 600);
    } else {
      setErrorMessage(result.message || 'Invalid OTP. Please check the code and try again.');
    }
  };

  // Format seconds into MM:SS format
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 3: Password Creation & Final Account Activation
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isPasswordStrong) {
      setErrorMessage('Please make sure your password meets all strong security requirements and confirmation matches.');
      return;
    }

    setLoading(true);
    try {
      let finalUser = googleUserObj || auth.currentUser;

      if (!finalUser) {
        finalUser = await registerWithEmail(email.trim(), password, fullName.trim(), parseInt(age, 10), gender);
      } else {
        try {
          await finalUser.updatePassword(password);
        } catch (passErr: any) {
          console.warn('[PASSWORD UPDATE NOTICE]', passErr);
        }
      }

      // Create/Update Firestore Profile users/{FirebaseAuthUID}
      // Note: Plaintext password is NEVER saved to Firestore or local storage!
      await createUserProfile(finalUser.uid, {
        uid: finalUser.uid,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        age: parseInt(age, 10),
        gender,
        mobile: `+91 ${mobile.replace(/\D/g, '')}`,
        emailVerified: true,
        authProvider: isGoogleAccount ? 'google' : 'email',
        role: 'patient',
        accountStatus: 'ACTIVE',
        profileCompleted: true,
        preferredLanguage: 'en'
      });

      // Send Welcome Thank You Email to Patient via EmailJS
      try {
        sendRegistrationWelcomeEmail(email.trim().toLowerCase(), fullName.trim());
      } catch (welcomeErr) {
        console.warn('[WELCOME EMAIL NOTICE]', welcomeErr);
      }

      await refreshProfile();
      setLoginOtpVerified(false);
      setUserMode('UNAUTHENTICATED');
      navigate('/signin', {
        replace: true,
        state: {
          registeredEmail: email.trim().toLowerCase(),
          message: '🎉 Account registration completed successfully! Please click "Sign in with Google" or enter your credentials to complete Sign In.'
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
      
      {/* Top Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-xl shadow-sky-500/20 mb-3 hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-sky-400" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isTa ? 'நோயாளி கணக்கை உருவாக்கவும்' : isHi ? 'रोगी खाता बनाएं' : 'Create your patient account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isTa ? `படி ${step} / 3 — பாதுகாப்பான நோயாளி பதிவு` : isHi ? `चरण ${step} का 3 — सुरक्षित रोगी ऑनबोर्डिंग` : `Step ${step} of 3 — Secure Patient Onboarding`}
          </p>
        </div>

        {/* Multi-Step Indicator Bar */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-sky-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>1</span>
            <span>Personal Info</span>
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-sky-500' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-sky-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>2</span>
            <span>OTP Verification</span>
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-sky-500' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-sky-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>3</span>
            <span>Password</span>
          </div>
        </div>

        {/* Main Card */}
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

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">1. Patient Personal Information</h3>
                  <p className="text-xs text-slate-400">Provide details to register your clinical patient profile</p>
                </div>
              </div>

              {/* Fast-Track Google Onboarding */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Option A: Fast-Track Google Onboarding</span>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>

              <div className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest my-1">
                ────────── OR MANUAL ENTRY ──────────
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Age & Gender Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-300">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Mobile Number with Fixed +91 Prefix */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Mobile Number</label>
                <div className="flex rounded-xl bg-slate-950 border border-slate-800 focus-within:border-sky-500 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-slate-900 border-r border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full px-3 py-2.5 bg-transparent text-white text-xs font-mono font-semibold outline-none placeholder:text-slate-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 text-right">Enter 10-digit mobile number</span>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    readOnly={isGoogleAccount}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-white text-xs outline-none focus:border-sky-500 ${
                      isGoogleAccount ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800'
                    }`}
                  />
                </div>
                {isGoogleAccount && (
                  <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    Google Account connected. Next step sends a 6-digit OTP code to this email for verification.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleStep1Continue}
                disabled={loading}
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
              >
                <span>CONTINUE TO OTP VERIFICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {step === 2 && (
            <div className="flex flex-col gap-4 text-center">
              <div className="border-b border-slate-800 pb-3 text-left">
                <h3 className="text-sm font-bold text-white">2. Email Ownership Verification</h3>
                <p className="text-xs text-slate-400">Verify your email address before setting up your account password</p>
              </div>

              <div className="flex flex-col items-center gap-4 py-2">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <MailCheck className="w-7 h-7" />
                </div>
                
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed text-left w-full flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">Verification Code Sent!</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Expires in {formatTime(expirySeconds)}</span>
                    </div>
                  </div>
                  <p>A 6-digit security verification code has been dispatched to <strong>{email}</strong>. Enter the code below to confirm email ownership.</p>
                </div>

                {/* 6-Digit Code Input Form (6 Small Boxes) */}
                <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4 items-center">
                  <label className="text-xs font-bold text-slate-300 text-left w-full">Enter 6-Digit Verification Code</label>
                  
                  {/* 6 Small Digit Boxes */}
                  <div className="flex gap-2.5 justify-center w-full my-1">
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
                        className={`w-11 h-14 rounded-2xl bg-slate-950 border text-center text-xl font-bold font-mono outline-none transition-all ${
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
                    {loading ? 'Verifying...' : 'VERIFY CODE & PROCEED TO PASSWORD'}
                  </button>
                </form>

                  {/* Resend Cooldown Button */}
                  <div className="flex items-center justify-between w-full pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={loading || cooldownSeconds > 0}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>{cooldownSeconds > 0 ? `Resend Code (${cooldownSeconds}s)` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>
            </div>
          )}

          {/* STEP 3: STRONG PASSWORD CREATION */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">3. Create Strong Account Password</h3>
                <p className="text-xs text-slate-400">Set a high-security password for your patient portal</p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500 font-mono"
                    required
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-sky-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Visual Password Strength Indicator Bar */}
              {password && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Password Strength:</span>
                    <span className="font-bold text-white">{strengthInfo.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${strengthInfo.color} transition-all duration-300`}
                      style={{ width: `${strengthInfo.pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Strong Password Requirements Checklist */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Password Requirements:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {hasMinLen ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {hasUpper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {hasLower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>At least 1 number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Special character (!@#$)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordStrong}
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Activating Patient Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CREATE & ACTIVATE ACCOUNT</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              {isTa ? 'ஏற்கனவே கணக்கு உள்ளதா?' : isHi ? 'क्या आपके पास पहले से एक खाता है?' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-sky-400 font-bold hover:underline">
                {isTa ? 'உள்நுழைக' : isHi ? 'साइन इन करें' : 'Sign In'}
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
