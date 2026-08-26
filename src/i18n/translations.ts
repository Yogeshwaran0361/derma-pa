export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  nav: {
    home: string;
    dashboard: string;
    scanner: string;
    history: string;
    about: string;
    signIn: string;
    register: string;
    profile: string;
    signOut: string;
    exitDemo: string;
    demoBadge: string;
    doctorHub: string;
    appointments: string;
  };
  home: {
    heroTag: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    registerBtn: string;
    signInBtn: string;
    demoBtn: string;
    demoCardTitle: string;
    demoCardDesc: string;
    demoCardBtn: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  auth: {
    createAccount: string;
    welcomeBack: string;
    joinSub: string;
    signInSub: string;
    fullName: string;
    age: string;
    gender: string;
    genderFemale: string;
    genderMale: string;
    genderOther: string;
    genderPreferNot: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    completeRegister: string;
    signInBtn: string;
    googleAuth: string;
    or: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    createOne: string;
    resetTitle: string;
    resetDesc: string;
    sendResetLink: string;
    newPassword: string;
    confirmNewPassword: string;
    saveNewPassword: string;
    passwordResetSent: string;
    accountNotFound: string;
    clickToRegister: string;
  };
  dashboard: {
    greeting: string;
    sub: string;
    startNewScan: string;
    totalScans: string;
    recentScans: string;
    noScansYet: string;
    noScansSub: string;
    viewReport: string;
    date: string;
    confidence: string;
    riskLevel: string;
  };
  profile: {
    title: string;
    sub: string;
    editProfile: string;
    saveToFirestore: string;
    saving: string;
    fullName: string;
    email: string;
    age: string;
    gender: string;
    preferredLanguage: string;
    authType: string;
    updateSuccess: string;
    updateError: string;
    cancel: string;
  };
  scanner: {
    title: string;
    subtitle: string;
    voiceActive: string;
    voiceGuide: string;
    demoNoticeTitle: string;
    demoNoticeDesc: string;
    loginRequired: string;
    uploadTab: string;
    cameraTab: string;
    dropTitle: string;
    dropSubtitle: string;
    browseFiles: string;
    cameraStart: string;
    cameraCapture: string;
    cameraStop: string;
    cameraError: string;
    analyzing: string;
    qualityChecking: string;
    qualityPassed: string;
    qualityPassedDesc: string;
    analyzeBtn: string;
    retake: string;
  };
  results: {
    title: string;
    subtitle: string;
    topClass: string;
    confidence: string;
    riskBadge: string;
    viewFullReport: string;
    newScan: string;
    savedToHistory: string;
  };
  report: {
    title: string;
    subtitle: string;
    downloadPdf: string;
    printReport: string;
    scanMetadata: string;
    scanId: string;
    scanDate: string;
    modelArchitecture: string;
    imageResolution: string;
    topPrediction: string;
    confidenceScore: string;
    riskClassification: string;
    clinicalInfo: string;
    diseaseDescription: string;
    symptomsTitle: string;
    causesTitle: string;
    precautionsTitle: string;
    warningSignsTitle: string;
    whenToSeekCareTitle: string;
    probabilityDistribution: string;
    medicalDisclaimer: string;
    disclaimerText: string;
    backToDashboard: string;
  };
  history: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    startFirstScan: string;
    scanId: string;
    viewReport: string;
  };
  about: {
    title: string;
    subtitle: string;
    missionTitle: string;
    missionDesc: string;
    modelTitle: string;
    modelDesc: string;
    disclaimerTitle: string;
    disclaimerDesc: string;
  };
  common: {
    loading: string;
    success: string;
    error: string;
    close: string;
    cancel: string;
    save: string;
    demoMode: string;
    highRisk: string;
    moderateRisk: string;
    lowRisk: string;
  };
  call: {
    incomingVideoCall: string;
    incomingVoiceCall: string;
    isCallingYou: string;
    acceptVideo: string;
    acceptVoice: string;
    decline: string;
    mute: string;
    unmute: string;
    cameraOff: string;
    cameraOn: string;
    endCall: string;
    connecting: string;
    connected: string;
    callEndedBy: string;
    cameraDenied: string;
    micDenied: string;
    tryAgain: string;
  };
  doctorPage: {
    portalTag: string;
    title: string;
    sub: string;
    online: string;
    viewProfileBtn: string;
    servicesTab: string;
    specialistTab: string;
    sharedReportsTab: string;
    findSpecialistTitle: string;
    findSpecialistSub: string;
    viewDoctorDetails: string;
    messagesTitle: string;
    messagesSub: string;
    openChatRoom: string;
    sharedReportsTitle: string;
    sharedReportsSub: string;
    viewSharedReports: string;
    bioTitle: string;
    clinicLine: string;
    expYears: string;
    fee: string;
  };
  chatPage: {
    title: string;
    sub: string;
    noConsultationTitle: string;
    noConsultationSub: string;
    startScanBtn: string;
    chatActiveFor: string;
    chatActiveSub: string;
    inputPlaceholder: string;
    sendBtn: string;
    voiceNoteTitle: string;
    voiceNoteFromPatient: string;
    voiceNoteFromDoctor: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      scanner: "Skin Scanner",
      history: "Scan History",
      about: "About AI",
      signIn: "Sign In",
      register: "Register",
      profile: "Profile",
      signOut: "Sign Out",
      exitDemo: "Exit Demo",
      demoBadge: "Demo Mode",
      doctorHub: "Doctor Consultation",
      appointments: "Appointments"
    },
    home: {
      heroTag: "DermaVision AI • ResNet50 Cutaneous Classifier",
      heroTitlePrefix: "Smart AI Skin Screening & ",
      heroTitleHighlight: "Clinical Diagnostic Reports",
      heroSubtitle: "Upload skin lesion photos for instant deep-learning AI analysis, risk categorization, and comprehensive multilingual medical reports.",
      registerBtn: "Register Account",
      signInBtn: "Sign In",
      demoBtn: "Explore Demo Mode",
      demoCardTitle: "Want to explore the project first?",
      demoCardDesc: "Browse the full UI, disease details, and report template in View-Only Demo Mode without registering.",
      demoCardBtn: "Explore Project in Demo Mode",
      feature1Title: "PyTorch ResNet50 AI",
      feature1Desc: "Trained on thousands of dermatologist-verified skin lesion images across 10 clinical categories.",
      feature2Title: "Risk Stratification",
      feature2Desc: "Instant risk assessment categorizing lesions into Low, Moderate, and High clinical risk tiers.",
      feature3Title: "Multilingual Reports",
      feature3Desc: "Full clinical screening reports automatically translated into English, Tamil, and Hindi."
    },
    auth: {
      createAccount: "Create Account",
      welcomeBack: "Welcome Back",
      joinSub: "Join DermaVision AI for private, personalized skin screening reports.",
      signInSub: "Sign in to access your saved AI skin screening reports.",
      fullName: "Full Name",
      age: "Age",
      gender: "Gender",
      genderFemale: "Female",
      genderMale: "Male",
      genderOther: "Other",
      genderPreferNot: "Prefer not to say",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      completeRegister: "Complete Registration",
      signInBtn: "Sign In",
      googleAuth: "Continue with Google",
      or: "OR",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      createOne: "Create Account",
      resetTitle: "Reset & Create Password",
      resetDesc: "Enter your email and your new password. We will trigger the official Firebase Auth password update verification.",
      sendResetLink: "Send Reset Verification",
      newPassword: "Create New Password",
      confirmNewPassword: "Confirm New Password",
      saveNewPassword: "Save New Password",
      passwordResetSent: "Firebase Password Reset email sent! Check your inbox to confirm.",
      accountNotFound: "No account found for this email address or incorrect password.",
      clickToRegister: "Click Here to Register as New User"
    },
    dashboard: {
      greeting: "Welcome back",
      sub: "Here is your real-time Firestore skin screening statistics and scan history.",
      startNewScan: "Start New Skin Scan",
      totalScans: "Total Skin Scans",
      recentScans: "Recent Scan Reports",
      noScansYet: "No Scans Saved Yet",
      noScansSub: "Start your first AI skin scan to generate and save your clinical report.",
      viewReport: "View Diagnostic Report",
      date: "Date",
      confidence: "Confidence",
      riskLevel: "Risk Level"
    },
    profile: {
      title: "User Profile",
      sub: "Manage your real Firestore user account information and language preferences.",
      editProfile: "Edit Profile",
      saveToFirestore: "Save to Firestore",
      saving: "Saving...",
      fullName: "Full Name",
      email: "Email Address",
      age: "Age",
      gender: "Gender",
      preferredLanguage: "Preferred Language",
      authType: "Authentication Type",
      updateSuccess: "Profile updated successfully in Firestore!",
      updateError: "Failed to update profile in Firestore.",
      cancel: "Cancel"
    },
    scanner: {
      title: "AI Skin Lesion Scanner",
      subtitle: "Upload a high-resolution skin photo for instant ResNet50 neural network analysis.",
      voiceActive: "Voice Guide Active",
      voiceGuide: "Listen Voice Guide",
      demoNoticeTitle: "Demo Mode — View Only",
      demoNoticeDesc: "Demo Mode is for exploring UI. Please register or log in to run real AI skin scanning.",
      loginRequired: "Login Required",
      uploadTab: "Upload Image",
      cameraTab: "Take Photo",
      dropTitle: "Drag & drop skin lesion photo here",
      dropSubtitle: "Supports JPG, PNG, WEBP up to 10MB",
      browseFiles: "Browse Image File",
      cameraStart: "Start Camera",
      cameraCapture: "Capture Photo",
      cameraStop: "Stop Camera",
      cameraError: "Camera access denied or unavailable.",
      analyzing: "Analyzing image with trained PyTorch model...",
      qualityChecking: "Checking image resolution, focus, and lighting quality...",
      qualityPassed: "Image Quality Passed",
      qualityPassedDesc: "Clear resolution, focus, and lighting verified.",
      analyzeBtn: "Analyze Skin Lesion Image",
      retake: "Retake / Choose Another"
    },
    results: {
      title: "AI Screening Result",
      subtitle: "PyTorch ResNet50 neural network classification completed.",
      topClass: "Top Classification",
      confidence: "Model Confidence",
      riskBadge: "Risk Stratification",
      viewFullReport: "View Full Diagnostic Report",
      newScan: "Scan Another Image",
      savedToHistory: "Scan record saved to Firestore"
    },
    report: {
      title: "Clinical AI Screening Report",
      subtitle: "Comprehensive disease-specific diagnostic breakdown and general guidance.",
      downloadPdf: "Download PDF Report",
      printReport: "Print Report",
      scanMetadata: "Scan Metadata & Telemetry",
      scanId: "Scan ID",
      scanDate: "Scan Date & Time",
      modelArchitecture: "Model Architecture",
      imageResolution: "Input Resolution",
      topPrediction: "Predicted Lesion Classification",
      confidenceScore: "Confidence Score",
      riskClassification: "Clinical Risk Stratification",
      clinicalInfo: "Clinical Information & Overview",
      diseaseDescription: "Medical Description",
      symptomsTitle: "Common Clinical Symptoms",
      causesTitle: "Causes & Risk Factors",
      precautionsTitle: "Recommended Care & Precautions",
      warningSignsTitle: "Warning Signs & Red Flags",
      whenToSeekCareTitle: "When to Seek Medical Attention",
      probabilityDistribution: "Full Class Probability Distribution",
      medicalDisclaimer: "Medical & AI Disclaimer",
      disclaimerText: "DermaVision AI is an assistive screening tool powered by deep learning. It does not replace professional dermatological examination, biopsy, or clinical diagnosis. Always consult a certified dermatologist for suspicious skin lesions.",
      backToDashboard: "Back to Dashboard"
    },
    history: {
      title: "Skin Scan History",
      subtitle: "Real Firestore scan documents saved to your account.",
      emptyTitle: "No Saved Scans Found",
      emptyDesc: "You haven't run any AI skin scans yet. Your saved diagnostic reports will appear here.",
      startFirstScan: "Start Your First Scan",
      scanId: "Scan ID",
      viewReport: "View Full Report"
    },
    about: {
      title: "About DermaVision AI",
      subtitle: "Empowering dermatological screening with deep residual neural networks.",
      missionTitle: "Our Mission",
      missionDesc: "DermaVision AI aims to provide rapid, reliable, and accessible preliminary skin lesion screening using state-of-the-art computer vision algorithms.",
      modelTitle: "Deep Learning Neural Network",
      modelDesc: "Built on PyTorch ResNet50 fine-tuned on thousands of clinical dermoscopic and close-up cutaneous images across 10 disease categories.",
      disclaimerTitle: "Clinical Notice",
      disclaimerDesc: "This software is for preliminary screening assistance only and does not constitute formal medical diagnosis."
    },
    common: {
      loading: "Loading...",
      success: "Operation completed successfully.",
      error: "An error occurred. Please try again.",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      demoMode: "Demo Mode",
      highRisk: "High Risk",
      moderateRisk: "Moderate Risk",
      lowRisk: "Low Risk"
    },
    call: {
      incomingVideoCall: "Incoming Video Consultation",
      incomingVoiceCall: "Incoming Voice Consultation",
      isCallingYou: "is calling you for a tele-dermatology consultation.",
      acceptVideo: "Accept Video Call",
      acceptVoice: "Accept Voice Call",
      decline: "Decline",
      mute: "Mute Mic",
      unmute: "Unmute Mic",
      cameraOff: "Turn Off Camera",
      cameraOn: "Turn On Camera",
      endCall: "End Call",
      connecting: "Connecting securely...",
      connected: "Connected",
      callEndedBy: "Call ended",
      cameraDenied: "Camera access is required for a video consultation.",
      micDenied: "Microphone access is required for a voice consultation.",
      tryAgain: "Try Again"
    },
    doctorPage: {
      portalTag: "Tele-Dermatology Portal",
      title: "Doctor Consultation",
      sub: "Connect with certified dermatologists, view shared reports, and launch video calls.",
      online: "Online",
      viewProfileBtn: "View Doctor Profile",
      servicesTab: "Clinical Services",
      specialistTab: "Specialist Profile",
      sharedReportsTab: "Shared Clinical Reports",
      findSpecialistTitle: "Find a Specialist",
      findSpecialistSub: "View our chief dermatologist profile, experience, hospital affiliation, and clinic details.",
      viewDoctorDetails: "View Doctor Details",
      messagesTitle: "Messages & Voice Chat",
      messagesSub: "Chat live with your attending doctor, send text messages, and record voice notes.",
      openChatRoom: "Open Chat Room",
      sharedReportsTitle: "Shared Diagnostic Reports",
      sharedReportsSub: "Access AI skin screening reports shared with your attending doctor.",
      viewSharedReports: "View Shared Reports",
      bioTitle: "Clinical Biography & Credentials",
      clinicLine: "Direct Clinic Contact Line",
      expYears: "Years Experience",
      fee: "Consultation Fee"
    },
    chatPage: {
      title: "Live Doctor Consultation Chat",
      sub: "Direct real-time text and voice communication with your attending dermatologist.",
      noConsultationTitle: "No Active Doctor Consultation Found",
      noConsultationSub: "Run a skin scan and tap 'Consult Doctor' to share your scan report and open live chat.",
      startScanBtn: "Start Skin Scan",
      chatActiveFor: "Live Chat active for:",
      chatActiveSub: "Send a text message or record a voice note below.",
      inputPlaceholder: "Type message to doctor...",
      sendBtn: "Send",
      voiceNoteTitle: "Voice Note",
      voiceNoteFromPatient: "🎙️ Voice Note sent by Patient",
      voiceNoteFromDoctor: "🎙️ Voice Note sent by Doctor"
    }
  },
  ta: {
    nav: {
      home: "முகப்பு",
      dashboard: "டாஷ்போர்டு",
      scanner: "தோல் ஸ்கேனர்",
      history: "ஸ்கேன் வரலாறு",
      about: "AI பற்றி",
      signIn: "உள்நுழை",
      register: "பதிவுசெய்",
      profile: "சுயவிவரம்",
      signOut: "வெளியேறு",
      exitDemo: "டெமோவிலிருந்து வெளியேறு",
      demoBadge: "டெமோ பயன்முறை",
      doctorHub: "மருத்துவர் ஆலோசனை",
      appointments: "சந்திப்புகள்"
    },
    home: {
      heroTag: "DermaVision AI • ResNet50 தோல் நோய் வகைப்படுத்தி",
      heroTitlePrefix: "ஸ்மார்ட் AI தோல் பரிசோதனை மற்றும் ",
      heroTitleHighlight: "மருத்துவ நோய் கண்டறிதல் அறிக்கைகள்",
      heroSubtitle: "உடனடி AI பகுப்பாய்வு, ஆபத்து வகைப்பாடு மற்றும் விரிவான பன்மொழி மருத்துவ அறிக்கைகளுக்காக தோல் புகைப்படங்களைப் பதிவேற்றவும்.",
      registerBtn: "கணக்கை பதிவுசெய்",
      signInBtn: "உள்நுழை",
      demoBtn: "டெமோ பயன்முறையை ஆராயுங்கள்",
      demoCardTitle: "முதலில் திட்டத்தை ஆராய விரும்புகிறீர்களா?",
      demoCardDesc: "பதிவு செய்யாமல் பார்வையாளராக பயன்பாட்டின் அனைத்து அம்சங்கள் மற்றும் நோய் விவரங்களை ஆராயுங்கள்.",
      demoCardBtn: "டெமோ பயன்முறையில் ஆராயுங்கள்",
      feature1Title: "PyTorch ResNet50 AI",
      feature1Desc: "10 மருத்துவப் பிரிவுகளில் ஆயிரக்கணக்கான தோல் படங்களைக் கொண்டு பயிற்சி அளிக்கப்பட்ட AI மாதிரி.",
      feature2Title: "ஆபத்து வகைப்பாடு",
      feature2Desc: "தோல் பாதிப்புகளை குறைந்த, நடுத்தர மற்றும் அதிக ஆபத்து நிலைகளாக வகைப்படுத்தும் உடனடி மதிப்பீடு.",
      feature3Title: "பன்மொழி அறிக்கைகள்",
      feature3Desc: "ஆங்கிலம், தமிழ் மற்றும் இந்தி மொழிகளில் தானாக மொழியாக்கம் செய்யப்படும் முழுமையான மருத்துவ அறிக்கைகள்."
    },
    auth: {
      createAccount: "புதிய கணக்கை உருவாக்கவும்",
      welcomeBack: "மீண்டும் வருக",
      joinSub: "தனிப்பயனாக்கப்பட்ட தோல் பரிசோதனை அறிக்கைகளைப் பெற DermaVision AI இல் இணையுங்கள்.",
      signInSub: "உங்கள் சேமிக்கப்பட்ட AI தோல் பரிசோதனை அறிக்கைகளை அணுக உள்நுழையவும்.",
      fullName: "முழு பெயர்",
      age: "வயது",
      gender: "பாலினம்",
      genderFemale: "பெண்",
      genderMale: "ஆண்",
      genderOther: "மற்றவை",
      genderPreferNot: "கூற விரும்பவில்லை",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்துக",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
      resetPassword: "கடவுச்சொல்லை மாற்றவும்",
      completeRegister: "பதிவை முடிக்கவும்",
      signInBtn: "உள்நுழை",
      googleAuth: "கூகிள் மூலம் தொடரவும்",
      or: "அல்லது",
      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      dontHaveAccount: "கணக்கு இல்லையா?",
      createOne: "புதிய கணக்கை உருவாக்கு",
      resetTitle: "கடவுச்சொல்லை மீட்டமைக்கவும்",
      resetDesc: "உங்கள் மின்னஞ்சலை உள்ளிடவும். கடவுச்சொல் மாற்ற இணைப்பை அனுப்புவோம்.",
      sendResetLink: "மீட்டமைப்பு இணைப்பை அனுப்பு",
      newPassword: "புதிய கடவுச்சொல்",
      confirmNewPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்துக",
      saveNewPassword: "புதிய கடவுச்சொல்லை சேமி",
      passwordResetSent: "கடவுச்சொல் மீட்டமைப்பு மின்னஞ்சல் அனுப்பப்பட்டது! உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.",
      accountNotFound: "இந்த மின்னஞ்சலுக்கு கணக்கு எதுவும் கிடைக்கவில்லை அல்லது கடவுச்சொல் தவறானது.",
      clickToRegister: "புதிய பயனராக பதிவு செய்ய இங்கே கிளிக் செய்யவும்"
    },
    dashboard: {
      greeting: "மீண்டும் வருக",
      sub: "உங்கள் நிகழ்நேர Firestore தோல் பரிசோதனை புள்ளிவிவரங்கள் மற்றும் வரலாற்றை இங்கே காணலாம்.",
      startNewScan: "புதிய தோல் ஸ்கேன் தொடங்கவும்",
      totalScans: "மொத்த தோல் ஸ்கேன்கள்",
      recentScans: "சமீபத்திய ஸ்கேன் அறிக்கைகள்",
      noScansYet: "இன்னும் ஸ்கேன்கள் சேமிக்கப்படவில்லை",
      noScansSub: "உங்கள் மருத்துவ அறிக்கையை உருவாக்க மற்றும் சேமிக்க முதல் AI தோல் ஸ்கேனைத் தொடங்குங்கள்.",
      viewReport: "கண்டறிதல் அறிக்கையைப் பார்க்கவும்",
      date: "தேதி",
      confidence: "நம்பகத்தன்மை",
      riskLevel: "ஆபத்து நிலை"
    },
    profile: {
      title: "பயனர் சுயவிவரம்",
      sub: "உங்கள் Firestore பயனர் கணக்குத் தகவல் மற்றும் மொழி விருப்பங்களை நிர்வகிக்கவும்.",
      editProfile: "சுயவிவரத்தைத் திருத்து",
      saveToFirestore: "Firestore இல் சேமிக்கவும்",
      saving: "சேமிக்கப்படுகிறது...",
      fullName: "முழு பெயர்",
      email: "மின்னஞ்சல் முகவரி",
      age: "வயது",
      gender: "பாலினம்",
      preferredLanguage: "விரும்பிய மொழி",
      authType: "அடையாள வகை",
      updateSuccess: "சுயவிவரம் Firestore இல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      updateError: "Firestore இல் சுயவிவரத்தைப் புதுப்பிக்க முடியவில்லை.",
      cancel: "ரத்து செய்"
    },
    scanner: {
      title: "AI தோல் நோய் ஸ்கேனர்",
      subtitle: "ResNet50 AI பகுப்பாய்விற்கு தெளிவான தோல் புகைப்படத்தைப் பதிவேற்றவும்.",
      voiceActive: "குரல் வழிகாட்டி இயங்குகிறது",
      voiceGuide: "குரல் வழிகாட்டையைக் கேளுங்கள்",
      demoNoticeTitle: "டெமோ பயன்முறை — பார்வை மட்டும்",
      demoNoticeDesc: "உண்மையான AI தோல் ஸ்கேன் செய்ய தயவுசெய்து உள்நுழையவும் அல்லது பதிவுசெய்யவும்.",
      loginRequired: "உள்நுழைவு தேவை",
      uploadTab: "படத்தைப் பதிவேற்று",
      cameraTab: "படம் எடுக்கவும்",
      dropTitle: "தோல் புகைப்படத்தை இங்கே இழுத்து விடவும்",
      dropSubtitle: "JPG, PNG, WEBP வடிவங்களை ஆதரிக்கிறது (10MB வரை)",
      browseFiles: "படத்தைத் தேர்ந்தெடுக்கவும்",
      cameraStart: "கேமராவைத் தொடங்கு",
      cameraCapture: "படம் எடுக்கவும்",
      cameraStop: "கேமராவை நிறுத்து",
      cameraError: "கேமரா அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை.",
      analyzing: "பயிற்சி அளிக்கப்பட்ட PyTorch மாதிரி மூலம் படம் பகுப்பாய்வு செய்யப்படுகிறது...",
      qualityChecking: "படத்தின் தரம், வெளிச்சம் மற்றும் தெளிவு சரிபார்க்கப்படுகிறது...",
      qualityPassed: "படத்தின் தரம் சரியானது",
      qualityPassedDesc: "தெளிவான தெளிவுத்திறன் மற்றும் வெளிச்சம் உறுதி செய்யப்பட்டது.",
      analyzeBtn: "தோல் படத்தை பகுப்பாய்வு செய்",
      retake: "வேறு படத்தைத் தேர்ந்தெடு"
    },
    results: {
      title: "AI பரிசோதனை முடிவு",
      subtitle: "PyTorch ResNet50 நரம்பியல் நெட்வொர்க் பகுப்பாய்வு முடிந்தது.",
      topClass: "முதன்மையான வகைப்பாடு",
      confidence: "மாதிரியின் நம்பகத்தன்மை",
      riskBadge: "ஆபத்து நிலை",
      viewFullReport: "முழுமையான அறிக்கையைப் பார்க்கவும்",
      newScan: "மற்றொரு படத்தைச் ஸ்கேன் செய்",
      savedToHistory: "ஸ்கேன் பதிவு Firestore இல் சேமிக்கப்பட்டது"
    },
    report: {
      title: "மருத்துவ AI பரிசோதனை அறிக்கை",
      subtitle: "நோய் குறித்த விரிவான கண்டறிதல் மற்றும் பொதுவான மருத்துவ வழிகாட்டுதல்.",
      downloadPdf: "PDF அறிக்கையைப் பதிவிறக்குக",
      printReport: "அறிக்கையை அச்சிடுக",
      scanMetadata: "ஸ்கேன் விவரங்கள்",
      scanId: "ஸ்கேன் அடையாளம்",
      scanDate: "ஸ்கேன் செய்த தேதி",
      modelArchitecture: "மாதிரி கட்டமைப்பு",
      imageResolution: "படத்தின் தெளிவுத்திறன்",
      topPrediction: "கணிக்கப்பட்ட தோல் பாதிப்பு",
      confidenceScore: "நம்பகத்தன்மை மதிப்பெண்",
      riskClassification: "ஆபத்து நிலை வகைப்பாடு",
      clinicalInfo: "மருத்துவத் தகவல் & கண்ணோட்டம்",
      diseaseDescription: "மருத்துவ விளக்கம்",
      symptomsTitle: "பொதுவான மருத்துவ அறிகுறிகள்",
      causesTitle: "காரணங்கள் & ஆபத்து காரணிகள்",
      precautionsTitle: "பரிந்துரைக்கப்பட்ட பராமரிப்பு & முன்னெச்சரிக்கைகள்",
      warningSignsTitle: "எச்சரிக்கை அறிகுறிகள்",
      whenToSeekCareTitle: "எப்போது மருத்துவரை அணுக வேண்டும்?",
      probabilityDistribution: "முழுமையான மாதிரி நிகழ்தகவு விநியோகம்",
      medicalDisclaimer: "மருத்துவ & AI மறுப்புரை",
      disclaimerText: "DermaVision AI என்பது ஒரு முதன்மை உதவி கருவியாகும். இது தொழில்முறை தோல் மருத்துவ பரிசோதனை அல்லது திசு பரிசோதனைக்கு மாற்றாகாது. சந்தேகத்திற்குரிய தோல் பாதிப்புகளுக்கு எப்போதும் தகுதியான தோல் மருத்துவரை அணுகவும்.",
      backToDashboard: "டாஷ்போர்டிற்குத் திரும்பு"
    },
    history: {
      title: "தோல் ஸ்கேன் வரலாறு",
      subtitle: "உங்கள் கணக்கில் சேமிக்கப்பட்ட Firestore ஸ்கேன் ஆவணங்கள்.",
      emptyTitle: "சேமிக்கப்பட்ட ஸ்கேன்கள் எதுவும் இல்லை",
      emptyDesc: "நீங்கள் இன்னும் எந்த AI தோல் ஸ்கேனையும் செய்யவில்லை. உங்கள் அறிக்கைகள் இங்கே தோன்றும்.",
      startFirstScan: "முதல் ஸ்கேனைத் தொடங்குங்கள்",
      scanId: "ஸ்கேன் அடையாளம்",
      viewReport: "முழு அறிக்கையைப் பார்க்கவும்"
    },
    about: {
      title: "DermaVision AI பற்றி",
      subtitle: "ஆழ்ந்த நரம்பியல் நெட்வொர்க்குகள் மூலம் தோல் மருத்துவ பரிசோதனையை மேம்படுத்துதல்.",
      missionTitle: "எங்கள் நோக்கம்",
      missionDesc: "நவீன கணினி பார்வை வழிமுறைகளைப் பயன்படுத்தி வேகமான, நம்பகமான தோல் பரிசோதனையை வழங்குவதே எங்கள் நோக்கம்.",
      modelTitle: "ஆழ்ந்த கற்றல் நரம்பியல் நெட்வொர்க்",
      modelDesc: "10 நோய் பிரிவுகளில் ஆயிரக்கணக்கான மருத்துவப் படங்களைக் கொண்டு பயிற்சி அளிக்கப்பட்ட PyTorch ResNet50 மாதிரி.",
      disclaimerTitle: "மருத்துவ அறிவிப்பு",
      disclaimerDesc: "இந்த மென்பொருள் முதன்மை பரிசோதனை உதவிக்காக மட்டுமே, இது முறையான மருத்துவ நோயறிதல் அல்ல."
    },
    common: {
      loading: "ஏற்றப்படுகிறது...",
      success: "செயல்பாடு வெற்றிகரமாக முடிந்தது.",
      error: "ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
      close: "மூடு",
      cancel: "ரத்து செய்",
      save: "சேமி",
      demoMode: "டெமோ பயன்முறை",
      highRisk: "அதிக ஆபத்து",
      moderateRisk: "நடுத்தர ஆபத்து",
      lowRisk: "குறைந்த ஆபத்து"
    },
    call: {
      incomingVideoCall: "உள்வரும் வீடியோ அழைப்பு",
      incomingVoiceCall: "உள்வரும் குரல் அழைப்பு",
      isCallingYou: "உங்களை தொடர்பு கொள்கிறார்.",
      acceptVideo: "வீடியோ அழைப்பை ஏற்கவும்",
      acceptVoice: "குரல் அழைப்பை ஏற்கவும்",
      decline: "நிராகரிக்கவும்",
      mute: "ஒலியை முடக்கு",
      unmute: "ஒலியை இயக்கு",
      cameraOff: "கேமராவை அணைக்கவும்",
      cameraOn: "கேமராவை ஆன் செய்யவும்",
      endCall: "அழைப்பை முடிக்கவும்",
      connecting: "பாதுகாப்பாக இணைக்கப்படுகிறது...",
      connected: "இணைக்கப்பட்டது",
      callEndedBy: "அழைப்பு முடிக்கப்பட்டது",
      cameraDenied: "வீடியோ அழைப்பிற்கு கேமரா அனுமதி தேவை.",
      micDenied: "குரல் அழைப்பிற்கு மைக்ரோஃபோன் அனுமதி தேவை.",
      tryAgain: "மீண்டும் முயற்சிக்கவும்"
    },
    doctorPage: {
      portalTag: "தொலைநிலை தோல் மருத்துவ மையம்",
      title: "மருத்துவர் ஆலோசனை",
      sub: "சான்றளிக்கப்பட்ட தோல் மருத்துவ நிபுணர்களுடன் தொடர்பு கொண்டு நோய் அறிக்கைகளைப் பகிரவும்.",
      online: "ஆன்லைன்",
      viewProfileBtn: "மருத்துவர் சுயவிவரத்தைப் பார்க்கவும்",
      servicesTab: "மருத்துவ சேவைகள்",
      specialistTab: "நிபுணர் சுயவிவரம்",
      sharedReportsTab: "பகிரப்பட்ட அறிக்கைகள்",
      findSpecialistTitle: "மருத்துவ நிபுணரைக் கண்டறியவும்",
      findSpecialistSub: "எங்கள் தலைமை தோல் மருத்துவரின் விவரங்கள் மற்றும் அனுபவத்தைப் பார்க்கவும்.",
      viewDoctorDetails: "மருத்துவர் விவரங்களைப் பார்க்கவும்",
      messagesTitle: "நிகழ்நேர அரட்டை & குரல் குறிப்பு",
      messagesSub: "உங்கள் மருத்துவருடன் நேரடியாக அரட்டையடிக்கவும் மற்றும் குரல் குறிப்புகளை அனுப்பவும்.",
      openChatRoom: "அரட்டை அறையைத் திறக்கவும்",
      sharedReportsTitle: "பகிரப்பட்ட மருத்துவ அறிக்கைகள்",
      sharedReportsSub: "உங்கள் மருத்துவருடன் பகிரப்பட்ட AI தோல் பரிசோதனை அறிக்கைகளைப் பார்க்கவும்.",
      viewSharedReports: "பகிரப்பட்ட அறிக்கைகளைப் பார்க்கவும்",
      bioTitle: "மருத்துவ வரலாறு & அனுபவம்",
      clinicLine: "நேரடி மருத்துவமனை தொடர்பு",
      expYears: "ஆண்டுகள் அனுபவம்",
      fee: "கட்டணம்"
    },
    chatPage: {
      title: "நேரலை மருத்துவர் அரட்டை",
      sub: "உங்கள் மருத்துவருடன் நேரலை உரை மற்றும் குரல் உரையாடல்.",
      noConsultationTitle: "செயலில் உள்ள மருத்துவர் ஆலோசனை எதுவும் கிடைக்கவில்லை",
      noConsultationSub: "தோல் ஸ்கேன் செய்து மருத்துவருடன் அறிக்கையைப் பகிரவும்.",
      startScanBtn: "தோல் ஸ்கேன் தொடங்கவும்",
      chatActiveFor: "இதற்கான நேரலை அரட்டை செயல்படுகிறது:",
      chatActiveSub: "கீழே உரை செய்தி அனுப்பவும் அல்லது குரல் குறிப்பைப் பதிவுசெய்யவும்.",
      inputPlaceholder: "மருத்துவருக்கு செய்தி தட்டச்சு செய்யவும்...",
      sendBtn: "அனுப்பு",
      voiceNoteTitle: "குரல் குறிப்பு",
      voiceNoteFromPatient: "🎙️ நோயாளி அனுப்பிய குரல் குறிப்பு",
      voiceNoteFromDoctor: "🎙️ மருத்துவர் அனுப்பிய குரல் குறிப்பு"
    }
  },
  hi: {
    nav: {
      home: "मुख्य पृष्ठ",
      dashboard: "डैशबोर्ड",
      scanner: "त्वचा स्कैनर",
      history: "स्कैन इतिहास",
      about: "AI के बारे में",
      signIn: "साइन इन करें",
      register: "पंजीकरण करें",
      profile: "प्रोफ़ाइल",
      signOut: "साइन आउट",
      exitDemo: "डेमो से बाहर निकलें",
      demoBadge: "डेमो मोड",
      doctorHub: "डॉक्टर परामर्श",
      appointments: "अपॉइंटमेंट"
    },
    home: {
      heroTag: "DermaVision AI • ResNet50 त्वचा रोग वर्गीकारक",
      heroTitlePrefix: "स्मार्ट AI त्वचा जांच और ",
      heroTitleHighlight: "नैदानिक रिपोर्ट",
      heroSubtitle: "त्वचा के निशानों की फ़ोटो अपलोड करें और त्वरित AI विश्लेषण, जोखिम वर्गीकरण और बहुभाषी चिकित्सा रिपोर्ट प्राप्त करें।",
      registerBtn: "खाता पंजीकृत करें",
      signInBtn: "साइन इन करें",
      demoBtn: "डेमो मोड देखें",
      demoCardTitle: "क्या आप पहले प्रोजेक्ट को एक्सप्लोर करना चाहते हैं?",
      demoCardDesc: "बिना पंजीकरण के केवल देखने योग्य डेमो मोड में ऐप की सुविधाओं और रिपोर्ट को एक्सप्लोर करें।",
      demoCardBtn: "डेमो मोड में एक्सप्लोर करें",
      feature1Title: "PyTorch ResNet50 AI",
      feature1Desc: "10 नैदानिक श्रेणियों में हज़ारों त्वचा छवियों पर प्रशिक्षित AI मॉडल।",
      feature2Title: "जोखिम वर्गीकरण",
      feature2Desc: "त्वचा के घावों को कम, मध्यम और उच्च जोखिम श्रेणियों में वर्गीकृत करने वाला त्वरित मूल्यांकन।",
      feature3Title: "बहुभाषी रिपोर्ट",
      feature3Desc: "अंग्रेजी, तमिल और हिंदी में स्वचालित रूप से अनुवादित व्यापक चिकित्सा रिपोर्ट।"
    },
    auth: {
      createAccount: "नया खाता बनाएं",
      welcomeBack: "पुनः स्वागत है",
      joinSub: "निजी त्वचा जांच रिपोर्ट प्राप्त करने के लिए DermaVision AI से जुड़ें।",
      signInSub: "अपनी सहेजी गई AI त्वचा जांच रिपोर्ट देखने के लिए साइन इन करें।",
      fullName: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      genderFemale: "महिला",
      genderMale: "पुरुष",
      genderOther: "अन्य",
      genderPreferNot: "बताना नहीं चाहते",
      email: "ईमेल पता",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      forgotPassword: "पासवर्ड भूल गए?",
      resetPassword: "पासवर्ड रीसेट करें",
      completeRegister: "पंजीकरण पूरा करें",
      signInBtn: "साइन इन करें",
      googleAuth: "गूगल के साथ जारी रखें",
      or: "अथवा",
      alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      createOne: "नया खाता बनाएं",
      resetTitle: "पासवर्ड रीसेट करें",
      resetDesc: "अपना ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे।",
      sendResetLink: "रीसेट लिंक भेजें",
      newPassword: "नया पासवर्ड बनाएं",
      confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
      saveNewPassword: "नया पासवर्ड सहेजें",
      passwordResetSent: "पासवर्ड रीसेट ईमेल भेजा गया! अपना इनबॉक्स जांचें।",
      accountNotFound: "इस ईमेल के लिए कोई खाता नहीं मिला या पासवर्ड गलत है।",
      clickToRegister: "नया उपयोगकर्ता पंजीकृत करने के लिए यहां क्लिक करें"
    },
    dashboard: {
      greeting: "पुनः स्वागत है",
      sub: "यहाँ आपके रीयल-टाइम Firestore त्वचा जांच आंकड़े और इतिहास हैं।",
      startNewScan: "नया त्वचा स्कैन शुरू करें",
      totalScans: "कुल त्वचा स्कैन",
      recentScans: "हाल की स्कैन रिपोर्ट",
      noScansYet: "अभी तक कोई स्कैन नहीं सहेजा गया",
      noScansSub: "अपनी नैदानिक रिपोर्ट उत्पन्न करने और सहेजने के लिए पहला AI त्वचा स्कैन शुरू करें।",
      viewReport: "नैदानिक रिपोर्ट देखें",
      date: "दिनांक",
      confidence: "विश्वास स्तर",
      riskLevel: "जोखिम स्तर"
    },
    profile: {
      title: "उपयोगकर्ता प्रोफ़ाइल",
      sub: "अपनी Firestore उपयोगकर्ता जानकारी और भाषा प्राथमिकताओं को प्रबंधित करें।",
      editProfile: "प्रोफ़ाइल संपादित करें",
      saveToFirestore: "Firestore में सहेजें",
      saving: "सहेजा जा रहा है...",
      fullName: "पूरा नाम",
      email: "ईमेल पता",
      age: "आयु",
      gender: "लिंग",
      preferredLanguage: "पसंदीदा भाषा",
      authType: "प्रामाणीकरण प्रकार",
      updateSuccess: "प्रोफ़ाइल Firestore में सफलतापूर्वक अपडेट हो गई!",
      updateError: "Firestore में प्रोफ़ाइल अपडेट करने में विफल।",
      cancel: "रद्द करें"
    },
    scanner: {
      title: "AI त्वचा रोग स्कैनर",
      subtitle: "ResNet50 AI विश्लेषण के लिए एक स्पष्ट त्वचा फ़ोटो अपलोड करें।",
      voiceActive: "वॉयस गाइड सक्रिय",
      voiceGuide: "वॉयस गाइड सुनें",
      demoNoticeTitle: "डेमो मोड — केवल देखें",
      demoNoticeDesc: "वास्तविक AI त्वचा स्कैन चलाने के लिए कृपया साइन इन या पंजीकरण करें।",
      loginRequired: "साइन इन आवश्यक",
      uploadTab: "छवि अपलोड करें",
      cameraTab: "फ़ोटो खींचें",
      dropTitle: "त्वचा की फ़ोटो यहाँ खींचें और छोड़ें",
      dropSubtitle: "JPG, PNG, WEBP स्वरूप समर्थित (10MB तक)",
      browseFiles: "छवि फ़ाइल चुनें",
      cameraStart: "कैमरा शुरू करें",
      cameraCapture: "फ़ोटो खींचें",
      cameraStop: "कैमरा बंद करें",
      cameraError: "कैमरा एक्सेस नहीं मिला या अनुपलब्ध है।",
      analyzing: "प्रशिक्षित PyTorch मॉडल के साथ छवि का विश्लेषण किया जा रहा है...",
      qualityChecking: "छवि की गुणवत्ता, फ़ोकस और रोशनी की जाँच की जा रही है...",
      qualityPassed: "छवि गुणवत्ता ठीक है",
      qualityPassedDesc: "स्पष्ट रिज़ॉल्यूशन, फ़ोकस और रोशनी सत्यापित।",
      analyzeBtn: "त्वचा छवि का विश्लेषण करें",
      retake: "दूसरी छवि चुनें"
    },
    results: {
      title: "AI जांच परिणाम",
      subtitle: "PyTorch ResNet50 तंत्रिका नेटवर्क वर्गीकरण पूरा हुआ।",
      topClass: "शीर्ष वर्गीकरण",
      confidence: "मॉडल विश्वास स्तर",
      riskBadge: "जोखिम स्तर",
      viewFullReport: "पूरी नैदानिक रिपोर्ट देखें",
      newScan: "दूसरी छवि स्कैन करें",
      savedToHistory: "स्कैन रिकॉर्ड Firestore में सहेजा गया"
    },
    report: {
      title: "चिकित्सीय AI जांच रिपोर्ट",
      subtitle: "रोग-विशिष्ट विस्तृत विश्लेषण और सामान्य चिकित्सीय मार्गदर्शन।",
      downloadPdf: "PDF रिपोर्ट डाउनलोड करें",
      printReport: "रिपोर्ट प्रिंट करें",
      scanMetadata: "स्कैन मेटाडेटा",
      scanId: "स्कैन ID",
      scanDate: "स्कैन दिनांक और समय",
      modelArchitecture: "मॉडल वास्तुकला",
      imageResolution: "इनपुट रिज़ॉल्यूशन",
      topPrediction: "अनुमानित त्वचा रोग",
      confidenceScore: "विश्वास स्कोर",
      riskClassification: "जोखिम श्रेणी",
      clinicalInfo: "नैदानिक जानकारी और अवलोकन",
      diseaseDescription: "चिकित्सीय विवरण",
      symptomsTitle: "सामान्य लक्षण",
      causesTitle: "कारण और जोखिम कारक",
      precautionsTitle: "अनुशंसित देखभाल और सावधानियां",
      warningSignsTitle: "चेतावनी संकेत और खतरे",
      whenToSeekCareTitle: "डॉक्टर से कब परामर्श लें?",
      probabilityDistribution: "पूर्ण मॉडल संभावना वितरण",
      medicalDisclaimer: "चिकित्सीय एवं AI अस्वीकरण",
      disclaimerText: "DermaVision AI एक सहायक स्क्रीनिंग टूल है। यह पेशेवर त्वचा विशेषज्ञ परीक्षा या बायोप्सी का विकल्प नहीं है। संदिग्ध निशानों के लिए हमेशा योग्य त्वचा विशेषज्ञ से परामर्श लें।",
      backToDashboard: "डैशबोर्ड पर वापस जाएं"
    },
    history: {
      title: "स्कैन इतिहास",
      subtitle: "आपके खाते में सहेजे गए Firestore स्कैन दस्तावेज़।",
      emptyTitle: "कोई सहेजा गया स्कैन नहीं मिला",
      emptyDesc: "आपने अभी तक कोई AI त्वचा स्कैन नहीं चलाया है। आपकी रिपोर्ट यहाँ दिखाई देंगी।",
      startFirstScan: "पहला स्कैन शुरू करें",
      scanId: "स्कैन ID",
      viewReport: "पूरी रिपोर्ट देखें"
    },
    about: {
      title: "DermaVision AI के बारे में",
      subtitle: "डीप न्यूरल नेटवर्क के साथ त्वचा रोग जांच को सशक्त बनाना।",
      missionTitle: "हमारा उद्देश्य",
      missionDesc: "कंप्यूटर विज़न एल्गोरिदम का उपयोग करके तीव्र, विश्वसनीय प्राथमिक त्वचा जांच प्रदान करना।",
      modelTitle: "डीप लर्निंग न्यूरल नेटवर्क",
      modelDesc: "10 रोग श्रेणियों में हज़ारों छवियों पर प्रशिक्षित PyTorch ResNet50 मॉडल।",
      disclaimerTitle: "चिकित्सीय सूचना",
      disclaimerDesc: "यह सॉफ़्टवेयर केवल प्राथमिक जांच सहायता के लिए है, औपचारिक चिकित्सा निदान नहीं है।"
    },
    common: {
      loading: "लोड हो रहा है...",
      success: "ऑपरेशन सफलतापूर्वक पूरा हुआ।",
      error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
      close: "बंद करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      demoMode: "डेमो मोड",
      highRisk: "उच्च जोखिम",
      moderateRisk: "मध्यम जोखिम",
      lowRisk: "कम जोखिम"
    },
    call: {
      incomingVideoCall: "आने वाली वीडियो कॉल",
      incomingVoiceCall: "आने वाली वॉयस कॉल",
      isCallingYou: "आपको टेली-डर्मेटोलॉजी परामर्श के लिए कॉल कर रहा है।",
      acceptVideo: "वीडियो कॉल स्वीकार करें",
      acceptVoice: "वॉयस कॉल स्वीकार करें",
      decline: "अस्वीकार करें",
      mute: "म्यूट करें",
      unmute: "अनम्यूट करें",
      cameraOff: "कैमरा बंद करें",
      cameraOn: "कैमरा चालू करें",
      endCall: "कॉल समाप्त करें",
      connecting: "सुरक्षित रूप से कनेक्ट हो रहा है...",
      connected: "कनेक्ट हो गया",
      callEndedBy: "कॉल समाप्त हो गया",
      cameraDenied: "वीडियो कॉल के लिए कैमरा अनुमति आवश्यक है।",
      micDenied: "वॉयस कॉल के लिए माइक्रोफोन अनुमति आवश्यक है।",
      tryAgain: "पुनः प्रयास करें"
    },
    doctorPage: {
      portalTag: "टेली-डर्मेटोलॉजी पोर्टल",
      title: "डॉक्टर परामर्श",
      sub: "प्रमाणित त्वचा विशेषज्ञों से परामर्श लें और रिपोर्ट साझा करें।",
      online: "ऑनलाइन",
      viewProfileBtn: "डॉक्टर प्रोफ़ाइल देखें",
      servicesTab: "चिकित्सा सेवाएं",
      specialistTab: "विशेषज्ञ प्रोफ़ाइल",
      sharedReportsTab: "साझा रिपोर्ट",
      findSpecialistTitle: "विशेषज्ञ खोजें",
      findSpecialistSub: "हमारे मुख्य त्वचा विशेषज्ञ का अनुभव और विवरण देखें।",
      viewDoctorDetails: "डॉक्टर का विवरण देखें",
      messagesTitle: "लाइव चैट और वॉइस संदेश",
      messagesSub: "अपने डॉक्टर से लाइव चैट करें और वॉइस नोट्स भेजें।",
      openChatRoom: "चैट रूम खोलें",
      sharedReportsTitle: "साझा की गई रिपोर्ट",
      sharedReportsSub: "अपने डॉक्टर के साथ साझा की गई एआई रिपोर्ट देखें।",
      viewSharedReports: "साझा रिपोर्ट देखें",
      bioTitle: "चिकित्सा अनुभव",
      clinicLine: "क्लीनिक संपर्क संख्या",
      expYears: "वर्षों का अनुभव",
      fee: "परामर्श शुल्क"
    },
    chatPage: {
      title: "लाइव डॉक्टर चैट",
      sub: "अपने डॉक्टर के साथ लाइव संदेश और वॉइस बातचीत।",
      noConsultationTitle: "कोई सक्रिय डॉक्टर परामर्श नहीं मिला",
      noConsultationSub: "त्वचा की जांच करें और अपनी रिपोर्ट साझा करें।",
      startScanBtn: "त्वचा जांच शुरू करें",
      chatActiveFor: "इसके लिए लाइव चैट सक्रिय है:",
      chatActiveSub: "नीचे संदेश लिखें या वॉइस नोट रिकॉर्ड करें।",
      inputPlaceholder: "डॉक्टर को संदेश लिखें...",
      sendBtn: "भेजें",
      voiceNoteTitle: "वॉइस नोट",
      voiceNoteFromPatient: "🎙️ मरीज का वॉइस नोट",
      voiceNoteFromDoctor: "🎙️ डॉक्टर का वॉइस नोट"
    }
  }
};
