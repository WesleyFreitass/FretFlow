// Motor de Áudio Web Audio API para Backing Tracks do Guitar Hero (Bateria, Baixo e Harmonia de Rock)

export class RockBackingEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.timerId = null;
    this.volume = 0.75;
    this.currentSongId = null;
    this.bpm = 120;
    this.step = 0;
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  playKick(time) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.14);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.14);
  }

  playSnare(time) {
    if (!this.audioCtx) return;
    // Noise buffer for punchy snare snap
    const bufferSize = this.audioCtx.sampleRate * 0.1;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.1);
  }

  playHiHat(time) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'highpass';
    osc.frequency.setValueAtTime(9000, time);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  playBassNote(freq, time, duration = 0.25) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  startSong(songId, bpm) {
    this.init();
    this.stop();

    this.currentSongId = songId;
    this.bpm = bpm || 120;
    this.isPlaying = true;
    this.step = 0;

    const stepIntervalMs = (60 / this.bpm / 2) * 1000; // Eighth notes (colcheias)

    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const beat = this.step % 8;

      // 1. Rock Drum Groove (Kick on 1 & 5, Snare on 3 & 7, Hi-hat on all)
      this.playHiHat(now);

      if (beat === 0 || beat === 4) {
        this.playKick(now);
      }
      if (beat === 2 || beat === 6) {
        this.playSnare(now);
      }

      // 2. Song Bassline & Harmonic Riffs
      if (this.currentSongId === 'seven_nation_army') {
        // E -> E -> G -> E -> D -> C -> B
        const bassNotes = [
          82.41, 0, 82.41, 98.00, 82.41, 73.42, 65.41, 61.74
        ];
        const f = bassNotes[beat];
        if (f > 0) this.playBassNote(f, now, 0.28);
      } else if (this.currentSongId === 'smoke_on_the_water') {
        // G -> Bb -> C
        const bassNotes = [
          98.00, 0, 116.54, 0, 130.81, 0, 0, 0
        ];
        const f = bassNotes[beat];
        if (f > 0) this.playBassNote(f, now, 0.3);
      } else if (this.currentSongId === 'smells_like_teen_spirit') {
        // F -> Bb -> Ab -> Db
        const bassNotes = [
          87.31, 87.31, 116.54, 116.54, 103.83, 103.83, 138.59, 138.59
        ];
        const f = bassNotes[beat];
        if (f > 0) this.playBassNote(f, now, 0.22);
      } else {
        // Default D Rock groove
        const bassNotes = [
          73.42, 0, 73.42, 0, 98.00, 0, 82.41, 0
        ];
        const f = bassNotes[beat];
        if (f > 0) this.playBassNote(f, now, 0.25);
      }

      this.step++;
    }, stepIntervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const globalRockBacking = new RockBackingEngine();
