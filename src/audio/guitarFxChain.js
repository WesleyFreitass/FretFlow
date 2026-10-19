/**
 * Guitar FX DSP Engine - Analog-Modeled Studio DSP
 * Precision component-level modeling for vacuum tubes (12AX7), diode clippers,
 * pre-drive tone filters, multi-stage guitar cabinets, and classic modulation/time/pitch effects:
 * - Smart Dynamic Noise Gate (Clamps room & mic noise when guitar is idle)
 * - Auto-Wah / Envelope Filter (Cry Baby / Mu-Tron)
 * - 4-Stage Phaser (MXR Phase 90)
 * - Vintage Flanger (Boss BF-2 / Electric Mistress)
 * - Optical Tremolo (Boss TR-2 / Fender Twin)
 * - Octaver / Pitch Shifter (Boss OC-2 / Whammy)
 * - Acoustic Simulator (Boss AC-3)
 */

// 1. Vacuum Tube 12AX7 Triode Transfer Function
function makeTubeCurve(amount = 2.0, isHighGain = false) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const gain = Math.max(1.0, isHighGain ? amount * 2.2 : amount * 1.4);

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    const xg = x * gain;

    let y;
    if (xg >= 0) {
      y = 1.0 - Math.exp(-Math.min(10.0, xg * 1.1));
    } else {
      y = -Math.tanh(-xg * 0.85);
    }

    const secondHarmonic = 0.08 * (x * x - 0.5);
    y = y + secondHarmonic;
    curve[i] = Math.tanh(y * 0.92);
  }
  return curve;
}

// 2. Tube Screamer / Overdrive
function makeOverdriveCurve(amount = 2.5) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const gain = 1.0 + amount * 2.0;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    const xg = x * gain;
    let y = (Math.exp(0.8 * xg) - Math.exp(-0.8 * xg)) / (Math.exp(0.8 * xg) + Math.exp(-0.8 * xg));
    y = 0.82 * y + 0.18 * Math.tanh(xg * 0.4);
    curve[i] = Math.max(-0.95, Math.min(0.95, y));
  }
  return curve;
}

// 3. DS-1 / RAT Hard Clipper
function makeHardDistortionCurve(amount = 3.5) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const gain = 1.0 + amount * 3.0;
  const threshold = 0.55;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    const xg = x * gain;
    const absX = Math.abs(xg);

    let y;
    if (absX < threshold) {
      y = xg;
    } else {
      const excess = absX - threshold;
      y = Math.sign(xg) * (threshold + (1.0 - threshold) * Math.tanh(excess * 1.5));
    }
    curve[i] = Math.tanh(y * 1.15) * 0.9;
  }
  return curve;
}

// 4. Vintage Germanium Fuzz
function makeFuzzCurve(amount = 4.0) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const gain = 1.0 + amount * 4.2;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    const xg = x * gain;
    const bias = xg >= 0 ? 1.5 : 0.9;
    const y = Math.sign(xg) * (1.0 - Math.exp(-Math.abs(xg) * bias));
    curve[i] = Math.max(-0.95, Math.min(0.95, y * 0.95));
  }
  return curve;
}

// 5. Clean Boost
function makeBoostCurve(amount = 1.5) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = Math.tanh(x * amount * 1.2);
  }
  return curve;
}

// 6. Octave Waveshaper (Rectifier / Octave Up Generator)
function makeOctaveUpCurve() {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = Math.abs(x) * 2 - 1;
  }
  return curve;
}

export function getDriveCurve(type, amount) {
  switch (type) {
    case 'ts': return makeOverdriveCurve(amount);
    case 'ds1': return makeHardDistortionCurve(amount);
    case 'fuzz': return makeFuzzCurve(amount);
    case 'boost': return makeBoostCurve(amount);
    default: return makeOverdriveCurve(amount);
  }
}

export const CAB_MODELS = {
  '1x12': { name: '1x12 Deluxe (Open Back)', thumpFreq: 95, coneFreq: 2600, highCut: 4800 },
  '2x12': { name: '2x12 AC30 / Bassman', thumpFreq: 105, coneFreq: 2800, highCut: 4600 },
  '4x12': { name: '4x12 Marshall 1960A (V30)', thumpFreq: 115, coneFreq: 3100, highCut: 4200 },
  '4x10': { name: '4x10 Super Reverb', thumpFreq: 125, coneFreq: 3400, highCut: 5200 }
};

export const AMP_MODELS = {
  'fender': { name: "'65 Twin Reverb", type: 'clean', defaultGain: 1.8, defaultBass: 3.5, defaultMid: 2.8, defaultTreble: 4.0, cab: '2x12' },
  'marshall': { name: 'JCM800 Lead', type: 'crunch', defaultGain: 3.8, defaultBass: 3.2, defaultMid: 4.5, defaultTreble: 3.5, cab: '4x12' },
  'mesa': { name: 'Dual Rectifier', type: 'high_gain', defaultGain: 4.8, defaultBass: 4.2, defaultMid: 3.0, defaultTreble: 4.2, cab: '4x12' },
  'vox': { name: 'AC30 Top Boost', type: 'chime', defaultGain: 2.5, defaultBass: 2.5, defaultMid: 4.0, defaultTreble: 4.5, cab: '2x12' },
  'acoustic': { name: 'Acoustic Studio Preamp', type: 'acoustic', defaultGain: 1.2, defaultBass: 4.0, defaultMid: 2.0, defaultTreble: 4.5, cab: '1x12' }
};

