/**
 * High-performance pitch detector using Normalized Square Difference Function (NSDF) / MPM
 * with parabolic interpolation for accurate guitar tuning and single-note tracking.
 */
import { frequencyToNote } from './chordDictionary.js';

export class PitchDetector {
  constructor(sampleRate = 44100, bufferSize = 2048) {
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    this.nsdfBuffer = new Float32Array(bufferSize);
    this.minFreq = 65;   // Below Low E (E2 ~ 82.4Hz)
    this.maxFreq = 1200; // Above high notes on 24th fret
    this.cutoff = 0.85;  // Peak threshold for pitch confidence
  }

  setSampleRate(rate) {
    this.sampleRate = rate;
  }

  /**
   * Calculates RMS (volume energy) of the buffer.
   */
  getRMS(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  /**
   * Detects the fundamental pitch from time-domain audio samples.
   * @param {Float32Array} floatBuffer - Time domain audio buffer (-1.0 to 1.0)
   * @param {number} noiseThreshold - Minimum RMS to consider audio active (e.g. 0.01)
   * @returns {Object|null} Detected pitch info or null if silent/unpitched
   */
  detectPitch(floatBuffer, noiseThreshold = 0.012) {
    const rms = this.getRMS(floatBuffer);
    if (rms < noiseThreshold) {
      return null;
    }

    const maxLag = Math.floor(this.sampleRate / this.minFreq);
    const minLag = Math.floor(this.sampleRate / this.maxFreq);
    const bufferLength = floatBuffer.length;

    // 1. Calculate Normalized Square Difference Function (NSDF)
    for (let tau = 0; tau < maxLag && tau < bufferLength; tau++) {
      let acf = 0;
      let divisorM = 0;
      for (let i = 0; i < bufferLength - tau; i++) {
        acf += floatBuffer[i] * floatBuffer[i + tau];
        divisorM += floatBuffer[i] * floatBuffer[i] + floatBuffer[i + tau] * floatBuffer[i + tau];
      }
      this.nsdfBuffer[tau] = divisorM > 0.00001 ? (2 * acf) / divisorM : 0;
    }

    // 2. Find turning points and highest peak candidate
    const maxPositions = [];
    let pos = 0;
    let curMaxPos = 0;

    // Find first zero crossing
    while (pos < (maxLag - 1) / 2 && this.nsdfBuffer[pos] > 0) {
      pos++;
    }
    while (pos < (maxLag - 1) / 2 && this.nsdfBuffer[pos] <= 0) {
      pos++;
    }

    if (pos === 0) pos = 1;

    while (pos < maxLag - 1) {
      if (this.nsdfBuffer[pos] > this.nsdfBuffer[pos - 1] && this.nsdfBuffer[pos] >= this.nsdfBuffer[pos + 1]) {
        if (curMaxPos === 0) {
          curMaxPos = pos;
        } else if (this.nsdfBuffer[pos] > this.nsdfBuffer[curMaxPos]) {
          curMaxPos = pos;
        }
      }
      pos++;
      if (pos < maxLag - 1 && this.nsdfBuffer[pos] <= 0) {
        if (curMaxPos > 0) {
          maxPositions.push(curMaxPos);
          curMaxPos = 0;
        }
        while (pos < maxLag - 1 && this.nsdfBuffer[pos] <= 0) {
          pos++;
        }
      }
    }
    if (curMaxPos > 0) {
      maxPositions.push(curMaxPos);
    }

    if (maxPositions.length === 0) {
      return null;
    }

    // 3. Find highest peak with confidence threshold
    let highestPeak = 0;
    let bestTau = 0;

    for (let i = 0; i < maxPositions.length; i++) {
      const idx = maxPositions[i];
      if (this.nsdfBuffer[idx] > highestPeak) {
        highestPeak = this.nsdfBuffer[idx];
      }
    }

    const threshold = highestPeak * this.cutoff;
    for (let i = 0; i < maxPositions.length; i++) {
      const idx = maxPositions[i];
      if (this.nsdfBuffer[idx] >= threshold) {
        bestTau = idx;
        break;
      }
    }

    if (bestTau < minLag || highestPeak < 0.35) {
      return null;
    }

    // 4. Parabolic interpolation for sub-sample accuracy
    let delta = 0;
    if (bestTau > 0 && bestTau < maxLag - 1) {
      const y1 = this.nsdfBuffer[bestTau - 1];
      const y2 = this.nsdfBuffer[bestTau];
      const y3 = this.nsdfBuffer[bestTau + 1];
      const bottom = 2 * (2 * y2 - y1 - y3);
      if (bottom !== 0) {
        delta = (y3 - y1) / bottom;
      }
    }

    const trueTau = bestTau + delta;
    const frequency = this.sampleRate / trueTau;

    if (frequency < this.minFreq || frequency > this.maxFreq) {
      return null;
    }

    const noteData = frequencyToNote(frequency);
    if (!noteData) return null;

    return {
      ...noteData,
      confidence: Math.min(1, Math.max(0, highestPeak)),
      volume: rms
    };
  }
}
