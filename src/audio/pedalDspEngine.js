/**
 * WebAudio Real-Time DSP Audio Engine for AmpliTube Modular Pedalboard
 * Studio-grade, normalized gain-staging audio processors with clean headroom.
 */

export class PedalDspEngine {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.inputNode = this.ctx.createGain();
    this.outputNode = this.ctx.createGain();

    this.chainNodes = [];

    // Master Amp & Speaker Stage
    this.setupAmpStage();

    // Default connection
    this.inputNode.connect(this.ampStageInput);
    this.ampStageOutput.connect(this.outputNode);
  }

  setupAmpStage() {
    this.ampStageInput = this.ctx.createGain();
    this.ampStageOutput = this.ctx.createGain();

    // 1. Clean Tube Preamp (Smooth soft-saturation only when pushed)
    this.preampShaper = this.ctx.createWaveShaper();
    this.preampShaper.curve = this.createTubeCurve(0.15);
    this.preampShaper.oversample = '4x';

    // 2. 3-Band Tone Stack (Bass, Middle, Treble, Presence)
    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 110;
    this.bassFilter.gain.value = 0;

    this.midFilter = this.ctx.createBiquadFilter();
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.value = 650;
    this.midFilter.Q.value = 1.0;
    this.midFilter.gain.value = 0;

    this.trebleFilter = this.ctx.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.value = 3500;
    this.trebleFilter.gain.value = 0;

    this.presenceFilter = this.ctx.createBiquadFilter();
    this.presenceFilter.type = 'peaking';
    this.presenceFilter.frequency.value = 4500;
    this.presenceFilter.Q.value = 1.2;
    this.presenceFilter.gain.value = 0;

    // 3. Cabinet Speaker Emulation (2x12" Jensen smooth rolloff)
    this.cabLowCut = this.ctx.createBiquadFilter();
    this.cabLowCut.type = 'highpass';
    this.cabLowCut.frequency.value = 70;

    this.cabHighCut = this.ctx.createBiquadFilter();
    this.cabHighCut.type = 'lowpass';
    this.cabHighCut.frequency.value = 6000;
    this.cabHighCut.Q.value = 0.7;

    // Connect Amp chain cleanly
    this.ampStageInput
      .connect(this.preampShaper)
      .connect(this.bassFilter)
      .connect(this.midFilter)
      .connect(this.trebleFilter)
      .connect(this.presenceFilter)
      .connect(this.cabLowCut)
      .connect(this.cabHighCut)
      .connect(this.ampStageOutput);
  }

  updateAmpSettings({ gain = 4, bass = 5, middle = 5, treble = 5, presence = 5, master = 7, ampModel = '65_twin_reverb', ampDspType = 'clean_blackface' }) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    let bassF = 110, midF = 650, trebF = 3800, presF = 4800, cabCut = 6000, driveMult = 0.30, isTube = true;

    if (ampDspType.startsWith('bass') || ampModel.includes('bass') || ampModel.includes('svx') || ampModel.includes('360')) {
      bassF = 55; midF = 400; trebF = 2400; presF = 3500; cabCut = 4200; driveMult = 0.35;
      isTube = !ampDspType.includes('solid');
    } else if (ampDspType.startsWith('highgain') || ampModel.includes('lead') || ampModel.includes('rect') || ampModel.includes('metal') || ampModel.includes('800') || ampModel.includes('900') || ampModel.includes('5150') || ampModel.includes('vh4') || ampModel.includes('powerball')) {
      bassF = 90; midF = 750; trebF = 3200; presF = 4200; cabCut = 4500; driveMult = 0.75;
      isTube = true;
    } else if (ampDspType.startsWith('crunch') || ampModel.includes('plexi') || ampModel.includes('deluxe') || ampModel.includes('ac30') || ampModel.includes('orange') || ampModel.includes('terror') || ampModel.includes('hiamp')) {
      bassF = 120; midF = 900; trebF = 3600; presF = 4600; cabCut = 5200; driveMult = 0.55;
      isTube = true;
    } else if (ampDspType.includes('solid_state') || ampModel.includes('jazz_amp') || ampModel.includes('jc120')) {
      bassF = 120; midF = 800; trebF = 4000; presF = 5000; cabCut = 7500; driveMult = 0.05;
      isTube = false;
    }

    // Update Filter Frequencies
    this.bassFilter.frequency.setTargetAtTime(bassF, now, 0.05);
    this.midFilter.frequency.setTargetAtTime(midF, now, 0.05);
    this.trebleFilter.frequency.setTargetAtTime(trebF, now, 0.05);
    this.presenceFilter.frequency.setTargetAtTime(presF, now, 0.05);
    this.cabHighCut.frequency.setTargetAtTime(cabCut, now, 0.05);

    // Preamp drive curve
    const normalizedGain = Math.max(0, Math.min(10, gain));
    const driveAmount = (normalizedGain / 10) * driveMult;
    this.preampShaper.curve = isTube 
      ? this.createTubeCurve(driveAmount) 
      : this.createTubeCurve(0.01);

    // Tone stack EQ
    this.bassFilter.gain.setTargetAtTime((bass - 5) * 1.6, now, 0.05);
    this.midFilter.gain.setTargetAtTime((middle - 5) * 1.6, now, 0.05);
    this.trebleFilter.gain.setTargetAtTime((treble - 5) * 1.6, now, 0.05);
    this.presenceFilter.gain.setTargetAtTime((presence - 5) * 1.3, now, 0.05);

    // Master volume (Normalized 0.85x)
    const masterGain = (master / 10) * 0.85;
    this.ampStageOutput.gain.setTargetAtTime(masterGain, now, 0.05);
  }

  rebuildChain(activePedals) {
    if (!this.ctx) return;

    // Disconnect previous chain
    this.inputNode.disconnect();
    this.chainNodes.forEach(nodeGroup => {
      try {
        if (nodeGroup.input) nodeGroup.input.disconnect();
        if (nodeGroup.output) nodeGroup.output.disconnect();
        if (nodeGroup.destroy) nodeGroup.destroy();
      } catch (_) {}
    });
    this.chainNodes = [];

    if (!activePedals || activePedals.length === 0) {
      this.inputNode.connect(this.ampStageInput);
      return;
    }

    let lastOutput = this.inputNode;

    activePedals.forEach(pedal => {
      const dsp = this.createPedalDspNode(pedal);
      if (dsp) {
        lastOutput.connect(dsp.input);
        lastOutput = dsp.output;
        this.chainNodes.push(dsp);
      }
    });

    lastOutput.connect(this.ampStageInput);
  }

  createPedalDspNode(pedal) {
    const { dspType, isBypassed = false, knobValues = {} } = pedal;

    const input = this.ctx.createGain();
    const output = this.ctx.createGain();

    // Direct True Bypass if pedal is turned off
    if (isBypassed) {
      input.connect(output);
      return { id: pedal.instanceId || pedal.id, input, output, isBypassed: true };
    }

    // 1. OVERDRIVE & DISTORTION & FUZZ
    if (dspType.startsWith('overdrive') || dspType.startsWith('distortion') || dspType.startsWith('fuzz')) {
      const isFuzz = dspType.includes('fuzz');
      const isDist = dspType.includes('distortion') || dspType.includes('rat') || dspType.includes('metal');

      const preFilter = this.ctx.createBiquadFilter();
      preFilter.type = 'peaking';
      preFilter.frequency.value = isFuzz ? 400 : 720;
      preFilter.gain.value = isFuzz ? 3 : 4;

      const driveVal = (knobValues.gain || knobValues.overdrive || knobValues.drive || knobValues.dist || knobValues.fuzz || 5) / 10;
      const driveGain = this.ctx.createGain();
      // Controlled drive multiplier to avoid square-wave clipping
      driveGain.gain.value = 1.0 + driveVal * (isFuzz ? 8.0 : isDist ? 5.0 : 2.5);

      const shaper = this.ctx.createWaveShaper();
      shaper.curve = isFuzz 
        ? this.createFuzzCurve(driveVal) 
        : isDist 
          ? this.createHardClipCurve(driveVal) 
          : this.createTubeCurve(driveVal);
      shaper.oversample = '4x';

      const toneFilter = this.ctx.createBiquadFilter();
      toneFilter.type = 'lowpass';
      const toneVal = (knobValues.tone || knobValues.filter || 5) / 10;
      toneFilter.frequency.value = 1200 + toneVal * 4500;

      const postGain = this.ctx.createGain();
      const volVal = (knobValues.level || knobValues.volume || knobValues.out || 7) / 10;
      // Output normalization to preserve unity gain
      postGain.gain.value = (volVal / (1.0 + driveVal * 1.5)) * 1.1;

      input
        .connect(preFilter)
        .connect(driveGain)
        .connect(shaper)
        .connect(toneFilter)
        .connect(postGain)
        .connect(output);

      return { id: pedal.instanceId || pedal.id, input, output };
    }

    // 2. DELAYS
    if (dspType.startsWith('delay')) {
      const delayNode = this.ctx.createDelay(2.0);
      const timeVal = (knobValues.time || knobValues.delay || knobValues.tempo || 320) / 1000;
      delayNode.delayTime.value = Math.max(0.05, Math.min(1.5, timeVal));

      const feedbackGain = this.ctx.createGain();
      const fdbkVal = (knobValues.feedback || knobValues.repeat || knobValues.repeats || knobValues.sustain || 35) / 100;
      feedbackGain.gain.value = Math.min(0.70, fdbkVal * 0.65);

      const dampFilter = this.ctx.createBiquadFilter();
      dampFilter.type = 'lowpass';
      dampFilter.frequency.value = 3200;

      const mixVal = (knobValues.mix || knobValues.level || knobValues.echo || knobValues.blend || 30) / 100;
      const dryGain = this.ctx.createGain();
      const wetGain = this.ctx.createGain();

      dryGain.gain.value = 1.0;
      wetGain.gain.value = mixVal * 0.7;

      // Clean dry path
      input.connect(dryGain).connect(output);

      // Wet feedback loop
      input.connect(delayNode);
      delayNode.connect(dampFilter);
      dampFilter.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      dampFilter.connect(wetGain).connect(output);

      return { id: pedal.instanceId || pedal.id, input, output };
    }

    // 3. MODULATION (Chorus, Flanger, Phaser, Tremolo)
    if (dspType.startsWith('mod')) {
      if (dspType.includes('tremolo')) {
        const tremGain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        const rateVal = knobValues.rate || knobValues.speed || 4;
        const depthVal = (knobValues.depth || knobValues.intensity || 50) / 100;

        lfo.type = 'sine';
        lfo.frequency.value = rateVal;
        lfoGain.gain.value = depthVal * 0.4;

        tremGain.gain.value = 1.0 - depthVal * 0.4;
        lfo.connect(lfoGain).connect(tremGain.gain);
        lfo.start();

        input.connect(tremGain).connect(output);
        return { id: pedal.instanceId || pedal.id, input, output, destroy: () => { try { lfo.stop(); } catch(_) {} } };
      }

      // Chorus / Flanger / Phaser Modulator
      const delayMod = this.ctx.createDelay(0.05);
      const baseDelay = dspType.includes('flanger') ? 0.002 : 0.015;
      delayMod.delayTime.value = baseDelay;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const rateVal = knobValues.rate || knobValues.speed || 1.5;
      const depthVal = (knobValues.depth || knobValues.width || knobValues.intensity || 50) / 100;

      lfo.type = 'sine';
      lfo.frequency.value = rateVal;
      lfoGain.gain.value = baseDelay * depthVal * 0.5;

      lfo.connect(lfoGain).connect(delayMod.delayTime);
      lfo.start();

      const drySig = this.ctx.createGain();
      const wetSig = this.ctx.createGain();
      drySig.gain.value = 0.85;
      wetSig.gain.value = 0.60;

      input.connect(drySig).connect(output);
      input.connect(delayMod).connect(wetSig).connect(output);

      return { id: pedal.instanceId || pedal.id, input, output, destroy: () => { try { lfo.stop(); } catch(_) {} } };
    }

    // 4. DYNAMICS & EQ & GATE
    if (dspType.startsWith('dynamics')) {
      if (dspType.includes('compressor') || dspType.includes('dynacomp')) {
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = knobValues.threshold !== undefined ? knobValues.threshold : -20;
        comp.ratio.value = knobValues.ratio !== undefined ? knobValues.ratio : 3.5;
        comp.attack.value = 0.02;
        comp.release.value = 0.15;

        const compGain = this.ctx.createGain();
        compGain.gain.value = 1.1;

        input.connect(comp).connect(compGain).connect(output);
        return { id: pedal.instanceId || pedal.id, input, output };
      }

      if (dspType.includes('boost') || dspType.includes('trebleboost')) {
        const boostGain = this.ctx.createGain();
        const dbVal = knobValues.boost || knobValues.gain || 4;
        boostGain.gain.value = Math.pow(10, dbVal / 20);

        input.connect(boostGain).connect(output);
        return { id: pedal.instanceId || pedal.id, input, output };
      }

      // Clean transparent Gate
      const gateGain = this.ctx.createGain();
      gateGain.gain.value = 1.0;
      input.connect(gateGain).connect(output);
      return { id: pedal.instanceId || pedal.id, input, output };
    }

    // 5. WAH & FILTERS
    if (dspType.startsWith('filter')) {
      const wahFilter = this.ctx.createBiquadFilter();
      wahFilter.type = 'peaking';
      const pedalPos = (knobValues.pedal !== undefined ? knobValues.pedal : 50) / 100;
      wahFilter.frequency.value = 450 + Math.pow(pedalPos, 1.8) * 2200;
      wahFilter.Q.value = 4.0;
      wahFilter.gain.value = 8;

      input.connect(wahFilter).connect(output);
      return { id: pedal.instanceId || pedal.id, input, output };
    }

    // 6. REVERBS & OTHER
    if (dspType.startsWith('reverb')) {
      const revFilter = this.ctx.createBiquadFilter();
      revFilter.type = 'lowpass';
      revFilter.frequency.value = 4000;

      const revDelay = this.ctx.createDelay(0.2);
      revDelay.delayTime.value = 0.045;

      const fdbk = this.ctx.createGain();
      fdbk.gain.value = 0.35;

      const dry = this.ctx.createGain();
      const wet = this.ctx.createGain();
      dry.gain.value = 1.0;
      wet.gain.value = (knobValues.mix || 30) / 100 * 0.4;

      input.connect(dry).connect(output);
      input.connect(revFilter).connect(revDelay);
      revDelay.connect(fdbk).connect(revDelay);
      revDelay.connect(wet).connect(output);

      return { id: pedal.instanceId || pedal.id, input, output };
    }

    // Fallback: Clean pass-through
    input.connect(output);
    return { id: pedal.instanceId || pedal.id, input, output };
  }

  // Musical, smooth non-linear waveshaping curves (No harsh digital clipping)
  createTubeCurve(amount) {
    const k = 1.0 + Math.max(0, amount) * 4.0;
    const n = 2048;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = Math.tanh(k * x) / Math.tanh(k);
    }
    return curve;
  }

  createHardClipCurve(amount) {
    const gain = 1.0 + amount * 3.0;
    const n = 2048;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = ((i * 2) / n - 1) * gain;
      curve[i] = Math.max(-0.95, Math.min(0.95, Math.tanh(x * 1.5)));
    }
    return curve;
  }

  createFuzzCurve(amount) {
    const gain = 1.0 + amount * 6.0;
    const n = 2048;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = ((i * 2) / n - 1) * gain;
      curve[i] = Math.tanh(x) * 0.9;
    }
    return curve;
  }
}
