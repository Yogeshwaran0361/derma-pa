import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFriendlyAuthErrorMessage, resetPassword } from '../services/firebase';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  UserPlus,
  ShieldCheck,
  Activity,
  KeyRound,
  CheckCircle2,
  X,
  Stethoscope,
  BookOpen,
  Check,
  Zap,
  HeartPulse,
  UserCheck
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, userMode, register, login, signUpGoogle, signInGoogle, enterDemoMode, updateProfile } = useAuth();
  const { currentLang, t } = useLanguage();

  const [tab, setTab] = useState<'register' | 'login'>('register');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'login') {
      setTab('login');
    } else if (tabParam === 'register') {
      setTab('register');
    }
  }, [location]);

  // Registration Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showModalNewPass, setShowModalNewPass] = useState(false);
  const [showModalConfirmPass, setShowModalConfirmPass] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Complete Profile Modal State for Google Sign-Up
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [googleAge, setGoogleAge] = useState('');
  const [googleGender, setGoogleGender] = useState('Female');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please enter a valid age between 1 and 120.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, name, ageNum, gender);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(getFriendlyAuthErrorMessage(err.code || '', err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(getFriendlyAuthErrorMessage(err.code || '', err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSent(false);

    const cleanResetEmail = resetEmail.trim().toLowerCase();
    if (!cleanResetEmail || !cleanResetEmail.includes('@')) {
      setResetError('Please enter a valid registered email address.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setResetError('New passwords do not match.');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(cleanResetEmail);
      setResetSent(true);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      setResetError(getFriendlyAuthErrorMessage(err.code || '', err.message));
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleClick = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (tab === 'register') {
        const res = await signUpGoogle();
        if (res.existingUser) {
          if (res.profileCompleted) {
            setError('This Google account is already registered! Redirecting to Patient Home...');
            setTimeout(() => navigate('/dashboard'), 1000);
          } else {
            setShowCompleteProfileModal(true);
          }
        } else if (res.isNewUser || !res.profileCompleted) {
          setShowCompleteProfileModal(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await signInGoogle();
        if (res.notRegistered) {
          setError('This Google account is not registered yet. Please click "Sign up with Google" on the Registration tab to create an account.');
        } else if (!res.profileCompleted) {
          setShowCompleteProfileModal(true);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyAuthErrorMessage(err.code || '', err.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAge || parseInt(googleAge, 10) <= 0) {
      setError('Please enter a valid age.');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        age: parseInt(googleAge, 10),
        gender: googleGender
      });
      setShowCompleteProfileModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDemoClick = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const heroTagText = isTa
    ? 'டெர்மாவிஷன் AI • மருத்துவ தோல் தொலைமருத்துவம்'
    : isHi
    ? 'डर्माविज़न एआई • क्लिनिकल त्वचा टेलीमेडिसिन'
    : 'DermaVision AI • Clinical Skin Telemedicine';

  const heroTitleText = isTa
    ? 'புத்திசாலி AI தோல் நோய் வகைப்படுத்தி & டெலி-டெர்மடாலஜி'
    : isHi
    ? 'बुद्धिमान एआई त्वचा रोग वर्गीकृत और टेली-डर्मेटोलॉजी'
    : 'Intelligent AI Skin Disease Classifier & Tele-Dermatology';

  const heroSubtitleText = isTa
    ? '153 தோல் நோய்கள் குறித்து ஆரம்பகால கண்டறிதல், ஆபத்து மதிப்பீடு மற்றும் மருத்துவ ஆலோசனைகளுக்கு உதவும் PyTorch ஆழமான கற்றல் மாதிரிகள்.'
    : isHi
    ? '153 त्वचा स्थितियों में प्रारंभिक पहचान, जोखिम मूल्यांकन और नैदानिक परामर्श में सहायता के लिए PyTorch दीप लर्निंग मॉडल द्वारा संचालित।'
    : 'Powered by PyTorch deep learning models to assist in early detection, risk assessment, and clinical tele-consultations across 153 dermatological conditions.';

  const welcomeUserText = isTa ? `மீண்டும் வருக, ${userName}!` : isHi ? `वापसी पर स्वागत है, ${userName}!` : `Welcome back, ${userName}!`;
  const workspaceActiveText = isTa ? 'உறுதிப்படுத்தப்பட்ட பணியிடம் செயலில் உள்ளது' : isHi ? 'प्रमाणित कार्यस्थान सक्रिय है' : 'Authenticated Workspace Active';
  const startScanBtnText = isTa ? 'புதிய தோல் ஸ்கேன் தொடங்குக' : isHi ? 'नया त्वचा स्कैन शुरू करें' : 'Start New Skin Scan';

  const overviewTitleText = isTa ? 'டெர்மாவிஷன் AI மருத்துவ முறைமை மேலோட்டம்' : isHi ? 'डर्माविज़न एआई क्लिनिकल सिस्टम अवलोकन' : 'DermaVision AI Clinical System Overview';
  const overviewSubText = isTa ? 'ஆழமான கற்றல் மாதிரி கட்டமைப்பு & டெலி-டெர்மடாலஜி வழிகாட்டுதல்கள்' : isHi ? 'दीप लर्निंग मॉडल आर्किटेक्चर और टेली-डर्मेटोलॉजी दिशानिर्देश' : 'Deep Learning Model Architecture & Tele-Dermatology Guidelines';

  const feat1TitleText = isTa ? '153 தோல் நோய்கள்' : isHi ? '153 त्वचा स्थितियां' : '153 Skin Conditions';
  const feat1DescText = isTa
    ? 'மெலனோமா, சொரியாசிஸ், அரிக்கும் தோலழற்சி, முகப்பரு, பிஸ்டுல், மற்றும் பூஞ்சை தொற்றுகள் உள்ளிட்ட 153 தோல் வகுப்புகளை பகுப்பாய்வு செய்கிறது.'
    : isHi
    ? 'मेलेनोमा, सोरायसिस, एक्जिमा, मुँहासे, फंगल संक्रमण और अन्य 153 त्वचा श्रेणियों का मूल्यांकन करता है।'
    : 'Evaluates Melanoma, Psoriasis, Eczema, Acne, Rosacea, Fungal Infections, and 153 cutaneous condition classes.';

  const feat2TitleText = isTa ? 'ஒன்றிய AI கணிப்பு' : isHi ? 'एन्सेम्बल एआई निष्कर्ष' : 'Ensemble AI Inference';
  const feat2DescText = isTa
    ? 'PyTorch நரம்பியல் நெட்வொர்க் எடைகளை இணைத்து துல்லியமான சாத்தியக்கூறுகள் மற்றும் ஆபத்து வரம்புகளை வழங்குகிறது.'
    : isHi
    ? 'संभाव्यता वितरण और जोखिम वर्गीकरण रैंकिंग प्राप्त करने के लिए कई PyTorch न्यूरल नेटवर्क भार जोड़ता है।'
    : 'Combines PyTorch neural network weights to yield probability distributions and risk stratification rankings.';

  const feat3TitleText = isTa ? 'டெலி-ஹெல்த் இணைப்பு' : isHi ? 'टेली-हेल्थ एकीकरण' : 'Tele-Health Integration';
  const feat3DescText = isTa
    ? 'உடனடி அறிக்கை பகிர்வு, வீடியோ ஆலோசனைகள் மற்றும் மருத்துவருடன் நிகழ்நேர முன்பதிவுகளை அனுமதிக்கிறது.'
    : isHi
    ? 'त्वचा विशेषज्ञों के साथ त्वरित रिपोर्ट साझा करने, 2-तरफा वीडियो परामर्श और वास्तविक समय में अपॉइंटमेंट बुकिंग की अनुमति देता है।'
    : 'Allows instant report sharing, 2-way video consultations, and real-time appointment bookings with attending dermatologists.';

  const abcdeTitleText = isTa ? 'தோல் சுயமாக கண்காணிக்கும் மருத்துவ வழிகாட்டுதல்கள் (ABCDE விதி)' : isHi ? 'त्वचा की स्व-निगरानी नैदानिक दिशानिर्देश (ABCDE मानदंड)' : 'Skin Self-Monitoring Clinical Guidelines (ABCDE Criteria)';
  const abcdeSubText = isTa ? 'தோல் மச்சங்கள் மற்றும் புள்ளிகளை பரிசோதிப்பதற்கான தரப்படுத்தப்பட்ட வழிகாட்டுதல்கள்' : isHi ? 'त्वचा के तिलों और घावों के निरीक्षण के लिए मानक मानदंड' : 'Standard dermatological criteria for inspecting skin moles and cutaneous lesions';

  const readyTitleText = isTa ? 'தோல் புகைப்படத்தை பகுப்பாய்வு செய்ய தயாரா?' : isHi ? 'त्वचा घाव फोटो का विश्लेषण करने के लिए तैयार हैं?' : 'Ready to Analyze a Skin Lesion Photo?';
  const readySubText = isTa ? 'உடனடி AI மாதிரி வகைப்பாட்டிற்கு தெளிவான புகைப்படத்தை எடுக்கவும் அல்லது பதிவேற்றவும்.' : isHi ? 'त्वरित एआई मॉडल वर्गीकरण चलाने के लिए एक स्पष्ट त्वचा फोटो कैप्चर करें या अपलोड करें।' : 'Capture or upload a clear skin photo to run instant PyTorch AI model classification.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-28 md:pb-12 max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
      
      {/* Hero Brand Title */}
      <div className="text-center flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{heroTagText}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight">
          {heroTitleText}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
          {heroSubtitleText}
        </p>
      </div>

      {userMode === 'AUTHENTICATED' || user ? (
        /* SIGNED IN USER HOME VIEW: CLINICAL OVERVIEW & GUIDELINES ONLY */
        <div className="w-full flex flex-col gap-6">
          
          {/* Welcome User Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{welcomeUserText}</h2>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{workspaceActiveText}</span>
                </p>
              </div>
            </div>

            <Link
              to="/scanner"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4" />
              <span>{startScanBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Clinical Project Overview Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{overviewTitleText}</h3>
                <p className="text-xs text-slate-400">{overviewSubText}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>{feat1TitleText}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {feat1DescText}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <HeartPulse className="w-4 h-4" />
                  <span>{feat2TitleText}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {feat2DescText}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{feat3TitleText}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {feat3DescText}
                </p>
              </div>
            </div>
          </div>

          {/* Skin Self-Monitoring Guidelines */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{abcdeTitleText}</h3>
                <p className="text-xs text-slate-400">{abcdeSubText}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-amber-400">{isTa ? 'A — சமச்சீரற்ற தன்மை' : isHi ? 'A — असममितता' : 'A — Asymmetry'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isTa ? 'மச்சத்தின் ஒரு பாதி மற்ற பாதியுடன் வடிவம் அல்லது அமைப்பில் பொருந்தவில்லை.' : isHi ? 'तिल या त्वचा के निशान का आधा हिस्सा दूसरे आधे हिस्से से आकार या समोच्च में मेल नहीं खाता है।' : 'One half of the mole or skin mark does not match the other half in shape or contour.'}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-amber-400">{isTa ? 'B — ஒழுங்கற்ற விளிம்பு' : isHi ? 'B — सीमा अनियमितता' : 'B — Border Irregularity'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isTa ? 'விளிம்புகள் சொரசொரப்பாக, தெளிவற்றதாக அல்லது ஒழுங்கற்ற நிறப் பரவலுடன் இருக்கும்.' : isHi ? 'किनारे दांतेदार, कटे हुए, धुंधले या खराब रूप से परिभाषित होते हैं।' : 'Edges are ragged, notched, blurred, or poorly defined with irregular pigment spreading.'}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-amber-400">{isTa ? 'C — நிற வேறுபாடு' : isHi ? 'C — रंग भिन्नता' : 'C — Color Variation'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isTa ? 'நிறம் ஒரே சீராக இல்லை; பழுப்பு, கருப்பு, சிவப்பு அல்லது நீல நிறங்களின் நிழல்கள் தோன்றும்.' : isHi ? 'पिग्मेंटेशन एकसमान नहीं है; भूरे, काले, लाल, सफेद या नीले रंग के शेड दिखाई देते हैं।' : 'Pigmentation is not uniform; shades of tan, brown, black, red, white, or blue appear.'}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <span className="font-bold text-amber-400">{isTa ? 'D — விட்டம் வளர்ச்சி' : isHi ? 'D — व्यास वृद्धि' : 'D — Diameter Growth'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isTa ? '6மிமீக்கும் அதிகமான புள்ளிகள் (பென்சில் ரப்பரின் அளவு) மருத்துவ பரிசோதனை தேவைப்படுகிறது.' : isHi ? '6 मिमी (पेंसिल इरेज़र का आकार) से अधिक घावों के लिए पेशेवर जांच की आवश्यकता होती है।' : 'Lesions greater than 6mm (size of a pencil eraser) require professional dermatological check.'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Start New Scan Banner CTA */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-6 text-center flex flex-col items-center gap-4 shadow-xl">
            <h3 className="text-xl font-black text-white">{readyTitleText}</h3>
            <p className="text-xs text-slate-300 max-w-md">{readySubText}</p>
            <Link
              to="/scanner"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-black text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4" />
              <span>{startScanBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      ) : (
        /* IF NOT LOGGED IN: SHOW MAIN COMBINED AUTHENTICATION CARD */
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.auth.createAccount}</span>
            </button>

            <button
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{t.auth.signInBtn}</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">{t.auth.fullName}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">{t.auth.age}</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="28"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">{t.auth.gender}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Female">{t.auth.genderFemale}</option>
                    <option value="Male">{t.auth.genderMale}</option>
                    <option value="Other">{t.auth.genderOther}</option>
                    <option value="Prefer not to say">{t.auth.genderPreferNot}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">{t.auth.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">{t.auth.confirmPassword}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t.common.loading}
                  </span>
                ) : (
                  t.auth.createAccount
                )}
              </button>
            </form>
          )}

          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold">{t.auth.password}</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(loginEmail);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                  >
                    {t.auth.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t.common.loading}
                  </span>
                ) : (
                  t.auth.signInBtn
                )}
              </button>
            </form>
          )}

          {/* Social Google Login / Sign Up Button */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800/80">
            <div className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest -mt-5 bg-slate-900 px-3 mx-auto w-fit">
              ────────── OR ──────────
            </div>
            <button
              onClick={handleGoogleClick}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
              </svg>
              <span>
                {isSubmitting
                  ? 'Connecting to Google...'
                  : tab === 'register'
                  ? 'Sign up with Google'
                  : 'Sign in with Google'}
              </span>
            </button>

            {/* Quick Guest Demo Button */}
            <button
              onClick={handleDemoClick}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Enter Guest Mode (Quick Explore)</span>
            </button>
          </div>

        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl flex flex-col gap-5">
            
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">Enter your email and new password to trigger an official Firebase password reset & update.</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Password Reset Request Initiated!</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  A secure password reset email has been sent to <strong className="text-white">{resetEmail}</strong>. Check your inbox to complete the password update in Firebase Authentication.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close & Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="flex flex-col gap-4 text-xs">
                {resetError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">New Password (Min 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showModalNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalNewPass(!showModalNewPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showModalNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showModalConfirmPass ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalConfirmPass(!showModalConfirmPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showModalConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </span>
                    ) : (
                      'Save & Reset Password'
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* COMPLETE PROFILE MODAL FOR GOOGLE SIGN-UP */}
      {showCompleteProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Complete Your Profile</h3>
                <p className="text-xs text-slate-400">Google account authenticated! Please enter your age and gender to finalize your patient record.</p>
              </div>
            </div>

            <form onSubmit={handleCompleteProfileSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={userProfile?.name || user?.displayName || 'Google User'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={userProfile?.email || user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Age <span className="text-rose-400">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={googleAge}
                  onChange={(e) => setGoogleAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold">Gender <span className="text-rose-400">*</span></label>
                <select
                  value={googleGender}
                  onChange={(e) => setGoogleGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? 'Saving Profile...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
