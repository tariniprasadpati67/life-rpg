/**
 * Native Web Audio API Sound Generator for Life RPG
 * Synthesizes retro-futuristic arcade chimes and fanfares without external audio files!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gain = 0.1, delay = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playTone(880, 'triangle', 0.05, 0.08);
  }

  playQuestComplete() {
    // Ascending power arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.12, idx * 0.08);
    });
  }

  playXpGain() {
    this.playQuestComplete();
  }

  playStreak() {
    // Dual power chime
    this.playTone(659.25, 'triangle', 0.2, 0.1, 0);
    this.playTone(987.77, 'sine', 0.35, 0.12, 0.12);
  }

  playLevelUp() {
    // Epic fanfare chord progression
    const fanfare = [
      { f: 523.25, d: 0.15, delay: 0 },
      { f: 659.25, d: 0.15, delay: 0.12 },
      { f: 783.99, d: 0.15, delay: 0.24 },
      { f: 1046.50, d: 0.4, delay: 0.36 },
      { f: 1318.51, d: 0.6, delay: 0.52 },
    ];
    fanfare.forEach(note => {
      this.playTone(note.f, 'sine', note.d, 0.15, note.delay);
    });
  }

  playDelete() {
    this.playTone(300, 'sawtooth', 0.15, 0.06);
    this.playTone(180, 'sawtooth', 0.2, 0.06, 0.1);
  }

  playTimerTick() {
    this.playTone(1200, 'sine', 0.03, 0.02);
  }

  playTimerDone() {
    // Triumphant fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.3, 0.15, idx * 0.1);
    });
  }
}

export const soundFx = new SoundEngine();
