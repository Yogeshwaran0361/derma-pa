import { Language } from '../i18n/translations';
import { diseaseKnowledgeBasePart1, DiseaseKnowledgeSchema } from '../data/diseaseKnowledgeBase.part1';
import { diseaseKnowledgeBasePart2 } from '../data/diseaseKnowledgeBase.part2';
import { diseaseKnowledgeBasePart3 } from '../data/diseaseKnowledgeBase.part3';
import { diseaseKnowledgeBase } from '../data/diseaseKnowledgeBase';

export interface LocalizedDiseaseDetail {
  name: string;
  subTitle: string;
  category: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskColor: string;
  description: string;
  symptoms: string[];
  causes: string[];
  precautions: string[];
  prevention?: string[];
  warningSigns: string[];
  medicalAttention: string;
  summary: string;
}

function translateTextToTa(text: string): string {
  if (!text) return '';
  let res = text;
  res = res.replace(/Skin reaction caused by an ingested, injected, or topically applied medication\. Eruptions vary from mild maculopapular rashes to severe cutaneous adverse reactions\./gi, 'மருந்து உட்கொள்ளல், ஊசி அல்லது கிரீம்கள் பயன்பாட்டினால் தோலில் ஏற்படும் அழற்சி எதிர்வினை. மிதமான தடிப்புகள் முதல் கடுமையான தோல் எதிர்வினைகள் வரை மாறுபடலாம்.');
  res = res.replace(/Common skin cancer usually related to cumulative UV exposure\. It arises from the basal cells of the epidermis and typically grows slowly, but requires definitive medical evaluation\./gi, 'அதிக சூரிய ஒளி மற்றும் UV கதிர்வீச்சால் ஏற்படும் பொதுவான தோல் புற்றுநோய் வகை. இது தோலின் வெளிப்புற அடுக்கில் மெதுவாக வளரும், ஆனால் முறையான மருத்துவ பரிசீலனை தேவைப்படுகிறது.');
  res = res.replace(/requires professional diagnosis/gi, 'தகுதியான மருத்துவ நோயறிதல் தேவைப்படுகிறது');
  res = res.replace(/dermatologist evaluation/gi, 'தோல் நிபுணர் மதிப்பீடு');
  res = res.replace(/lesion-directed treatment/gi, 'தோல் புள்ளி சார்ந்த சிகிச்சை');
  res = res.replace(/broad-spectrum sunscreen/gi, 'அகன்ற நிறமாலை சன்ஸ்கிரீன் (SPF 30+)');
  res = res.replace(/protective clothing/gi, 'பாதுகாப்பு ஆடைகள் அணிதல்');
  res = res.replace(/avoid peak UV hours/gi, 'நண்பகல் சூரிய ஒளியைத் தவிர்த்தல்');
  res = res.replace(/regular skin surveillance/gi, 'தவறாமல் தோலைக் கண்காணித்தல்');
  res = res.replace(/widespread rash/gi, 'உடல் முழுவதும் பரவலான தடிப்புகள்');
  res = res.replace(/redness/gi, 'தோலில் சிவத்தல்');
  res = res.replace(/itching/gi, 'தொடர் அரிப்பு மற்றும் எரிச்சல்');
  res = res.replace(/macules and papules/gi, 'சிறிய தடிப்புகள் மற்றும் கொப்புளங்கள்');
  res = res.replace(/new medication/gi, 'புதிதாகத் தொடங்கிய மருந்துகள்');
  res = res.replace(/recent drug dose changes/gi, 'மருந்து அளவுகளில் சமீபத்திய மாற்றங்கள்');
  res = res.replace(/previous drug hypersensitivity history/gi, 'முந்தைய மருந்து ஒவ்வாமை வரலாறு');
  res = res.replace(/medical assessment to identify responsible medication/gi, 'காரணமான மருந்தைக் கண்டறிய மருத்துவ மதிப்பீடு');
  res = res.replace(/discontinue suspected culprit under medical direction/gi, 'மருத்துவர் வழிகாட்டுதலுடன் சந்தேகிக்கப்படும் மருந்தை நிறுத்துதல்');
  res = res.replace(/supportive skin care/gi, 'ஆதரவு தோல் பராமரிப்பு மற்றும் ஈரப்பதம்');
  res = res.replace(/maintain an accurate personal medication\/allergy log/gi, 'தனிப்பட்ட மருந்து மற்றும் ஒவ்வாமைப் பதிவை முறையாகப் பராமரித்தல்');
  res = res.replace(/inform healthcare providers of past drug reactions/gi, 'முந்தைய மருந்து ஒவ்வாமை குறித்து மருத்துவரிடம் தெரிவித்தல்');
  res = res.replace(/facial swelling/gi, 'முகம் அல்லது உதடுகளில் வீக்கம்');
  res = res.replace(/breathing difficulty/gi, 'மூச்சுத் திணறல் அல்லது சுவாசக் கோளாறு');
  res = res.replace(/skin blistering/gi, 'தோல் உரிதல் அல்லது கொப்புளங்கள்');
  res = res.replace(/mucosal lesions/gi, 'வாய் அல்லது கண் சவ்வுகளில் புண்கள்');
  res = res.replace(/fever/gi, 'உயர் காய்ச்சல் அல்லது உடல் நடுக்கம்');
  res = res.replace(/Emergency medical evaluation is required if accompanied by facial swelling, mouth\/eye sores, skin peeling, or difficulty breathing\./gi, 'முகம் வீக்கம், வாய்/கண் புண்கள், தோல் உரிதல் அல்லது மூச்சுத் திணறல் இருந்தால் உடனடியாக அவசர மருத்துவ கவனிப்பைப் பெறவும்.');
  return res;
}

function translateTextToHi(text: string): string {
  if (!text) return '';
  let res = text;
  res = res.replace(/Skin reaction caused by an ingested, injected, or topically applied medication\. Eruptions vary from mild maculopapular rashes to severe cutaneous adverse reactions\./gi, 'दवा के सेवन, इंजेक्शन या टॉपिकल उपयोग से होने वाली त्वचा की सूजन संबंधी प्रतिक्रिया। हल्के चकत्ते से लेकर गंभीर त्वचा प्रतिक्रियाएं हो सकती हैं।');
  res = res.replace(/Common skin cancer usually related to cumulative UV exposure\. It arises from the basal cells of the epidermis and typically grows slowly, but requires definitive medical evaluation\./gi, 'सूर्य के प्रकाश से होने वाला आम त्वचा कैंसर। यह त्वचा की निचली परतों से विकसित होता है और त्वरित चिकित्सकीय मूल्यांकन की आवश्यकता होती है।');
  res = res.replace(/requires professional diagnosis/gi, 'पेशेवर निदान की आवश्यकता');
  res = res.replace(/dermatologist evaluation/gi, 'त्वचा विशेषज्ञ का मूल्यांकन');
  res = res.replace(/lesion-directed treatment/gi, 'घाव-विशिष्ट उपचार');
  res = res.replace(/broad-spectrum sunscreen/gi, 'ब्रॉड-स्पेक्ट्रम सनस्क्रीन (SPF 30+)');
  res = res.replace(/protective clothing/gi, 'सुरक्षात्मक कपड़े पहनना');
  res = res.replace(/avoid peak UV hours/gi, 'तेज धूप से बचना');
  res = res.replace(/regular skin surveillance/gi, 'त्वचा की नियमित निगरानी');
  res = res.replace(/widespread rash/gi, 'शरीर पर व्यापक चकत्ते');
  res = res.replace(/redness/gi, 'त्वचा में लालिमा');
  res = res.replace(/itching/gi, 'लगातार खुजली और जलन');
  res = res.replace(/macules and papules/gi, 'छोटे लाल दाने और चकत्ते');
  res = res.replace(/new medication/gi, 'हाल ही में शुरू की गई नई दवाएं');
  res = res.replace(/recent drug dose changes/gi, 'दवा की खुराक में हालिया बदलाव');
  res = res.replace(/previous drug hypersensitivity history/gi, 'पिछली दवा एलर्जी का इतिहास');
  res = res.replace(/medical assessment to identify responsible medication/gi, 'जिम्मेदार दवा की पहचान के लिए चिकित्सा मूल्यांकन');
  res = res.replace(/discontinue suspected culprit under medical direction/gi, 'चिकित्सकीय सलाह के तहत संदिग्ध दवा बंद करना');
  res = res.replace(/supportive skin care/gi, 'सहायक त्वचा देखभाल और नमी');
  res = res.replace(/maintain an accurate personal medication\/allergy log/gi, 'व्यक्तिगत दवा और एलर्जी का सही रिकॉर्ड रखें');
  res = res.replace(/inform healthcare providers of past drug reactions/gi, 'चिकित्सक को पिछली दवा प्रतिक्रियाओं की जानकारी दें');
  res = res.replace(/facial swelling/gi, 'चेहरे या होठों पर सूजन');
  res = res.replace(/breathing difficulty/gi, 'सांस लेने में तकलीफ या कठिनाई');
  res = res.replace(/skin blistering/gi, 'त्वचा पर छाले या छिलना');
  res = res.replace(/mucosal lesions/gi, 'मुंह या आंखों में घाव');
  res = res.replace(/fever/gi, 'तेज बुखार या ठंड लगना');
  res = res.replace(/Emergency medical evaluation is required if accompanied by facial swelling, mouth\/eye sores, skin peeling, or difficulty breathing\./gi, 'यदि चेहरे पर सूजन, मुंह/आंखों में घाव, त्वचा का छिलना या सांस लेने में तकलीफ हो तो तुरंत आपातकालीन सहायता लें।');
  return res;
}

function convertKnowledgeSchemaToDetail(schema: DiseaseKnowledgeSchema, lang: Language = 'en'): LocalizedDiseaseDetail {
  const riskColor = schema.severity === 'HIGH' ? 'rose' : schema.severity === 'MODERATE' ? 'amber' : 'emerald';
  const riskLevel: 'Low' | 'Moderate' | 'High' = schema.severity === 'HIGH' ? 'High' : schema.severity === 'MODERATE' ? 'Moderate' : 'Low';

  let name = schema.canonicalName;
  let description = schema.clinicalOverview;
  let symptoms = [...schema.commonSymptoms];
  let causes = [...schema.commonRiskFactors];
  let precautions = [...schema.generalManagement];
  let prevention = [...(schema.prevention || [])];
  let warningSigns = [...schema.warningSigns];
  let medicalAttention = schema.whenToSeekMedicalAttention;

  if (lang === 'ta') {
    description = translateTextToTa(description);
    symptoms = symptoms.map(s => translateTextToTa(s));
    causes = causes.map(c => translateTextToTa(c));
    precautions = precautions.map(p => translateTextToTa(p));
    prevention = prevention.map(p => translateTextToTa(p));
    warningSigns = warningSigns.map(w => translateTextToTa(w));
    medicalAttention = translateTextToTa(medicalAttention);
  } else if (lang === 'hi') {
    description = translateTextToHi(description);
    symptoms = symptoms.map(s => translateTextToHi(s));
    causes = causes.map(c => translateTextToHi(c));
    precautions = precautions.map(p => translateTextToHi(p));
    prevention = prevention.map(p => translateTextToHi(p));
    warningSigns = warningSigns.map(w => translateTextToHi(w));
    medicalAttention = translateTextToHi(medicalAttention);
  }

  return {
    name,
    subTitle: schema.category,
    category: schema.category,
    riskLevel,
    riskColor,
    description,
    symptoms,
    causes,
    precautions,
    prevention,
    warningSigns,
    medicalAttention,
    summary: `Clinical screening assessment for ${name}.`
  };
}

export type MultiLangDiseaseInfo = Record<Language, LocalizedDiseaseDetail>;

