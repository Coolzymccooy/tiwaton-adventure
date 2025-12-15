// services/audio.ts

export const AudioService = {
  speak: (text: string, priority: 'high' | 'low' = 'high') => {
    if (!('speechSynthesis' in window)) return;

    // Cancel existing speech if high priority (immediate feedback)
    if (priority === 'high') {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 1. Voice Selection Strategy for "Best" Quality
    const voices = window.speechSynthesis.getVoices();
    
    // Priority list for natural sounding voices
    const preferredVoices = [
      'Google US English', 
      'Samantha', // macOS high quality
      'Microsoft Zira', // Windows
      'Daniel', 
      'en-US'
    ];

    let selectedVoice = voices.find(v => v.name === 'Google US English') || 
                        voices.find(v => preferredVoices.some(p => v.name.includes(p))) ||
                        voices.find(v => v.lang.startsWith('en'));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // 2. Tuning for "Friendly/Kid" persona
    utterance.rate = 0.95; // Slightly slower is clearer
    utterance.pitch = 1.1; // Slightly higher is friendlier
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  },

  playEffect: (type: 'correct' | 'wrong' | 'click') => {
    // Simple tone generator using Web Audio API for instant feedback
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  }
};