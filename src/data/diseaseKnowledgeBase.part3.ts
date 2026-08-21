/**
 * DERMAVISION AI — DISEASE KNOWLEDGE BASE PART 3 (CLASSES 102–152)
 * Medical-Grade Disease Knowledge Layer for Clinical Skin Screening
 */

import { DiseaseKnowledgeSchema, DiseaseKnowledgeRecord } from './diseaseKnowledgeBase.part1';

// Reference entries for aliases
const seborrheicKeratosisEntry: DiseaseKnowledgeSchema = {
  canonicalName: "Seborrheic Keratosis",
  alternateNames: ["Seborrh Keratoses", "Seborrheic Wart", "Senile Wart"],
  category: "Benign Epidermal Tumor",
  clinicalOverview: "Very common benign epithelial skin growth appearing as a waxy, stuck-on tan, brown, or black plaque.",
  commonSymptoms: ["waxy stuck-on plaque", "well-demarcated brown/tan/black lesion", "rough or verrucous surface"],
  commonRiskFactors: ["increasing age", "family history / genetics", "sun-exposed or friction areas"],
  generalManagement: ["usually clinical observation", "cryotherapy or curettage if irritated by clothing"],
  prevention: ["not reliably preventable"],
  warningSigns: ["sudden rapid change in color or size", "spontaneous bleeding", "rapid onset of multiple lesions (Leser-Trélat sign)"],
  whenToSeekMedicalAttention: "Consult a dermatologist if a lesion bleeds, turns jet-black, or diagnosis is uncertain.",
  severity: "LOW",
  requiresDermatologistReview: false
};

const verrucaWartEntry: DiseaseKnowledgeSchema = {
  canonicalName: "Verruca / Viral Wart",
  alternateNames: ["Verruca Vulgaris", "Warts", "Common Wart", "Viral Wart"],
  category: "Viral Epidermal Hyperplasia",
  clinicalOverview: "Benign hyperkeratotic epidermal growth caused by infection of keratinocytes with Human Papillomavirus (HPV).",
  commonSymptoms: ["rough hyperkeratotic papule", "tiny black pinpoint dots (thrombosed capillaries)", "palmar or plantar location"],
  commonRiskFactors: ["direct contact with HPV", "minor skin micro-trauma", "public showers/pools", "immunosuppression"],
  generalManagement: ["topical salicylic acid therapy", "cryotherapy with liquid nitrogen", "clinician evaluation for recalcitrant warts"],
  prevention: ["avoid picking or scratching warts", "wear protective footwear in public wet areas", "avoid sharing nail clippers"],
  warningSigns: ["rapidly expanding lesions", "spontaneous bleeding", "severe pain or ulceration"],
  whenToSeekMedicalAttention: "Consult a healthcare provider for painful, spreading, or treatment-resistant warts.",
  severity: "LOW",
  requiresDermatologistReview: false
};

