import React, { useState, useEffect, useRef } from 'react';
import Highway3DCanvas from './Highway3DCanvas';
import { SAMPLE_SONGS } from '../data/sampleSongs';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Repeat, 
  Zap, 
  Flame, 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  Volume2,
  Sliders,
  ChevronDown
} from 'lucide-react';

export default function MainStage({
  selectedSong = SAMPLE_SONGS[0],
  onSelectSong,
  pitchData,
  chordData,
  isAudible = false,
  rmsLevel = 0
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 1.0, 0.9, 0.75, 0.5
  const [gameMode, setGameMode] = useState('solo'); // 'solo' | 'chords'

  // A-B Loop State
  const [loopA, setLoopA] = useState(null);
  const [loopB, setLoopB] = useState(null);
  const [isLoopActive, setIsLoopActive] = useState(false);

  // Gamification State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [streakDays, setStreakDays] = useState(124);
  const [evaluatedEvents, setEvaluatedEvents] = useState({});
  const [liveFeedback, setLiveFeedback] = useState(null);

  const animationTimerRef = useRef(null);
  const pitchDataRef = useRef(pitchData);
  pitchDataRef.current = pitchData;
  const chordDataRef = useRef(chordData);
  chordDataRef.current = chordData;

  // Multiplier logic: 1x, 2x (combo 10), 3x (combo 20), 4x (combo 30+)
  const multiplier = combo >= 30 ? 4 : combo >= 20 ? 3 : combo >= 10 ? 2 : 1;

  // Real-time evaluation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationTimerRef.current) cancelAnimationFrame(animationTimerRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now) => {
      const deltaSeconds = ((now - lastTimestamp) / 1000) * playbackSpeed;
      lastTimestamp = now;

      setCurrentTime(prevTime => {
        let nextTime = prevTime + deltaSeconds;

        // Loop A-B logic
        if (isLoopActive && loopA !== null && loopB !== null && nextTime >= loopB) {
          nextTime = loopA;
        }

        // Evaluate Solo Notes or Chords
        if (gameMode === 'solo' && selectedSong.soloNotes) {
          selectedSong.soloNotes.forEach((noteEv, idx) => {
            const hitWindowStart = noteEv.time - 0.2;
            const hitWindowEnd = noteEv.time + 0.6;

            if (nextTime >= hitWindowStart && nextTime <= hitWindowEnd && !evaluatedEvents[idx]) {
              const detected = pitchDataRef.current;
              if (detected && detected.note === noteEv.note) {
                // Perfect Hit!
                setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'hit' } }));
                setScore(s => s + (150 * multiplier));
                setCombo(c => {
                  const nextC = c + 1;
                  setMaxCombo(mc => Math.max(mc, nextC));
                  return nextC;
                });
                setLiveFeedback({ text: `PERFEITO! +${150 * multiplier}`, type: 'perfect', id: Date.now() });
              }
            } else if (nextTime > (noteEv.time + 0.8) && !evaluatedEvents[idx]) {
              // Miss
              setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'miss' } }));
              setCombo(0);
              setLiveFeedback({ text: 'ERROU A NOTA', type: 'miss', id: Date.now() });
            }
          });
        } else if (selectedSong.events) {
          // Evaluate Chords
          selectedSong.events.forEach((chordEv, idx) => {
            const hitWindowStart = chordEv.time;
            const hitWindowEnd = chordEv.time + 1.2;

            if (nextTime >= hitWindowStart && nextTime <= hitWindowEnd && !evaluatedEvents[idx]) {
              const detected = chordDataRef.current;
              if (detected && detected.name === chordEv.chord) {
                setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'hit' } }));
                setScore(s => s + (150 * multiplier));
                setCombo(c => {
                  const nextC = c + 1;
                  setMaxCombo(mc => Math.max(mc, nextC));
                  return nextC;
                });
                setLiveFeedback({ text: `PERFEITO! +${150 * multiplier}`, type: 'perfect', id: Date.now() });
              }
            } else if (nextTime > (chordEv.time + 1.5) && !evaluatedEvents[idx]) {
              setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'miss' } }));
              setCombo(0);
              setLiveFeedback({ text: 'ERROU O ACORDE', type: 'miss', id: Date.now() });
            }
          });
        }

        return nextTime;
      });

      animationTimerRef.current = requestAnimationFrame(loop);
    };

    animationTimerRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationTimerRef.current) cancelAnimationFrame(animationTimerRef.current);
    };
  }, [isPlaying, selectedSong, evaluatedEvents, playbackSpeed, isLoopActive, loopA, loopB, gameMode, multiplier]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(loopA !== null && isLoopActive ? loopA : 0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setEvaluatedEvents({});
    setLiveFeedback(null);
  };

  // Loop A-B Setter
  const handleToggleLoopAB = () => {
    if (loopA === null) {
      setLoopA(currentTime);
      setLiveFeedback({ text: `LOOP A DEFINIDO: ${currentTime.toFixed(1)}s`, type: 'good', id: Date.now() });
    } else if (loopB === null) {
      setLoopB(Math.max(loopA + 2, currentTime));
      setIsLoopActive(true);
      setLiveFeedback({ text: `LOOP ATIVADO (A -> B)`, type: 'perfect', id: Date.now() });
    } else {
      setLoopA(null);
      setLoopB(null);
      setIsLoopActive(false);
      setLiveFeedback({ text: 'LOOP DESATIVADO', type: 'good', id: Date.now() });
    }
  };

  // Total song length approx 4:12 (252s)
  const totalDuration = 252;
  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0b0f17] overflow-hidden relative select-none">
      
      {/* 1. TOP HEADER HUD BAR */}
      <header className="h-16 px-6 border-b border-slate-800/80 bg-[#0d131f]/90 backdrop-blur flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-300">
            Olá, <span className="text-white font-extrabold">Guitarrista!</span>
          </div>

          {/* Search bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar músicas, solos, aulas..."
              className="bg-[#090d16] border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 w-56 transition-all focus:w-72"
            />
          </div>
        </div>

        {/* Gamification Badges: STREAK & MULTIPLIER */}
        <div className="flex items-center gap-3">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 bg-[#090d16] px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <div className="text-xs font-black tracking-tight text-white">
              STREAK: <span className="text-amber-400 font-mono">{streakDays}</span>
            </div>
          </div>

          {/* Combo Multiplier */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-xs transition-all shadow-md ${
            multiplier > 1 
              ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20 scale-105' 
              : 'bg-[#090d16] border-slate-800 text-slate-400'
          }`}>
            <Zap className={`w-4 h-4 ${multiplier > 1 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <span>MULTIPLIER: <span className="font-mono">{multiplier}X</span></span>
          </div>

          {/* Pro Upgrade / Badge */}
          <button className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-sky-500/20 hover:brightness-110 transition">
            PRO STUDIO
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* 2. CENTRAL PLAYING STAGE (3D HIGHWAY + PIP VIDEO) */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        
        {/* PIP YouTube Video Player in Top-Left */}
        <div className="absolute top-6 left-6 z-20 w-64 lg:w-72 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800/90 group transition-all duration-300 hover:scale-105">
          <iframe
            title={selectedSong.title}
            src={`https://www.youtube.com/embed/${selectedSong.youtubeId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&origin=${window.location.origin}`}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center justify-between text-[11px] font-bold text-white">
            <span className="truncate">{selectedSong.artist}</span>
            <span className="text-[10px] text-sky-400 font-mono font-normal">PIP Sync</span>
          </div>
        </div>

        {/* Live Feedback Floating Banner */}
        {liveFeedback && (
          <div 
            key={liveFeedback.id}
            className={`absolute top-8 z-30 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-2xl animate-bounce-short ${
              liveFeedback.type === 'perfect' 
                ? 'bg-emerald-500 text-white shadow-emerald-500/50' 
                : liveFeedback.type === 'good' 
                  ? 'bg-sky-500 text-white shadow-sky-500/50' 
                  : 'bg-rose-500 text-white shadow-rose-500/50'
            }`}
          >
            {liveFeedback.text}
          </div>
        )}

        {/* Score & Combo HUD Top Right of Stage */}
        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-1">
          <div className="text-3xl font-black font-mono text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            {score.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            COMBO {combo}x
          </div>
        </div>

        {/* 3D Highway Canvas */}
        <Highway3DCanvas
          selectedSong={selectedSong}
          currentTime={currentTime}
          gameMode={gameMode}
          evaluatedEvents={evaluatedEvents}
          liveFeedback={liveFeedback}
          detectedPitch={pitchData}
          detectedChord={chordData}
          isAudible={isAudible}
          onToggleMode={setGameMode}
        />
      </div>

      {/* 3. BOTTOM TRANSPORT & PRACTICE PLAYBACK BAR */}
      <footer className="h-20 px-6 bg-[#0d131f]/95 border-t border-slate-800/80 flex flex-col justify-center gap-2 z-20 shadow-2xl">
        {/* Seek Progress Bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            setCurrentTime(clickRatio * totalDuration);
          }}
          className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group"
        >
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-75 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-white shadow-md absolute right-0 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Playback Transport Buttons & A-B Loop */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePlayPause}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 scale-105'
                  : 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:brightness-110 text-slate-950 shadow-sky-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/80"
              title="Reiniciar Música"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* A-B Loop Button */}
            <button
              onClick={handleToggleLoopAB}
              className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition border ${
                isLoopActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                  : loopA !== null
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
              title="Definir ponto A e ponto B para repetição contínua"
            >
              [A - B] {isLoopActive ? 'ON' : loopA !== null ? 'A...' : ''}
            </button>
          </div>

          {/* Center: Track Title & Artist */}
          <div className="text-center overflow-hidden">
            <div className="text-xs text-slate-400">Tocando Agora:</div>
            <div className="text-sm font-extrabold text-white truncate flex items-center justify-center gap-1.5">
              <span>"{selectedSong.title}"</span>
              <span className="text-sky-400 font-normal">({selectedSong.artist})</span>
            </div>
          </div>

          {/* Right: Time & Playback Speed Chips (100%, 90%, 75%, 50%) */}
          <div className="flex items-center gap-3">
            {/* Speed Selector Chips */}
            <div className="flex items-center bg-[#090d16] p-1 rounded-xl border border-slate-800">
              {[1.0, 0.9, 0.75, 0.5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                    playbackSpeed === spd
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {Math.round(spd * 100)}%
                </button>
              ))}
            </div>

            {/* Time Stamp */}
            <div className="font-mono text-xs font-bold text-slate-300 bg-[#090d16] px-3 py-1.5 rounded-xl border border-slate-800">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{Math.floor(totalDuration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
