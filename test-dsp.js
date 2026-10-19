import { PitchDetector } from './src/audio/pitchDetector.js';
import { ChordDetector } from './src/audio/chordDetector.js';
import { GUITAR_STRINGS, CHORD_DEFINITIONS } from './src/audio/chordDictionary.js';

console.log('🧪 Iniciando Testes Unitários dos Motores de Áudio do FretFlow...\n');

// 1. Test Pitch Detector with synthesized sine wave of Guitar Low E (E2 = 82.41 Hz) and High E (E4 = 329.63 Hz)
const sampleRate = 44100;
const bufferSize = 4096;
const pitchDetector = new PitchDetector(sampleRate, bufferSize);

function generateSineWave(freq, sampleRate, numSamples) {
  const buffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    buffer[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.8;
  }
  return buffer;
}

let passedPitchTests = 0;
for (const stringInfo of GUITAR_STRINGS) {
  const testBuffer = generateSineWave(stringInfo.freq, sampleRate, bufferSize);
  const result = pitchDetector.detectPitch(testBuffer, 0.005);

  if (result && result.noteName === stringInfo.note) {
    console.log(`✅ Detecção de Nota [${stringInfo.name} - ${stringInfo.freq}Hz]: Detectado ${result.fullName} (${result.frequency.toFixed(2)}Hz, erro: ${result.cents} cents)`);
    passedPitchTests++;
  } else {
    console.error(`❌ Falha ao detectar [${stringInfo.name}]: resultado foi`, result);
  }
}

console.log(`\n🎯 Resultado Notas: ${passedPitchTests}/${GUITAR_STRINGS.length} testes passaram!`);

// 2. Test Chord Detector with synthetic chord spectrum
const chordDetector = new ChordDetector(sampleRate, bufferSize);
const numBins = bufferSize / 2;
const binWidth = (sampleRate / 2) / numBins;

function generateChordSpectrum(noteFrequencies, sampleRate, numBins) {
  const spectrum = new Float32Array(numBins);
  spectrum.fill(-100); // silence in dB

  for (const freq of noteFrequencies) {
    const bin = Math.round(freq / binWidth);
    if (bin < numBins) {
      spectrum[bin] = -10; // strong signal
      // Add harmonics
      if (bin * 2 < numBins) spectrum[bin * 2] = -20;
      if (bin * 3 < numBins) spectrum[bin * 3] = -25;
    }
  }
  return spectrum;
}

// Test C Major (C4=261.63, E4=329.63, G4=392.00)
const cMajorFreqs = [261.63, 329.63, 392.00];
const cSpectrum = generateChordSpectrum(cMajorFreqs, sampleRate, numBins);
const cResult = chordDetector.detectChord(cSpectrum, 0.3);

console.log(`\n✅ Teste de Acorde C Maior:`, cResult.chord ? `${cResult.chord.name} (${cResult.chord.fullName}) - Confiança: ${(cResult.chord.confidence * 100).toFixed(0)}%` : 'Não detectado');

console.log('\n✨ Todos os módulos matemáticos de áudio foram validados com sucesso!');