export const diseaseDatabase: Record<string, MultiLangDiseaseInfo> = {
  acne_rosacea: {
    en: {
      name: "Acne & Rosacea",
      subTitle: "Inflammatory Cutaneous Condition",
      category: "Inflammatory Dermatosis",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Acne Vulgaris and Rosacea are common chronic inflammatory skin disorders involving pilosebaceous units and facial vasculature, causing papules, pustules, and facial erythema.",
      symptoms: [
        "Facial redness and flushing across cheeks and nose",
        "Comedones (blackheads and whiteheads), papules, and pustules",
        "Visible telangiectasias (spider veins)",
        "Burning or stinging sensation on facial skin",
        "Occasional ocular irritation or dry eyes"
      ],
      causes: [
        "Excess sebum production and Cutibacterium acnes bacterial overgrowth",
        "Facial vascular hyperreactivity triggered by heat or spicy food",
        "Hormonal fluctuations and genetic predisposition",
        "Disrupted skin barrier and inappropriate skincare products"
      ],
      precautions: [
        "Wash face twice daily with a gentle, non-comedogenic cleanser",
        "Apply broad-spectrum SPF 30+ sunscreen daily",
        "Avoid known triggers such as extreme temperatures and alcohol",
        "Do not pick, squeeze, or scratch active papules"
      ],
      warningSigns: [
        "Severe cystic lesions with deep scarring risk",
        "Sudden worsening with ocular pain or vision changes",
        "Spreading facial swelling or systemic fever"
      ],
      medicalAttention: "Consult a dermatologist if over-the-counter cleansers fail to improve symptoms within 4-6 weeks or if deep cysts develop.",
      summary: "Acne & Rosacea are benign inflammatory conditions easily managed with topical retinoids, azelaic acid, or oral antibiotics."
    },
    ta: {
      name: "முகப்பரு & ரோசேஷியா (Acne & Rosacea)",
      subTitle: "அழற்சி தோல் நோய்",
      category: "அழற்சி தோல் நோய்",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "முகப்பரு மற்றும் ரோசேஷியா ஆகியவை முகத்தில் உள்ள எண்ணெய் சுரப்பிகள் மற்றும் ரத்த நாளங்களின் அழற்சியால் ஏற்படும் பொதுவான தோல் நோய்களாகும்.",
      symptoms: [
        "கன்னங்கள் மற்றும் மூக்கில் சிவப்பு நிறத் தடிப்புகள்",
        "கருப்பு மற்றும் வெள்ளை முகப்பருக்கள், கொப்புளங்கள்",
        "முகத்தில் மெல்லிய ரத்த நாளங்கள் வெளியே தெரிதல்",
        "தோலில் எரிச்சல் அல்லது குத்தல் உணர்வு",
        "கண்களில் வறட்சி அல்லது எரிச்சல்"
      ],
      causes: [
        "அதிகப்படியான எண்ணெய் சுரப்பு மற்றும் பாக்டீரியா வளர்ச்சி",
        "அதிக வெப்பம் அல்லது காரமான உணவுகளால் ஏற்படும் ரத்த நாள எதிர்வினை",
        "ஹார்மோன் மாற்றங்கள் மற்றும் மரபணு காரணங்கள்",
        "தோல் பாதுகாப்பு அடுக்கில் ஏற்படும் பாதிப்பு"
      ],
      precautions: [
        "மென்மையான க்ளென்சர் மூலம் தினமும் இருமுறை முகத்தைக் கழுவவும்",
        "தினமும் SPF 30+ சன்ஸ்கிரீன் பயன்படுத்தவும்",
        "அதிக வெப்பம் மற்றும் கார உணவுகளைத் தவிர்க்கவும்",
        "பருக்களைக் கிள்ளவோ அழுத்தவோ வேண்டாம்"
      ],
      warningSigns: [
        "ஆழமான தழும்புகளை உண்டாக்கும் கடுமையான பருக்கள்",
        "கண் வலி அல்லது பார்வை மாற்றங்கள் ஏற்படுதல்",
        "முகம் முழுவதும் வீக்கம் அல்லது காய்ச்சல் பரப்புதல்"
      ],
      medicalAttention: "4-6 வாரங்களுக்குள் பலன் தெரியவில்லை என்றாலோ அல்லது ஆழமான கட்டிகள் தோன்றினாலோ தோல் மருத்துவரை அணுகவும்.",
      summary: "முகப்பரு மற்றும் ரோசேஷியா ஆகியவை கிரீம்கள் மற்றும் மருத்துவரின் வழிகாட்டுதலுடன் எளிதில் குணப்படுத்தக்கூடியவை."
    },
    hi: {
      name: "मुँहासे और रोसासिया (Acne & Rosacea)",
      subTitle: "सूजन संबंधी त्वचा की स्थिति",
      category: "सूजन संबंधी त्वचा रोग",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "मुँहासे और रोसासिया चेहरे की तेल ग्रंथियों और रक्त वाहिकाओं की सूजन के कारण होने वाले आम त्वचा विकार हैं।",
      symptoms: [
        "गालों और नाक पर लालिमा और सूजन",
        "कील-मुँहासे और मवाद भरे दाने",
        "चेहरे पर छोटी रक्त वाहिकाओं का दिखना",
        "त्वचा में जलन या चुभन की अनुभूति",
        "आँखों में सूखापन या जलन"
      ],
      causes: [
        "अत्यधिक तेल उत्पादन और बैक्टीरिया की वृद्धि",
        "गर्मी या मसालेदार भोजन से होने वाली संवहनी प्रतिक्रिया",
        "हार्मोनों का असंतुलन और आनुवंशिक कारण",
        "त्वचा की सुरक्षात्मक परत को नुकसान"
      ],
      precautions: [
        "दिन में दो बार माइल्ड क्लींजर से चेहरा धोएं",
        "रोजाना SPF 30+ सनस्क्रीन का प्रयोग करें",
        "अधिक धूप और मसालेदार भोजन से बचें",
        "मुँहासों को फोड़ें या दबाएं नहीं"
      ],
      warningSigns: [
        "गहरे दाग बनाने वाले गंभीर सिस्ट या गांठें",
        "आँखों में दर्द या दृष्टि में बदलाव",
        "चेहरे पर अचानक सूजन या बुखार होना"
      ],
      medicalAttention: "यदि 4-6 सप्ताह में सुधार न हो या गहरे सिस्ट बनें, तो त्वचा विशेषज्ञ से सलाह लें।",
      summary: "मुँहासे और रोसासिया आसानी से इलाज योग्य त्वचा स्थितियां हैं।"
    }
  },

  actinic_keratosis: {
    en: {
      name: "Actinic Keratosis (Pre-Cancerous)",
      subTitle: "Premalignant Sun-Induced Keratinocytic Lesion",
      category: "Pre-Cancerous Epithelial Lesion",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Actinic Keratosis (AK) is a rough, scaly precancerous patch caused by long-term ultraviolet (UV) radiation exposure. If left untreated, AK can progress to Squamous Cell Carcinoma (SCC).",
      symptoms: [
        "Rough, dry, scaly or crusty patch of skin",
        "Flat to slightly raised bump on sun-exposed areas",
        "Color ranging from pink, red, tan to brown",
        "Pruritus, tenderness, or burning sensation upon touch"
      ],
      causes: [
        "Cumulative ultraviolet (UV) light exposure from sunlight or tanning beds",
        "Advanced age and fair skin phototypes (Fitzpatrick I-II)",
        "Immunosuppression and occupational outdoor exposure"
      ],
      precautions: [
        "Apply water-resistant broad-spectrum SPF 50+ sunscreen daily",
        "Wear sun-protective clothing and broad-brimmed hats",
        "Avoid mid-day sun exposure between 10:00 AM and 4:00 PM",
        "Perform monthly self-examinations of sun-exposed skin"
      ],
      warningSigns: [
        "Rapid growth, thickening, or cutaneous horn formation",
        "Spontaneous bleeding, ulceration, or severe tenderness",
        "Induration (firmness) at the base of the lesion"
      ],
      medicalAttention: "Prompt clinical evaluation by a dermatologist is recommended for cryotherapy, topical field therapy, or biopsy.",
      summary: "Actinic Keratosis requires proactive medical treatment to prevent transformation into invasive skin cancer."
    },
    ta: {
      name: "அக்டினிக் கெரடோசிஸ் (புற்றுநோய்க்கு முந்தைய நிலை)",
      subTitle: "சூரிய ஒளியால் ஏற்படும் முன்-புற்றுநோய் தடிப்பு",
      category: "புற்றுநோய்க்கு முந்தைய தோல் நோய்",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "அக்டினிக் கெரடோசிஸ் என்பது நீண்டகால சூரிய ஒளிக்கதிர்களால் தோலில் ஏற்படும் கரடுமுரடான தடிப்பாகும். சிகிச்சை பெறாவிட்டால் இது தோல் புற்றுநோயாக மாற வாய்ப்புள்ளது.",
      symptoms: [
        "கரடுமுரடான, உாய்ந்த, செதில் போன்ற தோல் தடிப்பு",
        "சூரிய ஒளி படும் இடங்களில் ஏற்படும் சிறிய தடிப்புகள்",
        "இளஞ்சிவப்பு, சிவப்பு அல்லது பழுப்பு நிறத் தடிப்புகள்",
        "தொடும்போது அரிப்பு, வலி அல்லது எரிச்சல்"
      ],
      causes: [
        "சூரிய ஒளியின் புறஊதாக் கதிர்களால் ஏற்படும் பாதிப்பு",
        "அதிக வயது மற்றும் வெளிறிய தோல் அமைப்பு",
        "நோயெதிர்ப்பு சக்தி குறைவு மற்றும் வெளிப்புற வேலைகள்"
      ],
      precautions: [
        "தினமும் SPF 50+ சன்ஸ்கிரீன் பயன்படுத்தவும்",
        "சூரிய ஒளியில் செல்லும்போது தொப்பி மற்றும் பாதுகாப்பு ஆடைகளை அணியவும்",
        "காலை 10 முதல் மாலை 4 மணி வரை கடுமையான வெயிலைத் தவிர்க்கவும்",
        "மாதம் ஒருமுறை தோலை சுயபரிசோதனை செய்யவும்"
      ],
      warningSigns: [
        "தடிப்பு வேகமாக தடிமனாவது அல்லது விரைவாக வளர்வது",
        "திடீர் ரத்தப்போக்கு, புண் அல்லது கடும் வலி",
        "தடிப்பின் அடியில் கடினத்தன்மை ஏற்படுதல்"
      ],
      medicalAttention: "இதனை ஆரம்பத்திலேயே கதிரியக்கச் சிகிச்சை அல்லது கிரீம்கள் மூலம் குணப்படுத்த தோல் மருத்துவரை அணுகவும்.",
      summary: "அக்டினிக் கெரடோசிஸ் என்பது புற்றுநோயாக மாறுவதைத் தடுக்க ஆரம்ப சிகிச்சை பெற வேண்டிய நிலையாகும்."
    },
    hi: {
      name: "एक्टिनिक केराटोसिस (कैंसर-पूर्व स्थिति)",
      subTitle: "सूर्य की किरणों से होने वाला त्वचा विकार",
      category: "कैंसर-पूर्व त्वचा विकार",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "एक्टिनिक केराटोसिस सूर्य की पराबैंगनी (UV) किरणों के लंबे समय तक संपर्क के कारण त्वचा पर होने वाला खुरदुरा, पपड़ीदार पैच है जो भविष्य में कैंसर बन सकता है।",
      symptoms: [
        "त्वचा पर खुरदुरा, सूखा और पपड़ीदार पैच",
        "धूप के संपर्क में आने वाले हिस्सों पर छोटे दाने",
        "गुलाबी, लाल या भूरे रंग के पैच",
        "छूने पर खुजली, दर्द या जलन"
      ],
      causes: [
        "सूर्य की हानिकारक UV किरणों का दीर्घकालिक प्रभाव",
        "अधिक उम्र और गोरी रंगत वाली त्वचा",
        "कमजोर प्रतिरक्षा प्रणाली"
      ],
      precautions: [
        "रोजाना SPF 50+ सनस्क्रीन का उपयोग करें",
        "धूप में बाहर निकलते समय पूरे शरीर को ढकने वाले कपड़े पहनें",
        "सुबह 10 से शाम 4 बजे की तेज धूप से बचें",
        "नियमित रूप से अपनी त्वचा की जांच करें"
      ],
      warningSigns: [
        "पैच का तेजी से बढ़ना या मोटा होना",
        "खून बहना, घाव बनना या तेज दर्द होना",
        "पैच का नीचे से सख्त हो जाना"
      ],
      medicalAttention: "इसे कैंसर बनने से रोकने के लिए तुरंत त्वचा विशेषज्ञ से जांच कराएं।",
      summary: "एक्टिनिक केराटोसिस का समय पर इलाज कराना बेहद जरूरी है।"
    }
  },

  benign_other: {
    en: {
      name: "Benign Skin Mark / Other",
      subTitle: "Non-Malignant Cutaneous Growth",
      category: "Benign Lesion",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Benign cutaneous growths include skin tags (acrochordons), cherry angiomas, dermatofibromas, and lentigines. These are non-cancerous structures with zero malignant potential.",
      symptoms: [
        "Stable, well-demarcated papule, nodule, or pigmented macule",
        "Asymptomatic (no significant pain, bleeding, or rapid enlargement)",
        "Smooth, dome-shaped, pedunculated, or firm to touch"
      ],
      causes: [
        "Genetics, friction from clothing or skin folds",
        "Normal aging process and vascular capillary proliferation",
        "Post-inflammatory hyperpigmentation"
      ],
      precautions: [
        "Avoid picking, twisting, or attempting self-removal at home",
        "Protect skin from friction and mechanical trauma",
        "Maintain routine skin self-surveillance"
      ],
      warningSigns: [
        "Sudden change in size, color, symmetry, or border outline",
        "Unexplained spontaneous bleeding or persistent ulceration"
      ],
      medicalAttention: "Routine evaluation only. Elective removal can be performed by a dermatologist for cosmetic or mechanical discomfort reasons.",
      summary: "Benign skin marks are completely harmless non-cancerous growths that require no urgent medical treatment."
    },
    ta: {
      name: "சாதாரண தோல் தழும்பு / பிற (Benign Skin Mark)",
      subTitle: "ஆபத்தற்ற சாதாரண தோல் வளர்ச்சி",
      category: "ஆபத்தற்ற தோல் வளர்ச்சி",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "இது தோலில் ஏற்படும் ஆபத்தற்ற சாதாரண வளர்ச்சியாகும் (மருக்கள், செர்ரி ஆஞ்சியோமா போன்றவை). இவை புற்றுநோய் அல்லாத பாதுகாப்பான தழும்புகள் ஆகும்.",
      symptoms: [
        "மாறுபடாத, நிலையான சிறிய தோல் தடிப்பு அல்லது மச்சம்",
        "வலி, ரத்தப்போக்கு அல்லது வேகமான வளர்ச்சி இல்லாத நிலை",
        "மென்மையான அல்லது தொடுவதற்கு சற்று கடினமான அமைப்பு"
      ],
      causes: [
        "மரபியல், ஆடைகளின் உராய்தல்",
        "இயற்கையான வயது முதிர்வு மற்றும் ரத்த நாள மாற்றங்கள்"
      ],
      precautions: [
        "வீட்டில் வைத்து இவைகளை சொந்தமாக நறுக்கவோ அல்லது பிடுங்கவோ வேண்டாம்",
        "உராய்தல் மற்றும் காயங்களில் இருந்து தோலைப் பாதுகாக்கவும்"
      ],
      warningSigns: [
        "அளவு, நிறம் அல்லது வடிவத்தில் திடீர் மாற்றங்கள்",
        "திடீர் ரத்தப்போக்கு அல்லது ஆறாத புண்"
      ],
      medicalAttention: "மருத்துவ அவசர நிலை இல்லை. அழகு அல்லது அசௌகரியக் காரணங்களுக்காக விரும்பினால் மருத்துவரிடம் அகற்றலாம்.",
      summary: "சாதாரண தோல் மச்சங்கள் முற்றிலும் ஆபத்தற்றவை, பயப்படத் தேவையில்லை."
    },
    hi: {
      name: "सामान्य त्वचा का निशान (Benign Skin Mark)",
      subTitle: "गैर-हानिकारक त्वचा वृद्धि",
      category: "सुरक्षित त्वचा वृद्धि",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "यह त्वचा की एक सामान्य और सुरक्षित वृद्धि है (जैसे मस्से या लाल तिल)। ये पूरी तरह से गैर-कैंसरीकृत और हानिकारक नहीं होते हैं।",
      symptoms: [
        "स्थिर और स्पष्ट सीमाओं वाला छोटा निशान",
        "दर्द, ब्लीडिंग या तेज फैलाव न होना",
        "छूने पर चिकना या हल्का सख्त महसूस होना"
      ],
      causes: [
        "आनुवंशिकी और कपड़ों की रगड़",
        "उम्र बढ़ने की सामान्य प्रक्रिया"
      ],
      precautions: [
        "इन्हें खुद से काटने या हटाने का प्रयास न करें",
        "रगड़ और चोट से बचाएं"
      ],
      warningSigns: [
        "रंग, आकार या बनावट में अचानक बदलाव",
        "अचानक खून बहना या घाव बनना"
      ],
      medicalAttention: "यह पूरी तरह से सुरक्षित है। यदि सौंदर्य के कारण हटाना चाहें तो त्वचा विशेषज्ञ से मिलें।",
      summary: "यह एक सामान्य और हानिरहित त्वचा का निशान है।"
    }
  },

  eczema_dermatitis: {
    en: {
      name: "Eczema & Dermatitis",
      subTitle: "Pruritic Inflammatory Skin Disorder",
      category: "Eczematous Dermatosis",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Atopic Dermatitis and Contact Dermatitis present with pruritic, erythematous, dry, flaky patches caused by immune hypersensitivity and epidermal barrier impairment.",
      symptoms: [
        "Intense itching (pruritus), especially at night",
        "Red to brownish-gray dry, cracked, or scaly patches",
        "Small raised bumps which may ooze fluid and crust when scratched",
        "Thickened, leathery, lichenified skin areas"
      ],
      causes: [
        "Immune dysregulation and genetic filaggrin gene mutations",
        "Environmental allergens, harsh soaps, detergents, or chemical irritants",
        "Stress, dry cold weather, and skin barrier disruption"
      ],
      precautions: [
        "Moisturize skin at least twice daily with ceramide-rich emollients",
        "Take short, warm (not hot) showers using fragrance-free cleansers",
        "Wear soft, breathable cotton clothing",
        "Avoid scratching to prevent secondary bacterial superinfections"
      ],
      warningSigns: [
        "Signs of bacterial infection (pus, yellowish crusting, severe red streaks)",
        "Widespread eczema herpes simplex viral co-infection",
        "Severe sleep disruption due to uncontrollable itching"
      ],
      medicalAttention: "Seek medical advice for prescription topical corticosteroids, calcineurin inhibitors, or barrier restoration therapies.",
      summary: "Eczema is a manageable inflammatory condition requiring strict moisturization and allergen avoidance."
    },
    ta: {
      name: "எக்ஸிமா & தோல் அழற்சி (Eczema & Dermatitis)",
      subTitle: "அரிப்புடன் கூடிய தோல் அழற்சி நோய்",
      category: "தோல் அழற்சி நோய்",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "எக்ஸிமா என்பது தீவிர அரிப்பு, வறட்சி மற்றும் தோல் உரிதல் ஆகியவற்றை உண்டாக்கும் ஒரு நோயெதிர்ப்பு சார்ந்த தோலழற்சி நோயாகும்.",
      symptoms: [
        "இரவில் தீவிரமடையும் கடுமையான அரிப்பு",
        "சிவப்பு அல்லது பழுப்பு நிற வறண்ட, விரிசல் விழுந்த தோல்",
        "சொறியும்போது நீர் வடியும் சிறிய கொப்புளங்கள்",
        "தடிமனான தோல் பகுதிகள்"
      ],
      causes: [
        "நோயெதிர்ப்பு மண்டலத்தின் அதிகப்படியான உணர்திறன்",
        "ரசாயன சோப்புகள், வாசனை திரவியங்கள் மற்றும் ஒவ்வாமை பொருள்கள்",
        "மனஅழுத்தம் மற்றும் வறண்ட வானிலை"
      ],
      precautions: [
        "தினமும் இரண்டு முறை நல்ல ஈரப்பதமூட்டும் கிரீம்களைப் பூசவும்",
        "மிதமான வெதுவெதுப்பான நீரில் குளிக்கவும்",
        "மென்மையான பருத்தி ஆடைகளை அணியவும்",
        "தோலை நகங்களால் சொறிய வேண்டாம்"
      ],
      warningSigns: [
        "சீழ் வடிதல் அல்லது மஞ்சள் நிற மேல்தோல் அமைதல் (பாக்டீரியா தொற்று)",
        "உடல் முழுவதும் வேகமாக பரவும் புண்கள்",
        "அரிப்பால் தூக்கம் கடுமையாக பாதிக்கப்படுவது"
      ],
      medicalAttention: "அரிப்பு அதிகமாக இருந்தால் மருத்துவரின் ஆலோசனைப்படி கிரீம்கள் மற்றும் மருந்துகளைப் பயன்படுத்தவும்.",
      summary: "எக்ஸிமாவை சரியான ஈரப்பதமூட்டும் பராமரிப்பு மூலம் எளிதாகக் கட்டுப்படுத்தலாம்."
    },
    hi: {
      name: "एटोपिक एक्जिमा और डर्मेटाइटिस (Eczema & Dermatitis)",
      subTitle: "खुजली और सूजन संबंधी त्वचा विकार",
      category: "त्वचा की सूजन",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "एक्जिमा एक ऐसी स्थिति है जिसमें त्वचा में लालिमा, अत्यधिक खुजली, सूखापन और पपड़ी जमने की समस्या होती है।",
      symptoms: [
        "अत्यधिक खुजली, विशेषकर रात के समय",
        "लाल या भूरे रंग के सूखे और फटे हुए पैच",
        "छोटे दाने जिनमें से खुजलाने पर पानी निकल सकता है",
        "त्वचा का मोटा और सख्त होना"
      ],
      causes: [
        "प्रतिरक्षा प्रणाली का असंतुलन",
        "कठोर साबुन, डिटर्जेंट या एलर्जेंस से संपर्क",
        "तनाव और शुष्क मौसम"
      ],
      precautions: [
        "दिन में कम से कम दो बार मॉइस्चराइज़र लगाएं",
        "हल्के गुनगुने पानी से नहाएं और सुगंध रहित साबुन का प्रयोग करें",
        "सूती कपड़े पहनें",
        "त्वचा को खुजलाने से बचें"
      ],
      warningSigns: [
        "पीला मवाद निकलना या संक्रमण के लक्षण दिखना",
        "पूरे शरीर पर बहुत तेजी से दाने फैलना",
        "खुजली के कारण नींद न आना"
      ],
      medicalAttention: "यदि लक्षण नियंत्रित न हों तो त्वचा विशेषज्ञ से दवा और लोशन की सलाह लें।",
      summary: "एक्जिमा को सही मॉइस्चराइज़र और देखभाल से नियंत्रित किया जा सकता है।"
    }
  },

  melanoma: {
    en: {
      name: "Melanoma (Malignant)",
      subTitle: "Aggressive Cutaneous Malignancy",
      category: "Malignant Melanocytic Neoplasm",
      riskLevel: "High",
      riskColor: "rose",
      description: "Melanoma is a serious and potentially life-threatening form of skin cancer originating in pigment-producing melanocytes. Early detection and complete surgical excision are essential for curative outcomes.",
      symptoms: [
        "Asymmetry: One half of the lesion does not match the other half",
        "Border irregularity: Scalloped, notched, or poorly defined edges",
        "Color variation: Mixed shades of black, brown, blue, red, or white",
        "Diameter: Greater than 6mm (size of a pencil eraser), though can be smaller",
        "Evolving: Rapid changes in size, shape, color, elevation, or new symptoms (bleeding, itching)"
      ],
      causes: [
        "Intense intermittent UV radiation exposure and blistering sunburns",
        "Genetic susceptibility (CDKN2A mutations, family history of melanoma)",
        "High total mole count (>50 atypical nevi) and fair skin complexions"
      ],
      precautions: [
        "Schedule an urgent dermatological evaluation and diagnostic biopsy immediately",
        "Do not attempt any topical treatment or home remedies",
        "Avoid all sun exposure on the affected area",
        "Perform routine full-body skin surveillance"
      ],
      warningSigns: [
        "Rapid enlargement or nodular elevation",
        "Spontaneous ulceration, bleeding, or crusting",
        "Enlarged regional lymph nodes"
      ],
      medicalAttention: "IMMEDIATE CONSULTATION REQUIRED: Contact a board-certified dermatologist or surgical oncologist urgently for excision and histopathological evaluation.",
      summary: "HIGH CLINICAL RISK: Melanoma requires prompt professional diagnosis and excision. Early treatment yields exceptionally high survival rates."
    },
    ta: {
      name: "மெலனோமா புற்றுநோய் (Melanoma - Malignant)",
      subTitle: "அதிவேகமாக பரவும் தோல் புற்றுநோய்",
      category: "தோல் புற்றுநோய்",
      riskLevel: "High",
      riskColor: "rose",
      description: "மெலனோமா என்பது தோலில் உள்ள நிறமி செல்களில் ஏற்படும் ஒரு தீவிரமான தோல் புற்றுநோயாகும். ஆரம்பத்திலேயே கண்டறிந்து சிகிச்சை பெறுவது உயிர் காக்க மிகவும் அவசியமாகும்.",
      symptoms: [
        "சீரற்ற வடிவமைப்பு (ABCDE விதி - Asymmetry)",
        "ஒழுங்கற்ற அல்லது சொரசொரப்பான விளிம்புகள் (Border)",
        "கருப்பு, பழுப்பு, சிவப்பு என பல வண்ணங்கள் கலந்து காணப்படுதல் (Color)",
        "6 மில்லிமீட்டருக்கும் அதிகமான அளவு (Diameter)",
        "அளவு, வடிவம் அல்லது நிறத்தில் வேகமான மாற்றங்கள் (Evolving)"
      ],
      causes: [
        "அதிகப்படியான சூரிய ஒளி மற்றும் புறஊதாக் கதிர்களின் பாதிப்பு",
        "குடும்பத்தில் புற்றுநோய் வரலாறு மற்றும் மரபணு காரணங்கள்",
        "உடலில் அதிகப்படியான மச்சங்கள் இருப்பது"
      ],
      precautions: [
        "உடனடியாக தோல் புற்றுநோய் மருத்துவரை அணுகவும்",
        "வீட்டு வைத்தியம் அல்லது கிரீம்களைப் பயன்படுத்த வேண்டாம்",
        "பாதிக்கப்பட்ட இடத்தில் வெயில் படாமல் பாதுகாக்கவும்"
      ],
      warningSigns: [
        "மச்சத்தின் அளவு மற்றும் உயரம் வேகமாக அதிகரிப்பது",
        "காரணமின்றி ரத்தம் வடிதல் அல்லது புண் ஏற்படுதல்",
        "அருகில் உள்ள நிணநீர் முனைகளில் வீக்கம்"
      ],
      medicalAttention: "அவசர மருத்துவ ஆலோசனை தேவை: உடனடியாக தகுதியான தோல் மருத்துவரைச் சந்தித்து பயாப்ஸி பரிசோதனை செய்து கொள்ளவும்.",
      summary: "அதிக ஆபத்துள்ள நிலை: மெலனோமாவை ஆரம்பத்திலேயே அறுவை சிகிச்சை மூலம் முழுமையாகக் குணப்படுத்த முடியும்."
    },
    hi: {
      name: "मेलेनोमा त्वचा कैंसर (Melanoma - Malignant)",
      subTitle: "गंभीर त्वचा कैंसर",
      category: "घातक त्वचा कैंसर",
      riskLevel: "High",
      riskColor: "rose",
      description: "मेलेनोमा त्वचा कैंसर का सबसे गंभीर रूप है जो रंगद्रव्य बनाने वाली कोशिकाओं (मेलेनोसाइट्स) में शुरू होता है। समय पर इलाज जीवन बचाने के लिए अत्यंत आवश्यक है।",
      symptoms: [
        "असममित आकार (एक आधा हिस्सा दूसरे से अलग दिखना)",
        "अनियमित या कटे-फटे किनारे",
        "काला, भूरा, लाल या नीला रंग मिला-जुला होना",
        "6 मिमी से बड़ा आकार होना",
        "आकार, रंग या बनावट में लगातार बदलाव होना"
      ],
      causes: [
        "सूर्य की पराबैंगनी (UV) किरणों का तीव्र प्रभाव",
        "आनुवंशिक कारण और परिवार में त्वचा कैंसर का इतिहास",
        "शरीर पर बहुत अधिक तिलों का होना"
      ],
      precautions: [
        "बिना देरी के तुरंत त्वचा विशेषज्ञ से जांच कराएं",
        "किसी भी घरेलू उपचार का प्रयोग न करें",
        "प्रभावित जगह को धूप से बचाएं"
      ],
      warningSigns: [
        "निशान का तेजी से बढ़ना या ऊपर उठना",
        "अचानक खून बहना या पपड़ी जमना",
        "आसपास की लिम्फ नोड्स में सूजन"
      ],
      medicalAttention: "तत्काल परामर्श आवश्यक: तुरंत कैंसर या त्वचा विशेषज्ञ से संपर्क करें और बायोप्सी कराएं।",
      summary: "उच्च जोखिम स्थिति: प्रारंभिक चरण में मेलेनोमा का इलाज पूरी तरह से संभव है।"
    }
  },

  nevus_mole: {
    en: {
      name: "Nevus (Common Mole)",
      subTitle: "Benign Melanocytic Proliferation",
      category: "Benign Melanocytic Lesion",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Common Melanocytic Nevi are benign clusters of melanocytes. They are extremely common, clinically stable, and non-cancerous.",
      symptoms: [
        "Symmetrical round or oval pigmented macule or papule",
        "Uniform brown, tan, or skin-colored pigmentation",
        "Smooth, distinct borders and stable diameter (<6mm)"
      ],
      causes: [
        "Normal benign melanocytic proliferation during childhood and adolescence",
        "Genetic predisposition and sun exposure"
      ],
      precautions: [
        "Monitor moles periodically using the ABCDE self-examination rules",
        "Apply sunscreen to prevent solar damage and dysplastic changes",
        "Do not scratch or attempt chemical removal at home"
      ],
      warningSigns: [
        "New onset of asymmetry or border jaggedness",
        "Multiple colors appearing within a single mole",
        "Rapid enlargement, itching, or spontaneous bleeding"
      ],
      medicalAttention: "Routine monitoring only. Consult a doctor if a mole displays evolving changes.",
      summary: "Nevi are harmless common moles requiring only standard routine surveillance."
    },
    ta: {
      name: "சாதாரண மச்சம் (Nevus / Common Mole)",
      subTitle: "ஆபத்தற்ற சாதாரண மச்சம்",
      category: "ஆபத்தற்ற தோல் மச்சம்",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "இது தோலில் காணப்படும் ஆபத்தற்ற சாதாரண மச்சமாகும். இது முற்றிலும் பாதுகாப்பானது மற்றும் புற்றுநோய் அல்லாதது.",
      symptoms: [
        "சீரான வட்ட அல்லது நீள்வட்ட வடிவ மச்சம்",
        "ஒரே சீரான பழுப்பு அல்லது கருப்பு நிறம்",
        "தெளிவான விளிம்புகள் மற்றும் நிலையான அளவு"
      ],
      causes: [
        "வளர்ச்சிப் பருவத்தில் ஏற்படும் இயற்கையான நிறமி செல்களின் வளர்ச்சி",
        "மரபியல் காரணங்கள்"
      ],
      precautions: [
        "மச்சங்களை அவ்வப்போது சுயபரிசோதனை செய்து கொள்ளவும்",
        "சூரிய ஒளியில் செல்லும்போது சன்ஸ்கிரீன் பயன்படுத்தவும்",
        "மச்சத்தை நகங்களால் பிடுங்க வேண்டாம்"
      ],
      warningSigns: [
        "மச்சத்தின் வடிவத்தில் திடீர் மாற்றம்",
        "ஒரே மச்சத்தில் பல நிறங்கள் தோன்றுவது",
        "திடீர் அரிப்பு அல்லது ரத்தப்போக்கு"
      ],
      medicalAttention: "சாதாரண மச்சங்களுக்கு சிகிச்சை தேவையில்லை. மாற்றங்கள் தெரிந்தால் மட்டும் மருத்துவரை அணுகவும்.",
      summary: "சாதாரண மச்சங்கள் முற்றிலும் பாதுகாப்பானவை."
    },
    hi: {
      name: "सामान्य तिल (Nevus / Common Mole)",
      subTitle: "सुरक्षित सामान्य तिल",
      category: "सामान्य त्वचा का तिल",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "सामान्य नेवस या तिल त्वचा पर रंगद्रव्य कोशिकाओं का एक सुरक्षित समूह है। ये पूरी तरह से सामान्य और हानिरहित होते हैं।",
      symptoms: [
        "समान गोल या अंडाकार आकृति",
        "एकसमान भूरा या काला रंग",
        "स्पष्ट किनारे और स्थिर आकार"
      ],
      causes: [
        "बचपन और किशोरावस्था में कोशिकाओं का प्राकृतिक विकास",
        "आनुवंशिक कारण"
      ],
      precautions: [
        "समय-समय पर तिलों की सामान्य जांच करें",
        "धूप से बचाव के लिए सनस्क्रीन लगाएं",
        "तिल को छेड़े नहीं"
      ],
      warningSigns: [
        "तिल के आकार या रंग में अचानक बदलाव",
        "खुजली या खून बहने की समस्या"
      ],
      medicalAttention: "सामान्य तिलों के लिए इलाज की आवश्यकता नहीं है। बदलाव दिखने पर डॉक्टर से मिलें।",
      summary: "सामान्य तिल पूरी तरह से सुरक्षित होते हैं।"
    }
  },

  psoriasis: {
    en: {
      name: "Psoriasis",
      subTitle: "Chronic Autoimmune Erythemosquamous Disorder",
      category: "Autoimmune Papulosquamous Disease",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Psoriasis is a chronic systemic autoimmune inflammatory condition characterized by hyperproliferation of epidermal keratinocytes, causing thick, silvery-scaly plaques.",
      symptoms: [
        "Sharply demarcated red erythematous plaques covered with silvery-white scales",
        "Commonly affects elbows, knees, scalp, and lower back",
        "Pitting, thickening, or ridging of nails",
        "Auspitz sign (pinpoint bleeding when scales are scraped)"
      ],
      causes: [
        "T-cell mediated autoimmune dysregulation accelerating skin cell turnover",
        "Genetic predisposition (HLA-Cw6 allele association)",
        "Environmental triggers: stress, streptococcal infection, skin trauma (Koebner phenomenon)"
      ],
      precautions: [
        "Keep skin thoroughly moisturized with dense ointments or creams",
        "Avoid skin injury, scratching, and severe sunburns",
        "Manage emotional stress and avoid smoking and excessive alcohol"
      ],
      warningSigns: [
        "Erythrodermic flare (redness covering >90% of total body surface area)",
        "Generalized pustular psoriasis with systemic fever and chills",
        "Joint pain, stiffness, and swelling (Psoriatic Arthritis)"
      ],
      medicalAttention: "Consult a dermatologist for prescription topical steroids, vitamin D analogues, phototherapy, or systemic biologic targeted therapies.",
      summary: "Psoriasis is a chronic manageable immune disorder responsive to modern biologic and topical treatments."
    },
    ta: {
      name: "சொரியாசிஸ் (Psoriasis)",
      subTitle: "நாட்பட்ட நோயெதிர்ப்பு சார்ந்த தோல் நோய்",
      category: "நோயெதிர்ப்பு மண்டல தோல் நோய்",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "சொரியாசிஸ் என்பது நோயெதிர்ப்பு மண்டலத்தின் மாறுபாட்டால் தோலின் செல்கள் அதிவேகமாக வளர்ந்து வெள்ளி நிறச் செதில்களாக மாறும் நோயாகும்.",
      symptoms: [
        "வெள்ளி நிறச் செதில்களால் மூடப்பட்ட தடிமனான சிவப்புத் தடிப்புகள்",
        "முழங்கை, முழங்கால், மண்டை ஓடு மற்றும் முதுகில் அதிகம் தோன்றுதல்",
        "நகங்களில் குழிகள் அல்லது தடிமன் ஏற்படுதல்",
        "செதில்களை உரிக்கும்போது சிறிய ரத்தப் புள்ளிகள் வருவது"
      ],
      causes: [
        "நோயெதிர்ப்பு மண்டலத்தின் சீர்குலைவு",
        "மரபியல் காரணங்கள்",
        "மனஅழுத்தம், தொண்டை தொற்று மற்றும் தோல் காயங்கள்"
      ],
      precautions: [
        "தோலை எப்போதும் ஈரப்பதமாக வைத்திருக்க கிரீம்களைப் பூசவும்",
        "தோலில் காயங்கள் ஏற்படாமல் பார்த்துக்கொள்ளவும்",
        "மனஅழுத்தம் மற்றும் புகைபிடித்தலைத் தவிர்க்கவும்"
      ],
      warningSigns: [
        "உடல் முழுவதும் 90% மேல் பரவும் கடும் சிவத்தல்",
        "காய்ச்சலுடன் கூடிய சீழ் கொப்புளங்கள் தோன்றுவது",
        "மூட்டு வலி மற்றும் வீக்கம் (சொரியாடிக் அρθ்ரைடிஸ்)"
      ],
      medicalAttention: "சிறந்த சிகிச்சைக்கு தோல் மருத்துவரை அணுகி நவீன கிரீம்கள் மற்றும் மருந்துகளைப் பெறவும்.",
      summary: "சொரியாசிஸ் என்பது தொடர் மருத்துவம் மற்றும் பராமரிப்பு மூலம் சிறப்பாகக் கட்டுப்படுத்தக்கூடிய நோயாகும்."
    },
    hi: {
      name: "सोरायसिस (Psoriasis)",
      subTitle: "दीर्घकालिक ऑटोइम्यून त्वचा विकार",
      category: "स्वप्रतिरक्षित त्वचा रोग",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "सोरायसिस एक दीर्घकालिक ऑटोइम्यून स्थिति है जिसमें त्वचा की कोशिकाएं बहुत तेजी से बनने लगती हैं, जिससे चांदी जैसी पपड़ीदार परतें बन जाती हैं।",
      symptoms: [
        "चांदी जैसी सफेद पपड़ी से ढके हुए लाल धब्बे",
        "कोहनी, घुटने, खोपड़ी और पीठ के निचले हिस्से पर अधिक होना",
        "नाखूनों में गड्ढे या मोटाई आना",
        "पपड़ी हटाने पर खून की छोटी बूंदें निकलना"
      ],
      causes: [
        "प्रतिरक्षा प्रणाली की अतिसक्रियता",
        "आनुवंशिक कारक",
        "तनाव, गले का संक्रमण और त्वचा की चोट"
      ],
      precautions: [
        "त्वचा पर गाढ़ा मॉइस्चराइज़र या ऑइंटमेंट लगाएं",
        "त्वचा को चोट और खरोंच से बचाएं",
        "तनाव कम करें और धूम्रपान से बचें"
      ],
      warningSigns: [
        "पूरे शरीर पर लालिमा और सूजन का फैलना",
        "बुखार के साथ मवाद भरे दाने होना",
        "जोड़ों में दर्द और सूजन होना"
      ],
      medicalAttention: "उचित उपचार, फोटोथेरेपी या जैविक दवाओं के लिए त्वचा विशेषज्ञ से परामर्श लें।",
      summary: "सोरायसिस को आधुनिक चिकित्सा और सही देखभाल से अच्छी तरह नियंत्रित किया जा सकता है।"
    }
  },

  seborrheic_keratosis: {
    en: {
      name: "Seborrheic Keratosis",
      subTitle: "Benign Epidermal Warty Tumuloid",
      category: "Benign Epithelial Tumor",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Seborrheic Keratoses are extremely common non-cancerous benign skin growths appearing as waxy, elevated, 'stuck-on' verrucous papules in older adults.",
      symptoms: [
        "Waxy, greasy, or velvet-like 'stuck-on' appearance",
        "Color varies from light tan to dark brown or black",
        "Slightly raised, oval or round with a keratin horn-cyst surface"
      ],
      causes: [
        "Normal cutaneous aging and benign keratinocyte proliferation",
        "Genetic factors (FGFR3 gene mutation involvement)"
      ],
      precautions: [
        "Do not scratch, pick, or attempt to cut off lesions",
        "Prevent friction from clothing straps or belts"
      ],
      warningSigns: [
        "Sudden explosive eruption of hundreds of lesions (Sign of Leser-Trélat)",
        "Spontaneous ulceration, bleeding, or asymmetrical border growth"
      ],
      medicalAttention: "No treatment required medically. Cryotherapy or curettage can be performed by a clinician if irritated.",
      summary: "Seborrheic Keratosis is a benign non-cancerous lesion of no health risk."
    },
    ta: {
      name: "செபோரிக் கெரடோசிஸ் (Seborrheic Keratosis)",
      subTitle: "ஆபத்தற்ற தோல் மெழுகுத் தடிப்பு",
      category: "ஆபத்தற்ற தோல் தடிப்பு",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "செபோரிக் கெரடோசிஸ் என்பது தோலின் மேல் ஒட்டிக்கொண்டது போலக் காணப்படும் ஆபத்தற்ற மெழுகு போன்ற தடிப்பாகும். இது புற்றுநோய் அல்ல.",
      symptoms: [
        "தோலின் மேல் ஒட்டியது போன்ற மெழுகு அல்லது பிசுபிசுப்பான அமைப்பு",
        "வெளிர் பழுப்பு முதல் கருப்பு நிறம் வரை காணப்படுதல்",
        "சிறிது உயர்த்தப்பட்ட வட்ட அல்லது நீள்வட்ட தடிப்பு"
      ],
      causes: [
        "வயது முதிர்வு மற்றும் இயற்கையான தோல் செல்கள் பெருக்கம்",
        "மரபியல் காரணங்கள்"
      ],
      precautions: [
        "தடிப்புகளைக் கிள்ளவோ அல்லது சொறியவோ வேண்டாம்",
        "ஆடைகளின் உராய்தலைத் தவிர்க்கவும்"
      ],
      warningSigns: [
        "திடீரென நூற்றுக்கணக்கான தடிப்புகள் தோன்றுவது",
        "ரத்தப்போக்கு அல்லது புண் ஏற்படுவது"
      ],
      medicalAttention: "மருத்துவ சிகிச்சை தேவையில்லை. அசௌகரியமாக இருந்தால் மருத்துவரிடம் அகற்றிவிடலாம்.",
      summary: "செபோரிக் கெரடோசிஸ் என்பது முற்றிலும் ஆபத்தற்ற தோல் தடிப்பாகும்."
    },
    hi: {
      name: "सेबोरहाइक केराटोसिस (Seborrheic Keratosis)",
      subTitle: "सुरक्षित मोमी त्वचा वृद्धि",
      category: "सुरक्षित त्वचा विकार",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "सेबोरहाइक केराटोसिस त्वचा पर मोम जैसी चिपकी हुई दिखने वाली एक सामान्य और सुरक्षित वृद्धि है जो उम्र बढ़ने के साथ होती है।",
      symptoms: [
        "मोम या ग्रीस जैसी दिखने वाली चिपकी हुई बनावट",
        "हल्के भूरे से लेकर काले रंग के दाने",
        "उभरे हुए गोल या अंडाकार निशान"
      ],
      causes: [
        "उम्र बढ़ने की सामान्य प्रक्रिया",
        "आनुवंशिक कारण"
      ],
      precautions: [
        "इन्हें खुरचने या काटने का प्रयास न करें",
        "कपड़ों की रगड़ से बचाएं"
      ],
      warningSigns: [
        "अचानक बहुत सारे नए निशान बनना",
        "खून बहना या घाव होना"
      ],
      medicalAttention: "इलाज की आवश्यकता नहीं है। आवश्यकता होने पर डॉक्टर इसे आसानी से हटा सकते हैं।",
      summary: "यह एक पूरी तरह से सुरक्षित त्वचा की वृद्धि है।"
    }
  },

  tinea_fungal: {
    en: {
      name: "Tinea / Fungal Infection",
      subTitle: "Superficial Cutaneous Mycosis",
      category: "Fungal Infection",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Tinea (Ringworm, Athlete's Foot, Tinea Versicolor) is a superficial dermatophyte fungal infection of the skin, causing annular itchy scaly lesions.",
      symptoms: [
        "Annular (ring-shaped) erythematous patch with active scaly border and central clearing",
        "Pruritus (itching), scaling, cracking, or skin peeling",
        "May affect feet (tinea pedis), groin (tinea cruris), body (tinea corporis), or scalp"
      ],
      causes: [
        "Dermatophyte fungi (Trichophyton, Microsporum, Epidermophyton)",
        "Warm, humid environments, excessive sweating, and wearing tight synthetic clothing",
        "Direct contact with infected individuals, pets, or contaminated towels"
      ],
      precautions: [
        "Keep affected skin clean, dry, and thoroughly ventilated",
        "Apply topical antifungal cream (clotrimazole, terbinafine) as prescribed",
        "Do not share personal items such as towels, socks, or clothing",
        "Wear loose, breathable cotton garments"
      ],
      warningSigns: [
        "Secondary bacterial superinfection with oozing pus and warmth",
        "Widespread recalcitrant systemic fungal infection in immunocompromised patients"
      ],
      medicalAttention: "Consult a clinician for topical or oral antifungal medications if the ringworm does not clear within 2 weeks.",
      summary: "Fungal skin infections are curable with standard OTC or prescription antifungal treatments."
    },
    ta: {
      name: "படைத் தாமரை / பூஞ்சை தொற்று (Tinea / Fungal Infection)",
      subTitle: "தோல் பூஞ்சை தொற்று",
      category: "பூஞ்சை தொற்று",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "படைத் தாமரை என்பது தோலின் மேற்பரப்பில் ஏற்படும் பூஞ்சை தொற்றாகும். இது வட்ட வடிவ சிவப்புத் தடிப்புகள் மற்றும் அரிப்பை உண்டாக்குகிறது.",
      symptoms: [
        "வட்ட வடிவ (மோதிரம் போன்ற) சிவப்புத் தடிப்புகள்",
        "அரிப்பு, தோல் உரிதல் மற்றும் செதில்கள் தோன்றுதல்",
        "பாதங்கள், இடுப்பு அல்லது உடல் பகுதிகளில் அதிகம் ஏற்படுதல்"
      ],
      causes: [
        "பூஞ்சை கிருமிகளின் தொற்று (Dermatophytes)",
        "அதிக வியர்வை, ஈரம் மற்றும் இறுக்கமான ஆடைகள்",
        "பாதிக்கப்பட்டவர்களின் துண்டுகள் அல்லது ஆடைகளைப் பயன்படுத்துதல்"
      ],
      precautions: [
        "தோல் பகுதியை எப்போதும் உலர்ந்ததாகவும் சுத்தமாகவும் வைத்திருக்கவும்",
        "மருத்துவர் பரிந்துரைக்கும் பூஞ்சை எதிர்ப்பு கிரீம்களைப் பயன்படுத்தவும்",
        "துண்டுகள் மற்றும் ஆடைகளைப் பிறருடன் பகிர்ந்துகொள்ள வேண்டாம்",
        "மென்மையான பருத்தி ஆடைகளை அணியவும்"
      ],
      warningSigns: [
        "சீழ் வடிதல் அல்லது பாக்டீரியா தொற்று ஏற்படுதல்",
        "உடல் முழுவதும் வேகமாகப் பரவுதல்"
      ],
      medicalAttention: "2 வாரங்களுக்குள் பூஞ்சை தொற்று குணமாகவில்லை என்றால் மருத்துவரின் ஆலோசனையைப் பெறவும்.",
      summary: "பூஞ்சை தொற்று என்பது கிரீம்கள் மற்றும் மருந்துகள் மூலம் எளிதில் குணப்படுத்தக்கூடிய நோயாகும்."
    },
    hi: {
      name: "दाद / फंगल संक्रमण (Tinea / Fungal Infection)",
      subTitle: "त्वचा का फंगल संक्रमण",
      category: "फंगल संक्रमण",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "दाद या टिनिया त्वचा की सतह पर होने वाला एक आम फंगल संक्रमण है, जो गोल पपड़ीदार चकत्ते और खुजली पैदा करता है।",
      symptoms: [
        "गोल (अंगूठी जैसा) लाल चकत्ता जिसके किनारे उभरे हुए हों",
        "खुजली, त्वचा का छिलना या पपड़ी जमना",
        "पैरों, जांघों या शरीर पर दाने होना"
      ],
      causes: [
        "डर्मेटोफाइट फंगस का संक्रमण",
        "नमी, पसीना और तंग कपड़े पहनना",
        "संक्रमित व्यक्ति के तौलिये या कपड़ों का उपयोग"
      ],
      precautions: [
        "त्वचा को हमेशा साफ और सूखा रखें",
        "एंटीफंगल क्रीम (जैसे टरबीनाफाइन) का प्रयोग करें",
        "व्यक्तिगत सामान जैसे तौलिया या कपड़े शेयर न करें",
        "सूती और ढीले कपड़े पहनें"
      ],
      warningSigns: [
        "मवाद पड़ना या गंभीर जीवाणु संक्रमण होना",
        "संक्रमण का बहुत तेजी से फैलना"
      ],
      medicalAttention: "यदि 2 सप्ताह में सुधार न हो तो डॉक्टर से एंटीफंगल दवा की सलाह लें।",
      summary: "फंगल संक्रमण का सही एंटीफंगल क्रीम से पूरी तरह इलाज संभव है।"
    }
  },

  vascular_lesion: {
    en: {
      name: "Vascular Lesion / Hemangioma",
      subTitle: "Cutaneous Capillary Malformation",
      category: "Vascular Anomaly",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Vascular lesions encompass cherry angiomas, infantile hemangiomas, port-wine stains, and telangiectasias arising from blood vessel anomalies.",
      symptoms: [
        "Bright red, violaceous, or purple macule or raised nodule",
        "Blanches (fades temporarily) under direct glass or finger pressure",
        "Asymptomatic unless traumatized"
      ],
      causes: [
        "Benign capillary endothelial cell proliferation",
        "Congenital vascular malformations or localized capillary ectasia"
      ],
      precautions: [
        "Protect from sharp mechanical trauma to prevent profuse bleeding",
        "Do not puncture or squeeze vascular lesions"
      ],
      warningSigns: [
        "Rapid enlargement near vital anatomical structures (eye, airway)",
        "Spontaneous brisk bleeding or ulceration"
      ],
      medicalAttention: "Consult a physician for pulsed-dye laser therapy or clinical monitoring if bleeding or functional impairment occurs.",
      summary: "Vascular lesions are benign capillary structures requiring intervention only if symptomatic or for aesthetic reasons."
    },
    ta: {
      name: "ரத்த நாளத் தழும்பு / ஹெமாங்கியோமா (Vascular Lesion)",
      subTitle: "ரத்தக் குழாய் சார்ந்த தோல் தழும்பு",
      category: "ரத்த நாளக் குறைபாடு",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "இது தோலின் மெல்லிய ரத்தக் குழாய்களில் ஏற்படும் ஆபத்தற்ற சிவப்பு அல்லது ஊதா நிறத் தழும்பாகும்.",
      symptoms: [
        "பிரகாசமான சிவப்பு அல்லது ஊதா நிறச் சிறிய தடிப்பு",
        "அழுத்தும்போது தற்காலிகமாக நிறம் மங்குதல்",
        "வலி அல்லது அரிப்பு இல்லாத நிலை"
      ],
      causes: [
        "ரத்தக் குழாய் செல்களின் இயற்கை வளர்ச்சி",
        "பிறவி ரத்த நாள அமைப்புக் காரணங்கள்"
      ],
      precautions: [
        "காயம் ஏற்பட்டு ரத்தம் வடிவதைத் தடுக்க கவனமாக இருக்கவும்",
        "தடிப்புகளை ஊசியால் குத்தவோ அழுத்தவோ வேண்டாம்"
      ],
      warningSigns: [
        "கண் அல்லது மூக்கு அருகில் வேகமாக வளர்வது",
        "நிற்காமல் ரத்தம் வடிவது"
      ],
      medicalAttention: "அவசியம் என்றால் லேசர் சிகிச்சை மூலம் அகற்றுவதற்கு மருத்துவரை அணுகலாம்.",
      summary: "ரத்த நாளத் தழும்புகள் ஆபத்தற்றவை, பயப்படத் தேவையில்லை."
    },
    hi: {
      name: "रक्त वाहिका निशान / हेमांगीओमा (Vascular Lesion)",
      subTitle: "रक्त वाहिका संबंधी त्वचा का निशान",
      category: "रक्त वाहिका विकार",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "यह त्वचा की बारीक रक्त वाहिकाओं में होने वाली एक सुरक्षित लाल या बैंगनी रंग की वृद्धि है।",
      symptoms: [
        "चमकदार लाल या बैंगनी रंग का छोटा दाना या निशान",
        "दबाने पर हल्का रंग फीका पड़ना",
        "आमतौर पर बिना दर्द या खुजली का होना"
      ],
      causes: [
        "रक्त वाहिकाओं की कोशिकाओं का असामान्य विकास",
        "जन्मजात संवहनी विकृति"
      ],
      precautions: [
        "चोट से बचाएं ताकि खून न बहे",
        "इन्हें सुई से फोड़ने या दबाने की कोशिश न करें"
      ],
      warningSigns: [
        "आँख या नाक के पास बहुत तेजी से बढ़ना",
        "लगातार खून बहना"
      ],
      medicalAttention: "आवश्यकता होने पर लेजर उपचार से हटाया जा सकता है।",
      summary: "यह एक सुरक्षित और सामान्य रक्त वाहिका निशान है।"
    }
  },

  blue_nevus: {

    en: {
      name: "Blue Nevus",
      subTitle: "Dermal Melanocytic Lesion",
      category: "Benign Melanocytic Lesion",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "A Blue Nevus is a benign dermal melanocytic proliferation presenting as a blue, steel-gray, or blue-black papule or macule.",
      symptoms: ["Steel-blue or dark bluish-black smooth papule", "Asymptomatic with stable dimensions", "Typically located on hands, feet, or buttocks"],
      causes: ["Deep dermal melanocyte arrest during embryogenesis", "Localized melanin pigment accumulation in dermis"],
      precautions: ["Perform annual skin checks with a dermatologist", "Report any sudden growth or irregular border changes"],
      warningSigns: ["Rapid growth or ulceration", "Nodular elevation or satellite lesions"],
      medicalAttention: "Routine monitoring by dermatologist. Excision recommended if sudden morphological change occurs.",
      summary: "Blue Nevus is a benign skin lesion caused by deep dermal pigment."
    },
    ta: {
      name: "நீல மச்சம் (Blue Nevus)",
      subTitle: "பாதுகாப்பான நீல நிற மச்சம்",
      category: "பாதுகாப்பான மச்சம்",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "நீல மச்சம் என்பது தோலின் ஆழமான பகுதியில் ஏற்படும் ஆபத்தற்ற நீல அல்லது சாம்பல் நிற மச்சம் ஆகும்.",
      symptoms: ["நீலம் அல்லது கருநீல நிற மென்மையான தழும்பு", "வலி அல்லது அரிப்பு இல்லாத நிலை"],
      causes: ["தோலின் ஆழமான பகுதியில் மெலனின் நிறமி சேருதல்"],
      precautions: ["ஆண்டுதோறும் தோல் மருத்துவரிடம் பரிசோதிக்கவும்"],
      warningSigns: ["திடீர் வளர்ச்சி அல்லது ரத்தப்போக்கு"],
      medicalAttention: "சாதாரண பரிசோதனை போதுமானது.",
      summary: "நீல மச்சம் முற்றிலும் ஆபத்தற்றது."
    },
    hi: {
      name: "ब्लू नेवस (Blue Nevus)",
      subTitle: "सुरक्षित नीला तिल",
      category: "सुरक्षित तिल",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "ब्लू नेवस त्वचा की गहरी परत में होने वाला एक सुरक्षित नीला या स्लेटी रंग का तिल है।",
      symptoms: ["नीले या काले-नीले रंग का चिकना दाना", "दर्द या जलन का न होना"],
      causes: ["त्वचा की निचली परत में रंजक (पिगमेंट) का जमाव"],
      precautions: ["नियमित रूप से अपनी त्वचा की जांच करें"],
      warningSigns: ["आकार में तेजी से बदलाव"],
      medicalAttention: "यह सामान्यतः सुरक्षित होता है।",
      summary: "ब्लू नेवस एक सुरक्षित तिल है।"
    }
  },

  bowenoid_papulosis: {
    en: {
      name: "Bowenoid Papulosis",
      subTitle: "HPV-Associated Cutaneous Lesion",
      category: "Pre-Malignant Lesion",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Bowenoid Papulosis presents as reddish-brown mucosal or cutaneous papules linked to oncogenic Human Papillomavirus (HPV).",
      symptoms: ["Hyperpigmented reddish-brown papules", "Mild itching or burning"],
      causes: ["High-risk HPV strains (HPV 16, 18)", "Immunosuppression"],
      precautions: ["Maintain safe hygiene and seek prompt evaluation"],
      warningSigns: ["Ulceration or rapid plaque expansion"],
      medicalAttention: "Requires dermatological evaluation for topical or destructive cryotherapy.",
      summary: "Bowenoid Papulosis requires early treatment to prevent malignant transformation."
    },
    ta: {
      name: "போவெனாய்டு பாப்புலோசிஸ் (Bowenoid Papulosis)",
      subTitle: "HPV தொடர்பான தோல் தடிப்பு",
      category: "மத்திம ஆபத்துள்ள தடிப்பு",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "இது எச்பிவி (HPV) வைரஸால் ஏற்படும் சிவந்த பழுப்பு நிறத் தோல்தடிப்பு ஆகும்.",
      symptoms: ["சிவப்பு-பழுப்பு நிறத் தடிப்புகள்", "லேசான அரிப்பு"],
      causes: ["HPV வைரஸ் தொற்று"],
      precautions: ["உடனடி மருத்துவ ஆலோசனை பெறவும்"],
      warningSigns: ["வேகமான வளர்ச்சி"],
      medicalAttention: "தோல் மருத்துவரிடம் சிகிச்சை பெறவும்.",
      summary: "ஆரம்ப சிகிச்சையால் எளிதில் குணப்படுத்தலாம்."
    },
    hi: {
      name: "बोवेनोइड पापलोसिस (Bowenoid Papulosis)",
      subTitle: "HPV से संबंधित त्वचा का घाव",
      category: "मध्यम जोखिम",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "यह एचपीवी (HPV) संक्रमण के कारण होने वाले लाल-भूरे रंग के दानों की स्थिति है।",
      symptoms: ["लाल-भूरे रंग के दाने", "हल्की खुजली"],
      causes: ["एचपीवी (HPV) वायरस"],
      precautions: ["त्वचा विशेषज्ञ से सलाह लें"],
      warningSigns: ["दानों का फैलना"],
      medicalAttention: "समय पर इलाज आवश्यक है।",
      summary: "इलाज से इसे ठीक किया जा सकता है।"
    }
  },

  bowens_disease: {
    en: {
      name: "Bowen's Disease (SCC in situ)",
      subTitle: "Squamous Cell Carcinoma in situ",
      category: "Pre-Cancerous Carcinoma",
      riskLevel: "High",
      riskColor: "rose",
      description: "Bowen's Disease is an in situ squamous cell carcinoma characterized by slow-growing, red, scaly, demarcated plaques.",
      symptoms: ["Persistent red scaly plaque", "Crusting or mild oozing"],
      causes: ["Chronic sun exposure", "Arsenic exposure or HPV infection"],
      precautions: ["Apply daily broad-spectrum SPF 50+ sunscreen", "Avoid sun exposure"],
      warningSigns: ["Nodular hardening or rapid ulceration indicating invasive SCC"],
      medicalAttention: "Requires dermatological treatment (cryotherapy, excision, or topical 5-FU).",
      summary: "Bowen's Disease is an early form of skin cancer that is cureable when treated early."
    },
    ta: {
      name: "போவன்ஸ் நோய் (Bowen's Disease)",
      subTitle: "ஆரம்ப கட்ட தோல் புற்றுநோய் நிலை",
      category: "அதிக ஆபத்துள்ள நிலை",
      riskLevel: "High",
      riskColor: "rose",
      description: "போவன்ஸ் நோய் என்பது தோலின் மேல் அடுக்கில் ஏற்படும் ஆரம்ப கட்ட செதிள் செல் புற்றுநோய் நிலையாகும்.",
      symptoms: ["சிவப்பு நிற செதிள் தடிப்பு", "தோல் உரிதல்"],
      causes: ["அதிக சூரிய ஒளி பாதிப்பு"],
      precautions: ["சன்ஸ்கிரீன் பயன்படுத்தவும்"],
      warningSigns: ["தடிப்பு கடினமாதல் அல்லது ரத்தப்போக்கு"],
      medicalAttention: "உடனடியாக தோல் மருத்துவரை அணுகவும்.",
      summary: "ஆரம்ப சிகிச்சை புற்றுநோயைத் தடுக்கும்."
    },
    hi: {
      name: "बोवेन्स बीमारी (Bowen's Disease)",
      subTitle: "शुरुआती त्वचा कैंसर की स्थिति",
      category: "उच्च जोखिम",
      riskLevel: "High",
      riskColor: "rose",
      description: "बोवेन्स बीमारी त्वचा के स्क्वैमस सेल कार्सिनोमा का शुरुआती रूप है जो ऊपरी त्वचा तक सीमित रहता है।",
      symptoms: ["लाल पपड़ीदार पैच", "त्वचा का छिलना"],
      causes: ["तेज धूप का दीर्घकालिक प्रभाव"],
      precautions: ["धूप से बचें और सनस्क्रीन लगाएं"],
      warningSigns: ["घाव बनना या खून बहना"],
      medicalAttention: "तुरंत त्वचा विशेषज्ञ से इलाज कराएं।",
      summary: "शुरुआती इलाज से पूर्ण बचाव संभव है।"
    }
  },

  cafe_au_lait_macule: {
    en: {
      name: "Café au Lait Macule",
      subTitle: "Pigmented Skin Macule",
      category: "Pigmentary Macule",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Café au Lait macules are flat, light-brown hyperpigmented birthmarks or macules with sharp borders.",
      symptoms: ["Light brown flat macule", "Asymptomatic"],
      causes: ["Increased epidermal melanin synthesis"],
      precautions: ["Routine monitoring"],
      warningSigns: ["Presence of 6 or more macules >5mm (Neurofibromatosis 1 evaluation)"],
      medicalAttention: "Routine surveillance. Pediatric evaluation if multiple spots exist.",
      summary: "Café au Lait macules are benign pigmented patches."
    },
    ta: {
      name: "கஃபே ஓ லே மச்சம் (Café au Lait Macule)",
      subTitle: "இளம்பழுப்பு நிற தோல் தழும்பு",
      category: "பாதுகாப்பான தழும்பு",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "இது தோலில் தோன்றும் இளம்பழுப்பு நிற தட்டையான மச்சம் ஆகும்.",
      symptoms: ["இளம்பழுப்பு தட்டையான தழும்பு"],
      causes: ["மெலனின் நிறமி அதிகரிப்பு"],
      precautions: ["சாதாரண கண்காணிப்பு"],
      warningSigns: ["ஆறுக்கும் மேற்பட்ட தழும்புகள் தோன்றுதல்"],
      medicalAttention: "அவசர சிகிச்சை தேவையில்லை.",
      summary: "முற்றிலும் ஆபத்தற்றது."
    },
    hi: {
      name: "कैफे औ लेत मैकुल (Café au Lait Macule)",
      subTitle: "हल्का भूरा पैच",
      category: "सुरक्षित पैच",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "यह त्वचा पर पाया जाने वाला समतल, हल्का भूरा धब्बा या जन्मजात निशान है।",
      symptoms: ["हल्का भूरा धब्बा"],
      causes: ["मेलानिन पिगमेंट की अधिकता"],
      precautions: ["सामान्य जांच"],
      warningSigns: ["एक साथ कई धब्बे होना"],
      medicalAttention: "यह सामान्यतः सुरक्षित है।",
      summary: "यह एक सुरक्षित निशान है।"
    }
  },

  callus: {
    en: {
      name: "Callus & Hyperkeratosis",
      subTitle: "Mechanical Skin Thickening",
      category: "Hyperkeratotic Dermatosis",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "A Callus is localized hyperkeratotic skin thickening resulting from repetitive mechanical friction or pressure.",
      symptoms: ["Thick, hardened, yellowish rough skin area", "Reduced tactile sensation"],
      causes: ["Repetitive friction from tight shoes or manual labor"],
      precautions: ["Wear properly fitted footwear", "Apply moisturizing urea creams"],
      warningSigns: ["Deep painful cracking, infection, or diabetic ulceration"],
      medicalAttention: "Podiatry evaluation if painful or in diabetic patients.",
      summary: "Calluses are benign protective skin thickenings easily managed with pumice stone and moisturizers."
    },
    ta: {
      name: "தோல் தடிப்பு / ஆணி (Callus)",
      subTitle: "உராய்தலால் ஏற்படும் தோல் தடிப்பு",
      category: "சாதாரண தடிப்பு",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "தொடர்ச்சியான உராய்தல் மற்றும் அழுத்தத்தால் தோலில் ஏற்படும் தடிப்பு ஆகும்.",
      symptoms: ["கடினமான மஞ்சள்/சாம்பல் நிறத் தோல்"],
      causes: ["இறுகிய காலணிகள் அல்லது கடின உழைப்பு"],
      precautions: ["மென்மையான காலணிகளை அணியவும்"],
      warningSigns: ["வலிமிகுந்த வெடிப்புகள்"],
      medicalAttention: "தேவைப்பட்டால் மருத்துவரிடம் காண்பிக்கவும்.",
      summary: "காலணிகளை மாற்றுவதன் மூலம் குணமாகும்."
    },
    hi: {
      name: "कैलस / त्वचा का कड़ापन (Callus)",
      subTitle: "रगड़ से होने वाली मोटी त्वचा",
      category: "सामान्य कड़ापन",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "बार-बार रगड़ या दबाव के कारण त्वचा का मोटा और सख्त होना कैलस कहलाता है।",
      symptoms: ["सख्त और खुरदुरी त्वचा"],
      causes: ["तंग जूते या लगातार काम करना"],
      precautions: ["आरामदायक जूते पहनें"],
      warningSigns: ["दर्दनाक दरारें या संक्रमण"],
      medicalAttention: "सॉफ्ट क्रीम का प्रयोग करें।",
      summary: "यह एक सामान्य स्थिति है।"
    }
  },

  candidiasis: {
    en: {
      name: "Candidiasis (Fungal Infection)",
      subTitle: "Cutaneous Yeast Infection",
      category: "Fungal Dermatosis",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Cutaneous Candidiasis is an erythematous macerated rash with peripheral satellite pustules caused by Candida yeast.",
      symptoms: ["Bright red macerated skin folds", "Satellite pustules and intense itching"],
      causes: ["Candida albicans overgrowth", "Moisture, heat, diabetes, or immunosuppression"],
      precautions: ["Keep skin folds dry and clean", "Wear breathable cotton clothing"],
      warningSigns: ["Spreading rash with fever or deep tissue erosion"],
      medicalAttention: "Consult a healthcare provider for topical antifungal cream (clotrimazole/miconazole).",
      summary: "Candidiasis responds rapidly to topical antifungal therapy and moisture control."
    },
    ta: {
      name: "கேன்டிடியாசிஸ் பூஞ்சை தொற்று (Candidiasis)",
      subTitle: "தோல் பூஞ்சை தொற்று",
      category: "பூஞ்சை தொற்று",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "ஈரப்பதம் உள்ள தோல் மடிப்புகளில் ஏற்படும் சிவப்பான பூஞ்சை தொற்று ஆகும்.",
      symptoms: ["சிவப்பு நிறத் தடிப்பு", "கடுமையான அரிப்பு"],
      causes: ["ஈரப்பதம் மற்றும் பூஞ்சை வளர்ச்சி"],
      precautions: ["தோலை உலர்ந்து வைத்துக்கொள்ளவும்"],
      warningSigns: ["அதிகரிக்கும் காய்ச்சல் அல்லது புண்"],
      medicalAttention: "பூஞ்சை எதிர்ப்பு கிரீம் பயன்படுத்தவும்.",
      summary: "கிரீம்கள் மூலம் எளிதில் குணப்படுத்தலாம்."
    },
    hi: {
      name: "कैंडिडिआसिस फंगल संक्रमण (Candidiasis)",
      subTitle: "त्वचा का यीस्ट संक्रमण",
      category: "फंगल संक्रमण",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "यह त्वचा की सिलवटों में होने वाला लाल और खुजलीदार फंगल संक्रमण है।",
      symptoms: ["लाल रंग के चत्ते", "तेज खुजली"],
      causes: ["नमी और यीस्ट का बढ़ना"],
      precautions: ["त्वचा को सूखा और साफ रखें"],
      warningSigns: ["घाव फैलना"],
      medicalAttention: "एंटीफंगल क्रीम का उपयोग करें।",
      summary: "उचित इलाज से यह जल्दी ठीक होता है।"
    }
  },

  cellulitis: {
    en: {
      name: "Cellulitis (Acute Bacterial Infection)",
      subTitle: "Dermal & Subcutaneous Infection",
      category: "Bacterial Infection",
      riskLevel: "High",
      riskColor: "rose",
      description: "Cellulitis is a spreading bacterial skin infection of the dermis and subcutaneous tissue causing erythema, edema, and warmth.",
      symptoms: ["Rapidly spreading red, hot, swollen skin", "Tenderness, warmth, and systemic fever"],
      causes: ["Streptococcus or Staphylococcus bacterial entry via skin break"],
      precautions: ["Elevate affected limb", "Do not delay medical care"],
      warningSigns: ["Rapid expansion, red streaks, blistering, or high fever"],
      medicalAttention: "URGENT MEDICAL ATTENTION REQUIRED for oral or IV antibiotic treatment.",
      summary: "Cellulitis is a serious bacterial infection requiring prompt prescription antibiotics."
    },
    ta: {
      name: "செல்லுலைடிஸ் பாக்டீரியா தொற்று (Cellulitis)",
      subTitle: "கடுமையான தோல் அழற்சி",
      category: "அவசர சிகிச்சை தேவைப்படும் நிலை",
      riskLevel: "High",
      riskColor: "rose",
      description: "இது தோலின் ஆழமான பகுதியில் வேகமாக பரவும் பாக்டீரியா தொற்று ஆகும்.",
      symptoms: ["சூடான சிவப்பு வீக்கம்", "கடுமையான வலி மற்றும் காய்ச்சல்"],
      causes: ["பாக்டீரியா கிருமி தொற்று"],
      precautions: ["உடனடி மருத்துவமனை சிகிச்சை பெறவும்"],
      warningSigns: ["வேகமாகப் பரவும் வீக்கம்"],
      medicalAttention: "உடனடியாக மருத்துவரை அணுகவும்.",
      summary: "ஆன்டிபயாடிக் மருந்துகள் மூலம் சிகிச்சை அளிக்க வேண்டும்."
    },
    hi: {
      name: "सेल्युलाइटिस बैक्टीरियल संक्रमण (Cellulitis)",
      subTitle: "गंभीर त्वचा संक्रमण",
      category: "उच्च जोखिम",
      riskLevel: "High",
      riskColor: "rose",
      description: "सेल्युलाइटिस त्वचा की गहरी परतों में तेजी से फैलने वाला बैक्टीरियल संक्रमण है।",
      symptoms: ["त्वचा पर लालिमा, सूजन और तेज दर्द", "गर्मी और बुखार"],
      causes: ["बैक्टीरिया का प्रवेश"],
      precautions: ["तुरंत अस्पताल जाएं"],
      warningSigns: ["लाल रेखाएं बनना या बुखार बढ़ना"],
      medicalAttention: "तुरंत डॉक्टर से एंटीबायोटिक इलाज लें।",
      summary: "एंटीबायोटिक्स से इसका इलाज संभव है।"
    }
  },

  dermatofibroma: {
    en: {
      name: "Dermatofibroma",
      subTitle: "Benign Cutaneous Nodule",
      category: "Benign Fibrous Lesion",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "Dermatofibroma is a firm, solitary, reddish-brown dermal nodule exhibiting a characteristic 'fitzpatrick dimple sign' upon lateral compression.",
      symptoms: ["Firm brown/red papule or nodule", "Pinch dimple sign (dimples inward when squeezed)"],
      causes: ["Minor trauma, insect bites, or folliculitis reactive fibrosis"],
      precautions: ["Avoid picking or mechanical trauma"],
      warningSigns: ["Rapid growth or spontaneous bleeding"],
      medicalAttention: "Routine monitoring. Surgical excision available if symptomatic.",
      summary: "Dermatofibromas are completely harmless fibrous skin nodules."
    },
    ta: {
      name: "டெர்மாடோஃபைபுரோமா (Dermatofibroma)",
      subTitle: "பாதுகாப்பான தோல் கட்டி",
      category: "ஆபத்தற்ற கட்டி",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "இது தோலில் ஏற்படும் கடினமான சிறிய ஆபத்தற்ற கட்டி ஆகும்.",
      symptoms: ["கடினமான பழுப்பு நிறக் கட்டி", "அமுக்கும் போது உள்வாங்கும் தன்மை"],
      causes: ["பூச்சி கடி அல்லது சிறு காயம்"],
      precautions: ["கட்டியை அழுத்த வேண்டாம்"],
      warningSigns: ["திடீர் வளர்ச்சி"],
      medicalAttention: "சாதாரண பரிசோதனை போதுமானது.",
      summary: "முற்றிலும் ஆபத்தற்றது."
    },
    hi: {
      name: "डर्माटोफाइब्रोमा (Dermatofibroma)",
      subTitle: "सुरक्षित त्वचा गांठ",
      category: "सुरक्षित गांठ",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "यह त्वचा में होने वाली एक सख्त, छोटी और सुरक्षित गांठ है।",
      symptoms: ["सख्त भूरी गांठ", "दबाने पर डिंपल बनना"],
      causes: ["कीड़े के काटने या छोटी चोट की प्रतिक्रिया"],
      precautions: ["इसे छेड़े नहीं"],
      warningSigns: ["तेजी से बढ़ना"],
      medicalAttention: "यह पूरी तरह से सुरक्षित है।",
      summary: "यह एक सुरक्षित गांठ है।"
    }
  },

  bullous: {
    en: {
      name: "Bullous (Bullous Pemphigoid / Pemphigus)",
      subTitle: "Autoimmune Blistering Dermatosis",
      category: "Subepidermal Blistering Condition",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Bullous dermatoses (such as Bullous Pemphigoid) are autoimmune skin disorders characterized by large, fluid-filled blisters (bullae) formed due to autoantibodies targeting basement membrane proteins.",
      symptoms: [
        "Large, tense, fluid-filled blisters (bullae) on normal or erythematous skin",
        "Intense pruritus (itching) often preceding blister development",
        "Urticarial (hive-like) skin plaques or erosion formation",
        "Blisters primarily located on flexor surfaces, lower abdomen, or thighs"
      ],
      causes: [
        "Autoimmune response with IgG autoantibodies targeting BP180 and BP230 proteins",
        "Triggers such as specific medications, trauma, or neurological conditions",
        "Disruption of hemidesmosomal adhesion structures"
      ],
      precautions: [
        "Protect active bullae from friction, trauma, or popping to prevent secondary infection",
        "Apply gentle, non-irritating wound dressings as advised by a healthcare provider",
        "Maintain strict skin hygiene and avoid harsh antiseptic soaps"
      ],
      warningSigns: [
        "Rapidly spreading blister coverage or involvement of mucosal membranes (mouth/eyes)",
        "Signs of secondary bacterial infection (pus, foul odor, expanding redness, fever)",
        "Severe mucosal pain, difficulty swallowing, or systemic fever"
      ],
      medicalAttention: "Prompt clinical evaluation by a certified dermatologist or immunodermatologist is required for skin biopsy and immunofluorescence testing.",
      summary: "Bullous disease is an autoimmune blistering disorder requiring expert dermatological management."
    },
    ta: {
      name: "புல்லஸ் (Bullous - கொப்புளத் தோல் நோய்)",
      subTitle: "சுய-நோயெதிர்ப்பு கொப்புள நோய்",
      category: "கொப்புளத் தோல் நோய்",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "புல்லஸ் என்பது தோலில் பெரிய நீர் நிறைந்த கொப்புளங்களை உருவாக்கும் சுய-நோயெதிர்ப்பு தோல் நோயாகும்.",
      symptoms: [
        "தோலில் பெரிய, இறுக்கமான நீர் கொப்புளங்கள்",
        "கொப்புளங்கள் தோன்றுவதற்கு முன் கடுமையான அரிப்பு",
        "தோல் சிவந்து தடிமனாதல்"
      ],
      causes: [
        "நோயெதிர்ப்பு மண்டலத்தின் தவறான தாக்கம்",
        "சில மருந்துகள் அல்லது காயங்களின் பக்கவிளைவு"
      ],
      precautions: [
        "கொப்புளங்களை உடைக்கவோ உடைக்க முயற்சிக்கவோ வேண்டாம்",
        "தோலை சுத்தமாகவும் உராயாமலும் வைத்திருக்கவும்"
      ],
      warningSigns: [
        "கொப்புளங்கள் வேகமாக பரவுதல் அல்லது வாயில் தோன்றுதல்",
        "காய்ச்சல் அல்லது சீழ் பிடித்தல்"
      ],
      medicalAttention: "உடனடியாக தோல் மருத்துவரை அணுகி பயாப்ஸி பரிசோதனை செய்து கொள்ளவும்.",
      summary: "புல்லஸ் என்பது கொப்புளங்களை உருவாக்கும் நோய்."
    },
    hi: {
      name: "बुलस (Bullous - छालेदार त्वचा विकार)",
      subTitle: "ऑटोइम्यून छालेदार रोग",
      category: "छालेदार त्वचा रोग",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "बुलस एक ऑटोइम्यून त्वचा विकार है जिसमें त्वचा पर बड़े, पानी से भरे छाले (बुलै) बन जाते हैं।",
      symptoms: [
        "त्वचा पर बड़े और पानी से भरे छाले",
        "छाले बनने से पहले तेज खुजली",
        "त्वचा पर लाल चकत्ते होना"
      ],
      causes: [
        "प्रतिरक्षा प्रणाली की गड़बड़ी",
        "कुछ दवाओं या चोटों का प्रभाव"
      ],
      precautions: [
        "छालों को फोड़ें नहीं",
        "त्वचा को साफ और रगड़ से बचाकर रखें"
      ],
      warningSigns: [
        "छालों का तेजी से फैलना या मुंह में होना",
        "बुखार या मवाद पड़ना"
      ],
      medicalAttention: "तुरंत त्वचा विशेषज्ञ से सलाह लें और बायोप्सी कराएं।",
      summary: "बुलस छाले पैदा करने वाला त्वचा विकार है।"
    }
  },

  lymphomatoid_papulosis: {
    en: {
      name: "Lymphomatoid Papulosis",
      subTitle: "CD30+ Cutaneous Lymphoproliferative Disorder",
      category: "Cutaneous Lymphoproliferative Condition",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Lymphomatoid Papulosis (LyP) is a rare chronic cutaneous lymphoproliferative disorder characterized by recurrent crops of self-healing papulonecrotic or nodular skin lesions.",
      symptoms: [
        "Recurrent crops of reddish-brown papules and nodules",
        "Central necrosis, ulceration, or crusting of papules",
        "Spontaneous regression of individual lesions within 4 to 8 weeks leaving small scars",
        "Variable mild itching or local tenderness"
      ],
      causes: [
        "Clonal proliferation of atypical CD30+ T-lymphocytes",
        "Dysregulated cutaneous immune response",
        "Genetic or immune microenvironment factors"
      ],
      precautions: [
        "Do not squeeze or excise active necrotic papules at home",
        "Keep active lesions clean and covered with sterile non-stick bandages",
        "Maintain routine dermatological follow-up consultations"
      ],
      warningSigns: [
        "Lesions failing to self-regress after 12 weeks or rapidly expanding in size",
        "Development of systemic symptoms (fever, unexplained weight loss, night sweats)",
        "Persistent localized lymphadenopathy (swollen lymph nodes)"
      ],
      medicalAttention: "Consult a dermatologist for clinical evaluation, skin biopsy, and long-term surveillance.",
      summary: "Lymphomatoid Papulosis features self-healing crops of cutaneous nodules requiring medical monitoring."
    },
    ta: {
      name: "லிம்போமடாய்டு பாபுலோசிஸ் (Lymphomatoid Papulosis)",
      subTitle: "தோல் நிணநீர் சார்ந்த நோய்",
      category: "தோல் நோய்",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "இது தோலில் மீண்டும் மீண்டும் தோன்றி தானாகவே ஆறும் தடிப்புகள் மற்றும் கட்டிகளை உண்டாக்கும் அரிதான நோயாகும்.",
      symptoms: ["சிவப்பு-பழுப்பு நிற தடிப்புகள்", "நடுவில் புண் அல்லது மேல்தோல் உரிதல்"],
      causes: ["T-செல்களின் மாறுபட்ட வளர்ச்சி"],
      precautions: ["தடிப்புகளை கிள்ள வேண்டாம்"],
      warningSigns: ["12 வாரங்களுக்கு மேல் ஆறாமல் இருத்தல்"],
      medicalAttention: "தோல் மருத்துவரை அணுகி பயாப்ஸி செய்து கொள்ளவும்.",
      summary: "தானாக ஆறும் தடிப்புகளைக் கொண்ட தோல் நிலை."
    },
    hi: {
      name: "लिम्फोमैटॉइड पैपुलोसिस (Lymphomatoid Papulosis)",
      subTitle: "त्वचा लिम्फोप्रोलिफेरेटिव विकार",
      category: "त्वचा विकार",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "यह एक दुर्लभ त्वचा विकार है जिसमें बार-बार दाने और गांठें बनती हैं जो स्वतः ठीक हो जाती हैं।",
      symptoms: ["लाल-भूरे रंग के दाने", "बीच में घाव या पपड़ी जमना"],
      causes: ["टी-कोशिकाओं की असामान्य वृद्धि"],
      precautions: ["दानों को दबाएं नहीं"],
      warningSigns: ["12 सप्ताह से अधिक समय तक ठीक न होना"],
      medicalAttention: "त्वचा विशेषज्ञ से सलाह लें और जांच कराएं।",
      summary: "स्वतः ठीक होने वाले दानों वाला त्वचा विकार।"
    }
  },

  drug_eruption: {
    en: {
      name: "Drug Eruption (Cutaneous Adverse Drug Reaction)",
      subTitle: "Systemic Medication-Induced Cutaneous Reaction",
      category: "Adverse Cutaneous Reaction",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "Drug Eruptions (such as morbilliform or fixed drug eruptions) are adverse skin reactions triggered by systemic medications, ranging from mild maculopapular rashes to severe cutaneous reactions.",
      symptoms: [
        "Widespread symmetric maculopapular rash appearing 1 to 2 weeks after drug initiation",
        "Pruritus (itching), skin burning, or cutaneous discomfort",
        "Solitary or sparse violaceous erythematous macules (Fixed Drug Eruption)",
        "Skin tenderness or mild cutaneous swelling"
      ],
      causes: [
        "Immunological (Type I, II, III, or IV hypersensitivity) or non-immunological drug reaction",
        "Systemic medications including antibiotics, NSAIDs, anticonvulsants, or diuretics"
      ],
      precautions: [
        "Contact your prescribing physician immediately before discontinuing any vital medication",
        "Keep a detailed written timeline of all newly started medications and supplements",
        "Avoid hot showers and apply cool compresses or emollients to soothe itching"
      ],
      warningSigns: [
        "Mucosal involvement (blisters or erosions on lips, mouth, eyes, or genitals)",
        "Skin detachment, epidermal sloughing, positive Nikolsky sign, or facial edema",
        "High fever, swollen lymph nodes, or organ involvement (DRESS / Stevens-Johnson Syndrome)"
      ],
      medicalAttention: "Seek urgent medical attention if rash spreads rapidly, blisters form, or systemic symptoms like fever or facial swelling occur.",
      summary: "Drug Eruption is an adverse cutaneous reaction requiring prompt medication review by a physician."
    },
    ta: {
      name: "மருந்து பக்கவிளைவுத் தடிப்பு (Drug Eruption)",
      subTitle: "மருந்துகளால் ஏற்படும் தோல் எதிர்வினை",
      category: "மருந்து பக்கவிளைவு நோய்",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "மருந்துகள் உட்கொள்வதால் தோலில் ஏற்படும் ஒவ்வாமை மற்றும் சிவப்பு நிறத் தடிப்புகள்.",
      symptoms: ["உடல் முழுவதும் பரவும் சிவப்புத் தடிப்புகள்", "தோல் அரிப்பு மற்றும் எரிச்சல்"],
      causes: ["புதிய மருந்துகள் அல்லது மாத்திரைகளின் ஒவ்வாமை"],
      precautions: ["சம்பந்தப்பட்ட மருந்தை மருத்துவரிடம் காட்டி ஆலோசனை பெறவும்"],
      warningSigns: ["தோல் உரிதல் அல்லது வாயில் புண்கள்"],
      medicalAttention: "உடனடியாக மருத்துவரை அணுகவும்.",
      summary: "மருந்துகளால் ஏற்படும் தோல் ஒவ்வாமை."
    },
    hi: {
      name: "ड्रग इरप्शन (दवा से होने वाले दाने)",
      subTitle: "दवाओं के दुष्प्रभाव से त्वचा प्रतिक्रिया",
      category: "दवा एलर्जी विकार",
      riskLevel: "Moderate",
      riskColor: "amber",
      description: "दवाओं के सेवन से त्वचा पर होने वाले लाल दाने और चकत्ते।",
      symptoms: ["पूरे शरीर पर लाल दाने", "खुजली और जलन"],
      causes: ["एंटीबायोटिक या अन्य दवाओं से एलर्जी"],
      precautions: ["अपनी दवाओं की सूची डॉक्टर को दिखाएं"],
      warningSigns: ["त्वचा की छीलने की स्थिति या मुंह में छाले"],
      medicalAttention: "तुरंत चिकित्सक से संपर्क करें।",
      summary: "दवा के दुष्प्रभाव से त्वचा पर दाने।"
    }
  }
};

export function formatConfidencePct(confidence: number): string {
  if (confidence === undefined || confidence === null || isNaN(confidence)) return "0.0";
  let pct = Number(confidence);
  if (pct <= 1.0) {
    pct = pct * 100;
  }
  const clamped = Math.min(Math.max(pct, 0), 100);
  return clamped.toFixed(1);
}

export function getLocalizedDiseaseInfo(classKey: string, lang: Language): LocalizedDiseaseDetail {
  if (!classKey) {
    const fallback = diseaseDatabase['benign_other'];
    return fallback[lang] || fallback['en'];
  }

  const combinedKB: Record<string | number, DiseaseKnowledgeSchema> = diseaseKnowledgeBase || {
    ...diseaseKnowledgeBasePart1,
    ...diseaseKnowledgeBasePart2,
    ...diseaseKnowledgeBasePart3
  };

  // 1. Check numeric class ID index in master knowledge base (Classes 0 to 152)
  const numericMatch = classKey.match(/\b([0-9]{1,3})\b/);
  if (numericMatch) {
    const classId = parseInt(numericMatch[1], 10);
    if (combinedKB[classId]) {
      return convertKnowledgeSchemaToDetail(combinedKB[classId], lang);
    }
  }

  // 2. Check canonical or alternate names in combined knowledge base
  const cleanKey = classKey.toLowerCase().trim().replace(/[\s\-]+/g, '_');
  const rawCleanKey = classKey.toLowerCase().trim();

  for (const [id, entry] of Object.entries(combinedKB)) {
    if (!entry) continue;
    const cName = entry.canonicalName.toLowerCase().replace(/[\s\-]+/g, '_');
    const rawCName = entry.canonicalName.toLowerCase().trim();

    const isMatch = cName === cleanKey || 
      rawCName === rawCleanKey ||
      cleanKey.includes(cName) ||
      rawCleanKey.includes(rawCName) ||
      (entry.alternateNames && entry.alternateNames.some(alt => {
        const altClean = alt.toLowerCase().replace(/[\s\-]+/g, '_');
        return altClean === cleanKey || cleanKey.includes(altClean) || rawCleanKey.includes(alt.toLowerCase().trim());
      }));

    if (isMatch) {
      return convertKnowledgeSchemaToDetail(entry, lang);
    }
  }

  // 3. Check legacy diseaseDatabase dictionary
  let matchedKey = Object.keys(diseaseDatabase).find(k => k === cleanKey);

  if (!matchedKey) {
    if (cleanKey.includes('bullous')) matchedKey = 'bullous';
    else if (cleanKey.includes('lymphomatoid')) matchedKey = 'lymphomatoid_papulosis';
    else if (cleanKey.includes('drug') || cleanKey.includes('drugeruption')) matchedKey = 'drug_eruption';
    else if (cleanKey.includes('acne') || cleanKey.includes('rosacea')) matchedKey = 'acne_rosacea';
    else if (cleanKey.includes('actinic') || (cleanKey.includes('keratosis') && cleanKey.includes('actinic'))) matchedKey = 'actinic_keratosis';
    else if (cleanKey.includes('eczema') || cleanKey.includes('dermatitis')) matchedKey = 'eczema_dermatitis';
    else if (cleanKey.includes('melanoma')) matchedKey = 'melanoma';
    else if (cleanKey.includes('nevus') || cleanKey.includes('mole')) matchedKey = 'nevus_mole';
    else if (cleanKey.includes('psoriasis')) matchedKey = 'psoriasis';
    else if (cleanKey.includes('seborrheic')) matchedKey = 'seborrheic_keratosis';
    else if (cleanKey.includes('tinea') || cleanKey.includes('fungal') || cleanKey.includes('ringworm')) matchedKey = 'tinea_fungal';
    else if (cleanKey.includes('vascular') || cleanKey.includes('hemangioma')) matchedKey = 'vascular_lesion';
  }

  if (matchedKey && diseaseDatabase[matchedKey]) {
    const diseaseEntry = diseaseDatabase[matchedKey];
    return diseaseEntry[lang] || diseaseEntry['en'];
  }

  // Authoritative Professional Clinical Detail (NO "UNAVAILABLE" TEXT EVER DISPLAYED)
  const formattedName = classKey.replace(/^class_\d+_\(?|\)?$/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    name: formattedName,
    subTitle: "Dermatological Condition",
    category: "Cutaneous Evaluation",
    riskLevel: "Moderate",
    riskColor: "amber",
    description: `Clinical evaluation for ${formattedName}. This condition presents as a distinct cutaneous feature requiring professional dermatological evaluation for accurate diagnosis and personalized guidance.`,
    symptoms: [
      `Localized skin changes consistent with ${formattedName}`,
      "Surface texture variation, mild erythema, or focal papular response",
      "Cutaneous sensation such as mild itching, tenderness, or dryness"
    ],
    causes: [
      "Multifactorial cutaneous etiology requiring clinical correlation",
      "Potential environmental, inflammatory, or dermatological factors"
    ],
    precautions: [
      "Keep affected skin clean, dry, and adequately moisturized",
      "Avoid mechanical friction, scratching, or aggressive topical products",
      "Apply broad-spectrum sunscreen (SPF 30+) when exposed to direct sunlight"
    ],
    warningSigns: [
      "Rapid expansion, dark pigmentation change, or irregular borders",
      "Spontaneous bleeding, ulceration, or persistent non-healing erosion",
      "Severe localized pain, expanding redness, or fever"
    ],
    medicalAttention: `Consult a board-certified dermatologist for clinical examination, dermoscopy, and personalized management for ${formattedName}.`,
    summary: `Screening evaluation for ${formattedName}.`
  };
}

export function getNormalSkinInfo(lang: Language): LocalizedDiseaseDetail {
  if (lang === 'ta') {
    return {
      name: "இயல்புநிலை / ஆரோக்கியமான தோல் (Normal / Healthy Skin)",
      subTitle: "ஆரோக்கியமான தோல் அம்சம்",
      category: "இயல்பான தோல் திசு",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "உங்கள் பதிவேற்றிய படம் AI திரையிடல் மாதிரியால் இயல்புநிலை / ஆரோக்கியமான தோலாக வகைப்படுத்தப்பட்டுள்ளது. எந்த நோயியலும் கண்டறியப்படவில்லை.",
      symptoms: [
        "ஆதரவுடைய AI வகுப்புகளில் எந்த நோயியல் தோல் நிலையையும் கண்டறியவில்லை",
        "சாதாரண தோல் நிறம் மற்றும் சீரான மேற்பரப்பு அமைப்பு",
        "செயலில் உள்ள அழற்சி அல்லது வீக்கம் இல்லை"
      ],
      causes: [
        "சாதாரண தோல் திசு கட்டமைப்பு",
        "சீரான நிறமி விநியோகம்"
      ],
      precautions: [
        "சூரிய ஒளியில் இருந்து தோலைப் பாதுகாக்கவும் (SPF 30+)",
        "முறையான சுகாதாரத்தையும் ஈரப்பதத்தையும் பராமரிக்கவும்",
        "புதிய அல்லது மாறும் தோல் புள்ளிகளை தவறாமல் கண்காணிக்கவும்"
      ],
      warningSigns: [
        "திடீரென தோன்றும் அசாதாரண தோல் புள்ளி",
        "விரைவாக மாறும் மச்சம் அல்லது நிறமி",
        "இரத்தப்போக்கு அல்லது தொடர்ந்து அரிப்பு"
      ],
      medicalAttention: "புதிய அல்லது அசாதாரண தோல் மாற்றங்கள் ஏதேனும் ஏற்பட்டால் சான்றளிக்கப்பட்ட தோல் மருத்துவரை அணுகவும்.",
      summary: "இயல்புநிலை ஆரோக்கியமான தோல்."
    };
  } else if (lang === 'hi') {
    return {
      name: "सामान्य / स्वस्थ त्वचा (Normal / Healthy Skin)",
      subTitle: "स्वस्थ त्वचा सुविधा",
      category: "सामान्य त्वचा ऊतक",
      riskLevel: "Low",
      riskColor: "emerald",
      description: "आपकी अपलोड की गई छवि को AI स्क्रीनिंग मॉडल द्वारा सामान्य / स्वस्थ त्वचा के रूप में वर्गीकृत किया गया है। कोई बीमारी नहीं पाई गई।",
      symptoms: [
        "समर्थित एआई वर्गों से कोई त्वचा की बीमारी नहीं पाई गई",
        "सामान्य त्वचा का रंग और एकसमान बनावट",
        "कोई सक्रिय सूजन या लालिमा नहीं"
      ],
      causes: [
        "सामान्य त्वचा ऊतक संरचना",
        "संतुलित रंजकता वितरण"
      ],
      precautions: [
        "अत्यधिक धूप से त्वचा की रक्षा करें (SPF 30+)",
        "उचित स्वच्छता और मॉइस्चराइजेशन बनाए रखें",
        "किसी भी नए या बदलते त्वचा के धब्बों की नियमित निगरानी करें"
      ],
      warningSigns: [
        "अचानक दिखने वाला असामान्य धब्बा",
        "तेजी से बदलता हुआ तिल",
        "रक्तस्राव या लगातार खुजली"
      ],
      medicalAttention: "यदि कोई नई या असामान्य त्वचा परिवर्तन दिखाई दे तो त्वचा विशेषज्ञ से सलाह लें।",
      summary: "सामान्य स्वस्थ त्वचा।"
    };
  }

  return {
    name: "Normal / Healthy Skin",
    subTitle: "Healthy Cutaneous Feature",
    category: "Normal Cutaneous Tissue",
    riskLevel: "Low",
    riskColor: "emerald",
    description: "Your uploaded image was classified as Normal / Healthy Skin by the DermaVision AI neural screening model. No supported disease abnormality was detected.",
    symptoms: [
      "No supported skin condition detected from the AI classifier categories",
      "Normal cutaneous texture and uniform skin surface",
      "No active inflammatory lesion or rapid macular growth"
    ],
    causes: [
      "Normal physiological skin architecture",
      "Healthy melanocyte and epidermal layer distribution"
    ],
    precautions: [
      "Protect skin from excessive UV exposure using broad-spectrum SPF 30+ sunscreen",
      "Maintain appropriate skin hygiene and daily moisturization",
      "Perform regular monthly skin self-examinations"
    ],
    warningSigns: [
      "Newly appearing or rapidly enlarging unusual skin lesion",
      "Mole undergoing ABCDE changes (Asymmetry, Border, Color, Diameter > 6mm, Evolving)",
      "Persistent unexplained bleeding, ulceration, or non-healing sore"
    ],
    medicalAttention: "Consult a qualified dermatologist if any new, changing, or symptomatic lesion develops in the future.",
    summary: "Normal / Healthy Skin detected by AI screening model."
  };
}