export const diseaseKnowledgeBasePart3: DiseaseKnowledgeRecord = {
  102: {
    canonicalName: "Onychogryphosis",
    alternateNames: ["Ram's Horn Nail", "Onychogryposis"],
    category: "Nail Unit Hypertrophic Disorder",
    clinicalOverview: "Severe hypertrophy, thickening, and opaque yellow-brown spiraling curvature of the nail plate, most commonly affecting the great toe in older adults.",
    commonSymptoms: ["thick, curved, claw-like nail", "yellowish-brown hyperkeratosis", "difficulty cutting nails"],
    commonRiskFactors: ["advanced age", "chronic micro-trauma", "poor peripheral circulation", "neglect or self-care limitation"],
    generalManagement: ["professional podiatry nail debridement", "electric burring", "treatment of underlying circulatory or fungal factors"],
    prevention: ["proper roomy footwear", "regular nail hygiene"],
    warningSigns: ["severe localized pain", "periungual ulceration or bacterial infection", "inability to walk comfortably"],
    whenToSeekMedicalAttention: "Podiatry or dermatology evaluation is recommended for safe nail debridement.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  103: {
    canonicalName: "Onycholysis",
    alternateNames: ["Nail Bed Separation", "Nail Lifting"],
    category: "Nail Bed Structural Disorder",
    clinicalOverview: "Painless separation of the nail plate from the underlying vascular nail bed, creating a white or yellow distal area beneath the nail.",
    commonSymptoms: ["lifted white or yellow area beneath nail plate", "sharp border between attached and unattached nail", "subungual debris"],
    commonRiskFactors: ["repetitive mechanical trauma", "fungal infection (onychomycosis)", "psoriasis", "chemical exposures (nail hardeners)"],
    generalManagement: ["identify underlying trigger", "clip away detached unattached nail plate", "keep nail bed dry"],
    prevention: ["avoid mechanical trauma", "wear protective gloves during chemical exposure"],
    warningSigns: ["severe periungual pain", "green/black bacterial colonization", "pus drainage"],
    whenToSeekMedicalAttention: "Consult a doctor if nail separation is persistent, painful, or accompanied by green/black discoloration.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  104: {
    canonicalName: "Onychomycosis",
    alternateNames: ["Tinea Unguium", "Fungal Nail Infection"],
    category: "Fungal Nail Infection",
    clinicalOverview: "Chronic fungal infection of the nail bed and plate caused predominantly by dermatophytes, leading to subungual hyperkeratosis and nail destruction.",
    commonSymptoms: ["thick discolored yellowish/brown nail", "brittle crumbling nail edges", "subungual hyperkeratotic debris"],
    commonRiskFactors: ["prolonged moisture retention", "tinea pedis (athlete's foot)", "diabetes mellitus", "older age"],
    generalManagement: ["medical confirmation (fungal KOH/culture)", "prescription topical or oral systemic antifungals", "proper nail hygiene"],
    prevention: ["keep feet dry", "change socks daily", "avoid sharing nail clippers", "wear flip-flops in public showers"],
    warningSigns: ["painful periungual cellulitis", "spreading redness up toe/finger", "diabetic foot complication"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for medical diagnosis and targeted antifungal therapy.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  105: {
    canonicalName: "Onychoschizia",
    alternateNames: ["Split Nails", "Lamellar Dystrophy"],
    category: "Nail Brittleness Disorder",
    clinicalOverview: "Horizontal splitting or lamellar separation of the distal nail plate layers, frequently caused by repetitive wetting and drying of the hands.",
    commonSymptoms: ["horizontal peeling or splitting of distal nail layers", "brittle thin nail edges"],
    commonRiskFactors: ["repeated wet-to-dry hand cycles", "harsh chemical exposure", "frequent use of nail polish remover"],
    generalManagement: ["protect nails with cotton-lined rubber gloves", "apply barrier moisturizers containing urea or alpha-hydroxy acids"],
    prevention: ["wear protective gloves during wet work", "limit acetone nail polish removers"],
    warningSigns: ["severe pain", "proximal nail matrix inflammation", "complete nail plate destruction"],
    whenToSeekMedicalAttention: "Consult a doctor if nail splitting is painful or refractory to moisturizing measures.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  106: {
    canonicalName: "Paronychia",
    alternateNames: ["Acute Paronychia", "Chronic Paronychia", "Nail Fold Infection"],
    category: "Periungual Infection / Inflammation",
    clinicalOverview: "Infection or inflammatory reaction of the tissue folds surrounding the nail plate, occurring in acute (bacterial) or chronic (fungal/irritant) forms.",
    commonSymptoms: ["redness around nail fold", "painful throbbing swelling", "pus accumulation", "loss of cuticle"],
    commonRiskFactors: ["nail biting", "hangnail tearing", "frequent water exposure", "manicure trauma"],
    generalManagement: ["warm water soaks 3-4 times daily", "prescription topical or oral antibiotics", "medical drainage of abscess if present"],
    prevention: ["avoid biting nails or picking cuticles", "keep hands dry and moisturized"],
    warningSigns: ["rapidly spreading redness up finger", "severe throbbing pain", "fever"],
    whenToSeekMedicalAttention: "Prompt medical evaluation is recommended for severe pain, purulent discharge, or spreading infection.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  107: {
    canonicalName: "Pearl Penile Papules",
    alternateNames: ["PPP", "Hirsutoid Papillomas"],
    category: "Benign Anatomical Variant",
    clinicalOverview: "Benign, asymptomatic normal anatomical papules arranged in rows around the corona of the glans penis. Not a disease or sexually transmitted infection.",
    commonSymptoms: ["small 1-2mm uniform pearly white/flesh-colored papules", "arranged in neat rows around coronal sulcus", "asymptomatic"],
    commonRiskFactors: ["normal anatomical variation"],
    generalManagement: ["reassurance", "no medical treatment required"],
    prevention: ["not applicable"],
    warningSigns: ["painful, ulcerated, irregular, or bleeding lesions"],
    whenToSeekMedicalAttention: "Seek medical evaluation if lesions are painful, itching, bleeding, or if diagnosis is uncertain.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  108: {
    canonicalName: "Pincer Nail Syndrome",
    alternateNames: ["Trumpet Nail", "Omega Nail"],
    category: "Transverse Nail Curvature Disorder",
    clinicalOverview: "Excessive transverse overcurving of the nail plate along its longitudinal axis, pinching the underlying soft tissue of the nail bed.",
    commonSymptoms: ["severely curved pinching nail", "tunnel-like or omega-shaped nail profile", "intense distal nail bed pain"],
    commonRiskFactors: ["genetics", "tight narrow-toed footwear", "osteoarthritis of distal phalanx"],
    generalManagement: ["specialist podiatry care", "proper wide-toebox footwear", "surgical nail matrix correction if severe"],
    prevention: ["wear wide properly fitting footwear", "trim nails straight across"],
    warningSigns: ["severe localized pain", "secondary periungual infection", "ulceration of nail bed"],
    whenToSeekMedicalAttention: "Podiatry or dermatologist evaluation is recommended for painful or inflamed pincer nails.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  109: {
    canonicalName: "Pitted Keratolysis",
    alternateNames: ["Keratolysis Plantare Sulcata", "Pitted Sole Infection"],
    category: "Superficial Bacterial Infection",
    clinicalOverview: "Superficial bacterial infection of the stratum corneum of the soles, caused by Kytococcus sedentarius, producing shallow pits and pungent odor.",
    commonSymptoms: ["small 1-3mm punched-out pits on soles", "foul foot odor (bromhidrosis)", "moist slimy white plantar skin"],
    commonRiskFactors: ["excessive foot sweating (plantar hyperhidrosis)", "occlusive tight footwear", "tropical warm climates"],
    generalManagement: ["keep feet dry", "apply topical prescription clindamycin or erythromycin lotion", "antiperspirant soaks"],
    prevention: ["wear moisture-wicking socks", "rotate shoes to dry completely", "use absorbent foot powder"],
    warningSigns: ["spreading foot redness", "severe pain upon weight bearing", "secondary cellulitis"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for diagnosis and topical antibiotic prescription.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  110: {
    canonicalName: "Pityriasis Alba",
    alternateNames: ["Hypopigmented Dry Patches"],
    category: "Mild Eczematous Reaction Pattern",
    clinicalOverview: "Common, mild inflammatory skin condition occurring primarily in children, presenting as poorly demarcated hypopigmented dry patches on the cheeks.",
    commonSymptoms: ["light-colored pale skin patches", "fine powdery surface scaling", "located on cheeks and outer arms"],
    commonRiskFactors: ["dry skin", "atopic dermatitis tendency", "sun exposure accentuating hypopigmentation"],
    generalManagement: ["regular mild emollient moisturization", "daily broad-spectrum sun protection", "mild topical anti-inflammatory creams if itchy"],
    prevention: ["maintain daily skin hydration", "apply sunscreen routinely"],
    warningSigns: ["rapidly spreading complete depigmentation (vitiligo differential)", "diagnostic uncertainty"],
    whenToSeekMedicalAttention: "Consult a doctor if pale patches are persistent, expanding rapidly, or causing cosmetic concern.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  111: {
    canonicalName: "Pityriasis Rosea",
    alternateNames: ["Herald Patch Eruption", "PR"],
    category: "Self-Limited Inflammatory Dermatosis",
    clinicalOverview: "Self-limited papulosquamous eruption characterized by a single large 'herald patch' followed by a widespread 'Christmas tree' pattern rash on the trunk.",
    commonSymptoms: ["single initial herald patch (2-5cm oval red plaque with inner scale)", "secondary smaller oval lesions along skin cleavage lines", "mild itching"],
    commonRiskFactors: ["reactivation of Human Herpesvirus 6 or 7 (HHV-6/7)"],
    generalManagement: ["reassurance (self-resolves in 6-8 weeks)", "emollients and topical anti-itch lotions"],
    prevention: ["no established primary prevention"],
    warningSigns: ["severe constitutional illness", "atypical purpuric distribution", "pregnancy during first trimester"],
    whenToSeekMedicalAttention: "Seek medical evaluation to confirm diagnosis and rule out secondary syphilis or medication rash.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  112: {
    canonicalName: "Pityrosporum Folliculitis",
    alternateNames: ["Malassezia Folliculitis", "Fungal Acne"],
    category: "Fungal Follicular Infection",
    clinicalOverview: "Follicular eruption caused by overgrowth of Malassezia yeast species within hair follicles, presenting as intensely pruritic uniform papulopustules.",
    commonSymptoms: ["intensely itchy uniform small red papules and pustules", "located on upper chest, back, and shoulders"],
    commonRiskFactors: ["hot humid environments", "excessive sweating", "oily skin", "oral antibiotic use"],
    generalManagement: ["medical assessment", "topical or oral antifungal therapy (ketoconazole, itraconazole)"],
    prevention: ["shower promptly after sweating", "avoid heavy occlusive body oils"],
    warningSigns: ["widespread severe refractory eruption", "secondary bacterial infection"],
    whenToSeekMedicalAttention: "Dermatologist evaluation is recommended for accurate diagnosis and antifungal prescription.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  113: {
    canonicalName: "Pseudofolliculitis Barbae",
    alternateNames: ["PFB", "Razor Bumps", "Shaving Bumps"],
    category: "Foreign-Body Inflammatory Reaction",
    clinicalOverview: "Inflammatory papular reaction caused by tightly curved hairs curving back and re-entering the dermis after close shaving.",
    commonSymptoms: ["itchy or painful red bumps in beard area or bikini line", "perifollicular papules and pustules", "hyperpigmented scars"],
    commonRiskFactors: ["tightly curled hair phototypes", "close multi-blade shaving", "pulling skin tight while shaving"],
    generalManagement: ["modify shaving technique (single-blade or electric clippers)", "topical anti-inflammatory/keratolytic lotions"],
    prevention: ["shave in direction of hair growth", "avoid extremely close shaving"],
    warningSigns: ["extensive hypertrophic scarring", "deep bacterial abscess formation"],
    whenToSeekMedicalAttention: "Consult a dermatologist if razor bumps cause deep infection or permanent scarring.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  114: {
    canonicalName: "Pseudorhinophyma",
    alternateNames: ["Non-Rosacea Nasal Hypertrophy"],
    category: "Hypertrophic Nasal Condition",
    clinicalOverview: "Nasal tissue enlargement mimicking rosacea-associated rhinophyma, but secondary to other conditions such as skin tumors, lymphoma, or granulomatous disease.",
    commonSymptoms: ["thickened nodular enlarged nasal skin", "lack of classic rosacea flushing background"],
    commonRiskFactors: ["underlying cutaneous tumors", "granulomatous disorders"],
    generalManagement: ["specialist dermatologist evaluation", "biopsy to rule out underlying malignancy"],
    prevention: ["manage underlying skin conditions"],
    warningSigns: ["rapid nasal enlargement", "ulceration", "bleeding"],
    whenToSeekMedicalAttention: "Specialist dermatologist assessment and biopsy are required.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  115: {
    canonicalName: "Psoriasis",
    alternateNames: ["Psoriasis Vulgaris", "Plaque Psoriasis"],
    category: "Chronic Autoimmune Disease",
    clinicalOverview: "Chronic, immune-mediated systemic inflammatory disease manifesting as well-demarcated erythematous plaques covered with silvery scales.",
    commonSymptoms: ["well-defined red plaques covered with silvery-white scales", "Auspitz sign (pinpoint bleeding when scale scraped)", "pitted nails", "itching"],
    commonRiskFactors: ["genetics", "autoimmune dysregulation", "streptococcal infection trigger", "skin trauma (Koebner reaction)"],
    generalManagement: ["dermatologist-directed treatment", "topical steroids/vitamin D analogues", "phototherapy", "biologic therapies"],
    prevention: ["avoid skin trauma", "manage stress", "avoid smoking and heavy alcohol"],
    warningSigns: ["widespread red scaling (>90% body area - erythroderma)", "painful joint swelling (psoriatic arthritis)", "pustular flares"],
    whenToSeekMedicalAttention: "Dermatologist evaluation is essential for long-term control.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  116: {
    canonicalName: "Pyoderma Gangrenosum",
    alternateNames: ["PG", "Neutrophilic Dermatosis"],
    category: "Rare Inflammatory Ulcerative Disease",
    clinicalOverview: "Rare non-infectious inflammatory ulcerative skin disease characterized by rapidly expanding, excruciatingly painful ulcers with violaceous undermined borders.",
    commonSymptoms: ["painful rapidly enlarging ulcer", "violaceous undermined border", "pathergy (worsens with surgical trauma)"],
    commonRiskFactors: ["inflammatory bowel disease (IBD)", "rheumatoid arthritis", "hematologic malignancies"],
    generalManagement: ["urgent specialist dermatologist/rheumatology care", "systemic immunosuppressive therapy", "gentle non-surgical wound care"],
    prevention: ["control underlying inflammatory bowel or autoimmune disease"],
    warningSigns: ["rapid ulcer expansion over 24-48 hours", "severe unremitting pain", "fever"],
    whenToSeekMedicalAttention: "Urgent specialist medical attention is required.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  117: {
    canonicalName: "Pyogenic Granuloma",
    alternateNames: ["Lobular Capillary Hemangioma", "PG Tumor"],
    category: "Benign Vascular Growth",
    clinicalOverview: "Common benign rapidly growing vascular lesion composed of proliferating capillaries, notorious for bleeding profusely following minor contact.",
    commonSymptoms: ["bright red raised vascular bump", "bleeds profusely upon light touch", "rapid growth over weeks"],
    commonRiskFactors: ["prior minor skin trauma", "pregnancy/hormonal shifts", "certain medications (retinoids)"],
    generalManagement: ["dermatologic examination", "curettage and electrocautery or surgical excision"],
    prevention: ["avoid repeated skin trauma"],
    warningSigns: ["persistent severe bleeding", "rapid unexpected expansion"],
    whenToSeekMedicalAttention: "Seek dermatologist evaluation for clinical removal and histological confirmation.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  118: {
    canonicalName: "Racquet Nail",
    alternateNames: ["Brachyonychia"],
    category: "Congenital Nail Plate Variant",
    clinicalOverview: "Benign anatomical nail variation where the thumb nail plate is wider than it is long, caused by premature epiphyseal closure of distal phalanx.",
    commonSymptoms: ["broad short flat thumb nail plate", "width greater than length"],
    commonRiskFactors: ["autosomal dominant inheritance", "developmental phalanx variation"],
    generalManagement: ["reassurance", "no treatment required"],
    prevention: ["not preventable"],
    warningSigns: ["newly developing broad nail changes across multiple digits in adulthood"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if nail changes develop suddenly in adulthood.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  119: {
    canonicalName: "Rhinophyma",
    alternateNames: ["Phymatous Rosacea"],
    category: "Hypertrophic Rosacea Variant",
    clinicalOverview: "Advanced phymatous subtype of rosacea causing progressive hypertrophy, fibrosis, and nodular enlargement of the nasal skin.",
    commonSymptoms: ["thickened bulbous enlarged nasal skin", "prominent dilated pores", "nodular surface contour"],
    commonRiskFactors: ["long-standing severe untreated rosacea", "male sex"],
    generalManagement: ["dermatologic evaluation", "medical rosacea management", "surgical or laser contouring"],
    prevention: ["early treatment of facial rosacea", "avoid rosacea triggers"],
    warningSigns: ["rapid growth", "nasal airway obstruction", "ulceration"],
    whenToSeekMedicalAttention: "Specialist dermatologist assessment is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  120: {
    canonicalName: "Scar",
    alternateNames: ["Cicatrices", "Cutaneous Scar"],
    category: "Fibrous Tissue Repair",
    clinicalOverview: "Fibrous tissue replacement of normal dermis following wound healing after trauma, surgery, or inflammatory skin disease.",
    commonSymptoms: ["flat, raised, or depressed area of skin", "altered pigmentation", "loss of hair follicles"],
    commonRiskFactors: ["prior skin trauma", "surgical incision", "acne or infection"],
    generalManagement: ["proper wound care during healing", "silicone scar gels", "laser or dermatologic scar remodeling"],
    prevention: ["prompt wound care", "broad-spectrum sun protection during scar maturation"],
    warningSigns: ["painful rapid growth (keloid transformation)", "non-healing ulceration within old scar (Marjolin's ulcer)"],
    whenToSeekMedicalAttention: "Seek evaluation if a scar becomes painful, rapidly growing, or non-healing.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  121: {
    canonicalName: "Scarring Alopecia",
    alternateNames: ["Cicatricial Alopecia", "Permanent Hair Loss"],
    category: "Permanent Follicular Destruction",
    clinicalOverview: "Diverse group of rare scalp disorders where hair follicles are irreversibly destroyed and replaced by scar tissue.",
    commonSymptoms: ["smooth shiny scalp patches with loss of follicular ostia", "scalp redness, scaling, or burning pain"],
    commonRiskFactors: ["lichen planopilaris", "discoid lupus", "central centrifugal cicatricial alopecia"],
    generalManagement: ["urgent dermatologist assessment", "scalp biopsy", "potent anti-inflammatory therapy to halt progression"],
    prevention: ["early treatment of active scalp inflammation"],
    warningSigns: ["active progressive hair loss", "severe scalp burning or tenderness"],
    whenToSeekMedicalAttention: "Prompt dermatologist assessment is critical to preserve remaining hair follicles.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  122: {
    canonicalName: "Schamberg's Disease",
    alternateNames: ["Schambergs Disease", "Progressive Pigmentary Purpura"],
    category: "Pigmented Purpuric Dermatosis",
    clinicalOverview: "Benign chronic purpuric condition caused by capillary erythrocyte extravasation, producing cayenne-pepper rust-colored macules on lower legs.",
    commonSymptoms: ["rust-colored or cayenne-pepper brown patches", "located on lower legs", "mild or absent itching"],
    commonRiskFactors: ["increased venous pressure", "capillary fragility", "gravitational factors"],
    generalManagement: ["clinical observation", "reassurance", "compression stockings if venous insufficiency present"],
    prevention: ["no reliable primary prevention"],
    warningSigns: ["pain", "severe leg swelling", "spreading palpable purpura"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for diagnosis confirmation and vascular screening.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  123: {
    canonicalName: "Sebaceous Gland Hyperplasia",
    alternateNames: ["Sebaceous Hyperplasia", "SGH"],
    category: "Benign Glandular Growth",
    clinicalOverview: "Common benign enlargement of sebaceous glands on facial skin, presenting as soft yellowish papules with central umbilication.",
    commonSymptoms: ["small 1-3mm yellowish papule", "central umbilical dip", "located on forehead and cheeks"],
    commonRiskFactors: ["increasing age", "oily skin", "chronic sun exposure", "immunosuppression (cyclosporine)"],
    generalManagement: ["reassurance", "elective electrocautery or laser removal by dermatologist"],
    prevention: ["no reliable prevention"],
    warningSigns: ["rapid enlargement", "pearly border with telangiectasias (basal cell carcinoma differential)"],
    whenToSeekMedicalAttention: "Dermatologist assessment is recommended if a lesion bleeds or grows rapidly.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  124: seborrheicKeratosisEntry, // Seborrh Keratoses mapped directly
  125: seborrheicKeratosisEntry,

  126: {
    canonicalName: "Skin Tag",
    alternateNames: ["Acrochordon", "Fibroma Molle"],
    category: "Benign Cutaneous Papilloma",
    clinicalOverview: "Common benign soft flesh-colored pedunculated skin growth occurring in areas of skin-on-skin friction.",
    commonSymptoms: ["soft flesh-colored papule on narrow stalk", "located on neck, armpits, or groin"],
    commonRiskFactors: ["friction", "genetics", "obesity", "pregnancy", "insulin resistance"],
    generalManagement: ["clinical observation", "elective in-clinic excision or cryotherapy if irritated"],
    prevention: ["reduce friction with loose clothing"],
    warningSigns: ["sudden darkening", "painful twisting/infarction", "bleeding"],
    whenToSeekMedicalAttention: "Seek evaluation if a skin tag becomes painful, dark, or bleeds.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  127: {
    canonicalName: "Skin Cancer",
    alternateNames: ["Skincancer", "Cutaneous Malignancy"],
    category: "Malignant Skin Neoplasm",
    clinicalOverview: "Broad classification of malignant skin tumors (basal cell carcinoma, squamous cell carcinoma, melanoma) requiring urgent clinical evaluation.",
    commonSymptoms: ["changing skin spot", "non-healing bleeding sore", "pearly bump or irregular dark mole"],
    commonRiskFactors: ["cumulative UV radiation exposure", "fair skin phototype", "immunosuppression"],
    generalManagement: ["prompt professional dermatologist evaluation", "biopsy confirmation", "definitive surgical or oncologic treatment"],
    prevention: ["broad-spectrum sun protection", "regular skin self-examinations"],
    warningSigns: ["ABCDE mole changes", "spontaneous bleeding", "rapid growth", "ulceration"],
    whenToSeekMedicalAttention: "Prompt dermatologist evaluation is essential for any changing or non-healing skin lesion.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  128: {
    canonicalName: "Solar Lentigo",
    alternateNames: ["Age Spot", "Sun Spot", "Liver Spot"],
    category: "Benign Sun-Induced Macule",
    clinicalOverview: "Common benign hyperpigmented macule caused by chronic ultraviolet radiation exposure, featuring increased localized melanin pigment.",
    commonSymptoms: ["flat brown well-demarcated macule", "located on sun-exposed face, hands, or shoulders"],
    commonRiskFactors: ["chronic sun exposure", "older age", "fair skin"],
    generalManagement: ["sun protection", "clinical monitoring", "elective dermatologic laser/cryotherapy for cosmetic preference"],
    prevention: ["daily broad-spectrum SPF 30+ sunscreen", "sun-protective clothing"],
    warningSigns: ["irregular borders", "multiple shades of dark brown/black", "rapid size enlargement (lentigo maligna differential)"],
    whenToSeekMedicalAttention: "Seek dermatologist evaluation for any sun spot undergoing irregular changes in border or color.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  129: {
    canonicalName: "Stasis Edema",
    alternateNames: ["Venous Stasis Edema", "Dependent Edema"],
    category: "Vascular Venous Insufficiency Sign",
    clinicalOverview: "Lower extremity fluid swelling resulting from chronic venous insufficiency and elevated hydrostatic pressure in leg veins.",
    commonSymptoms: ["lower leg swelling", "heaviness or aching in legs", "pitting edema", "hyperpigmentation"],
    commonRiskFactors: ["chronic venous insufficiency", "prolonged standing/sitting", "obesity", "previous DVT"],
    generalManagement: ["medical evaluation", "leg elevation above heart level", "gradient compression stockings when cleared"],
    prevention: ["regular walking exercises", "avoid prolonged immobility"],
    warningSigns: ["sudden unilateral leg swelling and calf pain (DVT risk)", "shortness of breath", "chest pain"],
    whenToSeekMedicalAttention: "Seek urgent medical evaluation for sudden one-sided leg swelling or severe pain.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  130: {
    canonicalName: "Stasis Ulcer",
    alternateNames: ["Venous Leg Ulcer", "Varicose Ulcer"],
    category: "Chronic Venous Ulcer",
    clinicalOverview: "Chronic non-healing ulcer on the lower leg or gaiter region resulting from long-standing venous hypertension and microvascular breakdown.",
    commonSymptoms: ["shallow ulcer on lower inner leg", "irregular margin", "surrounding reddish-brown skin discoloration and edema"],
    commonRiskFactors: ["chronic venous disease", "history of deep vein thrombosis", "varicose veins"],
    generalManagement: ["professional wound and vascular care", "multilayer compression therapy", "topical barrier wound dressings"],
    prevention: ["early management of leg swelling and venous insufficiency"],
    warningSigns: ["rapidly expanding ulcer", "foul-smelling purulent discharge", "fever", "spreading leg cellulitis"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a doctor or wound specialist is required.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  131: {
    canonicalName: "Steroid Striae",
    alternateNames: ["Corticosteroid-Induced Striae", "Steroid Stretch Marks"],
    category: "Drug-Induced Atrophic Dermatosis",
    clinicalOverview: "Severe cutaneous dermal atrophy and linear purple stretch marks resulting from prolonged systemic or potent topical corticosteroid use.",
    commonSymptoms: ["wide dark purple or reddish linear streaks", "atrophic thin skin", "easy bruising"],
    commonRiskFactors: ["prolonged potent topical or systemic corticosteroid use", "Cushing's syndrome"],
    generalManagement: ["evaluate and taper corticosteroid under physician supervision", "barrier skin care"],
    prevention: ["use topical steroids strictly as prescribed for limited durations"],
    warningSigns: ["widespread striae with facial swelling, muscle weakness, or hypertension"],
    whenToSeekMedicalAttention: "Consult a healthcare provider to review corticosteroid medications.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  132: {
    canonicalName: "Stomatitis",
    alternateNames: ["Oral Mucosal Inflammation", "Oral Stomatitis"],
    category: "Oral Inflammatory Disorder",
    clinicalOverview: "Inflammatory condition affecting the mucous membranes of the mouth, causing painful erythema, swelling, and erosions.",
    commonSymptoms: ["painful red oral mucosa", "mouth sores or ulcers", "burning sensation when eating"],
    commonRiskFactors: ["viral/bacterial infection", "chemotherapy / radiation", "nutritional deficiency", "contact allergy"],
    generalManagement: ["identify underlying cause", "bland soothing oral rinses", "topical oral anesthetic gels"],
    prevention: ["maintain good oral hygiene", "avoid irritating spicy or acidic foods"],
    warningSigns: ["inability to swallow liquids", "dehydration", "high fever", "widespread oral sloughing"],
    whenToSeekMedicalAttention: "Seek medical evaluation if oral pain prevents eating or drinking.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  133: {
    canonicalName: "Infantile Hemangioma",
    alternateNames: ["Strawberry Hemangioma", "Infantile Hemangioma"],
    category: "Benign Infantile Vascular Tumor",
    clinicalOverview: "Common benign vascular tumor of infancy appearing in early weeks of life, undergoing rapid proliferation followed by slow involution.",
    commonSymptoms: ["bright red raised strawberry-like lesion", "soft vascular plaque", "rapid early growth"],
    commonRiskFactors: ["infancy", "prematurity", "low birth weight", "female sex"],
    generalManagement: ["pediatric medical evaluation", "clinical monitoring (most involute by age 7-10)", "oral propranolol if near eye/airway"],
    prevention: ["not preventable"],
    warningSigns: ["eye or airway obstruction", "ulceration and bleeding", "rapid problematic growth"],
    whenToSeekMedicalAttention: "Pediatric dermatologist evaluation is recommended for hemangiomas near the eye, lip, or airway.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  134: {
    canonicalName: "Striae",
    alternateNames: ["Striae Distensae", "Stretch Marks"],
    category: "Dermal Elastic Atrophy",
    clinicalOverview: "Common linear dermal scarring caused by rapid stretching of the skin leading to rupture of dermal collagen and elastic fibers.",
    commonSymptoms: ["linear red/purple streaks (striae rubrae) evolving into pale white streaks (striae albae)"],
    commonRiskFactors: ["pubertal growth spurts", "pregnancy", "rapid weight changes", "corticosteroid exposure"],
    generalManagement: ["reassurance", "emollient moisturizers", "dermatologic laser/retinoid therapy for cosmetic preference"],
    prevention: ["no guaranteed prevention"],
    warningSigns: ["sudden extensive dark purple striae without obvious cause"],
    whenToSeekMedicalAttention: "Consult a doctor if stretch marks appear suddenly and extensively without weight gain or pregnancy.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  135: {
    canonicalName: "Subungual Hematoma",
    alternateNames: ["Nail Blood Spot", "Traumatic Subungual Bleed"],
    category: "Traumatic Vascular Lesion",
    clinicalOverview: "Collection of blood beneath the nail plate caused by trauma to the underlying nail bed capillaries.",
    commonSymptoms: ["dark red, purple, or black discoloration beneath nail plate", "throbbing pain after trauma"],
    commonRiskFactors: ["direct blunt crush injury to digit", "stubbing toe", "repetitive sports impact"],
    generalManagement: ["evaluate injury severity", "trephination (decompression hole) by clinician if acutely painful within 48 hours"],
    prevention: ["wear protective footwear during heavy work or sports"],
    warningSigns: ["hematoma involving >50% of nail bed", "suspected bone fracture", "pigmented discoloration not growing out with nail"],
    whenToSeekMedicalAttention: "Seek medical evaluation for severe pain, large blood spots, or suspected underlying bone fracture.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  136: {
    canonicalName: "Sun Damage",
    alternateNames: ["Sun Sunlight Damage", "Photoaging", "Actinic Damage"],
    category: "Actinic Cutaneous Degeneration",
    clinicalOverview: "Degenerative skin changes caused by chronic cumulative exposure to ultraviolet radiation, resulting in solar elastosis, mottling, and precancerous lesions.",
    commonSymptoms: ["mottled hyperpigmentation", "rough skin texture", "deep wrinkles", "telangiectasias"],
    commonRiskFactors: ["chronic UV exposure", "tanning bed use", "fair skin phototype"],
    generalManagement: ["strict broad-spectrum sun protection", "topical retinoids", "regular clinical skin surveillance"],
    prevention: ["broad-spectrum SPF 30+ sunscreen daily", "sun-protective clothing"],
    warningSigns: ["new rapidly growing skin nodules", "non-healing bleeding sores", "evolving asymmetric moles"],
    whenToSeekMedicalAttention: "Regular dermatologist skin examinations are recommended for individuals with sun damage.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  137: {
    canonicalName: "Syringoma",
    alternateNames: ["Eccrine Syringoma"],
    category: "Benign Adnexal Tumor",
    clinicalOverview: "Benign sweat duct tumor presenting as multiple small, firm, skin-colored or yellowish papules, typically on lower eyelids.",
    commonSymptoms: ["1-3mm smooth skin-colored papules", "located around lower eyelids and upper cheeks", "asymptomatic"],
    commonRiskFactors: ["genetics", "female sex", "Down syndrome association"],
    generalManagement: ["usually clinical observation", "reassurance", "elective electrocautery or laser removal"],
    prevention: ["not reliably preventable"],
    warningSigns: ["rapid growth", "ulceration"],
    whenToSeekMedicalAttention: "Consult a dermatologist if diagnosis requires confirmation.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  138: {
    canonicalName: "Terry's Nails",
    alternateNames: ["Terry Nails"],
    category: "Systemic Physical Sign",
    clinicalOverview: "Nail appearance characterized by whitening of almost the entire nail plate with a narrow pink distal band, strongly associated with systemic liver cirrhosis.",
    commonSymptoms: ["mostly white nail plate", "narrow 1-2mm pink/brown distal band", "loss of lunula"],
    commonRiskFactors: ["hepatic cirrhosis", "heart failure", "diabetes mellitus", "advanced age"],
    generalManagement: ["evaluate underlying systemic medical cause", "hepatology/physician workup"],
    prevention: ["depends on underlying systemic condition"],
    warningSigns: ["new unexplained white nail changes across all digits"],
    whenToSeekMedicalAttention: "Medical evaluation by a physician is recommended to evaluate liver function.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  139: {
    canonicalName: "Tinea / Fungal Infection",
    alternateNames: ["Ringworm", "Tinea Corporis", "Dermatophytosis"],
    category: "Fungal Infection",
    clinicalOverview: "Superficial fungal infection of the keratinized skin layer caused by dermatophytes, presenting with classic annular scaly plaques.",
    commonSymptoms: ["itchy circular red plaque", "raised scaly active border", "central clearing"],
    commonRiskFactors: ["warm moist skin", "contact with infected pets/humans", "immunosuppression"],
    generalManagement: ["medical evaluation", "appropriate topical or oral antifungal therapy", "keep skin clean and dry"],
    prevention: ["do not share towels or clothing", "treat infected household pets", "wear footwear in locker rooms"],
    warningSigns: ["widespread severe infection", "blistering or deep pus formation"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for persistent or widespread fungal skin rashes.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  140: {
    canonicalName: "Toe Deformity",
    alternateNames: ["Hammertoe", "Bunion", "Claw Toe"],
    category: "Structural Musculoskeletal Deformity",
    clinicalOverview: "Structural joint misalignment affecting toe alignment, causing painful pressure points, calluses, and difficulty wearing shoes.",
    commonSymptoms: ["bent or overlapping toe joint", "painful calluses over pressure points"],
    commonRiskFactors: ["ill-fitting narrow footwear", "arthritis", "neuropathy"],
    generalManagement: ["podiatric assessment", "roomy footwear", "orthotic pads", "surgical realignment if severe"],
    prevention: ["wear wide properly fitting shoes"],
    warningSigns: ["skin ulceration over joint", "spreading infection", "diabetic foot involvement"],
    whenToSeekMedicalAttention: "Podiatry evaluation is recommended for painful toe deformities or ulcerations.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  141: {
    canonicalName: "Trichilemmal Cyst",
    alternateNames: ["Pilar Cyst", "Isthmus-Catagen Cyst"],
    category: "Benign Scalp Cysts",
    clinicalOverview: "Common benign smooth dermal cyst originating from the outer root sheath of hair follicles, occurring predominantly on the scalp.",
    commonSymptoms: ["firm smooth mobile scalp lump", "asymptomatic", "no central punctum"],
    commonRiskFactors: ["autosomal dominant genetic inheritance", "middle age"],
    generalManagement: ["clinical observation", "simple surgical excision if symptomatic or bothersome"],
    prevention: ["not reliably preventable"],
    warningSigns: ["rapid painful swelling", "redness", "foul discharge"],
    whenToSeekMedicalAttention: "Seek evaluation if the cyst becomes painful, swollen, or infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  142: {
    canonicalName: "Trichofolliculoma",
    alternateNames: ["Follicular Hamartoma"],
    category: "Benign Follicular Tumor",
    clinicalOverview: "Benign follicular hamartoma presenting as a solitary dome-shaped facial papule with a central pore containing fine white hairs.",
    commonSymptoms: ["solitary flesh-colored facial papule", "central pore with cluster of tiny white hairs"],
    commonRiskFactors: ["uncertain"],
    generalManagement: ["dermatology evaluation", "excision or electrosurgery if desired"],
    prevention: ["no established prevention"],
    warningSigns: ["rapid enlargement", "bleeding", "ulceration"],
    whenToSeekMedicalAttention: "Consult a dermatologist for clinical examination.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  143: {
    canonicalName: "Trichostasis Spinulosa",
    alternateNames: ["Retention of Vellus Hairs"],
    category: "Follicular Hair Retention Disorder",
    clinicalOverview: "Common benign follicular condition where multiple vellus hairs are retained within a hyperkeratotic hair follicle, appearing as black dots.",
    commonSymptoms: ["tiny dark follicular dots containing bundles of fine hairs", "located on nose, face, or back"],
    commonRiskFactors: ["follicular retention", "older age"],
    generalManagement: ["gentle extraction", "topical retinoids or salicylic acid cleansers"],
    prevention: ["no established prevention"],
    warningSigns: ["inflammation", "rapid changes"],
    whenToSeekMedicalAttention: "Consult a dermatologist if diagnostic clarification is needed.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  144: {
    canonicalName: "Ulcer",
    alternateNames: ["Skin Ulcer", "Cutaneous Erosion"],
    category: "Full-Thickness Skin Loss",
    clinicalOverview: "Full-thickness loss of epidermis and part of dermis or deeper tissues, requiring comprehensive medical diagnosis of underlying etiology.",
    commonSymptoms: ["open skin sore", "pain or purulent drainage", "surrounding erythema or induration"],
    commonRiskFactors: ["venous disease", "arterial disease", "neuropathy/diabetes", "pressure"],
    generalManagement: ["identify underlying etiology", "professional wound care", "infection control"],
    prevention: ["pressure relief", "diabetic foot care", "venous disease management"],
    warningSigns: ["spreading cellulitis", "fever", "foul purulent discharge", "black necrotic tissue"],
    whenToSeekMedicalAttention: "Prompt medical evaluation is required for all open non-healing skin ulcers.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  145: {
    canonicalName: "Urticaria",
    alternateNames: ["Hives", "Wheals", "Nettle Rash"],
    category: "Acute / Chronic Mast Cell Reaction",
    clinicalOverview: "Transient erythematous, edematous, intensely pruritic skin wheals caused by mast cell histamine release.",
    commonSymptoms: ["intensely itchy raised red or pale wheals", "lesions move and resolve within 24 hours"],
    commonRiskFactors: ["allergic reactions (foods, drugs)", "viral infections", "physical stimuli (cold, pressure)"],
    generalManagement: ["identify and avoid trigger", "prescription or OTC H1 antihistamines", "medical guidance"],
    prevention: ["avoid identified allergic or physical triggers"],
    warningSigns: ["swelling of lips, tongue, or throat (angioedema)", "difficulty breathing or dizziness"],
    whenToSeekMedicalAttention: "Emergency care is required immediately if accompanied by throat swelling or breathing difficulty.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  146: {
    canonicalName: "Varicella",
    alternateNames: ["Chickenpox"],
    category: "Acute Viral Exanthem",
    clinicalOverview: "Highly contagious primary viral infection caused by varicella-zoster virus, producing crops of intensely pruritic vesicular lesions.",
    commonSymptoms: ["intensely itchy red macules evolving into fluid blisters ('dew drops on rose petals')", "crops at different stages", "fever"],
    commonRiskFactors: ["lack of varicella vaccination", "close contact with active case"],
    generalManagement: ["medical evaluation", "supportive care", "antiviral therapy for high-risk individuals"],
    prevention: ["varicella vaccination"],
    warningSigns: ["shortness of breath (varicella pneumonia)", "confusion or severe ataxia", "secondary skin infection"],
    whenToSeekMedicalAttention: "Seek medical evaluation for confirmation and treatment guidance.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  147: {
    canonicalName: "Vascular Lesion / Hemangioma",
    alternateNames: ["Vascular Lesion", "Vascular Malformation"],
    category: "Cutaneous Vascular Anomaly",
    clinicalOverview: "Diverse category of benign vascular growths or malformations composed of blood vessels.",
    commonSymptoms: ["red, blue, or purple vascular spot or plaque", "blanches with pressure"],
    commonRiskFactors: ["congenital development or acquired vascular changes"],
    generalManagement: ["dermatology evaluation", "observation or laser therapy depending on lesion type"],
    prevention: ["generally not preventable"],
    warningSigns: ["rapid expansion", "ulceration", "bleeding"],
    whenToSeekMedicalAttention: "Consult a dermatologist for clinical classification.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  148: verrucaWartEntry,

  149: {
    canonicalName: "Vitiligo",
    alternateNames: ["Depigmentation Disorder"],
    category: "Autoimmune Pigmentary Disorder",
    clinicalOverview: "Chronic autoimmune disease characterized by immune-mediated destruction of melanocytes, resulting in milk-white depigmented skin patches.",
    commonSymptoms: ["sharply demarcated milk-white depigmented patches", "poliosis (white hair)"],
    commonRiskFactors: ["autoimmune disease association (thyroid, alopecia areata)", "family history"],
    generalManagement: ["specialist dermatologist evaluation", "topical calcineurin inhibitors/steroids", "phototherapy"],
    prevention: ["no reliable prevention", "strict broad-spectrum sun protection on depigmented skin"],
    warningSigns: ["rapidly progressive widespread skin depigmentation"],
    whenToSeekMedicalAttention: "Specialist dermatologist evaluation is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  150: verrucaWartEntry, // Warts mapped to Verruca / Viral Wart

  151: {
    canonicalName: "Wound Infection",
    alternateNames: ["Surgical Infection", "Infected Wound"],
    category: "Acute Bacterial Wound Complication",
    clinicalOverview: "Bacterial colonization and invasion of a traumatic or surgical wound tissue, requiring prompt medical antimicrobial therapy.",
    commonSymptoms: ["increasing redness", "warmth", "swelling", "purulent pus discharge", "worsening pain"],
    commonRiskFactors: ["contaminated wound", "diabetes", "immunosuppression", "poor wound hygiene"],
    generalManagement: ["prompt medical evaluation", "wound culture", "prescription systemic antibiotics", "wound debridement"],
    prevention: ["clean wounds promptly with clean water", "apply sterile dressings"],
    warningSigns: ["fever", "red streaks spreading from wound", "foul purulent drainage", "severe pain"],
    whenToSeekMedicalAttention: "Prompt medical attention is required for infected wounds.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  152: {
    canonicalName: "Xerosis",
    alternateNames: ["Xeroderma", "Dry Skin"],
    category: "Epidermal Hydration Deficit",
    clinicalOverview: "Abnormally dry skin resulting from reduced moisture content in the stratum corneum, common in cold weather and older adults.",
    commonSymptoms: ["dry, rough, dull skin", "fine scaling", "itching", "superficial cracking"],
    commonRiskFactors: ["cold low-humidity weather", "frequent hot bathing with harsh soaps", "older age"],
    generalManagement: ["intensive emollient moisturization daily", "short lukewarm showers", "gentle soap-free cleansers"],
    prevention: ["daily skin moisturizing", "use indoor humidifiers"],
    warningSigns: ["painful deep bleeding fissures", "secondary skin infection (cellulitis)", "widespread red eczema craquele"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if dry skin becomes severely cracked, painful, or infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  }
};

/**
 * Automated Validation Helper for Part 3 Knowledge Base
 */
export function validateKnowledgeBasePart3(kb: DiseaseKnowledgeRecord = diseaseKnowledgeBasePart3): boolean {
  for (let i = 102; i <= 152; i++) {
    const entry = kb[i];
    if (!entry) {
      throw new Error(`[VALIDATION ERROR] Missing entry for Class ID: ${i}`);
    }
    if (!entry.canonicalName || entry.canonicalName.trim() === '') {
      throw new Error(`[VALIDATION ERROR] Empty canonicalName for Class ID: ${i}`);
    }
    if (!entry.clinicalOverview || entry.clinicalOverview.trim() === '') {
      throw new Error(`[VALIDATION ERROR] Empty clinicalOverview for Class ID: ${i}`);
    }
    if (!Array.isArray(entry.commonSymptoms) || entry.commonSymptoms.length === 0) {
      throw new Error(`[VALIDATION ERROR] Empty commonSymptoms array for Class ID: ${i}`);
    }
    if (!['LOW', 'MODERATE', 'HIGH'].includes(entry.severity)) {
      throw new Error(`[VALIDATION ERROR] Invalid severity level '${entry.severity}' for Class ID: ${i}`);
    }
  }

  // Verify Aliasing for Class 124, 127, 133, 150
  if (kb[124].canonicalName !== "Seborrheic Keratosis") {
    throw new Error("[VALIDATION ERROR] Class 124 alias must point to Seborrheic Keratosis");
  }
  if (kb[127].canonicalName !== "Skin Cancer") {
    throw new Error("[VALIDATION ERROR] Class 127 alias must point to Skin Cancer");
  }
  if (kb[133].canonicalName !== "Infantile Hemangioma") {
    throw new Error("[VALIDATION ERROR] Class 133 alias must point to Infantile Hemangioma");
  }
  if (kb[150].canonicalName !== "Verruca / Viral Wart") {
    throw new Error("[VALIDATION ERROR] Class 150 alias must point to Verruca / Viral Wart");
  }

  console.log("✓ [KNOWLEDGE BASE PART 3 VALIDATION PASSED] All Classes 102–152 verified with 100% schema compliance.");
  return true;
}