export const ARTIST_PRESETS = [
  {
    id: 'natural_clean_guitar',
    name: 'Som Natural da Guitarra (Clean Studio)',
    subtitle: 'Direct Clean / Transparente',
    artist: 'Padrão / Silencioso',
    category: 'Clean & Estudo',
    icon: '🎸',
    description: 'Som limpo, transparente e natural da guitarra com Noise Gate inteligente ativo contra ruídos e hum de captadores.',
    settings: {
      noiseGate: { enabled: true, threshold: 0.015 },
      compressor: { enabled: false, threshold: -20, ratio: 3.0, attack: 0.008, release: 0.1 },
      drive: { enabled: false, type: 'boost', gain: 1.0, tone: 4000, level: 1.0, bassCut: 80 },
      amp: { enabled: false, model: 'fender', gain: 1.2, bass: 3.0, mid: 3.0, treble: 3.5, presence: 3.0, cab: '2x12', master: 1.0 },
      phaser: { enabled: false, rate: 0.8, depth: 0.5, feedback: 0.3, mix: 0.0 },
      flanger: { enabled: false, rate: 0.5, depth: 0.5, feedback: 0.3, mix: 0.0 },
      tremolo: { enabled: false, rate: 4.0, depth: 0.5, mix: 0.0 },
      wah: { enabled: false, sensitivity: 0.5, baseFreq: 400, maxFreq: 2200, mix: 0.0 },
      octaver: { enabled: false, subOctave: 0.0, upperOctave: 0.0, mix: 0.0 },
      acoustic: { enabled: false, body: 0.5, top: 0.5, mix: 0.0 },
      chorus: { enabled: false, rate: 0.8, depth: 0.3, mix: 0.0 },
      delay: { enabled: false, time: 0.25, feedback: 0.2, tone: 3000, mix: 0.0 },
      reverb: { enabled: false, size: 'room', decay: 1.2, tone: 3500, mix: 0.0 }
    }
  }
];

export class GuitarFxChain {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.isBypassed = false;
    this.state = JSON.parse(JSON.stringify(ARTIST_PRESETS[0].settings));

    this.inputNode = null;
    this.outputNode = null;
    this.bypassGain = null;
    this.wetGain = null;

    // Submodules
    this.gateGain = null;
    this.compNode = null;

    // 1. Auto-Wah Nodes
    this.wahInput = null;
    this.wahDry = null;
    this.wahWet = null;
    this.wahFilter = null;
    this.wahLfo = null;
    this.wahLfoGain = null;

    // 2. Drive Nodes
    this.drivePreBassCut = null;
    this.drivePreMidHump = null;
    this.drivePreGain = null;
    this.driveWaveShaper = null;
    this.driveToneFilter = null;
    this.drivePostGain = null;
    this.driveDryGain = null;
    this.driveWetGain = null;

    // 3. Acoustic Simulator Nodes
    this.acousticInput = null;
    this.acousticDry = null;
    this.acousticWet = null;
    this.acousticBody = null;
    this.acousticMidScoop = null;
    this.acousticTopShimmer = null;

    // 4. Octaver Nodes
    this.octaverInput = null;
    this.octaverDry = null;
    this.octaverWet = null;
    this.octaverUpShaper = null;
    this.octaverUpFilter = null;
    this.octaverUpGain = null;
    this.octaverSubFilter = null;
    this.octaverSubGain = null;

    // 5. Amp & Cabinet
    this.ampPreTightFilter = null;
    this.ampPreGain = null;
    this.ampWaveShaper = null;
    this.ampBassFilter = null;
    this.ampMidFilter = null;
    this.ampTrebleFilter = null;
    this.ampPresenceFilter = null;
    this.cabThumpResonance = null;
    this.cabBodyCut = null;
    this.cabConePeak = null;
    this.cabSteepLowpassA = null;
    this.cabSteepLowpassB = null;
    this.ampMasterGain = null;

    // 6. Modulation Effects
    this.phaserInput = null;
    this.phaserDry = null;
    this.phaserWet = null;
    this.phaserStages = [];
    this.phaserLfo = null;
    this.phaserLfoGain = null;
    this.phaserFeedback = null;

    this.flangerInput = null;
    this.flangerDry = null;
    this.flangerWet = null;
    this.flangerDelay = null;
    this.flangerLfo = null;
    this.flangerLfoGain = null;
    this.flangerFeedback = null;

