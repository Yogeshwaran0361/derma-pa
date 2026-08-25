/**
 * DERMAVISION AI — DISEASE KNOWLEDGE BASE PART 1 (CLASSES 0–50)
 * Medical-Grade Disease Knowledge Layer for Clinical Skin Screening
 */

// Class 9 Basal Cell Carcinoma Schema (Reference for Alias Class 10 Bcc)
const basalCellCarcinomaEntry = {
  canonicalName: "Basal Cell Carcinoma",
  alternateNames: ["BCC", "Bcc", "Basal Cell Epithelioma"],
  category: "Malignant Skin Lesion",
  clinicalOverview: "Common skin cancer usually related to cumulative UV exposure. It arises from the basal cells of the epidermis and typically grows slowly, but requires definitive medical evaluation.",
  commonSymptoms: ["pearly bump", "persistent sore", "scaly patch", "bleeding lesion"],
  commonRiskFactors: ["cumulative UV exposure", "fair skin", "older age", "previous skin cancer"],
  generalManagement: ["requires professional diagnosis", "dermatologist evaluation", "lesion-directed treatment"],
  prevention: ["broad-spectrum sunscreen", "protective clothing", "avoid peak UV hours", "regular skin surveillance"],
  warningSigns: ["bleeding", "ulceration", "rapid growth", "non-healing sore"],
  whenToSeekMedicalAttention: "Urgent dermatology assessment is recommended for any non-healing, bleeding, or pearly growing skin lesion.",
  severity: "HIGH",
  requiresDermatologistReview: true
};

// Class 35 Drug Eruption Schema (Reference for Alias Class 36 Drugeruption)
const drugEruptionEntry = {
  canonicalName: "Drug Eruption",
  alternateNames: ["Adverse Drug Reaction", "Medication Rash", "Drugeruption"],
  category: "Drug-Induced Dermatosis",
  clinicalOverview: "Skin reaction caused by an ingested, injected, or topically applied medication. Eruptions vary from mild maculopapular rashes to severe cutaneous adverse reactions.",
  commonSymptoms: ["widespread rash", "redness", "itching", "hives or dusky red macules"],
  commonRiskFactors: ["new medications", "recent drug dose changes", "previous drug hypersensitivity history"],
  generalManagement: ["medical assessment to identify responsible medication", "discontinue suspected culprit under medical direction", "supportive skin care"],
  prevention: ["maintain an accurate personal medication/allergy log", "inform healthcare providers of past drug reactions"],
  warningSigns: ["facial swelling", "breathing difficulty", "skin blistering", "mucosal lesions", "fever"],
  whenToSeekMedicalAttention: "Emergency medical evaluation is required if accompanied by facial swelling, mouth/eye sores, skin peeling, or difficulty breathing.",
  severity: "HIGH",
  requiresDermatologistReview: true
};

