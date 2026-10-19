import React, { useState, useEffect, useRef } from 'react';
import { globalAudio } from '../audio/audioManager';
import { BACKING_TRACKS } from '../data/sampleSongs';
import { 
  Radio, 
  Volume2, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Sliders, 
  Zap,
  Sparkles,
  Music
} from 'lucide-react';

export default function ToolsSideDock({
  pitchData,
  chordData,
  isAudible = false,
  rmsLevel = 0,
  onOpenFullPedalboard
}) {
  // Metronome State
  const [bpm, setBpm] = useState(116);
  const [timeSig, setTimeSig] = useState(4); // 4/4, 3/4, 6/8
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [speedTrainer, setSpeedTrainer] = useState(false);

  // FX Mini-Rack State
  const [fxState, setFxState] = useState(() => {
    if (globalAudio.fxChain) {
      return JSON.parse(JSON.stringify(globalAudio.fxChain.state));
    }
    return {
      drive: { enabled: false, gain: 2.5, tone: 3800, level: 1.0 },
      delay: { enabled: false, time: 0.35, feedback: 0.25, mix: 0.2 },
      reverb: { enabled: false, decay: 1.8, mix: 0.22 }
    };
  });

  // Backing Track State
  const [playingTrackId, setPlayingTrackId] = useState(null);

  // Metronome Audio & Beat Timer
  const metronomeTimerRef = useRef(null);
  const barCountRef = useRef(0);

  const playClick = (isAccent) => {
    if (!globalAudio.audioContext) return;
    const ctx = globalAudio.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isAccent ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, ctx.currentTime);

    gain.gain.setValueAtTime(isAccent ? 0.35 : 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  };

  useEffect(() => {
    if (!isMetronomePlaying) {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      setCurrentBeat(0);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;

    metronomeTimerRef.current = setInterval(() => {
      setCurrentBeat(prevBeat => {
        const nextBeat = (prevBeat + 1) % timeSig;
        playClick(nextBeat === 0);

        if (nextBeat === 0) {
          barCountRef.current += 1;
          if (speedTrainer && barCountRef.current % 4 === 0) {
            setBpm(b => Math.min(260, b + 2));
          }
        }
        return nextBeat;
      });
    }, intervalMs);

    return () => {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    };
  }, [isMetronomePlaying, bpm, timeSig, speedTrainer]);

  // Sync FX Mini-rack toggles with DSP engine
  const handleToggleFx = (moduleName) => {
    if (globalAudio.fxChain) {
      globalAudio.fxChain.toggleModule(moduleName);
      setFxState(JSON.parse(JSON.stringify(globalAudio.fxChain.state)));
    }
  };

  // Chromatic Tuner Needle Calculation
  const targetNote = pitchData ? pitchData.note : 'E';
  const targetCents = pitchData ? pitchData.cents : 0;
  const targetHz = pitchData ? pitchData.frequency.toFixed(1) : '82.4';
  const isTuned = isAudible && Math.abs(targetCents) <= 5;
  const needleAngle = Math.max(-45, Math.min(45, (targetCents / 50) * 45));

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col gap-4 p-4 bg-[#0d131f]/95 border-l border-slate-800/80 overflow-y-auto custom-scrollbar select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Tools & Effects Rack</span>
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* 1. CHROMATIC TUNER GAUGE (ARC NEEDLE) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center relative overflow-hidden">
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Afinador Cromático
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
            isTuned 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {isTuned ? 'AFINADO' : `${targetCents > 0 ? '+' : ''}${targetCents}¢`}
          </span>
        </div>

        {/* Arc Gauge Visual */}
        <div className="relative w-48 h-24 flex items-end justify-center">
          {/* Arc Background Track */}
          <svg className="w-48 h-24 overflow-visible" viewBox="0 0 160 80">
            <path
              d="M 15 75 A 65 65 0 0 1 145 75"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Center In-Tune Notch */}
            <path
              d="M 75 12 A 65 65 0 0 1 85 12"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>

          {/* Needle */}
          <div 
            className="absolute bottom-1 w-1 h-16 origin-bottom bg-gradient-to-t from-sky-500 to-white rounded-full transition-transform duration-100 shadow-md"
            style={{ 
              transform: `rotate(${needleAngle}deg)`,
              backgroundColor: isTuned ? '#10b981' : '#38bdf8'
            }}
          />

          {/* Central Note Letter Display */}
          <div className="absolute bottom-0 text-center">
            <div className={`text-3xl font-black font-mono tracking-tighter ${
              isTuned ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'text-white'
            }`}>
              {isAudible ? targetNote : '--'}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              {isAudible ? `${targetHz} Hz` : 'Toque uma corda'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROGRESSIVE METRONOME */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Metrônomo
          </span>
          <button
            onClick={() => setSpeedTrainer(!speedTrainer)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
              speedTrainer 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-slate-800 text-slate-500'
            }`}
            title="Aumenta +2 BPM a cada 4 compassos"
          >
            Trainer {speedTrainer ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* BPM Display & Stepper */}
        <div className="flex items-center justify-between bg-[#090d16] p-2.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setBpm(b => Math.max(30, b - 5))}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center"
          >
            -5
          </button>

          <div className="text-center">
            <div className="text-xl font-black font-mono text-white flex items-center justify-center gap-1">
              <span>{bpm}</span>
              <span className="text-[10px] text-slate-400 font-normal">BPM</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">{timeSig}/4</div>
          </div>

          <button
            onClick={() => setBpm(b => Math.min(260, b + 5))}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center"
          >
            +5
          </button>
        </div>

        {/* Beat Indicator LEDs */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: timeSig }).map((_, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all ${
                isMetronomePlaying && currentBeat === idx
                  ? idx === 0 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/50 scale-110' 
                    : 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/50 scale-110'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Play/Stop Button & Time Signatures */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md ${
              isMetronomePlaying
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
            }`}
          >
            {isMetronomePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isMetronomePlaying ? 'Parar' : 'Iniciar'}</span>
          </button>

          <div className="flex gap-1 bg-[#090d16] p-1 rounded-xl border border-slate-800">
            {[4, 3, 6].map(ts => (
              <button
                key={ts}
                onClick={() => setTimeSig(ts)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  timeSig === ts ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {ts}/4
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MINI EFFECTS RACK (OVERDRIVE / DELAY / REVERB) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Mini Effects Rack
          </span>
          <button
            onClick={onOpenFullPedalboard}
            className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
          >
            Pedaleira Pro
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Compact Vertical Stompboxes */}
        <div className="grid grid-cols-3 gap-2">
          {/* Drive Pedal */}
          <div 
            onClick={() => handleToggleFx('drive')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
              fxState.drive?.enabled
                ? 'bg-amber-950/40 border-amber-500/80 shadow-md shadow-amber-500/20'
                : 'bg-[#090d16] border-slate-800 opacity-60'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${fxState.drive?.enabled ? 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-black text-amber-300 tracking-tight my-1">DRIVE</span>
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-300 font-mono">
              TS
            </div>
          </div>

          {/* Delay Pedal */}
          <div 
            onClick={() => handleToggleFx('delay')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
              fxState.delay?.enabled
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/20'
                : 'bg-[#090d16] border-slate-800 opacity-60'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${fxState.delay?.enabled ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-black text-emerald-300 tracking-tight my-1">DELAY</span>
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-300 font-mono">
              ECHO
            </div>
          </div>

          {/* Reverb Pedal */}
          <div 
            onClick={() => handleToggleFx('reverb')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
              fxState.reverb?.enabled
                ? 'bg-sky-950/40 border-sky-500/80 shadow-md shadow-sky-500/20'
                : 'bg-[#090d16] border-slate-800 opacity-60'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${fxState.reverb?.enabled ? 'bg-sky-400 animate-pulse shadow-sm shadow-sky-400' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-black text-sky-300 tracking-tight my-1">REVERB</span>
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-300 font-mono">
              HALL
            </div>
          </div>
        </div>
      </div>

      {/* 4. BACKING TRACKS QUICK LAUNCHER */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            Backing Tracks
          </span>
          <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Jam
          </span>
        </div>

        <div className="space-y-2">
          {BACKING_TRACKS.slice(0, 3).map(track => (
            <div
              key={track.id}
              className="bg-[#090d16] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 hover:border-indigo-500/50 transition group"
            >
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-200 truncate">{track.title}</div>
                <div className="text-[10px] text-indigo-400 font-medium truncate">{track.scale}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 flex-shrink-0">
                {track.bpm} BPM
              </span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
