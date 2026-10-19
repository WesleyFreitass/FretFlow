import React, { useState } from 'react';
import AudioVisualizer from './AudioVisualizer';
import { 
  Radio, 
  CheckCircle2, 
  Volume2, 
  Sliders, 
  HelpCircle, 
  Activity,
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

export const TUNING_PRESETS = [
  {
    id: 'standard',
    name: 'Padrão (E Standard — E A D G B e)',
    description: 'Afinação padrão universal para guitarra e violão.',
    strings: [
      { name: 'e', note: 'E', octave: 4, freq: 329.63, stringNum: 1, label: '1ª Mi (Aguda)' },
      { name: 'B', note: 'B', octave: 3, freq: 246.94, stringNum: 2, label: '2ª Si' },
      { name: 'G', note: 'G', octave: 3, freq: 196.00, stringNum: 3, label: '3ª Sol' },
      { name: 'D', note: 'D', octave: 3, freq: 146.83, stringNum: 4, label: '4ª Ré' },
      { name: 'A', note: 'A', octave: 2, freq: 110.00, stringNum: 5, label: '5ª Lá' },
      { name: 'E', note: 'E', octave: 2, freq: 82.41, stringNum: 6, label: '6ª Mi (Grave)' }
    ]
  },
  {
    id: 'half_step_down',
    name: 'Meio Tom Abaixo (Eb / D# — Hendrix / SRV)',
    description: 'Afinação meio tom abaixo, clássica do Blues e Hard Rock (Guns, Hendrix).',
    strings: [
      { name: 'eb', note: 'D#', octave: 4, freq: 311.13, stringNum: 1, label: '1ª Mib' },
      { name: 'Bb', note: 'A#', octave: 3, freq: 233.08, stringNum: 2, label: '2ª Sib' },
      { name: 'Gb', note: 'F#', octave: 3, freq: 185.00, stringNum: 3, label: '3ª Solb' },
      { name: 'Db', note: 'C#', octave: 3, freq: 138.59, stringNum: 4, label: '4ª Réb' },
      { name: 'Ab', note: 'G#', octave: 2, freq: 103.83, stringNum: 5, label: '5ª Láb' },
      { name: 'Eb', note: 'D#', octave: 2, freq: 77.78, stringNum: 6, label: '6ª Mib' }
    ]
  },
  {
    id: 'drop_d',
    name: 'Drop D (D A D G B e — Rock / Heavy)',
    description: '6ª corda rebaixada para Ré (D). Permite power chords de 1 dedo.',
    strings: [
      { name: 'e', note: 'E', octave: 4, freq: 329.63, stringNum: 1, label: '1ª Mi' },
      { name: 'B', note: 'B', octave: 3, freq: 246.94, stringNum: 2, label: '2ª Si' },
      { name: 'G', note: 'G', octave: 3, freq: 196.00, stringNum: 3, label: '3ª Sol' },
      { name: 'D', note: 'D', octave: 3, freq: 146.83, stringNum: 4, label: '4ª Ré' },
      { name: 'A', note: 'A', octave: 2, freq: 110.00, stringNum: 5, label: '5ª Lá' },
      { name: 'D', note: 'D', octave: 2, freq: 73.42, stringNum: 6, label: '6ª Ré (Drop)' }
    ]
  },
  {
    id: 'drop_c',
    name: 'Drop C (C G C F A d — Metalcore / Nu-Metal)',
    description: 'Afinação pesada e encorpada para riffs graves com alto ganho.',
    strings: [
      { name: 'd', note: 'D', octave: 4, freq: 293.66, stringNum: 1, label: '1ª Ré' },
      { name: 'A', note: 'A', octave: 3, freq: 220.00, stringNum: 2, label: '2ª Lá' },
      { name: 'F', note: 'F', octave: 3, freq: 174.61, stringNum: 3, label: '3ª Fá' },
      { name: 'C', note: 'C', octave: 3, freq: 130.81, stringNum: 4, label: '4ª Dó' },
      { name: 'G', note: 'G', octave: 2, freq: 98.00, stringNum: 5, label: '5ª Sol' },
      { name: 'C', note: 'C', octave: 2, freq: 65.41, stringNum: 6, label: '6ª Dó (Drop)' }
    ]
  },
  {
    id: 'dadgad',
    name: 'DADGAD (Folk / Céltica — Kashmir)',
    description: 'Afinação modal com sonoridade aberta, rica em harmônicos.',
    strings: [
      { name: 'D', note: 'D', octave: 4, freq: 293.66, stringNum: 1, label: '1ª Ré' },
      { name: 'A', note: 'A', octave: 3, freq: 220.00, stringNum: 2, label: '2ª Lá' },
      { name: 'G', note: 'G', octave: 3, freq: 196.00, stringNum: 3, label: '3ª Sol' },
      { name: 'D', note: 'D', octave: 3, freq: 146.83, stringNum: 4, label: '4ª Ré' },
      { name: 'A', note: 'A', octave: 2, freq: 110.00, stringNum: 5, label: '5ª Lá' },
      { name: 'D', note: 'D', octave: 2, freq: 73.42, stringNum: 6, label: '6ª Ré' }
    ]
  },
  {
    id: 'open_d',
    name: 'Open D (D A D F# A d — Slide / Blues)',
    description: 'Acorde de Ré Maior soando com todas as cordas soltas.',
    strings: [
      { name: 'd', note: 'D', octave: 4, freq: 293.66, stringNum: 1, label: '1ª Ré' },
      { name: 'A', note: 'A', octave: 3, freq: 220.00, stringNum: 2, label: '2ª Lá' },
      { name: 'F#', note: 'F#', octave: 3, freq: 185.00, stringNum: 3, label: '3ª Fá#' },
      { name: 'D', note: 'D', octave: 3, freq: 146.83, stringNum: 4, label: '4ª Ré' },
      { name: 'A', note: 'A', octave: 2, freq: 110.00, stringNum: 5, label: '5ª Lá' },
      { name: 'D', note: 'D', octave: 2, freq: 73.42, stringNum: 6, label: '6ª Ré' }
    ]
  },
  {
    id: 'open_g',
    name: 'Open G (D G D G B d — Rolling Stones)',
    description: 'Acorde de Sol Maior aberto. Clássico de Keith Richards.',
    strings: [
      { name: 'd', note: 'D', octave: 4, freq: 293.66, stringNum: 1, label: '1ª Ré' },
      { name: 'B', note: 'B', octave: 3, freq: 246.94, stringNum: 2, label: '2ª Si' },
      { name: 'G', note: 'G', octave: 3, freq: 196.00, stringNum: 3, label: '3ª Sol' },
      { name: 'D', note: 'D', octave: 3, freq: 146.83, stringNum: 4, label: '4ª Ré' },
      { name: 'G', note: 'G', octave: 2, freq: 98.00, stringNum: 5, label: '5ª Sol' },
      { name: 'D', note: 'D', octave: 2, freq: 73.42, stringNum: 6, label: '6ª Ré' }
    ]
  }
];

export default function TunerTab({ 
  pitchData, 
  chordData, 
  chromagram = new Array(12).fill(0), 
  timeDomainBuffer, 
  frequencyBuffer, 
  isAudible, 
  rmsLevel = 0 
}) {
  const [selectedTuning, setSelectedTuning] = useState(TUNING_PRESETS[0]);
  const [targetStringIndex, setTargetStringIndex] = useState(null);

  // Closest string detection in current tuning preset
  const closestString = pitchData && isAudible
    ? selectedTuning.strings.reduce((closest, str) => {
        const diff = Math.abs(str.freq - pitchData.frequency);
        const closestDiff = Math.abs(closest.freq - pitchData.frequency);
        return diff < closestDiff ? str : closest;
      }, selectedTuning.strings[0])
    : null;

  const currentString = targetStringIndex !== null 
    ? selectedTuning.strings[targetStringIndex] 
    : closestString;

  // Exact target frequency for precise cents calculation against the selected string/preset
  const targetFreq = currentString ? currentString.freq : (pitchData ? pitchData.standardFreq : 440);

  const cents = (pitchData && isAudible && targetFreq)
    ? Math.round(1200 * Math.log2(pitchData.frequency / targetFreq))
    : 0;

  const isTuned = isAudible && pitchData && Math.abs(cents) <= 4;
  const isFlat = isAudible && pitchData && cents < -4;
  const isSharp = isAudible && pitchData && cents > 4;

  // Gauge needle position: 0 to 100% (centered at 50% for 0 cents)
  const gaugePercent = isAudible && pitchData
    ? Math.max(0, Math.min(100, 50 + (cents / 50) * 50))
    : 50;

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto font-sans">
      
      {/* 1. Top Header Card */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
            <Radio className="w-5 h-5 text-oficina-terracotta" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
              <span>Afinador</span>
              <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                DSP 44.1kHz
              </span>
            </h2>
            <p className="text-xs text-oficina-bodyText">
              {selectedTuning.description}
            </p>
          </div>
        </div>

        {/* Tuning Selector Dropdown */}
        <div className="flex items-center gap-2 bg-oficina-surface px-3 py-1.5 rounded-sm border border-oficina-border">
          <span className="text-xs text-oficina-mutedText font-mono font-bold">Afinação:</span>
          <select
            value={selectedTuning.id}
            onChange={(e) => {
              const tuning = TUNING_PRESETS.find(t => t.id === e.target.value);
              if (tuning) {
                setSelectedTuning(tuning);
                setTargetStringIndex(null);
              }
            }}
            className="bg-oficina-card text-xs font-mono font-bold text-oficina-darkText border border-oficina-border rounded-sm px-2.5 py-1 focus:outline-none focus:border-oficina-darkText"
          >
            {TUNING_PRESETS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Main Tuner Stage (Oficina Boutique Look) */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-6 lg:p-8 shadow-sm space-y-6">
        
        {/* Header line with Cents Status & Action Advice */}
        <div className="flex justify-between items-baseline border-b border-oficina-borderLight pb-3">
          <div className="font-mono text-xs tracking-[0.14em] text-oficina-mutedText uppercase font-bold">
            LEITURA EM TEMPO REAL · {selectedTuning.name.split('(')[0].trim()}
          </div>
          <div className={`font-mono text-xs font-bold ${
            isTuned 
              ? 'text-oficina-olive font-black' 
              : isAudible 
                ? 'text-oficina-terracotta' 
                : 'text-oficina-mutedText'
          }`}>
            {isTuned 
              ? 'AFINADO 0¢ (PERFEITO ✓)' 
              : isFlat 
                ? `APERTE A TARRACHA (GRAVE ${cents}¢)` 
                : isSharp 
                  ? `AFROUXE A TARRACHA (AGUDO +${cents}¢)` 
                  : 'AGUARDANDO SINAL...'}
          </div>
        </div>

        {/* Note Display & Hertz */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl lg:text-8xl font-black tracking-tighter text-oficina-darkText leading-none font-sans">
              {pitchData && isAudible ? (currentString ? currentString.name : pitchData.noteName) : '--'}
            </span>
            <span className="text-2xl font-bold text-[#a5a093]">
              {pitchData && isAudible ? (currentString ? currentString.octave : pitchData.octave) : ''}
            </span>
          </div>

          <div className="font-mono text-xs text-oficina-bodyText text-right">
            {pitchData && isAudible ? (
              <div className="space-y-0.5">
                <div className="font-bold text-oficina-darkText">
                  {pitchData.frequency.toFixed(2)} Hz · Alvo: {targetFreq.toFixed(2)} Hz
                </div>
                <div className="text-oficina-mutedText text-[11px]">
                  {currentString ? `${currentString.label}` : 'Nota Cromática'}
                </div>
              </div>
            ) : (
              <span>Toque uma corda solta da guitarra...</span>
            )}
          </div>
        </div>

        {/* Gauge Bar */}
        <div className="space-y-2 pt-2">
          <div className="h-7 bg-[#eae6da] border border-oficina-border rounded-[2px] relative overflow-hidden">
            {/* Center target zone */}
            <div className="absolute left-[47%] right-[47%] top-0 bottom-0 bg-oficina-oliveLight border-x border-oficina-olive/40 z-0"></div>
            
            {/* Indicator needle */}
            <div 
              className={`absolute top-0 bottom-0 w-1 transition-all duration-75 z-10 -translate-x-1/2 ${
                isTuned ? 'bg-oficina-olive shadow-sm' : 'bg-oficina-terracotta'
              }`}
              style={{ left: `${gaugePercent}%` }}
            />
          </div>

          <div className="flex justify-between font-mono text-[10px] text-oficina-mutedText font-semibold">
            <span>-50¢ (Grave / Aperte)</span>
            <span className="text-oficina-olive font-bold">0¢ (Afinado)</span>
            <span>+50¢ (Agudo / Afrouxe)</span>
          </div>
        </div>

        {/* 6 Guitar String Selector Badges for this Preset */}
        <div className="space-y-2 pt-4 border-t border-oficina-borderLight">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold text-oficina-mutedText uppercase tracking-[0.14em]">
            <span>CORDAS DO PRESET ({selectedTuning.name.split('(')[0].trim()}):</span>
            <span className="text-oficina-bodyText">Clique em uma corda para travar a afinação</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1 w-full">
            <button
              onClick={() => setTargetStringIndex(null)}
              className={`px-2 py-2 rounded-[2px] font-mono text-[11px] font-bold border transition text-center truncate ${
                targetStringIndex === null
                  ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-sm'
                  : 'bg-oficina-card border-oficina-border text-oficina-bodyText hover:border-oficina-borderDark'
              }`}
              title="Auto-Detectar Corda"
            >
              Auto-Detectar
            </button>

            {selectedTuning.strings.map((str, idx) => {
              const isSelected = targetStringIndex === idx;
              const isDetected = closestString && closestString.stringNum === str.stringNum && isAudible;

              return (
                <button
                  key={idx}
                  onClick={() => setTargetStringIndex(idx)}
                  className={`px-2 py-2 rounded-[2px] font-mono text-[11px] font-bold border transition text-center truncate flex items-center justify-center gap-1 ${
                    isSelected || isDetected
                      ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-sm'
                      : 'bg-oficina-card border-oficina-border text-oficina-bodyText hover:border-oficina-borderDark'
                  }`}
                  title={`${str.stringNum}ª ${str.name} (${str.freq.toFixed(1)}Hz)`}
                >
                  <span>{str.stringNum}ª {str.name} ({str.freq.toFixed(1)}Hz)</span>
                  {isDetected && isTuned && <span className="text-oficina-oliveGlow text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Real-Time Oscilloscope & Chromagram Spectrum Visualizer */}
      <AudioVisualizer
        timeDomainBuffer={timeDomainBuffer}
        frequencyBuffer={frequencyBuffer}
        chromagram={chromagram}
        isAudible={isAudible}
        highlightNotes={pitchData && isAudible ? [pitchData.noteName] : []}
      />

    </div>
  );
}
