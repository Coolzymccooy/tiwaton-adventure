
// services/audio.ts

export const AudioService = {
  SARCASM: {
    correct: [
      "Correct! Even a broken clock is right twice a day.",
      "Wow, a genius in the making. Or maybe just lucky?",
      "Correct. I was almost worried I'd have to explain it again.",
      "Brilliant! Your brain is clearly in 'Sport Mode' today.",
      "Spot on! I'll stop making fun of you... for now.",
      "Incredible! Did you cheat? Just kidding. Mostly.",
      "Stunning. You actually read the question. I'm impressed."
    ],
    wrong: [
      "Wrong! My circuits are literally crying right now.",
      "Ouch. That was... certainly a choice.",
      "Incorrect. Maybe try opening your eyes this time?",
      "Not quite. But hey, participation trophies are still a thing, right?",
      "Nope! Let's pretend that didn't happen and try again.",
      "Error 404: Correct answer not found in your brain.",
      "Wrong. I could calculate the right answer in 0.001 seconds, just saying."
    ],
    intro: [
      "Ready to prove you're smarter than a toaster?",
      "Another mission? I hope you've had your coffee.",
      "Welcome back. Try not to break anything this time.",
      "Loading brilliance... oh wait, it's just you. Let's go!"
    ],
    completion: [
      "Mission over. My CPU needs a break from your 'excellence'.",
      "Stage cleared! I'm legally obligated to say I'm proud of you.",
      "Wow, you actually finished. I had a bet going against you. I lost.",
      "Next level unlocked. Don't let it go to your head.",
      "Mission Accomplished. You're officially less of a disaster today."
    ]
  },

  private: {
    queue: [] as { text: string; mood: string }[],
    isSpeaking: false,
    heartbeat: null as any,
    locale: 'en',
    ttsEnabled: false // explicitly requested to be default OFF
  },

  toggleTTS: (enabled?: boolean) => {
    if (enabled !== undefined) {
      AudioService.private.ttsEnabled = enabled;
    } else {
      AudioService.private.ttsEnabled = !AudioService.private.ttsEnabled;
    }
    if (!AudioService.private.ttsEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      AudioService.private.queue = [];
      AudioService.private.isSpeaking = false;
    }
    return AudioService.private.ttsEnabled;
  },

  setLocale: (locale: 'en' | 'de') => {
    AudioService.private.locale = locale;
  },

  speak: (
    text: string,
    mood: 'sarcastic' | 'excited' | 'neutral' = 'neutral',
    priority: 'high' | 'low' = 'low'
  ) => {
    if (!('speechSynthesis' in window) || !AudioService.private.ttsEnabled) return;

    if (priority === 'high') {
      window.speechSynthesis.cancel();
      AudioService.private.queue = [];
      AudioService.private.isSpeaking = false;
    }

    let processedText = text;
    if (mood === 'sarcastic' && !text.includes("?") && AudioService.private.locale !== 'de') {
      const remarks = AudioService.SARCASM.intro;
      processedText = `${remarks[Math.floor(Math.random() * remarks.length)]} ${text}`;
    }

    const chunks = processedText.match(/.{1,160}(\s|$)/g) || [processedText];
    chunks.forEach(chunk => {
      AudioService.private.queue.push({ text: chunk, mood });
    });

    if (!AudioService.private.isSpeaking) {
      AudioService.processQueue();
    }
  },

  processQueue: () => {
    if (AudioService.private.queue.length === 0) {
      AudioService.private.isSpeaking = false;
      if (AudioService.private.heartbeat) clearInterval(AudioService.private.heartbeat);
      return;
    }

    // Ensure voices are loaded. Some browsers load them asynchronously.
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null; // Prevent recursion
        AudioService.processQueue();
      };
      return;
    }

    AudioService.private.isSpeaking = true;
    const { text, mood } = AudioService.private.queue.shift()!;
    const utterance = new SpeechSynthesisUtterance(text);

    // SMARTER VOICE SELECTION
    // Prioritize natural/premium voices which sound much more "real"
    const preferredPatterns = [
      'premium', 'natural', 'google', 'neural', 'samantha', 'en-us', 'en-gb'
    ];

    let selectedVoice = voices.find(v =>
      preferredPatterns.some(p => v.name.toLowerCase().includes(p) && v.lang.startsWith('en'))
    );

    // Fallback search
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    // IMPROVED PROSODY (Human-like rhythm)
    const locale = AudioService.private.locale || 'en';

    // Dynamic Rate Adjustment: Longer sentences speak slightly faster to sound more natural
    const wordCount = text.split(/\s+/).length;
    let baseRate = wordCount > 20 ? 0.95 : 0.88;
    let basePitch = 1.0;

    if (locale === 'de') {
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
    } else if (mood === 'sarcastic') {
      // Sarcasm: Slower, slightly higher initial pitch, then flat
      utterance.rate = 0.78;
      utterance.pitch = 0.9;
    } else if (mood === 'excited') {
      // Excited: Faster, higher pitch variation
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
    } else {
      utterance.rate = baseRate;
      utterance.pitch = basePitch;
    }

    // PUNCTUATION PACING
    // Insert small delays on end to allow "breathing" between chunks
    utterance.onend = () => {
      let delay = 350; // default pause
      if (text.endsWith('!') || text.endsWith('?')) delay = 600;
      if (text.endsWith('.')) delay = 450;

      setTimeout(() => AudioService.processQueue(), delay);
    };

    utterance.onerror = (e) => {
      console.warn("TTS Error:", e);
      AudioService.private.isSpeaking = false;
      AudioService.processQueue();
    };

    // Heartbeat to prevent chrome from cutting off long utterances
    if (AudioService.private.heartbeat) clearInterval(AudioService.private.heartbeat);
    AudioService.private.heartbeat = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
  },

  playEffect: (type: 'correct' | 'wrong' | 'click') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.4);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    }
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }
};
