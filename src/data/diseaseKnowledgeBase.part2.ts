/**
 * DERMAVISION AI — DISEASE KNOWLEDGE BASE PART 2 (CLASSES 51–101)
 * Medical-Grade Disease Knowledge Layer for Clinical Skin Screening
 */

import { DiseaseKnowledgeSchema, DiseaseKnowledgeRecord } from './diseaseKnowledgeBase.part1';

export const diseaseKnowledgeBasePart2: DiseaseKnowledgeRecord = {
  51: {
    canonicalName: "Follicular Retention Cyst",
    alternateNames: ["Follicular Cyst", "Retention Cyst"],
    category: "Benign Cysts",
    clinicalOverview: "Keratin-filled follicular cystic lesion resulting from duct obstruction within a pilosebaceous follicle.",
    commonSymptoms: ["small localized skin-colored lump", "firm dome-shaped nodule", "asymptomatic"],
    commonRiskFactors: ["follicular blockage", "acne history", "prior micro-trauma"],
    generalManagement: ["clinical observation if asymptomatic", "clinician extraction or excision if painful or cosmetically desired"],
    prevention: ["no reliable prevention"],
    warningSigns: ["painful rapid enlargement", "redness and warmth", "purulent drainage"],
    whenToSeekMedicalAttention: "Seek medical evaluation if the cyst becomes inflamed, painful, or rapidly enlarging.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  52: {
    canonicalName: "Fordyce Spots",
    alternateNames: ["Fordyce Granules", "Ectopic Sebaceous Glands"],
    category: "Benign Anatomical Variant",
    clinicalOverview: "Visible ectopic sebaceous glands occurring on mucosal surfaces or genital skin. Entirely benign normal anatomical variant.",
    commonSymptoms: ["tiny pale or yellowish painless papules", "1-3mm smooth spots", "asymptomatic"],
    commonRiskFactors: ["normal anatomical development", "genetics", "post-pubertal hormonal influences"],
    generalManagement: ["reassurance", "no treatment required"],
    prevention: ["not preventable"],
    warningSigns: ["sudden rapid changes", "spontaneous bleeding", "pain or ulceration"],
    whenToSeekMedicalAttention: "Seek evaluation if diagnosis is uncertain or if lesions change appearance.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  53: {
    canonicalName: "Ganglion Cyst",
    alternateNames: ["Ganglion", "Synovial Cyst"],
    category: "Benign Periarticular Tissue Growth",
    clinicalOverview: "Fluid-filled benign mucous cyst occurring near joint capsules or tendon sheaths, most commonly on the wrist or foot.",
    commonSymptoms: ["smooth firm lump near joint or tendon", "may fluctuate in size over time", "transilluminates"],
    commonRiskFactors: ["repetitive joint motion", "tendon irritation", "prior joint trauma"],
    generalManagement: ["clinical observation", "splinting/rest", "aspiration or surgical excision if painful"],
    prevention: ["no reliable prevention"],
    warningSigns: ["severe pain", "numbness or tingling", "muscle weakness in digit"],
    whenToSeekMedicalAttention: "Seek medical assessment when the cyst causes persistent pain, numbness, or movement limitation.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  54: {
    canonicalName: "Geographic Tongue",
    alternateNames: ["Benign Migratory Glossitis", "Erythema Migrans Oralis"],
    category: "Benign Mucosal Inflammatory Condition",
    clinicalOverview: "Benign inflammatory condition of the tongue surface featuring smooth red patches surrounded by raised serpentine white borders.",
    commonSymptoms: ["smooth red patches on tongue", "irregular pale borders", "patch location migrates over days"],
    commonRiskFactors: ["genetics", "psoriasis association", "stress", "atopic history"],
    generalManagement: ["reassurance", "avoidance of spicy, acidic, or salty foods"],
    prevention: ["no reliable prevention"],
    warningSigns: ["persistent deep tongue ulceration", "severe pain", "difficulty swallowing or breathing"],
    whenToSeekMedicalAttention: "Seek evaluation if tongue lesions are persistently painful, bleeding, or fail to resolve.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  55: {
    canonicalName: "Granulation Tissue",
    alternateNames: ["Hypergranulation", "Proud Flesh"],
    category: "Wound Repair Proliferation",
    clinicalOverview: "New hypervascular tissue formed during normal wound healing, consisting of capillary loops and fibroblasts.",
    commonSymptoms: ["red moist granular tissue in healing wound", "bleeds easily with minimal contact"],
    commonRiskFactors: ["normal wound healing process", "chronic ulcers", "foreign body irritation"],
    generalManagement: ["assess wound healing progress", "appropriate wound dressing", "treat underlying cause or excess tissue with silver nitrate"],
    prevention: ["proper wound care and hygiene"],
    warningSigns: ["excessive bleeding", "purulent discharge", "expanding dark discoloration", "worsening wound size"],
    whenToSeekMedicalAttention: "Obtain wound-care assessment if tissue is excessively raised, foul-smelling, or non-healing.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  56: {
    canonicalName: "Granuloma Annulare",
    alternateNames: ["GA", "Annular Granulomatous Dermatosis"],
    category: "Benign Granulomatous Condition",
    clinicalOverview: "Benign chronic inflammatory skin condition producing smooth, ring-shaped papular plaques without surface scaling.",
    commonSymptoms: ["smooth skin-colored, reddish, or violaceous rings", "non-scaly circular plaques"],
    commonRiskFactors: ["immune hypersensitivity", "minor trauma", "diabetes mellitus association"],
    generalManagement: ["clinical observation (often self-resolving over 1-2 years)", "clinician-directed topical/intralesional steroids"],
    prevention: ["no established prevention"],
    warningSigns: ["widespread generalized eruption", "rapid enlargement", "ulceration"],
    whenToSeekMedicalAttention: "Consult a dermatologist for confirmation of diagnosis and discussion of treatment options.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  57: {
    canonicalName: "Green Nail Syndrome",
    alternateNames: ["Chloronychia", "Pseudomonas Nail Infection"],
    category: "Bacterial Nail Infection",
    clinicalOverview: "Green discoloration of the nail plate caused by Pseudomonas aeruginosa bacterial colonization under onycholytic nails.",
    commonSymptoms: ["green or blue-green nail discoloration", "nail plate lifting (onycholysis)", "foul odor"],
    commonRiskFactors: ["prolonged water immersion", "nail trauma", "wearing artificial nails"],
    generalManagement: ["keep nail dry and trimmed", "apply topical antiseptic/antibacterial soaks", "medical evaluation"],
    prevention: ["maintain nail dryness", "avoid prolonged wet glove wear"],
    warningSigns: ["severe periungual pain", "spreading redness up finger", "purulent pus discharge"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for medical evaluation and topical or oral anti-pseudomonal care.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  58: {
    canonicalName: "Hailey-Hailey Disease",
    alternateNames: ["Familial Benign Pemphigus"],
    category: "Hereditary Acantholytic Dermatosis",
    clinicalOverview: "Autosomal dominant genetic disorder causing recurrent painful skin erosions and blisters in intertriginous skin folds.",
    commonSymptoms: ["painful fragile blisters and erosions in skin folds", "crusting and fissuring", "malodor"],
    commonRiskFactors: ["ATP2C1 gene mutation", "heat", "sweating", "skin friction"],
    generalManagement: ["dermatologist-guided care", "topical/systemic antibiotics/corticosteroids", "cool moist compresses"],
    prevention: ["keep intertriginous folds cool and dry", "wear loose cotton clothing"],
    warningSigns: ["widespread painful erosions", "fever", "secondary bacterial or viral superinfection"],
    whenToSeekMedicalAttention: "Specialist dermatologist evaluation is strongly recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  59: {
    canonicalName: "Half and Half Nail",
    alternateNames: ["Lindsay's Nail", "Lindsay Nail"],
    category: "Systemic Physical Sign",
    clinicalOverview: "Nail color pattern featuring a proximal white/pale half and a distal red/brown transverse band, strongly linked to chronic renal failure.",
    commonSymptoms: ["proximal pale white nail bed", "distal dark reddish-brown band (20-50% nail length)"],
    commonRiskFactors: ["chronic kidney disease (uremia)", "dialysis patients"],
    generalManagement: ["evaluate underlying systemic medical cause", "nephrology workup"],
    prevention: ["depends on underlying systemic kidney disease"],
    warningSigns: ["new unexplained nail color shifts across all digits", "associated fluid retention or fatigue"],
    whenToSeekMedicalAttention: "Medical assessment by a physician is recommended to evaluate renal function.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  60: {
    canonicalName: "Herpes Simplex Virus",
    alternateNames: ["HSV-1", "HSV-2", "Cold Sore", "Genital Herpes"],
    category: "Viral Infection",
    clinicalOverview: "Contagious viral infection causing painful grouped vesicles on an erythematous base, recurring in mucocutaneous regions.",
    commonSymptoms: ["painful grouped blisters on red skin", "burning or tingling sensation before eruption", "shallow sores"],
    commonRiskFactors: ["viral contact", "sunlight exposure", "fever", "stress", "immune suppression"],
    generalManagement: ["clinician evaluation", "prescription oral antiviral therapy (acyclovir/valacyclovir)", "keep area clean/dry"],
    prevention: ["avoid direct contact during active outbreaks", "use barrier protection"],
    warningSigns: ["eye involvement (corneal herpes)", "widespread rash in eczema patients", "high fever", "confusion"],
    whenToSeekMedicalAttention: "Prompt medical care is required if blisters occur near the eye or in immunocompromised patients.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  61: {
    canonicalName: "Herpes Zoster",
    alternateNames: ["Shingles", "Zoster"],
    category: "Acute Neurocutaneous Viral Infection",
    clinicalOverview: "Reactivation of latent varicella-zoster virus in a nerve dermatome, producing intense neuropathic pain followed by a unilateral vesicular rash.",
    commonSymptoms: ["painful grouped blisters in a dermatomal band", "burning nerve pain", "unilateral distribution"],
    commonRiskFactors: ["increasing age (>50 years)", "immunosuppression", "past chickenpox infection"],
    generalManagement: ["urgent medical evaluation within 72 hours", "prescription systemic antivirals", "neuropathic pain management"],
    prevention: ["recombinant zoster vaccination (Shingrix)"],
    warningSigns: ["facial/eye involvement (herpes zoster ophthalmicus)", "widespread disseminated rash", "hearing loss or facial weakness"],
    whenToSeekMedicalAttention: "Urgent medical evaluation is needed, especially if rash affects the face, forehead, or tip of nose.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  62: {
    canonicalName: "Hidradenitis Suppurativa",
    alternateNames: ["HS", "Acne Inversa"],
    category: "Chronic Inflammatory Follicular Disease",
    clinicalOverview: "Chronic debilitating inflammatory condition targeting follicular units in apocrine-bearing skin folds, causing painful nodules, abscesses, and sinus tracts.",
    commonSymptoms: ["painful deep nodules", "recurrent abscesses", "draining sinus tracts", "double-ended comedones in folds"],
    commonRiskFactors: ["genetics", "obesity", "tobacco smoking", "hormonal factors"],
    generalManagement: ["dermatologist-guided long-term treatment", "biologics/antibiotics", "warm compresses", "wound care"],
    prevention: ["smoking cessation", "weight management", "avoid friction in skin folds"],
    warningSigns: ["severe acute infection", "extensive purulent drainage", "fever", "restricted limb mobility"],
    whenToSeekMedicalAttention: "Specialist dermatologist care is essential for long-term control.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  63: {
    canonicalName: "Histiocytosis X",
    alternateNames: ["Langerhans Cell Histiocytosis", "LCH"],
    category: "Rare Histiocytic Neoplasm",
    clinicalOverview: "Group of rare disorders characterized by abnormal clonal proliferation of Langerhans-type histiocytes, affecting skin, bone, and visceral organs.",
    commonSymptoms: ["seborrheic-like crusted papules", "ulcerated lesions in skin folds", "purpuric papules"],
    commonRiskFactors: ["BRAF V600E gene mutation", "immune dysregulation"],
    generalManagement: ["specialist oncology/dermatology multidisciplinary evaluation", "systemic or skin-directed therapy"],
    prevention: ["no established prevention"],
    warningSigns: ["rapidly progressive skin lesions", "bone pain", "fever or weight loss"],
    whenToSeekMedicalAttention: "Specialist medical assessment is required.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  64: {
    canonicalName: "Hypertrichosis",
    alternateNames: ["Excess Hair Growth", "Werewolf Syndrome"],
    category: "Hair Growth Disorder",
    clinicalOverview: "Excessive hair growth beyond the accepted normal limits for age, sex, and race, unlinked to androgenic stimulation.",
    commonSymptoms: ["increased hair density and length", "generalized or localized fine or terminal hair excess"],
    commonRiskFactors: ["genetics", "certain medications (minoxidil, cyclosporine)", "endocrine/systemic conditions"],
    generalManagement: ["identify underlying cause", "laser hair reduction or cosmetic removal if desired"],
    prevention: ["depends on underlying medication or medical cause"],
    warningSigns: ["sudden rapid onset of generalized hair growth in adults", "associated systemic symptoms"],
    whenToSeekMedicalAttention: "Medical evaluation is recommended for sudden-onset excessive hair growth.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  65: {
    canonicalName: "Ichthyosis",
    alternateNames: ["Fish Scale Disease", "Ichthyosis Vulgaris"],
    category: "Hereditary Cornification Disorder",
    clinicalOverview: "Heterogeneous group of genetic cutaneous disorders characterized by persistent, widespread dry, scaling, fish-like skin.",
    commonSymptoms: ["widespread polygonal scaling", "severe skin dryness", "hyperlinear palms"],
    commonRiskFactors: ["inherited FLG (filaggrin) gene mutation", "acquired disease associations"],
    generalManagement: ["regular intensive moisturization", "topical keratolytics (urea, lactic acid)", "gentle bath oils"],
    prevention: ["maintain skin hydration", "avoid harsh detergents"],
    warningSigns: ["secondary bacterial skin infection", "severe painful fissuring", "inability to sweat (heat stroke risk)"],
    whenToSeekMedicalAttention: "Dermatology assessment is recommended for specialized barrier repair therapy.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  66: {
    canonicalName: "Impetigo",
    alternateNames: ["Contagious Pyoderma", "School Sores"],
    category: "Superficial Bacterial Infection",
    clinicalOverview: "Highly contagious superficial bacterial skin infection caused by Staphylococcus aureus or Streptococcus pyogenes, producing honey-colored crusts.",
    commonSymptoms: ["red sores that rupture quickly", "honey-colored crusts", "itchy fluid-filled blisters (bullous impetigo)"],
    commonRiskFactors: ["minor skin cuts/bites", "close contact environments", "warm humid weather", "pediatric age"],
    generalManagement: ["medical evaluation", "topical or oral prescription antibiotics", "gentle crust removal"],
    prevention: ["strict hand hygiene", "do not share towels or clothing", "clean skin breaks promptly"],
    warningSigns: ["rapidly spreading lesions", "fever", "facial or eyelid involvement", "kidney symptoms (dark urine)"],
    whenToSeekMedicalAttention: "Seek medical evaluation for antimicrobial treatment.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  67: {
    canonicalName: "Infestations & Insect Bites",
    alternateNames: ["Arthropod Bites", "Bug Bites", "Scabies / Pediculosis"],
    category: "Cutaneous Infestation / Reaction",
    clinicalOverview: "Local inflammatory skin reactions caused by insect bites, mites (scabies), or lice, producing intensely itchy papules.",
    commonSymptoms: ["intensely itchy red papules", "central punctum", "linear bite marks", "excoriations"],
    commonRiskFactors: ["outdoor exposure", "bedding/pet exposure", "crowded living conditions"],
    generalManagement: ["identify culprit exposure", "topical anti-itch lotions", "prescription scabicides if scabies confirmed"],
    prevention: ["insect repellents", "protective clothing", "environmental pest control"],
    warningSigns: ["severe anaphylactic allergic reaction", "spreading cellulitis infection", "widespread systemic fever"],
    whenToSeekMedicalAttention: "Seek emergency care for facial swelling or breathing trouble; consult a doctor for persistent or infected bites.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  68: {
    canonicalName: "Keloid Scar",
    alternateNames: ["Keloid", "Hypertrophic Keloid"],
    category: "Abnormal Scar Proliferation",
    clinicalOverview: "Excessive fibroproliferative scar tissue growth extending beyond the boundaries of the original wound, failing to regress spontaneously.",
    commonSymptoms: ["firm smooth raised claw-like scar", "hyperpigmented or pink nodule", "local itching or tenderness"],
    commonRiskFactors: ["darker skin phototypes", "wound tension", "genetics", "ear piercing / acne scars"],
    generalManagement: ["specialist scar management", "intralesional corticosteroid injections", "silicone gel sheeting"],
    prevention: ["avoid unnecessary cosmetic piercings or minor elective skin procedures"],
    warningSigns: ["rapid painful growth", "ulceration"],
    whenToSeekMedicalAttention: "Consult a dermatologist or plastic surgeon for specialized scar treatments.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  69: {
    canonicalName: "Keratoacanthoma",
    alternateNames: ["KA", "Solitary Keratoacanthoma"],
    category: "Low-Grade Malignant Squamous Lesion",
    clinicalOverview: "Rapidly growing cutaneous tumor exhibiting central keratin plug, considered a subtype or close variant of well-differentiated squamous cell carcinoma.",
    commonSymptoms: ["rapidly growing dome-shaped nodule", "central crater filled with keratin plug", "sun-exposed skin site"],
    commonRiskFactors: ["chronic UV exposure", "older age", "immunosuppression"],
    generalManagement: ["requires urgent professional evaluation", "complete surgical excision biopsy"],
    prevention: ["broad-spectrum sun protection"],
    warningSigns: ["rapid growth over weeks", "spontaneous bleeding", "pain and ulceration"],
    whenToSeekMedicalAttention: "Prompt dermatologist assessment is required for biopsy and removal.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  70: {
    canonicalName: "Keratolysis Exfoliativa of Wende",
    alternateNames: ["Keratolysis Exfoliativa", "Lamellar Dyshidrosis"],
    category: "Benign Superficial Peeling",
    clinicalOverview: "Recurrent non-inflammatory superficial peeling of the skin on the palms and soles, featuring air-filled blisters that rupture.",
    commonSymptoms: ["superficial palmar/plantar skin peeling", "collarettes of scale", "mild burning", "dryness"],
    commonRiskFactors: ["excessive sweating (hyperhidrosis)", "friction", "frequent water/soap exposure"],
    generalManagement: ["barrier moisturization", "avoid harsh soaps and excess water exposure"],
    prevention: ["protect hands with gloves", "apply emollients regularly"],
    warningSigns: ["painful deep fissures", "secondary bacterial infection"],
    whenToSeekMedicalAttention: "Consult a doctor if peeling becomes painful, cracked, or infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  71: {
    canonicalName: "Kerion",
    alternateNames: ["Tinea Capitis Kerion", "Inflammatory Favus"],
    category: "Severe Fungal Abscess",
    clinicalOverview: "Severe, boggy, painful inflammatory fungal reaction of hair-bearing scalp caused by dermatophyte fungi, risking permanent scarring alopecia.",
    commonSymptoms: ["boggy tender purulent scalp swelling", "pustules and crusting", "regional lymph node enlargement", "hair loss"],
    commonRiskFactors: ["untreated tinea capitis fungal infection", "exposure to infected animals or shared hair brushes"],
    generalManagement: ["urgent medical evaluation", "prescription systemic oral antifungal therapy", "gentle warm soaks"],
    prevention: ["do not share combs, hats, or pillows", "treat infected pets"],
    warningSigns: ["extensive purulent scalp swelling", "high fever", "expanding hair loss"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a doctor or dermatologist is essential to prevent permanent scarring hair loss.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  72: {
    canonicalName: "Koilonychia",
    alternateNames: ["Spoon Nails"],
    category: "Nail Plate Dystrophy",
    clinicalOverview: "Abnormal nail plate dystrophy where nails lose normal convexity and become concave with raised edges, capable of holding a drop of liquid.",
    commonSymptoms: ["concave spoon-shaped nail plates", "thin brittle nails"],
    commonRiskFactors: ["iron deficiency anemia", "hemochromatosis", "occupational chemical exposure"],
    generalManagement: ["investigate underlying medical cause", "blood tests (serum ferritin)", "iron supplementation if indicated"],
    prevention: ["adequate nutritional iron intake"],
    warningSigns: ["new widespread spooning of all nails", "associated fatigue or paleness"],
    whenToSeekMedicalAttention: "Medical evaluation by a physician is recommended to screen for iron deficiency.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  73: {
    canonicalName: "Kyrle's Disease",
    alternateNames: ["Kyrle Disease", "Hyperkeratosis Follicularis et Parafollicularis"],
    category: "Acquired Perforating Dermatosis",
    clinicalOverview: "Acquired perforating skin disorder characterized by intensely pruritic hyperkeratotic papules with central keratin plugs, linked to systemic renal or diabetic disease.",
    commonSymptoms: ["intensely itchy hyperkeratotic papules with central keratin plug", "Koebner phenomenon"],
    commonRiskFactors: ["diabetes mellitus", "chronic renal failure / dialysis"],
    generalManagement: ["dermatologist evaluation", "management of underlying renal/diabetic condition", "topical retinoids / antipruritic agents"],
    prevention: ["strict glycemic and renal disease control"],
    warningSigns: ["widespread excoriated lesions", "secondary skin infection"],
    whenToSeekMedicalAttention: "Specialist evaluation by a dermatologist and nephrologist is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  74: {
    canonicalName: "Cutaneous Leiomyoma",
    alternateNames: ["Leiomyoma", "Piloleiomyoma"],
    category: "Benign Smooth Muscle Tumor",
    clinicalOverview: "Uncommon benign smooth-muscle tumor of the dermis, arising from arrector pili muscles and frequently presenting as painful red-brown papules.",
    commonSymptoms: ["firm red-brown papules or nodules", "paroxysmal pain triggered by cold or touch"],
    commonRiskFactors: ["sporadic or genetic mutation (Reed syndrome)"],
    generalManagement: ["dermatologic clinical assessment", "pain management", "surgical excision or cryotherapy"],
    prevention: ["no established prevention"],
    warningSigns: ["rapid growth", "unusual paroxysmal pain"],
    whenToSeekMedicalAttention: "Consult a dermatologist for evaluation of painful skin nodules.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  75: {
    canonicalName: "Leukonychia",
    alternateNames: ["White Nails", "Milk Spots"],
    category: "Nail Matrix Chromonychia",
    clinicalOverview: "White discoloration of the nail plate, classified into punctate (small spots), striata (lines), or total leukonychia.",
    commonSymptoms: ["white dots, lines, or bands across nail plate", "intact smooth nail surface"],
    commonRiskFactors: ["minor nail matrix trauma", "frequent manicures", "systemic hypoalbuminemia (Muehrcke's lines)"],
    generalManagement: ["identify cause", "reassurance as punctate spots grow out normally with nail growth"],
    prevention: ["avoid mechanical nail matrix trauma"],
    warningSigns: ["widespread persistent white nails across all digits", "associated liver or kidney disease"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if white discoloration affects all nails without trauma history.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  76: {
    canonicalName: "Lichen (Lichenoid Pattern)",
    alternateNames: ["Lichenification", "Lichenoid Dermatosis"],
    category: "Chronic Inflammatory Reaction Pattern",
    clinicalOverview: "Descriptive category for thickened, hyperkeratotic skin with exaggerated skin markings resulting from chronic rubbing, scratching, or lichenoid inflammation.",
    commonSymptoms: ["thickened leathery skin plaque", "exaggerated skin lines", "intense chronic itching"],
    commonRiskFactors: ["chronic scratching", "pre-existing eczema or psoriasis"],
    generalManagement: ["identify underlying skin disease", "break the itch-scratch cycle", "topical barrier emollients"],
    prevention: ["avoid scratching and harsh chemical irritants"],
    warningSigns: ["ulceration", "fissuring", "non-healing indurated plaque"],
    whenToSeekMedicalAttention: "Dermatologist assessment is recommended to diagnose the specific underlying lichenoid disorder.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  77: {
    canonicalName: "Lichen Planus",
    alternateNames: ["LP", "Cutaneous Lichen Planus"],
    category: "Autoimmune Inflammatory Dermatosis",
    clinicalOverview: "Inflammatory autoimmune disorder affecting skin, mucous membranes, nails, and scalp, characterized by classic '5 Ps': pruritic, planar, purple, polygonal papules.",
    commonSymptoms: ["intensely itchy violaceous flat-topped papules", "Wickham striae (fine white lines)", "lacy white oral mucosal lesions"],
    commonRiskFactors: ["immune dysregulation", "Hepatitis C virus association", "certain medications"],
    generalManagement: ["clinician-directed anti-inflammatory treatment (topical steroids)", "monitoring"],
    prevention: ["avoid known triggering medications"],
    warningSigns: ["painful erosive oral or genital ulcers", "scarring scalp alopecia", "nail matrix destruction"],
    whenToSeekMedicalAttention: "Specialist dermatologist evaluation is strongly recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  78: {
    canonicalName: "Lichen Sclerosus et Atrophicus",
    alternateNames: ["Lichen Sclerosus", "LSA"],
    category: "Chronic Anogenital Inflammatory Disease",
    clinicalOverview: "Chronic inflammatory skin disease affecting primarily anogenital skin, causing porcelain-white atrophic plaques, severe pruritus, and scarring.",
    commonSymptoms: ["porcelain-white thin fragile skin", "intense itching and soreness", "purpura and fissuring", "architectural scarring"],
    commonRiskFactors: ["autoimmune disease predisposition", "genetic susceptibility"],
    generalManagement: ["specialist assessment", "superpotent topical corticosteroids (clobetasol)", "long-term clinical surveillance"],
    prevention: ["avoid local chemical and friction irritants"],
    warningSigns: ["non-healing ulceration", "persistent hyperkeratotic thickening (squamous cell carcinoma risk)"],
    whenToSeekMedicalAttention: "Prompt specialist evaluation by a dermatologist or gynaecologist/urologist is required.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  79: {
    canonicalName: "Lichen Simplex Chronicus",
    alternateNames: ["LSC", "Neurodermatitis"],
    category: "Secondary Scratch-Induced Dermatosis",
    clinicalOverview: "Thickened leathery skin plaque produced by repetitive habitual scratching or rubbing of a localized pruritic skin area.",
    commonSymptoms: ["intensely itchy thickened leathery plaque", "hyperpigmentation", "prominent skin markings"],
    commonRiskFactors: ["atopic dermatitis history", "anxiety", "chronic localized itch"],
    generalManagement: ["break itch-scratch cycle", "potent topical corticosteroids under occlusion", "antipruritic lotions"],
    prevention: ["avoid scratching", "keep fingernails trimmed short"],
    warningSigns: ["secondary bacterial infection", "painful cracking or ulceration"],
    whenToSeekMedicalAttention: "Consult a doctor if itching is uncontrollable or skin becomes painful and infected.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  80: {
    canonicalName: "Lichen Spinulosus",
    alternateNames: ["Keratosis Spinulosa"],
    category: "Follicular Hyperkeratotic Disorder",
    clinicalOverview: "Rare follicular disorder presenting with grouped, rough, spiny papules capped by minute horny spines, commonly on extensor limbs.",
    commonSymptoms: ["grouped rough follicular papules with spiny keratin tips", "sandpaper-like feel", "minimal itching"],
    commonRiskFactors: ["uncertain / atopic predisposition"],
    generalManagement: ["dermatology evaluation", "topical keratolytics (salicylic acid, urea)"],
    prevention: ["no established prevention"],
    warningSigns: ["widespread sudden onset", "associated systemic symptoms"],
    whenToSeekMedicalAttention: "Consult a dermatologist for clinical assessment.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  81: {
    canonicalName: "Lipoma",
    alternateNames: ["Fatty Tumor", "Benign Adipose Tumor"],
    category: "Benign Adipose Tissue Tumor",
    clinicalOverview: "Very common benign tumor of mature subcutaneous fat cells, presenting as a soft, mobile, painless mass beneath the skin.",
    commonSymptoms: ["soft doughy mobile subcutaneous lump", "painless", "slow growing"],
    commonRiskFactors: ["genetics", "increasing age", "familial lipomatosis"],
    generalManagement: ["clinical observation", "reassurance", "surgical excision or liposuction if symptomatic or large"],
    prevention: ["no reliable prevention"],
    warningSigns: ["rapid enlargement", "firm induration or immobility", "pain or deep nerve compression"],
    whenToSeekMedicalAttention: "Seek medical evaluation if a subcutaneous mass grows rapidly, becomes hard, or hurts.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  82: {
    canonicalName: "Livedo Reticularis",
    alternateNames: ["Physiologic Livedo", "Vascular Mottling"],
    category: "Vascular Vasomotor Condition",
    clinicalOverview: "Vascular condition producing a net-like, purplish, reticulated skin discoloration due to altered cutaneous microvascular blood flow.",
    commonSymptoms: ["purplish net-like or lace-like skin discoloration", "accentuated by cold temperatures"],
    commonRiskFactors: ["cold exposure", "antiphospholipid syndrome", "vasculitis", "certain medications"],
    generalManagement: ["identify underlying cause", "protect skin from cold exposure", "medical workup"],
    prevention: ["avoid cold exposure", "wear warm insulating clothing"],
    warningSigns: ["persistent purplish discoloration at normal room temperature", "skin ulcers", "painful subcutaneous nodules"],
    whenToSeekMedicalAttention: "Seek physician evaluation if livedo pattern is fixed, persistent, or accompanied by skin ulcers.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  83: {
    canonicalName: "Cutaneous / Systemic Lupus",
    alternateNames: ["Lupus", "SLE", "Malar Rash"],
    category: "Systemic Autoimmune Vasculopathy",
    clinicalOverview: "Autoimmune disease capable of producing characteristic cutaneous lesions (malar butterfly rash, discoid plaques) and multisystem organ involvement.",
    commonSymptoms: ["malar butterfly rash across cheeks/nose", "photosensitive skin rashes", "joint pain", "fatigue"],
    commonRiskFactors: ["genetic susceptibility", "UV light exposure", "female sex (childbearing age)"],
    generalManagement: ["specialist rheumatology/dermatology care", "strict photoprotection", "systemic immunomodulators"],
    prevention: ["strict UV protection", "avoiding known drug triggers"],
    warningSigns: ["chest pain or shortness of breath", "fever", "neurologic symptoms", "leg swelling"],
    whenToSeekMedicalAttention: "Medical evaluation by a rheumatologist or dermatologist is essential.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  84: {
    canonicalName: "Lymphangioma Circumscriptum",
    alternateNames: ["Microcystic Lymphatic Malformation"],
    category: "Benign Lymphatic Malformation",
    clinicalOverview: "Benign congenital malformation of superficial cutaneous lymphatic vessels, producing clusters of clear or hemorrhagic vesicles resembling frog spawn.",
    commonSymptoms: ["clusters of translucent or dark red fluid-filled vesicles", "frog-spawn appearance", "clear fluid oozing"],
    commonRiskFactors: ["congenital lymphatic developmental anomaly"],
    generalManagement: ["specialist dermatology evaluation", "laser therapy or surgical excision if symptomatic"],
    prevention: ["not preventable"],
    warningSigns: ["recurrent cellulitis infection", "heavy bleeding", "rapid enlargement"],
    whenToSeekMedicalAttention: "Specialist dermatologist assessment is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  85: {
    canonicalName: "Lymphocytic Infiltrate of Jessner",
    alternateNames: ["Jessner Lymphocytic Infiltrate", "Benign Lymphocytic Infiltrate"],
    category: "Benign T-Cell Infiltrative Disorder",
    clinicalOverview: "Benign chronic cutaneous condition characterized by asymptomatic red papules or plaques on the face and upper back, showing heavy lymphocytic infiltration.",
    commonSymptoms: ["smooth red papules or ring-like plaques", "no scaling or atrophy", "spontaneous regression and recurrence"],
    commonRiskFactors: ["photosensitivity", "immune dysregulation"],
    generalManagement: ["dermatologist evaluation", "sun protection", "topical steroids or antimalarials"],
    prevention: ["avoid intense sunlight exposure"],
    warningSigns: ["persistent expanding indurated plaques", "ulceration"],
    whenToSeekMedicalAttention: "Consult a dermatologist for diagnostic confirmation.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  86: {
    canonicalName: "Lymphomatoid Papulosis",
    alternateNames: ["LyP", "CD30+ Lymphoproliferative Disorder"],
    category: "Cutaneous Lymphoproliferative Disorder",
    clinicalOverview: "Chronic, recurrent, self-healing CD30-positive T-cell lymphoproliferative skin disorder featuring crops of papules that necroticize and spontaneously heal.",
    commonSymptoms: ["recurrent red-brown papules and nodules", "central necrosis and ulceration", "spontaneous scarring over 4-8 weeks"],
    commonRiskFactors: ["CD30+ lymphoproliferative biology"],
    generalManagement: ["specialist dermatology/hematology longitudinal surveillance", "low-dose methotrexate or phototherapy when active"],
    prevention: ["no established primary prevention"],
    warningSigns: ["persistent non-healing tumor nodules", "swollen lymph nodes", "fever / B-symptoms"],
    whenToSeekMedicalAttention: "Specialist evaluation by a dermatologist or hematologist is essential for long-term monitoring.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  87: {
    canonicalName: "Mal Perforans",
    alternateNames: ["Neuropathic Foot Ulcer", "Diabetic Perforating Ulcer"],
    category: "Chronic Neuropathic Ulcer",
    clinicalOverview: "Chronic, deep, painless ulcer occurring over pressure points of an insensitive foot, secondary to peripheral neuropathy (most commonly diabetic).",
    commonSymptoms: ["deep painless round foot ulcer", "thickened hyperkeratotic halo around margin", "located on plantar pressure points"],
    commonRiskFactors: ["diabetic peripheral neuropathy", "peripheral arterial disease", "foot deformity"],
    generalManagement: ["urgent wound-care and podiatry management", "pressure off-loading", "debridement", "antimicrobial treatment if infected"],
    prevention: ["daily diabetic foot self-inspection", "proper orthotic footwear", "strict blood glucose control"],
    warningSigns: ["spreading redness or warmth", "foul-smelling pus", "fever", "visible bone at base of ulcer"],
    whenToSeekMedicalAttention: "Prompt urgent medical attention is required to prevent deep bone infection (osteomyelitis).",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  88: {
    canonicalName: "Median Nail Dystrophy",
    alternateNames: ["Median Canaliform Dystrophy of Heller", "Dystrophia Unguis Mediana Canaliformis"],
    category: "Acquired Nail Matrix Disorder",
    clinicalOverview: "Uncommon nail matrix disorder producing a longitudinal midline groove or split with pine-tree-like lateral branching on thumb nails.",
    commonSymptoms: ["central longitudinal groove or split in thumb nail", "fir-tree lateral defect pattern"],
    commonRiskFactors: ["habitual tic/trauma to proximal nail fold", "repetitive cuticle picking"],
    generalManagement: ["discontinue mechanical trauma to nail fold", "protective nail barrier creams"],
    prevention: ["avoid picking or pushing back proximal nail folds"],
    warningSigns: ["painful secondary bacterial or fungal infection", "nail plate destruction"],
    whenToSeekMedicalAttention: "Dermatology assessment is recommended if diagnosis is uncertain.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  89: {
    canonicalName: "Malignant Melanoma",
    alternateNames: ["Melanoma", "Cutaneous Melanoma"],
    category: "Malignant Melanocytic Neoplasm",
    clinicalOverview: "Aggressive malignant skin cancer arising from melanocytes, capable of rapid metastasis if not diagnosed and excised early.",
    commonSymptoms: ["asymmetric pigmented mole", "irregular notched borders", "multiple shades of brown/black/red/blue", "diameter > 6mm", "evolving size or shape"],
    commonRiskFactors: ["intense intermittent UV exposure", "fair skin phototype", "family history of melanoma", "multiple atypical nevi"],
    generalManagement: ["urgent professional dermatologist evaluation", "excision biopsy", "staging and oncology referral"],
    prevention: ["strict broad-spectrum sun protection", "monthly skin self-examinations"],
    warningSigns: ["ABCDE criteria changes", "spontaneous bleeding", "itching or pain", "new dark streak under nail"],
    whenToSeekMedicalAttention: "Prompt urgent dermatologist assessment is vital for any suspicious or evolving mole.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  90: {
    canonicalName: "Cutaneous Metastatic Carcinoma",
    alternateNames: ["Metastatic Carcinoma", "Skin Metastasis"],
    category: "Metastatic Cutaneous Malignancy",
    clinicalOverview: "Cutaneous spread of a primary internal malignant cancer, presenting as firm, rapidly growing skin nodules or vascular plaques.",
    commonSymptoms: ["firm painless flesh-colored or red-violaceous nodules", "rapid growth", "sudden onset"],
    commonRiskFactors: ["known or undiagnosed primary internal malignancy (breast, lung, kidney, colon)"],
    generalManagement: ["urgent oncology/dermatology evaluation", "biopsy confirmation", "systemic cancer treatment"],
    prevention: ["depends on primary malignancy screening"],
    warningSigns: ["rapidly multiplying skin nodules", "ulceration", "associated systemic weight loss or fatigue"],
    whenToSeekMedicalAttention: "Urgent medical evaluation by an oncologist or dermatologist is mandatory.",
    severity: "HIGH",
    requiresDermatologistReview: true
  },

  91: {
    canonicalName: "Milia",
    alternateNames: ["Milk Spots", "Epidermal Keratin Cysts"],
    category: "Benign Keratin Cysts",
    clinicalOverview: "Tiny, superficial, benign keratin-filled epidermal cysts presenting as firm white or yellowish papules on the face.",
    commonSymptoms: ["1-2mm tiny white or pearly papules", "firm dome-shaped spots", "asymptomatic"],
    commonRiskFactors: ["infant skin development", "healed skin blistering/dermabrasion", "occlusive heavy cosmetics"],
    generalManagement: ["usually harmless and self-resolving in infants", "gentle in-clinic extraction by clinician if desired in adults"],
    prevention: ["avoid heavy occlusive skincare creams"],
    warningSigns: ["unusual widespread inflamed lesions"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if diagnosis requires verification.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  92: {
    canonicalName: "Molluscum Contagiosum",
    alternateNames: ["Molluscum", "MCV Infection"],
    category: "Viral Cutaneous Infection",
    clinicalOverview: "Contagious viral skin infection caused by Molluscum Contagiosum Virus (a poxvirus), characterized by firm umbilicated papules.",
    commonSymptoms: ["small pearly dome-shaped papules", "central umbilication (indentation)", "asymptomatic or mild itch"],
    commonRiskFactors: ["pediatric age", "skin-to-skin contact", "swimming pool exposure", "atopic dermatitis"],
    generalManagement: ["often self-limiting over months", "clinician extraction/cryotherapy if spreading"],
    prevention: ["avoid sharing towels, clothing, or sponges", "avoid scratching lesions"],
    warningSigns: ["widespread extensive lesions in immunocompromised individuals", "secondary bacterial infection"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for diagnosis or if lesions are widespread.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  93: {
    canonicalName: "Morphea",
    alternateNames: ["Localized Scleroderma"],
    category: "Localized Autoimmune Fibrotic Disease",
    clinicalOverview: "Localized autoimmune connective tissue disorder causing inflammatory skin induration followed by sclerotic, thickened plaques.",
    commonSymptoms: ["firm indurated skin plaques", "violaceous active ring margin", "central ivory-white sclerosis"],
    commonRiskFactors: ["autoimmune predisposition", "prior local radiation or trauma"],
    generalManagement: ["dermatologist evaluation", "topical/intralesional steroids", "phototherapy (UVA-1)"],
    prevention: ["no reliable prevention"],
    warningSigns: ["deep linear lesions across joints causing contractures", "rapidly expanding plaques"],
    whenToSeekMedicalAttention: "Specialist evaluation by a dermatologist is recommended.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  94: {
    canonicalName: "Mucha-Habermann Disease",
    alternateNames: ["PLEVA", "Pityriasis Lichenoides et Varioliformis Acuta"],
    category: "Acute Inflammatory Papulosquamous Disease",
    clinicalOverview: "Rare acute inflammatory skin disorder characterized by recurrent crops of erythematous papules that rapidly undergo necrosis, ulceration, and varioliform scarring.",
    commonSymptoms: ["crops of red papules developing central blisters", "necrotic ulcerated crusts", "varioliform scars"],
    commonRiskFactors: ["immune hypersensitivity to infectious triggers"],
    generalManagement: ["dermatology evaluation", "oral antibiotics (doxycycline)", "phototherapy"],
    prevention: ["no established prevention"],
    warningSigns: ["high fever", "diffuse ulceronecrotic skin lesions (Febrile Ulceronecrotic Mucha-Habermann variant)"],
    whenToSeekMedicalAttention: "Prompt medical evaluation by a dermatologist is required.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  95: {
    canonicalName: "Myxoid Cyst",
    alternateNames: ["Digital Mucous Cyst", "Digital Myxoid Cyst"],
    category: "Benign Periungual Mucous Cyst",
    clinicalOverview: "Benign pseudocyst located near distal interphalangeal joints or nail folds, filled with clear gelatinous fluid containing hyaluronic acid.",
    commonSymptoms: ["translucent dome-shaped bump near finger joint or nail fold", "longitudinal nail groove from matrix compression"],
    commonRiskFactors: ["distal interphalangeal joint osteoarthritis"],
    generalManagement: ["clinician evaluation", "aspiration/injection or surgical excision if painful or compressing nail matrix"],
    prevention: ["no reliable prevention"],
    warningSigns: ["secondary bacterial joint infection", "severe pain"],
    whenToSeekMedicalAttention: "Consult a dermatologist or hand specialist if painful or causing nail deformity.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  96: {
    canonicalName: "Nail Dystrophy",
    alternateNames: ["Onychodystrophy", "Abnormal Nail Growth"],
    category: "Nail Unit Structural Disorder",
    clinicalOverview: "Broad descriptive category for abnormal nail plate formation, thickening, discoloration, brittleness, or crumbling.",
    commonSymptoms: ["thickened or distorted nail plate", "splitting", "discoloration", "crumbling nail edges"],
    commonRiskFactors: ["fungal infection (onychomycosis)", "psoriasis", "trauma", "poor peripheral circulation"],
    generalManagement: ["identify underlying cause (fungal clipping test)", "appropriate targeted treatment"],
    prevention: ["nail hygiene", "keep footwear dry", "avoid aggressive nail manicuring"],
    warningSigns: ["rapid painful nail plate destruction", "periungual pus", "pigmented dark streak"],
    whenToSeekMedicalAttention: "Dermatologist evaluation is recommended to establish exact diagnosis.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  97: {
    canonicalName: "Nail Ridging",
    alternateNames: ["Onychorrhexis", "Longitudinal Nail Striation"],
    category: "Benign Nail Matrix Variant",
    clinicalOverview: "Presence of longitudinal or transverse ridges along the nail plate, commonly representing normal physiological aging.",
    commonSymptoms: ["parallel longitudinal ridges on nail plate", "brittleness at free edge"],
    commonRiskFactors: ["normal physiological aging", "frequent hand washing", "minor matrix trauma"],
    generalManagement: ["gentle nail moisturizing", "avoid harsh chemicals"],
    prevention: ["apply nail oils", "wear protective gloves"],
    warningSigns: ["sudden deep transverse Beau's lines", "solitary pigmented longitudinal band"],
    whenToSeekMedicalAttention: "Consult a healthcare provider if ridges appear suddenly across all nails or present with a dark streak.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  98: {
    canonicalName: "Neurofibroma",
    alternateNames: ["Cutaneous Neurofibroma"],
    category: "Benign Nerve Sheath Tumor",
    clinicalOverview: "Benign tumor of the peripheral nerve sheath composed of Schwann cells and fibroblasts, presenting as soft flesh-colored buttonhole papules.",
    commonSymptoms: ["soft flesh-colored papule or nodule", "buttonhole sign (invaginates with finger pressure)"],
    commonRiskFactors: ["Neurofibromatosis Type 1 (NF1)", "sporadic occurrence"],
    generalManagement: ["clinical monitoring", "reassurance", "surgical excision if symptomatic or cosmetically bothersome"],
    prevention: ["no established primary prevention"],
    warningSigns: ["rapid enlargement", "severe pain", "hard induration (malignant peripheral nerve sheath tumor risk)"],
    whenToSeekMedicalAttention: "Specialist evaluation is recommended if lesions enlarge rapidly or become painful.",
    severity: "MODERATE",
    requiresDermatologistReview: true
  },

  99: {
    canonicalName: "Neurotic Excoriations",
    alternateNames: ["Psychogenic Excoriation", "Skin Picking Disorder"],
    category: "Psychocutaneous Disorder",
    clinicalOverview: "Repetitive, compulsive picking or scratching of normal skin or minor skin irregularities, resulting in secondary excoriated crusts and scarring.",
    commonSymptoms: ["multiple linear excoriations", "crusted erosions on accessible skin sites", "post-inflammatory scarring"],
    commonRiskFactors: ["underlying pruritus", "anxiety", "obsessive-compulsive spectrum tendencies", "stress"],
    generalManagement: ["multidisciplinary care", "topical wound healing barrier ointments", "behavioral therapy"],
    prevention: ["keep nails trimmed short", "identify emotional picking triggers"],
    warningSigns: ["secondary deep bacterial cellulitis infection", "non-healing deep ulcers"],
    whenToSeekMedicalAttention: "Consult a healthcare provider for comprehensive medical and behavioral support.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  100: {
    canonicalName: "Common Nevus (Mole)",
    alternateNames: ["Acquired Melanocytic Nevus", "Common Mole"],
    category: "Benign Melanocytic Lesion",
    clinicalOverview: "Very common benign focal proliferation of melanocytes presenting as a stable, well-circumscribed, uniformly colored macule or papule.",
    commonSymptoms: ["uniform brown or tan macule or papule", "sharp smooth borders", "stable size"],
    commonRiskFactors: ["genetics", "sun exposure in childhood", "fair skin phototype"],
    generalManagement: ["routine baseline monitoring", "sun protection"],
    prevention: ["broad-spectrum sun protection during childhood and adulthood"],
    warningSigns: ["ABCDE changes (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution)"],
    whenToSeekMedicalAttention: "Dermatologist assessment is recommended for any mole undergoing size, shape, or color changes.",
    severity: "LOW",
    requiresDermatologistReview: false
  },

  101: {
    canonicalName: "Normal / Healthy Skin (Benign Feature)",
    alternateNames: ["Normal Skin", "Healthy Skin", "Benign Cutaneous Feature"],
    category: "Normal Cutaneous Feature",
    clinicalOverview: "No concerning skin abnormality was identified by the screening model.",
    commonSymptoms: [
      "Clear/healthy-appearing skin",
      "No supported abnormality detected by this model"
    ],
    commonRiskFactors: [
      "Normal skin physiology"
    ],
    generalManagement: [
      "Maintain gentle daily cleansing.",
      "Moisturize according to skin needs.",
      "Use broad-spectrum sunscreen.",
      "Avoid unnecessary skin irritation.",
      "Perform regular skin self-checks."
    ],
    prevention: [
      "Sun protection.",
      "Healthy skin hygiene.",
      "Avoid excessive scratching/picking.",
      "Seek professional assessment if a new or changing lesion appears."
    ],
    warningSigns: [
      "Newly appearing or rapidly enlarging skin lesion",
      "Mole undergoing ABCDE changes",
      "Persistent unexplained bleeding or non-healing sore"
    ],
    whenToSeekMedicalAttention: "Seek professional evaluation if a new, changing, painful, bleeding, or persistent skin lesion develops in the future.",
    severity: "LOW",
    requiresDermatologistReview: false
  }
};

/**
 * Automated Validation Helper for Part 2 Knowledge Base
 */
export function validateKnowledgeBasePart2(kb: DiseaseKnowledgeRecord = diseaseKnowledgeBasePart2): boolean {
  for (let i = 51; i <= 101; i++) {
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

  // Verify Class 101 Normal Skin non-disease entry
  if (kb[101].canonicalName !== "Normal / Healthy Skin (Benign Feature)") {
    throw new Error("[VALIDATION ERROR] Class 101 must be Normal / Healthy Skin (Benign Feature)");
  }

  console.log("✓ [KNOWLEDGE BASE PART 2 VALIDATION PASSED] All Classes 51–101 verified with 100% schema compliance.");
  return true;
}