export const diseaseKnowledgeBasePart1 = {
  0: {
    canonicalName: "Acne & Rosacea",
    alternateNames: ["Acne Vulgaris", "Rosacea", "Facial Erythema"],
    category: "Inflammatory Dermatosis",
    clinicalOverview: "Common inflammatory skin conditions involving acneiform lesions or persistent facial redness and flushing.",
    commonSymptoms: ["pimples", "papules", "pustules", "facial redness", "flushing"],
    commonRiskFactors: ["hormones", "genetics", "oily skin", "heat exposure", "certain cosmetics"],
    generalManagement: ["gentle cleansing", "non-comedogenic skincare products", "avoiding identified personal triggers", "dermatologist treatment when persistent"],
    prevention: ["gentle skin care routines", "avoid picking or squeezing lesions", "identify and avoid rosacea triggers"],
    warningSigns: ["painful deep nodules", "scarring", "rapidly worsening facial inflammation"],
    whenToSeekMedicalAttention: "Consult a dermatologist if lesions are persistent, painful, causing scarring, or unresponsive to over-the-counter care.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  1: {
    canonicalName: "Actinic Keratosis",
    alternateNames: ["Solar Keratosis", "AK"],
    category: "Precancerous Lesion",
    clinicalOverview: "Sun-related precancerous rough skin lesion caused by chronic ultraviolet radiation exposure. May progress to squamous cell carcinoma if untreated.",
    commonSymptoms: ["rough or scaly patches", "crusting", "pink/red or skin-colored rough spots", "sandpaper-like texture"],
    commonRiskFactors: ["cumulative UV exposure", "fair skin", "older age", "immunosuppression"],
    generalManagement: ["dermatology evaluation", "appropriate lesion-directed cryotherapy or topical field treatment"],
    prevention: ["broad-spectrum sunscreen (SPF 30+)", "protective clothing", "shade seeking"],
    warningSigns: ["rapid growth", "bleeding", "ulceration", "persistent thickening or tenderness"],
    whenToSeekMedicalAttention: "Dermatologist evaluation is recommended for diagnostic confirmation and field treatment guidance.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  2: {
    canonicalName: "Alopecia Areata",
    alternateNames: ["Patchy Hair Loss", "Autoimmune Alopecia"],
    category: "Autoimmune Dermatosis",
    clinicalOverview: "Autoimmune condition causing localized hair loss due to immune-mediated attack on hair follicles.",
    commonSymptoms: ["smooth round or oval patches of hair loss", "exclamation-mark hairs at patch margins"],
    commonRiskFactors: ["autoimmune disease history", "family history of alopecia", "genetic susceptibility"],
    generalManagement: ["dermatologist assessment", "treatment depends on extent and patient age"],
    prevention: ["no guaranteed prevention", "manage co-existing autoimmune conditions"],
    warningSigns: ["rapid extensive hair loss", "eyebrow or eyelash involvement", "total scalp hair loss"],
    whenToSeekMedicalAttention: "Seek dermatologist assessment for evaluation and discussion of targeted immunomodulatory options.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  3: {
    canonicalName: "Androgenetic Alopecia",
    alternateNames: ["Pattern Hair Loss", "Male Pattern Baldness", "Female Pattern Hair Loss"],
    category: "Hair & Scalp Disorder",
    clinicalOverview: "Common genetically influenced patterned hair loss driven by androgen sensitivity and follicular miniaturization.",
    commonSymptoms: ["gradual thinning of scalp hair", "widening part line", "receding hairline"],
    commonRiskFactors: ["genetics", "increasing age", "hormonal sensitivity"],
    generalManagement: ["dermatologist evaluation", "evidence-based topical or oral hair-loss treatments"],
    prevention: ["no guaranteed prevention", "early professional clinical assessment"],
    warningSigns: ["sudden patchy hair loss", "scalp redness or scarring", "painful scalp"],
    whenToSeekMedicalAttention: "Seek medical evaluation if hair loss is sudden, rapid, painful, or accompanied by scalp inflammation.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  4: {
    canonicalName: "Angioma",
    alternateNames: ["Cherry Angioma", "Spider Angioma", "Vascular Papule"],
    category: "Benign Vascular Lesion",
    clinicalOverview: "Usually benign blood-vessel growth manifesting as small red or purple vascular papules on the skin.",
    commonSymptoms: ["red or purple papule", "small vascular spot", "blanches or non-blanches with pressure"],
    commonRiskFactors: ["increasing age", "genetics", "pregnancy/hormonal shifts"],
    generalManagement: ["usually clinical observation", "reassurance", "elective cosmetic removal if desired"],
    prevention: ["generally not preventable"],
    warningSigns: ["rapid change in size", "spontaneous bleeding", "irregular dark borders"],
    whenToSeekMedicalAttention: "Seek evaluation if the lesion bleeds frequently, grows rapidly, or changes appearance.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  5: {
    canonicalName: "Angular Cheilitis",
    alternateNames: ["Perleche", "Corner Mouth Cracks"],
    category: "Inflammatory / Infectious Lesion",
    clinicalOverview: "Inflammation and cracking localized to the corners of the mouth, often triggered by moisture retention or secondary yeast infection.",
    commonSymptoms: ["redness", "cracking at lip corners", "soreness", "crusting"],
    commonRiskFactors: ["saliva exposure", "mechanical irritation", "fungal or bacterial overgrowth", "nutritional deficiencies"],
    generalManagement: ["keep mouth corners dry", "apply protective barrier ointments", "medical evaluation for persistent cases"],
    prevention: ["avoid prolonged moisture accumulation", "avoid lip licking", "maintain oral hygiene"],
    warningSigns: ["spreading redness into cheeks", "severe swelling", "fever"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for persistent, painful, or frequently recurring lesions.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  6: {
    canonicalName: "Aphthous Ulcer",
    alternateNames: ["Canker Sore", "Aphthous Stomatitis"],
    category: "Oral Mucosal Lesion",
    clinicalOverview: "Common painful ulcer inside the oral cavity featuring a pale grayish center surrounded by an erythematous halo.",
    commonSymptoms: ["round or oval painful ulcer", "pale center with red border", "local burning before ulceration"],
    commonRiskFactors: ["minor oral trauma", "stress", "nutritional deficiencies", "immune factors"],
    generalManagement: ["protect affected area", "avoid spicy or acidic foods", "topical soothing gels"],
    prevention: ["avoid oral trauma", "maintain oral hygiene", "identify personal dietary triggers"],
    warningSigns: ["unusually large ulcers (>1cm)", "ulcers lasting longer than 14 days", "associated high fever"],
    whenToSeekMedicalAttention: "Seek medical review if ulcers last longer than 2 weeks, recur frequently, or cause severe eating difficulty.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  7: {
    canonicalName: "Apocrine Hydrocystoma",
    alternateNames: ["Apocrine Cystadenoma", "Sweat Gland Cyst"],
    category: "Benign Adnexal Lesion",
    clinicalOverview: "Benign cystic tumor arising from apocrine sweat glands, typically presenting as a translucent bluish papule on the face or eyelids.",
    commonSymptoms: ["smooth translucent or bluish cystic lesion", "slow-growing asymptomatic eyelid or facial lump"],
    commonRiskFactors: ["sweat-gland duct obstruction", "heat exposure"],
    generalManagement: ["usually benign clinical observation", "specialist evaluation if diagnosis is uncertain"],
    prevention: ["generally not preventable"],
    warningSigns: ["rapid growth", "spontaneous bleeding", "vision impairment"],
    whenToSeekMedicalAttention: "Obtain ophthalmology or dermatology evaluation if changing rapidly or impacting vision.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  8: {
    canonicalName: "Balanitis Xerotica Obliterans",
    alternateNames: ["BXO", "Penile Lichen Sclerosus"],
    category: "Chronic Inflammatory Dermatosis",
    clinicalOverview: "Chronic inflammatory condition affecting genital skin, closely associated with lichen sclerosus and characterized by progressive scarring.",
    commonSymptoms: ["whitening of genital skin", "tightness", "irritation", "scarring", "fissuring"],
    commonRiskFactors: ["chronic local inflammation", "autoimmune associations"],
    generalManagement: ["medical examination", "specialist-directed anti-inflammatory therapy", "long-term clinical surveillance"],
    prevention: ["gentle genital hygiene", "avoidance of harsh chemical irritants"],
    warningSigns: ["painful narrowing of meatus", "ulceration", "difficulty urinating"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a urologist or dermatologist is strongly recommended.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  9: basalCellCarcinomaEntry,
  10: basalCellCarcinomaEntry, // Bcc alias mapped directly

  11: {
    canonicalName: "Beau's Lines",
    alternateNames: ["Transverse Nail Grooves", "Beaus Lines"],
    category: "Nail Matrix Disorder",
    clinicalOverview: "Horizontal grooves across nail plates caused by temporary interruption of cell division in the nail matrix during systemic stress or illness.",
    commonSymptoms: ["transverse depressions across nail plates", "ridges affecting multiple nails simultaneously"],
    commonRiskFactors: ["recent severe illness", "physical trauma", "systemic stress", "nutritional deficiencies"],
    generalManagement: ["identify underlying systemic cause", "reassurance as nails grow out over 6–12 months"],
    prevention: ["protect nails from trauma", "promptly address systemic illness"],
    warningSigns: ["repeated unexplained lines across multiple nails", "nail lifting (onycholysis)"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if lines appear recurrently without an obvious past illness or injury.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  12: {
    canonicalName: "Behçet's Syndrome",
    alternateNames: ["Behcet Disease", "Behcets Syndrome", "Oculoorogenital Syndrome"],
    category: "Systemic Autoimmune Vasculitis",
    clinicalOverview: "Systemic inflammatory vasculitis condition causing recurrent oral and genital ulcers along with ocular and skin lesions.",
    commonSymptoms: ["recurrent oral ulcers", "recurrent genital ulcers", "eye inflammation", "erythema nodosum-like skin lesions"],
    commonRiskFactors: ["genetic HLA-B51 association", "immune dysregulation"],
    generalManagement: ["specialist multidisciplinary medical care", "immunosuppressive/anti-inflammatory therapy"],
    prevention: ["no established primary prevention"],
    warningSigns: ["eye pain or vision changes", "severe headache", "joint swelling", "neurologic symptoms"],
    whenToSeekMedicalAttention: "Prompt specialist evaluation by a rheumatologist, ophthalmologist, or dermatologist is essential.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  13: {
    canonicalName: "Blue Nevus",
    alternateNames: ["Dermal Melanocytoma", "Blue Mole"],
    category: "Benign Melanocytic Lesion",
    clinicalOverview: "Usually benign melanocytic lesion located deep within the dermis, giving it a characteristic steel-blue or blue-black appearance.",
    commonSymptoms: ["blue or blue-gray stable papule or nodule", "well-demarcated smooth lesion"],
    commonRiskFactors: ["melanocytic biology", "genetics"],
    generalManagement: ["clinical observation", "dermatologist baseline assessment if newly discovered"],
    prevention: ["sun protection", "routine skin self-monitoring"],
    warningSigns: ["rapid size change", "asymmetry", "irregular margins", "bleeding or ulceration"],
    whenToSeekMedicalAttention: "Seek dermatologist evaluation for any new, rapidly changing, or asymmetric blue skin lesion.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  14: {
    canonicalName: "Bowenoid Papulosis",
    alternateNames: ["Genital Intraepithelial Neoplasia", "HPV-associated Genital Papules"],
    category: "HPV-Related Dysplasia",
    clinicalOverview: "HPV-associated mucosal or genital lesions demonstrating intraepidermal dysplastic changes, typically presenting as reddish-brown papules.",
    commonSymptoms: ["reddish-brown papules or plaques", "genital skin spots", "mild itching"],
    commonRiskFactors: ["high-risk HPV infection", "immunosuppression"],
    generalManagement: ["medical evaluation", "specialist-directed lesion removal or topical therapy", "ongoing clinical surveillance"],
    prevention: ["HPV vaccination", "safer sexual practices"],
    warningSigns: ["ulceration", "rapid growth", "bleeding", "induration"],
    whenToSeekMedicalAttention: "Specialist evaluation by a dermatologist or gynaecologist/urologist is required.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  15: {
    canonicalName: "Bowen's Disease",
    alternateNames: ["Squamous Cell Carcinoma in Situ", "Bowens Disease"],
    category: "Precancerous / In-Situ Carcinoma",
    clinicalOverview: "Squamous cell carcinoma in situ affecting the full thickness of the epidermis. Presents as a persistent scaly patch.",
    commonSymptoms: ["persistent scaly or crusted red plaque", "slowly enlarging rough patch"],
    commonRiskFactors: ["chronic UV exposure", "arsenic exposure", "HPV infection", "immunosuppression"],
    generalManagement: ["professional clinical diagnosis", "lesion-directed therapy (topical field therapy, cryotherapy, or excision)"],
    prevention: ["broad-spectrum sun protection", "regular clinical skin surveillance"],
    warningSigns: ["ulceration", "bleeding", "rapid nodular growth within plaque"],
    whenToSeekMedicalAttention: "Dermatologist evaluation is required for biopsy and definitive lesion treatment.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  16: {
    canonicalName: "Bullous Pemphigoid / Blistering Disorder",
    alternateNames: ["Bullous", "Blistering Skin Condition", "Pemphigoid"],
    category: "Subepidermal Blistering Disease",
    clinicalOverview: "Broad category involving blistering skin disorders characterized by tense fluid-filled blisters, erosions, and cutaneous inflammation.",
    commonSymptoms: ["fluid-filled blisters", "skin erosions", "intense itching", "painful hives-like red patches"],
    commonRiskFactors: ["autoimmune predisposition", "medication triggers", "advanced age"],
    generalManagement: ["requires determination of the specific underlying cause", "specialist anti-inflammatory or immunosuppressive care"],
    prevention: ["avoid known drug triggers", "minimize skin trauma"],
    warningSigns: ["widespread blistering", "mouth/eye mucosal involvement", "fever", "secondary infection"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a dermatologist is required for blistering skin conditions.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  17: {
    canonicalName: "Café au Lait Macule",
    alternateNames: ["Cafe Au Lait Spot", "CALM"],
    category: "Benign Pigmentary Macule",
    clinicalOverview: "Flat, uniformly pigmented light-brown skin patch caused by localized increase in melanin pigment within basal keratinocytes.",
    commonSymptoms: ["flat light-brown macule", "smooth borders", "asymptomatic"],
    commonRiskFactors: ["genetics", "association with Neurofibromatosis Type 1 when multiple"],
    generalManagement: ["usually clinical observation", "count and monitor total number of macules"],
    prevention: ["not generally preventable"],
    warningSigns: ["presence of six or more lesions (>5mm in children or >15mm in adults)", "associated soft tissue lumps"],
    whenToSeekMedicalAttention: "Consult a pediatrician or dermatologist if multiple café au lait spots are present.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  18: {
    canonicalName: "Callus",
    alternateNames: ["Tyloma", "Hyperkeratosis"],
    category: "Mechanical Hyperkeratosis",
    clinicalOverview: "Thickened, hardened area of skin caused by repeated mechanical friction, rubbing, or localized pressure.",
    commonSymptoms: ["hard thick yellowish skin", "usually on hands or feet", "reduced skin sensitivity"],
    commonRiskFactors: ["ill-fitting footwear", "repetitive mechanical activity", "foot deformities"],
    generalManagement: ["reduce local friction and pressure", "apply moisturizing keratolytics (urea cream)", "gentle pumice smoothing"],
    prevention: ["properly fitting footwear", "protective gloves/pads during repetitive work"],
    warningSigns: ["pain", "ulceration", "redness", "diabetic foot involvement"],
    whenToSeekMedicalAttention: "Seek medical evaluation if calluses become painful, cracked, infected, or occur in patients with diabetes.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  19: {
    canonicalName: "Candidiasis",
    alternateNames: ["Cutaneous Candidiasis", "Yeast Infection", "Intertrigo"],
    category: "Fungal Infection",
    clinicalOverview: "Fungal skin infection caused by Candida species, typically thriving in warm, moist skin folds.",
    commonSymptoms: ["bright red rash", "intense itching", "moist raw skin", "satellite red papules or pustules"],
    commonRiskFactors: ["moisture retention", "antibiotic use", "diabetes mellitus", "immunosuppression"],
    generalManagement: ["medical evaluation", "appropriate topical antifungal therapy", "keep skin folds dry"],
    prevention: ["keep susceptible intertriginous areas clean and dry", "wear breathable cotton clothing"],
    warningSigns: ["spreading redness", "severe pain", "fever", "unresponsive to topical care"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for persistent, widespread, or recurring fungal skin infections.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  20: {
    canonicalName: "Cellulitis",
    alternateNames: ["Bacterial Dermitis", "Acute Skin Infection"],
    category: "Acute Bacterial Infection",
    clinicalOverview: "Acute bacterial infection of the deeper dermis and subcutaneous tissues, requiring prompt medical antibiotics to prevent systemic spread.",
    commonSymptoms: ["rapidly spreading redness", "warmth to touch", "swelling", "tenderness or pain"],
    commonRiskFactors: ["skin breaks or wounds", "athlete's foot", "chronic edema", "diabetes"],
    generalManagement: ["requires urgent medical evaluation", "prescription systemic antibiotics", "limb elevation"],
    prevention: ["prompt wound cleansing", "manage chronic leg edema", "treat tinea pedis"],
    warningSigns: ["fever or chills", "red streaks spreading toward heart", "blistering", "confusion"],
    whenToSeekMedicalAttention: "Urgent medical attention (urgent care / ER) is required for suspected cellulitis.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  21: {
    canonicalName: "Chalazion",
    alternateNames: ["Meibomian Cyst", "Eyelid Granuloma"],
    category: "Benign Eyelid Lesion",
    clinicalOverview: "Non-infectious granulomatous swelling of an eyelid oil gland (meibomian gland) caused by duct obstruction.",
    commonSymptoms: ["painless firm eyelid lump", "eyelid heaviness", "mild redness"],
    commonRiskFactors: ["blepharitis", "rosacea", "meibomian gland dysfunction"],
    generalManagement: ["frequent warm compresses", "gentle eyelid hygiene", "ophthalmology evaluation if persistent"],
    prevention: ["routine eyelid margin hygiene"],
    warningSigns: ["vision changes", "severe eye pain", "recurrent resistant eyelid lump"],
    whenToSeekMedicalAttention: "Seek ophthalmology evaluation if the lump impairs vision, causes pain, or persists beyond 4 weeks.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  22: {
    canonicalName: "Clubbing of Fingers",
    alternateNames: ["Digital Clubbing", "Hippocratic Fingers"],
    category: "Systemic Physical Sign",
    clinicalOverview: "Enlargement of the distal fingertips with loss of the normal nail-bed angle, often signaling underlying cardiac, pulmonary, or GI disease.",
    commonSymptoms: ["enlarged bulbous fingertips", "curved convex nails", "spongy softening of nail bed"],
    commonRiskFactors: ["chronic pulmonary disease", "cyanotic heart disease", "inflammatory bowel disease", "malignancy"],
    generalManagement: ["investigate underlying medical cause", "comprehensive physician workup"],
    prevention: ["depends on underlying systemic condition"],
    warningSigns: ["new or rapidly developing digital clubbing", "associated shortness of breath or chest pain"],
    whenToSeekMedicalAttention: "Medical evaluation by a physician is strongly recommended to identify potential underlying internal health conditions.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  23: {
    canonicalName: "Crowe's Sign",
    alternateNames: ["Crowes Sign", "Axillary Freckling"],
    category: "Cutaneous Genetic Marker",
    clinicalOverview: "Characteristic hyperpigmented freckling in the axillary or inguinal folds, strongly associated with Neurofibromatosis Type 1.",
    commonSymptoms: ["freckle-like small brown macules in armpits or groin fold"],
    commonRiskFactors: ["Neurofibromatosis Type 1 (NF1) genetic mutation"],
    generalManagement: ["professional clinical evaluation", "multidisciplinary genetic correlation"],
    prevention: ["depends on underlying genetic condition"],
    warningSigns: ["rapidly changing pigmentation", "multiple skin neurofibromas"],
    whenToSeekMedicalAttention: "Consult a dermatologist or genetic specialist for evaluation of axillary freckling.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  24: {
    canonicalName: "Normal / Healthy Skin",
    alternateNames: ["Normal Skin Features", "Healthy Cutaneous Pattern"],
    category: "Healthy / Normal",
    clinicalOverview: "Your skin scan is consistent with normal, healthy skin without active lesion features.",
    commonSymptoms: ["no unusual skin symptoms", "normal skin texture and pigmentation"],
    commonRiskFactors: ["routine sun exposure", "environmental dryness"],
    generalManagement: ["maintain regular hygiene", "daily broad-spectrum SPF sunscreen", "moisturize daily"],
    prevention: ["sun protection", "gentle cleansing", "adequate hydration"],
    warningSigns: ["new rapidly changing dark spots", "non-healing sores"],
    whenToSeekMedicalAttention: "Routine preventive skin wellness checkups.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  25: {
    canonicalName: "Normal / Healthy Skin",
    alternateNames: ["Normal Skin Features", "Healthy Cutaneous Pattern"],
    category: "Healthy / Normal",
    clinicalOverview: "Your skin scan is consistent with normal, healthy skin without active lesion features.",
    commonSymptoms: ["no unusual skin symptoms", "normal skin texture and pigmentation"],
    commonRiskFactors: ["routine sun exposure", "environmental dryness"],
    generalManagement: ["maintain regular hygiene", "daily broad-spectrum SPF sunscreen", "moisturize daily"],
    prevention: ["sun protection", "gentle cleansing", "adequate hydration"],
    warningSigns: ["new rapidly changing dark spots", "non-healing sores"],
    whenToSeekMedicalAttention: "Routine preventive skin wellness checkups.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  26: {
    canonicalName: "Cutaneous T-Cell Lymphoma",
    alternateNames: ["CTCL", "Mycosis Fungoides", "Sezary Syndrome"],
    category: "Cutaneous Malignancy",
    clinicalOverview: "Group of rare non-Hodgkin lymphomas primarily originating in the skin, progressing slowly from patches to plaques or tumors.",
    commonSymptoms: ["persistent red patches or plaques", "intense refractory itching", "skin scaling or tumor nodules"],
    commonRiskFactors: ["complex immune/genetic factors", "older age"],
    generalManagement: ["specialist oncology/dermatology multidisciplinary care", "skin-directed or systemic therapies"],
    prevention: ["no established primary prevention"],
    warningSigns: ["widespread red skin", "tumor nodules", "swollen lymph nodes"],
    whenToSeekMedicalAttention: "Specialist dermatologist assessment is required for biopsy and staging.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  27: {
    canonicalName: "Cutis Marmorata",
    alternateNames: ["Mottled Skin", "Vascular Mottling"],
    category: "Vascular Vasomotor Response",
    clinicalOverview: "Transient net-like purplish vascular mottling of the skin occurring in response to cold temperatures, typically benign in infants.",
    commonSymptoms: ["temporary lace-like purplish skin mottling", "blanches with pressure"],
    commonRiskFactors: ["cold temperature exposure", "autonomic vascular instability in infants"],
    generalManagement: ["skin rewarming", "clinical observation"],
    prevention: ["avoid excessive cold exposure", "keep infants appropriately bundled"],
    warningSigns: ["persistent mottling at normal room temperature", "associated skin ulcers or poor feeding in infants"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if mottling is persistent, fixed, or accompanied by systemic symptoms.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  28: {
    canonicalName: "Darier-White Disease",
    alternateNames: ["Darier Disease", "Keratosis Follicularis"],
    category: "Hereditary Acantholytic Dermatosis",
    clinicalOverview: "Autosomal dominant genetic skin disorder caused by ATP2A2 mutation, leading to loss of cell adhesion and greasy hyperkeratotic papules.",
    commonSymptoms: ["greasy crusted papules in seborrheic areas", "nail V-shaped nicks", "palmar pits"],
    commonRiskFactors: ["inherited ATP2A2 gene mutation", "heat and friction triggers"],
    generalManagement: ["dermatologist-directed long-term management", "topical retinoids", "antiseptic cleansers"],
    prevention: ["genetic counseling", "avoid excessive heat and sun exposure"],
    warningSigns: ["widespread secondary bacterial/viral herpes infection", "sudden painful flare"],
    whenToSeekMedicalAttention: "Ongoing specialist dermatology care is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  29: {
    canonicalName: "Dermatofibroma",
    alternateNames: ["Benign Fibrous Histiocytoma", "Sclerotic Hemangioma"],
    category: "Benign Dermal Nodule",
    clinicalOverview: "Common benign fibrous nodule in the dermis, often occurring on the lower legs and demonstrating a characteristic button-like dimple sign when pinched.",
    commonSymptoms: ["firm small brown or pink nodule", "dimples inward when pinched at margins"],
    commonRiskFactors: ["prior minor skin trauma", "insect bites"],
    generalManagement: ["usually clinical observation", "reassurance", "surgical excision if symptomatic or cosmetically desired"],
    prevention: ["not reliably preventable"],
    warningSigns: ["rapid growth", "spontaneous bleeding", "pain or color changes"],
    whenToSeekMedicalAttention: "Seek dermatologist evaluation if the lesion changes rapidly or diagnosis is uncertain.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  30: {
    canonicalName: "Dermatosis Papulosa Nigra",
    alternateNames: ["DPN", "Facial Seborrheic Keratoses"],
    category: "Benign Epidermal Growth",
    clinicalOverview: "Benign small dark hyperkeratotic papules occurring primarily on the face and neck of individuals with darker skin phototypes.",
    commonSymptoms: ["multiple small brown or black smooth papules", "asymptomatic facial spots"],
    commonRiskFactors: ["genetics", "darker skin phototypes", "increasing age"],
    generalManagement: ["clinical observation", "elective gentle cosmetic removal by trained dermatologist if desired"],
    prevention: ["not reliably preventable"],
    warningSigns: ["sudden rapid change in size", "irregular borders", "bleeding solitary lesion"],
    whenToSeekMedicalAttention: "Seek evaluation if a lesion changes rapidly or diagnosis requires verification.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  31: {
    canonicalName: "Desquamation",
    alternateNames: ["Skin Peeling", "Epidermal Shedding"],
    category: "Epidermal Barrier Reaction",
    clinicalOverview: "Shedding or peeling of the outermost epidermal layer following inflammation, thermal injury, infection, or drug reactions.",
    commonSymptoms: ["skin peeling", "scaling sheets", "dryness", "underlying tenderness"],
    commonRiskFactors: ["sunburn", "eczema", "viral exanthems", "medication reactions"],
    generalManagement: ["identify underlying cause", "intensive skin moisturization", "gentle barrier creams"],
    prevention: ["protect skin from sunburn", "avoid harsh irritants"],
    warningSigns: ["widespread painful peeling", "fever", "mouth or eye mucosal involvement"],
    whenToSeekMedicalAttention: "Urgent medical evaluation is needed if skin peeling is widespread, painful, or accompanied by fever.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  32: {
    canonicalName: "Digital Fibroma",
    alternateNames: ["Infantile Digital Fibromatosis", "Acral Fibroma"],
    category: "Benign Fibrous Tumor",
    clinicalOverview: "Usually benign fibrous nodular proliferation involving digits of the hands or feet.",
    commonSymptoms: ["firm localized nodule on a finger or toe", "slow growth"],
    commonRiskFactors: ["variable / trauma history"],
    generalManagement: ["clinical evaluation", "observation or specialist surgical management"],
    prevention: ["no established prevention"],
    warningSigns: ["rapid growth", "pain", "functional restriction of digit movement"],
    whenToSeekMedicalAttention: "Consult a dermatologist or hand specialist for assessment.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  33: {
    canonicalName: "Dilated Pore of Winer",
    alternateNames: ["Giant Comedo", "Pore of Winer"],
    category: "Benign Follicular Lesion",
    clinicalOverview: "Solitary enlarged follicular pore filled with keratinaceous material, commonly occurring on the face or trunk of older adults.",
    commonSymptoms: ["solitary large open comedone-like pore", "dark keratin plug"],
    commonRiskFactors: ["follicular obstruction", "older age", "history of severe acne"],
    generalManagement: ["benign observation", "professional dermatologic extraction or excision if desired"],
    prevention: ["routine facial skincare"],
    warningSigns: ["rapid nodular enlargement", "ulceration", "bleeding"],
    whenToSeekMedicalAttention: "Seek evaluation if the lesion becomes inflamed or diagnostic confirmation is needed.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  34: {
    canonicalName: "Discoid Lupus Erythematosus",
    alternateNames: ["DLE", "Cutaneous Lupus"],
    category: "Autoimmune Dermatosis",
    clinicalOverview: "Chronic autoimmune skin disease causing inflammatory red scaly plaques that can lead to scarring, atrophy, and permanent alopecia.",
    commonSymptoms: ["scaly red plaques", "central scarring/atrophy", "pigmentation changes", "scalp hair loss"],
    commonRiskFactors: ["autoimmune disease predisposition", "UV radiation exposure"],
    generalManagement: ["specialist evaluation", "topical/intralesional corticosteroids", "strict sun protection"],
    prevention: ["strict UV protection", "wearing sun-protective hats and clothing"],
    warningSigns: ["expanding scarring plaques", "scalp alopecia progression", "systemic lupus symptoms"],
    whenToSeekMedicalAttention: "Specialist evaluation by a dermatologist or rheumatologist is strongly recommended.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  35: drugEruptionEntry,
  36: drugEruptionEntry, // Drugeruption alias mapped directly

  37: {
    canonicalName: "Eccrine Poroma",
    alternateNames: ["Poroma", "Benign Sweat Gland Tumor"],
    category: "Benign Adnexal Tumor",
    clinicalOverview: "Usually benign skin tumor originating from the terminal ductal cells of eccrine sweat glands, often on palms or soles.",
    commonSymptoms: ["pink or red firm nodule", "sometimes sessile or pedunculated", "bleeding with minor trauma"],
    commonRiskFactors: ["uncertain"],
    generalManagement: ["dermatologic examination", "biopsy or surgical excision to confirm histology"],
    prevention: ["no established prevention"],
    warningSigns: ["rapid enlargement", "ulceration", "spontaneous bleeding"],
    whenToSeekMedicalAttention: "Consult a dermatologist for clinical evaluation and biopsy.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  38: {
    canonicalName: "Eczema & Dermatitis",
    alternateNames: ["Atopic Dermatitis", "Contact Dermatitis", "Eczematous Dermatosis"],
    category: "Inflammatory Skin Disease",
    clinicalOverview: "Common inflammatory skin condition characterized by skin barrier disruption, erythema, scaling, and intense pruritus.",
    commonSymptoms: ["intense itching", "redness", "dry scaly patches", "crusting or weeping when acutely inflamed"],
    commonRiskFactors: ["atopic predisposition", "environmental allergens", "harsh soaps", "skin barrier dysfunction"],
    generalManagement: ["frequent emollient moisturization", "avoidance of harsh soaps and known irritants", "clinician-guided topical anti-inflammatories"],
    prevention: ["gentle skin cleansing", "daily moisturizing", "identifying allergen triggers"],
    warningSigns: ["secondary bacterial infection", "painful honey-colored crusts", "fever", "widespread severe eczema flare"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if symptoms are severe, widespread, infected, or unresponsive to moisturizers.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  39: {
    canonicalName: "Epidermoid Cyst",
    alternateNames: ["Sebaceous Cyst", "Epidermal Inclusion Cyst"],
    category: "Benign Cysts",
    clinicalOverview: "Common benign dermal cyst lined by squamous epithelium and filled with cheesy keratin material.",
    commonSymptoms: ["round skin-colored dome-shaped lump", "central punctum", "foul-smelling keratin discharge if ruptured"],
    commonRiskFactors: ["blocked hair follicle", "prior skin trauma"],
    generalManagement: ["clinical observation if asymptomatic", "surgical excision of cyst wall if desired or recurrently inflamed"],
    prevention: ["not reliably preventable"],
    warningSigns: ["rapid painful swelling", "redness", "warmth", "fever"],
    whenToSeekMedicalAttention: "Seek medical evaluation if the cyst becomes painful, swollen, red, or infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  40: {
    canonicalName: "Epithelioma Adenoides Cysticum",
    alternateNames: ["Trichoepithelioma", "Brooke-Spiegler Syndrome"],
    category: "Benign Follicular Neoplasm",
    clinicalOverview: "Rare benign hair-follicle tumor, often presenting as multiple small skin-colored papules on the central face.",
    commonSymptoms: ["multiple small firm skin-colored facial papules", "slow growth"],
    commonRiskFactors: ["genetic predisposition", "familial Brooke-Spiegler syndrome"],
    generalManagement: ["dermatology clinical assessment", "biopsy for diagnosis confirmation", "cosmetic management"],
    prevention: ["no established primary prevention"],
    warningSigns: ["rapid enlargement", "ulceration"],
    whenToSeekMedicalAttention: "Specialist dermatologist evaluation is recommended.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  41: {
    canonicalName: "Erythema Ab Igne",
    alternateNames: ["Toasted Skin Syndrome", "Heat-Induced Dermatosis"],
    category: "Thermal Skin Reaction",
    clinicalOverview: "Net-like reticulated hyperpigmentation caused by chronic repeated exposure to infrared heat radiation below the threshold for thermal burns.",
    commonSymptoms: ["reticulated reddish-brown hyperpigmented pattern", "mild local burning sensation"],
    commonRiskFactors: ["chronic local heat exposure (heating pads, laptop computers, space heaters)"],
    generalManagement: ["immediately discontinue repeated heat exposure", "clinical monitoring"],
    prevention: ["avoid direct skin contact with prolonged heat sources"],
    warningSigns: ["persistent skin thickening", "ulceration", "precancerous changes in long-standing lesions"],
    whenToSeekMedicalAttention: "Dermatologist assessment is recommended if discoloration persists long after removing heat source.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  42: {
    canonicalName: "Erythema Annulare Centrifugum",
    alternateNames: ["EAC", "Annular Erythema"],
    category: "Reactive Inflammatory Dermatosis",
    clinicalOverview: "Reactive inflammatory skin eruption characterized by slowly spreading annular red rings with a trailing inner edge of scale.",
    commonSymptoms: ["red circular or polycyclic rings", "trailing scale on inner border", "mild itching"],
    commonRiskFactors: ["underlying infections (fungal/bacterial)", "medication exposure", "systemic triggers"],
    generalManagement: ["identify and treat underlying trigger", "clinician-directed topical anti-inflammatory therapy"],
    prevention: ["depends on specific underlying trigger"],
    warningSigns: ["widespread rapid eruption", "associated fever or weight loss"],
    whenToSeekMedicalAttention: "Medical evaluation by a dermatologist is recommended to investigate potential triggers.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  43: {
    canonicalName: "Erythema Craquelé",
    alternateNames: ["Eczema Craquele", "Asteatotic Eczema"],
    category: "Dry Skin Inflammatory Dermatosis",
    clinicalOverview: "Inflammatory skin condition resulting from severe xerosis, presenting with fine polygonal surface fissures resembling cracked porcelain.",
    commonSymptoms: ["polygonal skin fissures", "cracked porcelain appearance", "dryness", "itching or stinging"],
    commonRiskFactors: ["dry cold winter weather", "frequent hot bathing with harsh soaps", "advanced age"],
    generalManagement: ["intensive barrier emollient moisturization", "humidification", "short lukewarm baths"],
    prevention: ["daily moisturization", "avoid harsh soaps and hot water"],
    warningSigns: ["bleeding fissures", "secondary skin infection", "widespread severe redness"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if cracked skin is painful, bleeding, or infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  44: {
    canonicalName: "Erythema Multiforme",
    alternateNames: ["EM Major / Minor", "Target Lesion Eruption"],
    category: "Immune-Mediated Reaction",
    clinicalOverview: "Acute immune-mediated cutaneous eruption characterized by classic target-like (bulls-eye) lesions, often triggered by viral infections.",
    commonSymptoms: ["target-like concentric red rings", "acral distribution (hands/feet)", "sometimes mucosal sores"],
    commonRiskFactors: ["Herpes Simplex Virus (HSV) infection", "Mycoplasma infection", "medications"],
    generalManagement: ["identify underlying infectious or drug trigger", "medical assessment", "supportive care"],
    prevention: ["antiviral prophylaxis for recurrent HSV-associated EM"],
    warningSigns: ["mucosal involvement (mouth/eyes/genitals)", "skin blistering", "fever"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a physician or dermatologist is required.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  45: {
    canonicalName: "Exfoliative Erythroderma",
    alternateNames: ["Erythroderma", "Red Man Syndrome"],
    category: "Severe Dermatologic Emergency",
    clinicalOverview: "Severe widespread inflammatory skin disorder involving over 90% of the body surface with diffuse erythema and desquamation, carrying risk of metabolic crisis.",
    commonSymptoms: ["diffuse bright red skin (>90% surface area)", "widespread scaling", "shivering/thermoregulatory instability", "edema"],
    commonRiskFactors: ["pre-existing psoriasis or eczema flare", "drug reactions", "cutaneous T-cell lymphoma"],
    generalManagement: ["urgent inpatient medical care", "fluid/electrolyte management", "gentle barrier skincare"],
    prevention: ["proper management of primary inflammatory skin conditions"],
    warningSigns: ["fever", "dehydration", "rapid heart rate", "weakness"],
    whenToSeekMedicalAttention: "Urgent emergency medical attention (ER) is required for generalized red skin.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  46: {
    canonicalName: "Favre-Racouchot Syndrome",
    alternateNames: ["Favre Racouchot", "Nodular Elastoidosis"],
    category: "Actinic Degenerative Condition",
    clinicalOverview: "Cutaneous condition caused by severe chronic solar damage, presenting with clusters of open comedones and cysts on actinically damaged facial skin.",
    commonSymptoms: ["clusters of large open comedones around eyes/temples", "yellowish solar elastotic plaques"],
    commonRiskFactors: ["chronic heavy sun exposure", "heavy tobacco smoking"],
    generalManagement: ["sun protection", "smoking cessation", "dermatologic extraction or topical retinoids"],
    prevention: ["broad-spectrum UV protection", "avoid tobacco smoking"],
    warningSigns: ["atypical growing skin nodules within solar damage areas"],
    whenToSeekMedicalAttention: "Dermatologist assessment is recommended if diagnostic clarification is desired.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  47: {
    canonicalName: "Fibroma",
    alternateNames: ["Dermal Fibroma", "Benign Fibromatous Lesion"],
    category: "Benign Connective Tissue Growth",
    clinicalOverview: "Benign connective tissue growth composed of fibrous tissue, occurring anywhere on the body as a firm nodule.",
    commonSymptoms: ["localized firm nodule", "slow growth", "asymptomatic"],
    commonRiskFactors: ["variable depending on anatomical subtype"],
    generalManagement: ["clinical observation", "reassurance", "surgical removal if symptomatic"],
    prevention: ["generally not preventable"],
    warningSigns: ["rapid growth", "ulceration", "bleeding"],
    whenToSeekMedicalAttention: "Seek medical evaluation if a nodule changes rapidly or causes discomfort.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  48: {
    canonicalName: "Fibroma Molle",
    alternateNames: ["Acrochordon", "Skin Tag", "Soft Fibroma"],
    category: "Benign Cutaneous Papilloma",
    clinicalOverview: "Common benign soft flesh-colored pedunculated skin growth, frequently arising in intertriginous areas subject to friction.",
    commonSymptoms: ["soft flesh-colored pedunculated lesion", "stalk-like attachment"],
    commonRiskFactors: ["skin friction", "genetics", "obesity", "pregnancy", "metabolic syndrome"],
    generalManagement: ["usually clinical observation", "elective in-clinic removal by clinician if irritated"],
    prevention: ["reduce friction with loose clothing"],
    warningSigns: ["sudden darkening", "spontaneous painful twisting/necrosis", "bleeding"],
    whenToSeekMedicalAttention: "Seek evaluation if a skin tag becomes painful, dark, or bleeds.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  49: {
    canonicalName: "Fixed Drug Eruption",
    alternateNames: ["FDE", "Fixed Drug Reaction"],
    category: "Localized Drug Reaction",
    clinicalOverview: "Adverse drug reaction characterized by solitary or multiple dusky red lesions that recur at the exact same anatomical skin location upon re-exposure.",
    commonSymptoms: ["sharply demarcated dusky red or violaceous patch", "recurs in exact same spot", "may blister"],
    commonRiskFactors: ["exposure to culprit medications (NSAIDs, antibiotics, anticonvulsants)"],
    generalManagement: ["identify and strictly discontinue suspected medication with clinician guidance"],
    prevention: ["strictly avoid confirmed causative medication in the future"],
    warningSigns: ["blistering", "mucosal involvement", "widespread new lesions"],
    whenToSeekMedicalAttention: "Medical assessment by a doctor is recommended to identify the causative drug.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  50: {
    canonicalName: "Follicular Mucinosis",
    alternateNames: ["Alopecia Mucinosa"],
    category: "Follicular Mucinous Dermatosis",
    clinicalOverview: "Rare cutaneous condition featuring mucin accumulation within hair follicles and sebaceous glands, causing follicular papules and hair loss.",
    commonSymptoms: ["follicular papules or indurated plaques", "localized hair loss in affected patches", "itching"],
    commonRiskFactors: ["primary benign disorder or association with cutaneous T-cell lymphoma"],
    generalManagement: ["dermatologist evaluation", "biopsy assessment", "targeted anti-inflammatory therapy"],
    prevention: ["no established primary prevention"],
    warningSigns: ["widespread expanding plaques", "persistent progressive hair loss"],
    whenToSeekMedicalAttention: "Specialist assessment by a dermatologist is required for diagnostic evaluation.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  }
};
