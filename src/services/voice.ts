import { Language } from '../i18n/translations';

// Automatic multilingual dictionary for Voice Assistant announcements
const voiceTranslations: Record<Language, Record<string, string>> = {
  ta: {
    'Image selected. Verifying human skin region and photo quality.':
      'படம் தேர்ந்தெடுக்கப்பட்டது. மனித தோல் மற்றும் புகைப்படத்தின் தரம் சரிபார்க்கப்படுகிறது.',
    'The uploaded image does not appear to contain a valid human skin region. Please upload a skin photo.':
      'பதிவேற்றப்பட்ட படம் செல்லுபடியாகும் மனித தோல் பகுதியைக் கொண்டிருக்கவில்லை. தயவுசெய்து தோல் புகைப்படத்தைப் பதிவேற்றவும்.',
    'INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE':
      'செல்லுபடியற்ற படம் — தயவுசெய்து மனித தோல் புகைப்படத்தைப் பதிவேற்றவும்.',
    'Image quality is too low. Please upload a clear, well-lit skin image.':
      'படத்தின் தரம் மிகவும் குறைவாக உள்ளது. தயவுசெய்து தெளிவான தோல் படத்தைப் பதிவேற்றவும்.',
    'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit image of the skin area.':
      'படத்தின் தரம் குறைவு — தெளிவான தோல் படத்தைப் பதிவேற்றவும்.',
    'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit skin photo.':
      'படத்தின் தரம் குறைவு — தெளிவான தோல் படத்தைப் பதிவேற்றவும்.',
    'IMAGE QUALITY TOO LOW':
      'படத்தின் தரம் மிகவும் குறைவாக உள்ளது.',
    'Quality check passed cleanly. Ready for AI scanning.':
      'படத்தின் தரம் சிறப்பாக உள்ளது. AI பரிசோதனை செய்ய தயார்.',
    'Analyzing skin photo with PyTorch neural network model.':
      'நரம்பியல் பிணைய மாதிரியைப் பயன்படுத்தி தோல் புகைப்படம் பகுப்பாய்வு செய்யப்படுகிறது.',
    'AI analysis failed. Please check network connection and try again.':
      'AI பரிசோதனை தோல்வியடைந்தது. நெட்வொர்க் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
  },
  hi: {
    'Image selected. Verifying human skin region and photo quality.':
      'छवि चुनी गई। मानव त्वचा और फोटो गुणवत्ता की जाँच की जा रही है।',
    'The uploaded image does not appear to contain a valid human skin region. Please upload a skin photo.':
      'अपलोड की गई छवि में वैध मानव त्वचा क्षेत्र प्रतीत नहीं होता है। कृपया त्वचा की तस्वीर अपलोड करें।',
    'INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE':
      'अमान्य छवि - कृपया मानव त्वचा की छवि अपलोड करें।',
    'Image quality is too low. Please upload a clear, well-lit skin image.':
      'छवि की गुणवत्ता बहुत कम है। कृपया एक स्पष्ट, अच्छी तरह से प्रकाशित त्वचा की छवि अपलोड करें।',
    'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit image of the skin area.':
      'छवि गुणवत्ता बहुत कम है - कृपया एक स्पष्ट त्वचा फोटो अपलोड करें।',
    'IMAGE QUALITY TOO LOW — Please upload a clear, well-lit skin photo.':
      'छवि गुणवत्ता बहुत कम है - कृपया एक स्पष्ट त्वचा फोटो अपलोड करें।',
    'IMAGE QUALITY TOO LOW':
      'छवि गुणवत्ता बहुत कम है।',
    'Quality check passed cleanly. Ready for AI scanning.':
      'गुणवत्ता जांच सफल रही। एआई स्कैनिंग के लिए तैयार है।',
    'Analyzing skin photo with PyTorch neural network model.':
      'तंत्रिका नेटवर्क मॉडल का उपयोग करके त्वचा की तस्वीर का विश्लेषण किया जा रहा है।',
    'AI analysis failed. Please check network connection and try again.':
      'एआई विश्लेषण विफल रहा। कृपया नेटवर्क कनेक्शन जांचें और पुनः प्रयास करें।'
  },
  en: {}
};

export class VoiceAssistant {
  private static currentAudio: HTMLAudioElement | null = null;
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static cachedVoices: SpeechSynthesisVoice[] = [];

  private static loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve([]);
        return;
      }

      let currentVoices = this.synth.getVoices();
      if (currentVoices.length > 0) {
        this.cachedVoices = currentVoices;
        resolve(currentVoices);
        return;
      }

      // Handle async voice loading in Chrome / Edge / Android Webview
      this.synth.onvoiceschanged = () => {
        if (this.synth) {
          this.cachedVoices = this.synth.getVoices();
          resolve(this.cachedVoices);
        }
      };

      // Fallback timeout after 250ms
      setTimeout(() => {
        if (this.synth) {
          this.cachedVoices = this.synth.getVoices();
        }
        resolve(this.cachedVoices);
      }, 250);
    });
  }

  public static async speak(text: string, lang: Language = 'en'): Promise<void> {
    if (!text) return;

    this.stop();

    // Map English text to native language if available
    const finalSpeechText = voiceTranslations[lang]?.[text] || text;

    const voices = await this.loadVoices();

    // Search for best matching native voice for the selected language
    let matchedVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'ta') {
      matchedVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('ta') || 
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('தமிழ்') ||
        v.name.toLowerCase().includes('valluvar') ||
        v.name.toLowerCase().includes('kani')
      );
    } else if (lang === 'hi') {
      matchedVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('हिन्दी') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('madhur')
      );
    } else {
      matchedVoice = voices.find(v => 
        v.lang.toLowerCase().includes('en-in') || 
        v.lang.toLowerCase().includes('en-us') ||
        v.lang.startsWith('en')
      );
    }

    // High Quality Backend TTS Stream for Tamil & Hindi (guarantees crystal-clear native speech on Windows/All Browsers without CORS issues)
    if (lang === 'ta' || lang === 'hi') {
      try {
        const backendHost = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';
        const audioUrl = `${backendHost}/api/ai/tts?lang=${lang}&text=${encodeURIComponent(finalSpeechText)}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = 0.95;
        this.currentAudio = audio;
        await audio.play();
        return;
      } catch (e) {
        console.warn('Backend TTS audio playback notice, falling back to WebSpeech:', e);
      }
    }

    // Web Speech API fallback
    if (this.synth) {
      const utterance = new SpeechSynthesisUtterance(finalSpeechText);
      utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.90; // Natural speaking cadence
      utterance.pitch = 1.0;
      if (matchedVoice) utterance.voice = matchedVoice;
      this.synth.speak(utterance);
    }
  }

  public static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static isSpeaking(): boolean {
    const isAudioPlaying = this.currentAudio ? !this.currentAudio.paused : false;
    const isSynthSpeaking = this.synth ? (this.synth.speaking || this.synth.pending) : false;
    return isAudioPlaying || isSynthSpeaking;
  }
}
