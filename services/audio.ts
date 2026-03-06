// services/audio.ts
// ULTIMATE VERSION: Enhanced with Neural/Online voice priority and dramatic character prosody.

export type Mood = 'neutral' | 'excited' | 'sarcastic' | 'soft' | 'system';

interface QueueItem {
  text: string;
  mood?: Mood;
  voicePriority?: string[];
}

export const AudioService = {
  private: {
    queue: [] as QueueItem[],
    isSpeaking: false,
    locale: 'en',
    heartbeat: null as any,
    ttsEnabled: localStorage.getItem('tts_enabled') !== 'false',
    watchdog: null as any,
  },

  SARCASM: {
    correct: [
      "SENSATIONAL! I'm genuinely shocked you got that right.",
      "Calculating... Yup, correct. Even a broken clock is right twice a day!",
      "Wow. You found the correct answer. The universe is full of mysteries.",
      "Correct! I'll update my 'Surprise' database immediately.",
      "Brilliant. Truly. I'm wiping a digital tear from my eye."
    ],
    wrong: [
      "SYSTEM ERROR: Logic not found. Try turning your brain off and on again?",
      "Interesting choice. Wrong, but interesting.",
      "Incorrect. But hey, it was a very creative failure!",
      "Not even close. Shall we try using our thinking cap this time?",
      "Wrong! But don't worry, even I was poorly programmed once."
    ],
    completion: [
      "Objective complete! Even my processors are impressed.",
      "Mission accomplished. You're actually getting good at this.",
      "Done! I'll stop the sarcastic commentary... for now.",
      "Victory! Though let's be honest, I did most of the heavy lifting."
    ]
  },

  setLocale: (lang: string) => {
    AudioService.private.locale = lang;
  },

  speak: (text: string, mood: Mood = 'neutral') => {
    if (!AudioService.private.ttsEnabled) return;

    // Strip punctuation and formatting that TTS often reads out literally
    const cleanText = text
      .replace(/["*~_`#]/g, '')
      .replace(/--/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split long text into sentences for better pacing and reliability
    // Split by punctuation followed by space or newline
    const chunks = cleanText.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+(?:\s+|$)/g) || [cleanText];

    chunks.forEach(chunk => {
      const trimmed = chunk.trim();
      if (trimmed) {
        AudioService.private.queue.push({ text: trimmed, mood });
      }
    });

    if (!AudioService.private.isSpeaking) {
      AudioService.processQueue();
    }
  },

  playEffect: (effect: 'correct' | 'wrong' | 'click' | 'popup' | 'achievement') => {
    const urls = {
      correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
      wrong: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      popup: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
      achievement: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'
    };

    const audio = new Audio(urls[effect]);
    audio.volume = 0.3;
    audio.play().catch(() => { });
  },

  cancel: () => {
    window.speechSynthesis.cancel();
    AudioService.private.queue = [];
    AudioService.private.isSpeaking = false;
    if (AudioService.private.heartbeat) clearInterval(AudioService.private.heartbeat);
    if (AudioService.private.watchdog) clearTimeout(AudioService.private.watchdog);
  },

  toggleTTS: () => {
    AudioService.private.ttsEnabled = !AudioService.private.ttsEnabled;
    localStorage.setItem('tts_enabled', String(AudioService.private.ttsEnabled));
    if (!AudioService.private.ttsEnabled) {
      AudioService.cancel();
    }
    return AudioService.private.ttsEnabled;
  },

  isEnabled: () => AudioService.private.ttsEnabled,

  processQueue: async () => {
    if (AudioService.private.queue.length === 0) {
      AudioService.private.isSpeaking = false;
      if (AudioService.private.heartbeat) clearInterval(AudioService.private.heartbeat);
      return;
    }

    // ENSURE HIGH QUALITY VOICES ARE READY
    let voices = window.speechSynthesis.getVoices();

    // Neural voices often load slightly after the initial request
    const hasNeural = voices.some(v => v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('natural'));
    if (!hasNeural) {
      // Wait up to 250ms for better voices to arrive
      await new Promise(r => setTimeout(r, 250));
      voices = window.speechSynthesis.getVoices();
    }

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        AudioService.processQueue();
      };
      return;
    }

    AudioService.private.isSpeaking = true;
    const { text, mood } = AudioService.private.queue.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);

    // ULTIMATE VOICE SELECTION
    // Prioritize Microsoft Online (Neural) and Google Natural voices
    const ultraPatterns = ['online', 'neural', 'natural'];
    const premiumPatterns = ['premium', 'google', 'samantha', 'en-us', 'en-gb'];

    let selectedVoice = voices.find(v =>
      ultraPatterns.some(p => v.name.toLowerCase().includes(p)) && v.lang.startsWith('en')
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        premiumPatterns.some(p => v.name.toLowerCase().includes(p)) && v.lang.startsWith('en')
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    // DRAMATIC CHARACTER PROSODY
    const locale = AudioService.private.locale || 'en';
    const wordCount = text.split(/\s+/).length;

    let rate = wordCount > 20 ? 0.98 : 0.92;
    let pitch = 1.0;

    if (locale === 'de') {
      rate = 0.88;
      pitch = 1.0;
    } else if (mood === 'sarcastic') {
      // Sarcasm: Slow, dragging, low energy, slightly deeper bored pitch
      rate = 0.72;
      pitch = 0.8;
    } else if (mood === 'excited') {
      // Excited: Fast-paced, high energy, higher pitch
      rate = 1.15;
      pitch = 1.25;
    } else if (mood === 'soft') {
      rate = 0.8;
      pitch = 0.9;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    // PUNCTUATION PACING (Natural breathing)
    utterance.onend = () => {
      if (AudioService.private.watchdog) clearTimeout(AudioService.private.watchdog);
      let delay = 350;
      if (text.endsWith('!') || text.endsWith('?')) delay = 750;
      if (text.endsWith('.')) delay = 500;

      setTimeout(() => AudioService.processQueue(), delay);
    };

    // Watchdog to prevent hanging if onend doesn't fire
    if (AudioService.private.watchdog) clearTimeout(AudioService.private.watchdog);
    AudioService.private.watchdog = setTimeout(() => {
      if (AudioService.private.isSpeaking) {
        console.warn("TTS Watchdog triggered: forcing next chunk");
        AudioService.processQueue();
      }
    }, 15000); // 15s timeout per chunk

    utterance.onerror = (e) => {
      console.warn("TTS Error:", e);
      AudioService.private.isSpeaking = false;
      AudioService.processQueue();
    };

    // Heartbeat fix for Chromium (prevents cuts on long text)
    if (AudioService.private.heartbeat) clearInterval(AudioService.private.heartbeat);
    AudioService.private.heartbeat = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);

    window.speechSynthesis.speak(utterance);
  },
};
