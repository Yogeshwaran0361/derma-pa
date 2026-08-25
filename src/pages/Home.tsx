import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Stethoscope,
  BookOpen,
  Zap,
  HeartPulse,
  LogIn,
  UserPlus,
  Eye
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, userMode, enterDemoMode } = useAuth();
  const { currentLang } = useLanguage();

  const userName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  const handleDemoClick = () => {
    enterDemoMode();
    navigate('/scanner');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-28 md:pb-12 max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 font-sans">
      
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

        {/* Action Buttons for Unauthenticated Visitors / Demo Users */}
        {userMode !== 'AUTHENTICATED' && !user && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link
              to="/signin"
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN TO PATIENT PORTAL</span>
            </Link>

            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4 text-teal-400" />
              <span>CREATE ACCOUNT</span>
            </Link>
          </div>
        )}
      </div>

      {/* REAL HOMEPAGE SHOWCASE CONTENT & CLINICAL GUIDELINES */}
      <div className="w-full flex flex-col gap-6">
        
        {/* Welcome Banner for Authenticated or Demo User */}
        {userMode === 'AUTHENTICATED' && user ? (
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
        ) : null}

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
    </div>
  );
};
