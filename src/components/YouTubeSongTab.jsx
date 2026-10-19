import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_SONGS } from '../data/sampleSongs';
import { CHORD_DEFINITIONS } from '../audio/chordDictionary';
import Fretboard from './Fretboard';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Video, 
  Music, 
  Flame, 
  Trophy, 
  Sparkles, 
  Edit3, 
  Check, 
  Plus, 
  ListMusic,
  ExternalLink 
} from 'lucide-react';

export default function YouTubeSongTab({ 
  chordData, 
  pitchData, 
  isAudible 
}) {
  const [selectedSong, setSelectedSong] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [isEditingChords, setIsEditingChords] = useState(false);
  const [customChordText, setCustomChordText] = useState('');

  // Game scoring
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [evaluatedEvents, setEvaluatedEvents] = useState({});
  const [liveFeedback, setLiveFeedback] = useState(null);

  const playerRef = useRef(null);
  const animationTimerRef = useRef(null);
  const chordDataRef = useRef(chordData);
  chordDataRef.current = chordData;

  const parseYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const activeEvent = selectedSong.events.find(
    ev => currentTime >= ev.time && currentTime < (ev.time + ev.duration)
  );
  const activeChordName = activeEvent ? activeEvent.chord : null;
  const activeChordObj = activeChordName ? CHORD_DEFINITIONS[activeChordName] : null;

  useEffect(() => {
    if (!isPlaying) {
      if (animationTimerRef.current) cancelAnimationFrame(animationTimerRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now) => {
      const deltaSeconds = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setCurrentTime(prevTime => {
        const nextTime = prevTime + deltaSeconds;

        selectedSong.events.forEach((ev, idx) => {
          const hitWindowStart = ev.time;
          const hitWindowEnd = ev.time + 1.2;

          if (nextTime >= hitWindowStart && nextTime <= hitWindowEnd && !evaluatedEvents[idx]) {
            const detected = chordDataRef.current;
            if (detected && detected.name === ev.chord) {
              setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'hit' } }));
              setScore(s => s + 150 + combo * 20);
              setCombo(c => {
                const nextC = c + 1;
                setMaxCombo(mc => Math.max(mc, nextC));
                return nextC;
              });
              setLiveFeedback({ text: 'PERFEITO! +150', type: 'perfect', id: Date.now() });
            } else if (detected && detected.root === CHORD_DEFINITIONS[ev.chord]?.root) {
              setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'good' } }));
              setScore(s => s + 75);
              setCombo(c => c + 1);
              setLiveFeedback({ text: 'BOM! +75', type: 'good', id: Date.now() });
            }
          } else if (nextTime > (ev.time + 1.5) && !evaluatedEvents[idx]) {
            setEvaluatedEvents(prev => ({ ...prev, [idx]: { status: 'miss' } }));
            setCombo(0);
            setLiveFeedback({ text: 'ERROU O TEMPO', type: 'miss', id: Date.now() });
          }
        });

        return nextTime;
      });

      animationTimerRef.current = requestAnimationFrame(loop);
    };

    animationTimerRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationTimerRef.current) cancelAnimationFrame(animationTimerRef.current);
    };
  }, [isPlaying, selectedSong, evaluatedEvents, combo]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setEvaluatedEvents({});
    setLiveFeedback(null);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    handleReset();
  };

  const handleLoadCustomYouTube = () => {
    const videoId = parseYouTubeId(customUrl);
    if (!videoId) return;

    const newCustomSong = {
      id: 'custom_yt_' + Date.now(),
      title: 'Música do YouTube',
      artist: 'Personalizado',
      bpm: 90,
      youtubeId: videoId,
      events: [
        { time: 2, duration: 4, chord: 'C' },
        { time: 6, duration: 4, chord: 'G' },
        { time: 10, duration: 4, chord: 'Am' },
        { time: 14, duration: 4, chord: 'F' }
      ]
    };

    setSelectedSong(newCustomSong);
    handleReset();
  };

  return (
    <div className="space-y-5 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP HEADER & SONG PICKER */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
              <Video className="w-5 h-5 text-oficina-terracotta" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
                <span>Modo YouTube &amp; Cifras Sincronizadas</span>
                <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                  PLAYALONG
                </span>
              </h2>
              <p className="text-xs text-oficina-bodyText">
                Acompanhe as músicas com cifras e braço interativo sincronizados em tempo real
              </p>
            </div>
          </div>

          {/* Custom YouTube URL Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cole o link do YouTube..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="bg-oficina-surface border border-oficina-border rounded-sm px-3 py-1.5 text-xs text-oficina-darkText font-mono placeholder-oficina-mutedText focus:outline-none focus:border-oficina-darkText min-w-[200px]"
            />
            <button
              onClick={handleLoadCustomYouTube}
              className="px-3 py-1.5 bg-oficina-chassis text-[#f3f1ec] font-mono font-bold text-xs rounded-sm hover:brightness-110 shadow-sm"
            >
              Carregar
            </button>
          </div>
        </div>

        {/* Preset Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-oficina-borderLight">
          {SAMPLE_SONGS.map((song) => {
            const isSelected = selectedSong.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className={`p-3 rounded-sm border text-left transition ${
                  isSelected
                    ? 'bg-oficina-surface border-oficina-chassis shadow-sm'
                    : 'bg-oficina-card border-oficina-borderLight hover:border-oficina-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-oficina-darkText truncate">{song.title}</h4>
                  <span className="font-mono text-[10px] text-oficina-mutedText font-bold">{song.bpm} BPM</span>
                </div>
                <p className="text-[11px] text-oficina-mutedText mt-0.5 truncate">{song.artist}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TRANSPORT & CHORD TIMELINE */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 space-y-3 shadow-sm">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className={`px-4 py-1.5 rounded-sm font-bold flex items-center gap-1.5 shadow-sm transition ${
                isPlaying
                  ? 'bg-oficina-amber text-oficina-darkText font-black'
                  : 'bg-oficina-olive text-white font-black'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Tocar Junto'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-oficina-surface border border-oficina-border text-oficina-bodyText hover:text-oficina-darkText rounded-sm font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-oficina-mutedText mr-1.5 font-bold">Tempo:</span>
              <span className="font-black text-oficina-darkText">{currentTime.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-oficina-mutedText mr-1.5 font-bold">Pontos:</span>
              <span className="font-black text-oficina-olive">{score}</span>
            </div>
          </div>
        </div>

        {/* Chord Conveyor Strip */}
        <div className="relative h-14 bg-oficina-surface border border-oficina-border rounded-sm overflow-hidden flex items-center">
          
          {/* Strike Zone Target Line */}
          <div className="absolute left-24 top-0 bottom-0 w-1 bg-oficina-terracotta z-20 shadow-sm"></div>

          {/* Chord Blocks */}
          <div className="relative h-full flex items-center w-full">
            {selectedSong.events.map((ev, idx) => {
              const leftPos = 96 + (ev.time - currentTime) * 70;
              const width = ev.duration * 70;
              const isPassingTarget = currentTime >= ev.time && currentTime <= (ev.time + ev.duration);

              if (leftPos + width < -100 || leftPos > 900) return null;

              return (
                <div
                  key={idx}
                  className={`absolute h-10 rounded-[2px] border px-2 flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isPassingTarget
                      ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-md z-10 scale-105'
                      : 'bg-oficina-card border-oficina-border text-oficina-darkText'
                  }`}
                  style={{
                    left: `${leftPos}px`,
                    width: `${Math.max(45, width - 4)}px`
                  }}
                >
                  <span>{ev.chord}</span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 3. VIDEO PLAYER & ACTIVE CHORD FRETBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: YouTube IFrame Container */}
        <div className="lg:col-span-6 bg-black border border-oficina-border rounded-sm overflow-hidden shadow-sm h-[360px] flex items-center justify-center">
          <iframe
            src={`https://www.youtube.com/embed/${selectedSong.youtubeId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}`}
            title={selectedSong.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Right: Active Chord & Fretboard */}
        <div className="lg:col-span-6 bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-baseline justify-between border-b border-oficina-borderLight pb-2">
            <div>
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">ACORDE DO MOMENTO</span>
              <div className="text-2xl font-extrabold text-oficina-darkText">
                {activeChordObj ? `${activeChordObj.name} — ${activeChordObj.fullName}` : 'Aguardando próximo acorde...'}
              </div>
            </div>
            {activeChordObj && (
              <span className="font-mono text-xs border border-oficina-border px-2 py-0.5 rounded-[2px] text-oficina-bodyText">
                {activeChordObj.difficulty}
              </span>
            )}
          </div>

          <Fretboard chord={activeChordObj} />
        </div>

      </div>

    </div>
  );
}