    this.tremoloInput = null;
    this.tremoloDry = null;
    this.tremoloWet = null;
    this.tremoloGainNode = null;
    this.tremoloLfo = null;
    this.tremoloLfoGain = null;

    this.chorusInput = null;
    this.chorusDry = null;
    this.chorusWet = null;
    this.chorusDelayL = null;
    this.chorusDelayR = null;
    this.chorusLfo = null;
    this.chorusLfoGainL = null;
    this.chorusLfoGainR = null;

    // 7. Time Effects
    this.delayInput = null;
    this.delayDry = null;
    this.delayWet = null;
    this.delayNodeL = null;
    this.delayNodeR = null;
    this.delayFeedbackL = null;
    this.delayFeedbackR = null;
    this.delayFilter = null;

    this.reverbInput = null;
    this.reverbDry = null;
    this.reverbWet = null;
    this.reverbConvolver = null;

    // Limiter
    this.masterLimiter = null;

    this.buildDspGraph();
    this.loadPreset(ARTIST_PRESETS[0]);
  }

  buildDspGraph() {
    if (!this.ctx) return;

    this.inputNode = this.ctx.createGain();
    this.outputNode = this.ctx.createGain();
    this.bypassGain = this.ctx.createGain();
    this.wetGain = this.ctx.createGain();
    this.bypassGain.gain.value = 0;
    this.wetGain.gain.value = 1;

    // Direct Bypass
    this.inputNode.connect(this.bypassGain);
    this.bypassGain.connect(this.outputNode);

    // 1. Smart Noise Gate & Dynamics Compressor
    this.gateGain = this.ctx.createGain();
    this.gateGain.gain.value = 0.0; // Start muted until audio detected!

    this.compNode = this.ctx.createDynamicsCompressor();
    this.compNode.threshold.value = -20;
    this.compNode.knee.value = 6;
    this.compNode.ratio.value = 3.5;
    this.compNode.attack.value = 0.006;
    this.compNode.release.value = 0.08;

    // 2. Auto-Wah
    this.wahInput = this.ctx.createGain();
    this.wahDry = this.ctx.createGain();
    this.wahWet = this.ctx.createGain();
    this.wahFilter = this.ctx.createBiquadFilter();
    this.wahFilter.type = 'peaking';
    this.wahFilter.frequency.value = 800;
    this.wahFilter.Q.value = 4.5;
    this.wahFilter.gain.value = 8.0;

    this.wahLfo = this.ctx.createOscillator();
    this.wahLfo.frequency.value = 2.0;
    this.wahLfoGain = this.ctx.createGain();
    this.wahLfoGain.gain.value = 600;
    this.wahLfo.connect(this.wahLfoGain);
    this.wahLfoGain.connect(this.wahFilter.frequency);
    try { this.wahLfo.start(); } catch (_) {}

    this.wahInput.connect(this.wahDry);
    this.wahInput.connect(this.wahFilter);
    this.wahFilter.connect(this.wahWet);

    const wahOutput = this.ctx.createGain();
    this.wahDry.connect(wahOutput);
    this.wahWet.connect(wahOutput);

    // 3. Acoustic Simulator
    this.acousticInput = this.ctx.createGain();
    this.acousticDry = this.ctx.createGain();
    this.acousticWet = this.ctx.createGain();

    this.acousticBody = this.ctx.createBiquadFilter();
    this.acousticBody.type = 'peaking';
    this.acousticBody.frequency.value = 110;
    this.acousticBody.Q.value = 1.5;
    this.acousticBody.gain.value = 5.0;

    this.acousticMidScoop = this.ctx.createBiquadFilter();
    this.acousticMidScoop.type = 'peaking';
    this.acousticMidScoop.frequency.value = 450;
    this.acousticMidScoop.Q.value = 1.2;
    this.acousticMidScoop.gain.value = -6.0;

    this.acousticTopShimmer = this.ctx.createBiquadFilter();
    this.acousticTopShimmer.type = 'highshelf';
    this.acousticTopShimmer.frequency.value = 4500;
    this.acousticTopShimmer.gain.value = 6.0;

    this.acousticInput.connect(this.acousticDry);
    this.acousticInput.connect(this.acousticBody);
    this.acousticBody.connect(this.acousticMidScoop);
    this.acousticMidScoop.connect(this.acousticTopShimmer);
    this.acousticTopShimmer.connect(this.acousticWet);

    const acousticOutput = this.ctx.createGain();
    this.acousticDry.connect(acousticOutput);
    this.acousticWet.connect(acousticOutput);

    // 4. Octaver
    this.octaverInput = this.ctx.createGain();
    this.octaverDry = this.ctx.createGain();
    this.octaverWet = this.ctx.createGain();

    this.octaverUpShaper = this.ctx.createWaveShaper();
    this.octaverUpShaper.curve = makeOctaveUpCurve();
    this.octaverUpFilter = this.ctx.createBiquadFilter();
    this.octaverUpFilter.type = 'bandpass';
    this.octaverUpFilter.frequency.value = 1600;
    this.octaverUpFilter.Q.value = 1.5;
    this.octaverUpGain = this.ctx.createGain();
    this.octaverUpGain.gain.value = 0.5;

    this.octaverSubFilter = this.ctx.createBiquadFilter();
    this.octaverSubFilter.type = 'lowpass';
    this.octaverSubFilter.frequency.value = 180;
    this.octaverSubGain = this.ctx.createGain();
    this.octaverSubGain.gain.value = 0.5;

    this.octaverInput.connect(this.octaverDry);
    this.octaverInput.connect(this.octaverUpShaper);
    this.octaverUpShaper.connect(this.octaverUpFilter);
    this.octaverUpFilter.connect(this.octaverUpGain);
    this.octaverUpGain.connect(this.octaverWet);

    this.octaverInput.connect(this.octaverSubFilter);
    this.octaverSubFilter.connect(this.octaverSubGain);
    this.octaverSubGain.connect(this.octaverWet);

    const octaverOutput = this.ctx.createGain();
    this.octaverDry.connect(octaverOutput);
    this.octaverWet.connect(octaverOutput);

    // 5. Drive Stage
    this.drivePreBassCut = this.ctx.createBiquadFilter();
    this.drivePreBassCut.type = 'highpass';
    this.drivePreBassCut.frequency.value = 140;

    this.drivePreMidHump = this.ctx.createBiquadFilter();
    this.drivePreMidHump.type = 'peaking';
    this.drivePreMidHump.frequency.value = 1200;
    this.drivePreMidHump.Q.value = 1.2;
    this.drivePreMidHump.gain.value = 4.0;

    this.drivePreGain = this.ctx.createGain();
    this.drivePreGain.gain.value = 1.0;

    this.driveWaveShaper = this.ctx.createWaveShaper();
    this.driveWaveShaper.curve = getDriveCurve('ts', 2.5);
    this.driveWaveShaper.oversample = '4x';

    this.driveToneFilter = this.ctx.createBiquadFilter();
    this.driveToneFilter.type = 'lowpass';
    this.driveToneFilter.frequency.value = 3800;

    this.drivePostGain = this.ctx.createGain();
    this.drivePostGain.gain.value = 1.0;

    this.driveDryGain = this.ctx.createGain();
    this.driveWetGain = this.ctx.createGain();

    this.drivePreBassCut.connect(this.drivePreMidHump);
    this.drivePreMidHump.connect(this.drivePreGain);
    this.drivePreGain.connect(this.driveWaveShaper);
    this.driveWaveShaper.connect(this.driveToneFilter);
    this.driveToneFilter.connect(this.drivePostGain);
    this.drivePostGain.connect(this.driveWetGain);

    const driveOutput = this.ctx.createGain();
    this.driveDryGain.connect(driveOutput);
    this.driveWetGain.connect(driveOutput);

    // 6. Amp & Cabinet
    this.ampPreTightFilter = this.ctx.createBiquadFilter();
    this.ampPreTightFilter.type = 'highpass';
    this.ampPreTightFilter.frequency.value = 90;

    this.ampPreGain = this.ctx.createGain();
    this.ampPreGain.gain.value = 1.0;

    this.ampWaveShaper = this.ctx.createWaveShaper();
    this.ampWaveShaper.curve = makeTubeCurve(1.5, false);
    this.ampWaveShaper.oversample = '4x';

    this.ampBassFilter = this.ctx.createBiquadFilter();
    this.ampBassFilter.type = 'lowshelf';
    this.ampBassFilter.frequency.value = 120;
    this.ampBassFilter.gain.value = 0.0;

    this.ampMidFilter = this.ctx.createBiquadFilter();
    this.ampMidFilter.type = 'peaking';
    this.ampMidFilter.frequency.value = 750;
    this.ampMidFilter.Q.value = 1.0;
    this.ampMidFilter.gain.value = 0.0;

    this.ampTrebleFilter = this.ctx.createBiquadFilter();
    this.ampTrebleFilter.type = 'highshelf';
    this.ampTrebleFilter.frequency.value = 2800;
    this.ampTrebleFilter.gain.value = 0.0;

    this.ampPresenceFilter = this.ctx.createBiquadFilter();
    this.ampPresenceFilter.type = 'peaking';
    this.ampPresenceFilter.frequency.value = 3800;
    this.ampPresenceFilter.Q.value = 1.3;
    this.ampPresenceFilter.gain.value = 0.0;

    this.cabThumpResonance = this.ctx.createBiquadFilter();
    this.cabThumpResonance.type = 'peaking';
    this.cabThumpResonance.frequency.value = 105;
    this.cabThumpResonance.Q.value = 1.5;
    this.cabThumpResonance.gain.value = 2.0;

    this.cabBodyCut = this.ctx.createBiquadFilter();
    this.cabBodyCut.type = 'peaking';
    this.cabBodyCut.frequency.value = 450;
    this.cabBodyCut.Q.value = 1.2;
    this.cabBodyCut.gain.value = -2.0;

    this.cabConePeak = this.ctx.createBiquadFilter();
    this.cabConePeak.type = 'peaking';
    this.cabConePeak.frequency.value = 2900;
    this.cabConePeak.Q.value = 1.5;
    this.cabConePeak.gain.value = 2.0;

    this.cabSteepLowpassA = this.ctx.createBiquadFilter();
    this.cabSteepLowpassA.type = 'lowpass';
    this.cabSteepLowpassA.frequency.value = 4800;
    this.cabSteepLowpassA.Q.value = 1.0;

    this.cabSteepLowpassB = this.ctx.createBiquadFilter();
    this.cabSteepLowpassB.type = 'lowpass';
    this.cabSteepLowpassB.frequency.value = 5200;
    this.cabSteepLowpassB.Q.value = 0.8;

    this.ampMasterGain = this.ctx.createGain();
    this.ampMasterGain.gain.value = 1.0;

    this.ampPreTightFilter.connect(this.ampPreGain);
    this.ampPreGain.connect(this.ampWaveShaper);
    this.ampWaveShaper.connect(this.ampBassFilter);
    this.ampBassFilter.connect(this.ampMidFilter);
    this.ampMidFilter.connect(this.ampTrebleFilter);
    this.ampTrebleFilter.connect(this.ampPresenceFilter);
    this.ampPresenceFilter.connect(this.cabThumpResonance);
    this.cabThumpResonance.connect(this.cabBodyCut);
    this.cabBodyCut.connect(this.cabConePeak);
    this.cabConePeak.connect(this.cabSteepLowpassA);
    this.cabSteepLowpassA.connect(this.cabSteepLowpassB);
    this.cabSteepLowpassB.connect(this.ampMasterGain);

    // 7. Phaser
    this.phaserInput = this.ctx.createGain();
    this.phaserDry = this.ctx.createGain();
    this.phaserWet = this.ctx.createGain();
    this.phaserFeedback = this.ctx.createGain();
    this.phaserFeedback.gain.value = 0.35;

    this.phaserStages = [];
    for (let i = 0; i < 4; i++) {
      const allpass = this.ctx.createBiquadFilter();
      allpass.type = 'allpass';
      allpass.frequency.value = 1000;
      this.phaserStages.push(allpass);
    }
    for (let i = 0; i < 3; i++) {
      this.phaserStages[i].connect(this.phaserStages[i + 1]);
    }

    this.phaserLfo = this.ctx.createOscillator();
    this.phaserLfo.frequency.value = 0.8;
    this.phaserLfoGain = this.ctx.createGain();
    this.phaserLfoGain.gain.value = 750;
    this.phaserLfo.connect(this.phaserLfoGain);
    for (const stage of this.phaserStages) {
      this.phaserLfoGain.connect(stage.frequency);
    }
    try { this.phaserLfo.start(); } catch (_) {}

    this.phaserInput.connect(this.phaserDry);
    this.phaserInput.connect(this.phaserStages[0]);
    this.phaserStages[3].connect(this.phaserWet);
    this.phaserStages[3].connect(this.phaserFeedback);
    this.phaserFeedback.connect(this.phaserStages[0]);

    const phaserOutput = this.ctx.createGain();
    this.phaserDry.connect(phaserOutput);
    this.phaserWet.connect(phaserOutput);

    // 8. Flanger
    this.flangerInput = this.ctx.createGain();
    this.flangerDry = this.ctx.createGain();
    this.flangerWet = this.ctx.createGain();
    this.flangerDelay = this.ctx.createDelay(0.02);
    this.flangerDelay.delayTime.value = 0.003;
    this.flangerFeedback = this.ctx.createGain();
    this.flangerFeedback.gain.value = 0.5;

    this.flangerLfo = this.ctx.createOscillator();
    this.flangerLfo.frequency.value = 0.45;
    this.flangerLfoGain = this.ctx.createGain();
    this.flangerLfoGain.gain.value = 0.002;
    this.flangerLfo.connect(this.flangerLfoGain);
    this.flangerLfoGain.connect(this.flangerDelay.delayTime);
    try { this.flangerLfo.start(); } catch (_) {}

    this.flangerInput.connect(this.flangerDry);
    this.flangerInput.connect(this.flangerDelay);
    this.flangerDelay.connect(this.flangerWet);
    this.flangerDelay.connect(this.flangerFeedback);
    this.flangerFeedback.connect(this.flangerDelay);

    const flangerOutput = this.ctx.createGain();
    this.flangerDry.connect(flangerOutput);
    this.flangerWet.connect(flangerOutput);

    // 9. Optical Tremolo
    this.tremoloInput = this.ctx.createGain();
    this.tremoloDry = this.ctx.createGain();
    this.tremoloWet = this.ctx.createGain();
    this.tremoloGainNode = this.ctx.createGain();
    this.tremoloGainNode.gain.value = 0.5;

    this.tremoloLfo = this.ctx.createOscillator();
    this.tremoloLfo.frequency.value = 4.5;
    this.tremoloLfoGain = this.ctx.createGain();
    this.tremoloLfoGain.gain.value = 0.45;
    this.tremoloLfo.connect(this.tremoloLfoGain);
    this.tremoloLfoGain.connect(this.tremoloGainNode.gain);
    try { this.tremoloLfo.start(); } catch (_) {}

    this.tremoloInput.connect(this.tremoloDry);
    this.tremoloInput.connect(this.tremoloGainNode);
    this.tremoloGainNode.connect(this.tremoloWet);

    const tremoloOutput = this.ctx.createGain();
    this.tremoloDry.connect(tremoloOutput);
    this.tremoloWet.connect(tremoloOutput);

    // 10. Stereo Chorus
    this.chorusInput = this.ctx.createGain();
    this.chorusDry = this.ctx.createGain();
    this.chorusWet = this.ctx.createGain();
    this.chorusDelayL = this.ctx.createDelay(0.1);
    this.chorusDelayR = this.ctx.createDelay(0.1);
    this.chorusDelayL.delayTime.value = 0.018;
    this.chorusDelayR.delayTime.value = 0.024;

    this.chorusLfo = this.ctx.createOscillator();
    this.chorusLfo.frequency.value = 0.8;
    this.chorusLfoGainL = this.ctx.createGain();
    this.chorusLfoGainR = this.ctx.createGain();
    this.chorusLfoGainL.gain.value = 0.003;
    this.chorusLfoGainR.gain.value = -0.003;
    this.chorusLfo.connect(this.chorusLfoGainL);
    this.chorusLfo.connect(this.chorusLfoGainR);
    this.chorusLfoGainL.connect(this.chorusDelayL.delayTime);
    this.chorusLfoGainR.connect(this.chorusDelayR.delayTime);
    try { this.chorusLfo.start(); } catch (_) {}

    this.chorusInput.connect(this.chorusDry);
    this.chorusInput.connect(this.chorusDelayL);
    this.chorusInput.connect(this.chorusDelayR);
    this.chorusDelayL.connect(this.chorusWet);
    this.chorusDelayR.connect(this.chorusWet);

    const chorusOutput = this.ctx.createGain();
    this.chorusDry.connect(chorusOutput);
    this.chorusWet.connect(chorusOutput);

    // 11. Delay
    this.delayInput = this.ctx.createGain();
    this.delayDry = this.ctx.createGain();
    this.delayWet = this.ctx.createGain();
    this.delayNodeL = this.ctx.createDelay(2.0);
    this.delayNodeR = this.ctx.createDelay(2.0);
    this.delayFeedbackL = this.ctx.createGain();
    this.delayFeedbackR = this.ctx.createGain();
    this.delayFilter = this.ctx.createBiquadFilter();
    this.delayFilter.type = 'lowpass';
    this.delayFilter.frequency.value = 2800;

    this.delayInput.connect(this.delayDry);
    this.delayInput.connect(this.delayNodeL);
    this.delayNodeL.connect(this.delayFilter);
    this.delayFilter.connect(this.delayNodeR);
    this.delayFilter.connect(this.delayFeedbackL);
    this.delayFeedbackL.connect(this.delayNodeL);
    this.delayNodeR.connect(this.delayFeedbackR);
    this.delayFeedbackR.connect(this.delayNodeL);
    this.delayFilter.connect(this.delayWet);

    const delayOutput = this.ctx.createGain();
    this.delayDry.connect(delayOutput);
    this.delayWet.connect(delayOutput);

    // 12. Reverb
    this.reverbInput = this.ctx.createGain();
    this.reverbDry = this.ctx.createGain();
    this.reverbWet = this.ctx.createGain();
    this.reverbConvolver = this.ctx.createConvolver();
    this.reverbConvolver.buffer = this.buildReverbImpulse(2.0, 3500);

    this.reverbInput.connect(this.reverbDry);
    this.reverbInput.connect(this.reverbConvolver);
    this.reverbConvolver.connect(this.reverbWet);

    const reverbOutput = this.ctx.createGain();
    this.reverbDry.connect(reverbOutput);
    this.reverbWet.connect(reverbOutput);

    // 13. Master Studio Limiter
    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.threshold.value = -0.5;
    this.masterLimiter.knee.value = 0;
    this.masterLimiter.ratio.value = 20;
    this.masterLimiter.attack.value = 0.001;
    this.masterLimiter.release.value = 0.05;

    // Connect Complete Pedalboard Chain
    this.inputNode.connect(this.gateGain);
    this.gateGain.connect(this.compNode);

    // Dynamics -> Wah -> Acoustic Sim -> Octaver -> Drive
    this.compNode.connect(this.wahInput);
    wahOutput.connect(this.acousticInput);
    acousticOutput.connect(this.octaverInput);
    octaverOutput.connect(this.drivePreBassCut);
    octaverOutput.connect(this.driveDryGain);

    // Drive -> Amp/Cab
    driveOutput.connect(this.ampPreTightFilter);

    // Amp/Cab -> Modulation Stack (Phaser -> Flanger -> Tremolo -> Chorus)
    this.ampMasterGain.connect(this.phaserInput);
    phaserOutput.connect(this.flangerInput);
    flangerOutput.connect(this.tremoloInput);
    tremoloOutput.connect(this.chorusInput);

    // Modulation -> Time Stack (Delay -> Reverb)
    chorusOutput.connect(this.delayInput);
    delayOutput.connect(this.reverbInput);

    // Reverb -> Limiter -> Output
    reverbOutput.connect(this.masterLimiter);
    this.masterLimiter.connect(this.wetGain);
    this.wetGain.connect(this.outputNode);
  }

  buildReverbImpulse(durationSec = 2.0, highCutFreq = 3500) {
    if (!this.ctx) return null;
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * durationSec);
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (rate * (durationSec / 3)));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
  }

  setBypass(bypassed) {
    this.isBypassed = Boolean(bypassed);
    if (!this.ctx || !this.bypassGain || !this.wetGain) return;
    this.bypassGain.gain.setTargetAtTime(this.isBypassed ? 1.0 : 0.0, this.ctx.currentTime, 0.02);
    this.wetGain.gain.setTargetAtTime(this.isBypassed ? 0.0 : 1.0, this.ctx.currentTime, 0.02);
  }

  /**
   * Smart Dynamic Noise Gate: Silences room, fan and microphone noise when idle.
   */
  processNoiseGate(rms) {
    if (!this.ctx || !this.gateGain) return;
    const isGateEnabled = this.state.noiseGate ? this.state.noiseGate.enabled : true;
    const threshold = this.state.noiseGate ? this.state.noiseGate.threshold : 0.015;

    if (!isGateEnabled) {
      this.gateGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.01);
      return;
    }

    if (rms >= threshold) {
      // Guitar is playing: open gate with ultra-fast attack (3ms)
      this.gateGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.003);
    } else {
      // No guitar / idle room noise: close gate smoothly to silence
      this.gateGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.035);
    }
  }

  loadPreset(preset) {
    if (!preset || !preset.settings) return;
    this.state = JSON.parse(JSON.stringify(preset.settings));
    this.applyAllSettings();
  }

  applyAllSettings() {
    if (!this.ctx) return;
    const s = this.state;

    // Compressor
    if (this.compNode && s.compressor) {
      this.compNode.threshold.value = s.compressor.enabled ? s.compressor.threshold : 0;
      this.compNode.ratio.value = s.compressor.enabled ? s.compressor.ratio : 1;
    }

    // Auto-Wah
    if (this.wahDry && this.wahWet && s.wah) {
      this.wahDry.gain.value = s.wah.enabled ? (1 - s.wah.mix) : 1.0;
      this.wahWet.gain.value = s.wah.enabled ? s.wah.mix : 0.0;
      if (this.wahLfo) this.wahLfo.frequency.value = s.wah.sensitivity * 4.0;
      if (this.wahFilter) this.wahFilter.frequency.value = s.wah.baseFreq || 600;
    }

    // Acoustic Simulator
    if (this.acousticDry && this.acousticWet && s.acoustic) {
      this.acousticDry.gain.value = s.acoustic.enabled ? (1 - s.acoustic.mix) : 1.0;
      this.acousticWet.gain.value = s.acoustic.enabled ? s.acoustic.mix : 0.0;
      if (this.acousticBody) this.acousticBody.gain.value = s.acoustic.body * 6.0;
      if (this.acousticTopShimmer) this.acousticTopShimmer.gain.value = s.acoustic.top * 8.0;
    }

    // Octaver
    if (this.octaverDry && this.octaverWet && s.octaver) {
      this.octaverDry.gain.value = s.octaver.enabled ? (1 - s.octaver.mix) : 1.0;
      this.octaverWet.gain.value = s.octaver.enabled ? s.octaver.mix : 0.0;
      if (this.octaverSubGain) this.octaverSubGain.gain.value = s.octaver.subOctave || 0;
      if (this.octaverUpGain) this.octaverUpGain.gain.value = s.octaver.upperOctave || 0;
    }

    // Drive
    if (this.driveDryGain && this.driveWetGain && s.drive) {
      this.driveDryGain.gain.value = s.drive.enabled ? 0.0 : 1.0;
      this.driveWetGain.gain.value = s.drive.enabled ? (s.drive.level || 1.0) : 0.0;
      if (this.driveWaveShaper) this.driveWaveShaper.curve = getDriveCurve(s.drive.type, s.drive.gain);
      if (this.driveToneFilter) this.driveToneFilter.frequency.value = s.drive.tone;
    }

    // Amp & Cab
    if (this.ampPreGain && s.amp) {
      const isAmpOn = s.amp.enabled !== false;
      this.ampPreGain.gain.value = isAmpOn ? s.amp.gain : 1.0;
      if (this.ampWaveShaper) {
        this.ampWaveShaper.curve = makeTubeCurve(isAmpOn ? s.amp.gain : 1.0, isAmpOn && s.amp.gain > 3.0);
      }
      if (this.ampBassFilter) this.ampBassFilter.gain.value = isAmpOn ? s.amp.bass : 0;
      if (this.ampMidFilter) this.ampMidFilter.gain.value = isAmpOn ? s.amp.mid : 0;
      if (this.ampTrebleFilter) this.ampTrebleFilter.gain.value = isAmpOn ? s.amp.treble : 0;
      if (this.ampPresenceFilter) this.ampPresenceFilter.gain.value = isAmpOn ? s.amp.presence : 0;

      const cab = CAB_MODELS[s.amp.cab] || CAB_MODELS['2x12'];
      if (this.cabThumpResonance) this.cabThumpResonance.frequency.value = cab.thumpFreq;
      if (this.cabConePeak) this.cabConePeak.frequency.value = cab.coneFreq;
      if (this.cabSteepLowpassA) this.cabSteepLowpassA.frequency.value = cab.highCut;
    }

    // Phaser
    if (this.phaserDry && this.phaserWet && s.phaser) {
      this.phaserDry.gain.value = s.phaser.enabled ? (1 - s.phaser.mix) : 1.0;
      this.phaserWet.gain.value = s.phaser.enabled ? s.phaser.mix : 0.0;
      if (this.phaserLfo) this.phaserLfo.frequency.value = s.phaser.rate;
      if (this.phaserFeedback) this.phaserFeedback.gain.value = s.phaser.feedback;
    }

    // Flanger
    if (this.flangerDry && this.flangerWet && s.flanger) {
      this.flangerDry.gain.value = s.flanger.enabled ? (1 - s.flanger.mix) : 1.0;
      this.flangerWet.gain.value = s.flanger.enabled ? s.flanger.mix : 0.0;
      if (this.flangerLfo) this.flangerLfo.frequency.value = s.flanger.rate;
      if (this.flangerFeedback) this.flangerFeedback.gain.value = s.flanger.feedback;
    }

    // Tremolo
    if (this.tremoloDry && this.tremoloWet && s.tremolo) {
      this.tremoloDry.gain.value = s.tremolo.enabled ? (1 - s.tremolo.mix) : 1.0;
      this.tremoloWet.gain.value = s.tremolo.enabled ? s.tremolo.mix : 0.0;
      if (this.tremoloLfo) this.tremoloLfo.frequency.value = s.tremolo.rate;
      if (this.tremoloLfoGain) this.tremoloLfoGain.gain.value = s.tremolo.depth * 0.5;
    }

    // Chorus
    if (this.chorusDry && this.chorusWet && s.chorus) {
      this.chorusDry.gain.value = s.chorus.enabled ? (1 - s.chorus.mix) : 1.0;
      this.chorusWet.gain.value = s.chorus.enabled ? s.chorus.mix : 0.0;
      if (this.chorusLfo) this.chorusLfo.frequency.value = s.chorus.rate;
    }

    // Delay
    if (this.delayDry && this.delayWet && s.delay) {
      this.delayDry.gain.value = s.delay.enabled ? (1 - s.delay.mix) : 1.0;
      this.delayWet.gain.value = s.delay.enabled ? s.delay.mix : 0.0;
      if (this.delayNodeL) this.delayNodeL.delayTime.value = s.delay.time;
      if (this.delayNodeR) this.delayNodeR.delayTime.value = s.delay.time * 1.33;
      if (this.delayFeedbackL) this.delayFeedbackL.gain.value = s.delay.feedback;
      if (this.delayFeedbackR) this.delayFeedbackR.gain.value = s.delay.feedback * 0.8;
      if (this.delayFilter) this.delayFilter.frequency.value = s.delay.tone;
    }

    // Reverb
    if (this.reverbDry && this.reverbWet && s.reverb) {
      this.reverbDry.gain.value = s.reverb.enabled ? (1 - s.reverb.mix) : 1.0;
      this.reverbWet.gain.value = s.reverb.enabled ? s.reverb.mix : 0.0;
    }
  }

  setModuleEnabled(moduleName, enabled) {
    if (this.state[moduleName]) {
      this.state[moduleName].enabled = enabled;
      this.applyAllSettings();
    }
  }

  toggleModule(moduleName) {
    if (this.state[moduleName]) {
      this.setModuleEnabled(moduleName, !this.state[moduleName].enabled);
    }
  }

  setParam(moduleName, paramName, value) {
    if (this.state[moduleName] && this.state[moduleName][paramName] !== undefined) {
      this.state[moduleName][paramName] = value;
      this.applyAllSettings();
    }
  }

  updateParam(moduleName, paramName, value) {
    this.setParam(moduleName, paramName, value);
  }
}
