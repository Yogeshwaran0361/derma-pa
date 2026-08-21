import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

interface HealthySkinReportProps {
  scannedImageUrl: string;
}

export const HealthySkinReport: React.FC<HealthySkinReportProps> = ({ scannedImageUrl }) => {
  const { currentLang } = useLanguage();

  const isTa = currentLang === 'ta';
  const isHi = currentLang === 'hi';

  const title = isTa ? 'இயல்பான / ஆரோக்கியமான தோல்கள்' : isHi ? 'सामान्य / स्वस्थ त्वचा' : 'NORMAL / HEALTHY SKIN';
  const subtitle = isTa ? 'உள் AI வகுப்பு: class_101' : isHi ? 'आंतरिक एआई वर्ग: class_101' : 'Internal AI Class: class_101';
  const summaryMsg = isTa
    ? '"பதிவேற்றப்பட்ட புகைப்படம் பரிசோதனை மாதிரியால் இயல்பான / ஆரோக்கியமான தோலாக வகைப்படுத்தப்பட்டுள்ளது. இந்த மாதிரி மூலம் எந்த தோல் அசாதாரணமும் கண்டறியப்படவில்லை."'
    : isHi
    ? '"आपकी अपलोड की गई छवि को स्क्रीनिंग मॉडल द्वारा सामान्य / स्वस्थ त्वचा के रूप में वर्गीकृत किया गया था। कोई समर्थित त्वचा असामान्यता नहीं पाई गई।"'
    : '"Your uploaded image was classified as Normal / Healthy Skin by the AI screening model. No supported skin abnormality was identified by the AI screening model."';

  const scannedImgTitle = isTa ? 'ஸ்கேன் செய்யப்பட்ட படம்' : isHi ? 'स्कैन की गई छवि' : 'SCANNED IMAGE';
  const assessmentTitle = isTa ? 'ஆரோக்கியமான தோல் மதிப்பீடு' : isHi ? 'स्वस्थ त्वचा मूल्यांकन' : 'Healthy Skin Evaluation';
  const assess1 = isTa ? 'இந்த மாதிரி மூலம் எந்த தோல் அசாதாரணமும் கண்டறியப்படவில்லை.' : isHi ? 'इस स्क्रीनिंग मॉडल द्वारा कोई समर्थित त्वचा असामान्यता नहीं पाई गई।' : 'No supported skin abnormality identified by the AI screening model.';
  const assess2 = isTa ? 'வழக்கமான தோல் பராமரிப்பு மற்றும் கண்காணிப்பைத் தொடரவும்.' : isHi ? 'नियमित त्वचा की देखभाल और निगरानी जारी रखें।' : 'Continue routine preventive skin care and regular monitoring.';

  const prevTitle = isTa ? 'தடுப்பு தோல் பராமரிப்பு' : isHi ? 'निवारक त्वचा देखभाल' : 'Preventive Skin Care Guidance';
  const prev1 = isTa ? 'வழக்கமான தோல் சுகாதாரத்தைப் பராமரிக்கவும்.' : isHi ? 'नियमित त्वचा स्वच्छता बनाए रखें।' : 'Maintain regular skin hygiene';
  const prev2 = isTa ? 'தோலை எப்போதும் ஈரப்பதத்துடனும் வைத்திருக்கவும்.' : isHi ? 'त्वचा को नमीयुक्त रखें।' : 'Keep skin moisturized';
  const prev3 = isTa ? 'அதிகப்படியான சூரிய ஒளி (UV) கதிர்வீச்சிலிருந்து தோலைப் பாதுகாக்கவும்.' : isHi ? 'अत्यधिक यूवी एक्सपोजर से त्वचा की रक्षा करें।' : 'Protect skin from excessive UV exposure';
  const prev4 = isTa ? 'தேவையற்ற தோலைச் சொறிதல் அல்லது எரிச்சலைத் தவிர்க்கவும்.' : isHi ? 'अनावश्यक त्वचा खुजलाने या खरोंचने से बचें।' : 'Avoid unnecessary scratching or irritation';
  const prev5 = isTa ? 'வழக்கமான சுய தோல் பரிசோதனைகளை மேற்கொள்ளவும்.' : isHi ? 'नियमित त्वचा स्व-जांच करें।' : 'Perform regular skin self-checks';
  const prev6 = isTa ? 'புதிய அல்லது மாறும் தோல் புண் தோன்றினால் மருத்துவ மதிப்பீட்டைப் பெறவும்.' : isHi ? 'यदि नया या बदलता हुआ घाव दिखाई दे तो चिकित्सीय मूल्यांकन लें।' : 'Seek professional evaluation if a new or changing lesion appears';

  const consultTitle = isTa ? 'எப்போது தர்மட்டாலஜிஸ்ட் ஆலோசிக்க வேண்டும்' : isHi ? 'त्वचा विशेषज्ञ से कब परामर्श लें' : 'When to Seek Clinical Evaluation';
  const consult1 = isTa ? 'வேகமாக வளரும் அல்லது நிறம் மாறும் தோல் புள்ளிகள்.' : isHi ? 'नया तेजी से बढ़ता या बदलता त्वचा का घाव।' : 'New rapidly growing or evolving skin lesion.';
  const consult2 = isTa ? 'தொடர்ந்து அரிக்கும், இரத்தப்போக்கு அல்லது வலி உண்டாக்கும் பகுதிகள்.' : isHi ? 'लगातार खुजली, खून बहना या दर्दनाक त्वचा का धब्बा।' : 'Persistent itching, bleeding, or painful skin spot.';

  return (
    <div className="space-y-6">
      {/* Normal Skin Primary Result Card */}
      <div className="bg-emerald-50/80 border-2 border-emerald-500/30 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              {title}
            </h2>
            <p className="text-xs font-semibold text-emerald-700">{subtitle}</p>
          </div>
        </div>

        <div className="mt-3 bg-white/90 border border-emerald-200 rounded-xl p-4 text-emerald-900 font-medium text-sm">
          {summaryMsg}
        </div>
      </div>

      {/* Scanned Image Display */}
      {scannedImageUrl && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{scannedImgTitle}</h3>
          <div className="flex justify-center bg-slate-900/5 rounded-lg overflow-hidden max-h-80 p-2">
            <img
              src={scannedImageUrl}
              alt="Scanned Healthy Skin"
              className="max-h-76 object-contain rounded-md shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Healthy Skin Assessment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3>{assessmentTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>{assess1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>{assess2}</span>
          </li>
        </ul>
      </div>

      {/* Preventive Skin Care */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-slate-800 font-bold text-base">
          <HeartHandshake className="w-5 h-5 text-blue-600" />
          <h3>{prevTitle}</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev1}</span>
          </li>
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev2}</span>
          </li>
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev3}</span>
          </li>
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev4}</span>
          </li>
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev5}</span>
          </li>
          <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span>{prev6}</span>
          </li>
        </ul>
      </div>

      {/* When to Seek Clinical Evaluation */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3 text-amber-900 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3>{consultTitle}</h3>
        </div>
        <ul className="space-y-2 text-sm text-amber-900">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>{consult1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>{consult2}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
