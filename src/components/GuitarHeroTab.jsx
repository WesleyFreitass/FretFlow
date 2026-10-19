import React, { useState, useEffect, useRef } from 'react';
import { GUITAR_HERO_SONGS, GUITAR_HERO_STRINGS, GUITAR_HERO_DIFFICULTIES } from '../data/guitarHeroSongs';
import { CHORD_DEFINITIONS } from '../audio/chordDictionary';
import confetti from 'canvas-confetti';
import { 
  Gamepad2, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Zap, 
  Trophy, 
  Sparkles, 
  Radio, 
  Volume2, 
  Music, 
  Star,
  Layers,
  Award,
  Video,
  Clock,
  Sliders
} from 'lucide-react';

export default function GuitarHeroTab({ 
  pitchData, 
  chordData, 
  chromagram, 
  isAudible 
}) {
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioOffsetMs, setAudioOffsetMs] = useState(0);

  // Score & Game States
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [rockMeter, setRockMeter] = useState(50);
  const [starPower, setStarPower] = useState(0);
  const [isStarPowerActive, setIsStarPowerActive] = useState(false);
  const [recentHitFeedback, setRecentHitFeedback] = useState(null);
  const [gameOverStats, setGameOverStats] = useState(null);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const playerRef = useRef(null);

  const gameTimeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const audioPropsRef = useRef({ pitchData, chordData, isAudible });
  audioPropsRef.current = { pitchData, chordData, isAudible };

  const audioOffsetRef = useRef(audioOffsetMs);
  audioOffsetRef.current = audioOffsetMs;

  const noteHitsRef = useRef({});

  const currentSong = GUITAR_HERO_SONGS[selectedSongIndex];
  const difficultyKey = `level${selectedDifficulty}`;
  const currentChart = currentSong.charts[difficultyKey] || currentSong.charts.level3;

  const currentSongRef = useRef(currentSong);
  currentSongRef.current = currentSong;
  const currentChartRef = useRef(currentChart);
  currentChartRef.current = currentChart;
  const difficultyRef = useRef(selectedDifficulty);
  difficultyRef.current = selectedDifficulty;

  const handleResetGame = () => {
    setIsPlaying(false);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(0, true);
        playerRef.current.pauseVideo();
      } catch (_) {}
    }
    gameTimeRef.current = 0;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMultiplier(1);
    setRockMeter(50);
    setStarPower(0);
    setIsStarPowerActive(false);
    setRecentHitFeedback(null);
    setGameOverStats(null);
    noteHitsRef.current = {};
  };

  useEffect(() => {
    handleResetGame();
  }, [selectedSongIndex, selectedDifficulty]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (_) {}
      }
    };
  }, [currentSong.youtubeId]);

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player) return;
    const container = document.getElementById('hero-youtube-iframe');
    if (!container) return;

    try {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('hero-youtube-iframe', {
        height: '100%',
        width: '100%',
        videoId: currentSong.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          }
        }
      });
    } catch (_) {}
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
    }
  };

  // 3D Canvas Highway Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderLoop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlayingRef.current) {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const ytTime = playerRef.current.getCurrentTime();
          gameTimeRef.current = ytTime + (audioOffsetRef.current / 1000);
        } else {
          gameTimeRef.current += dt;
        }
      }

      const currentTime = gameTimeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Draw Highway Background (Dark boutique chassis finish)
      ctx.fillStyle = '#1f2321';
      ctx.fillRect(0, 0, w, h);

      // Draw 3D Perspective Road
      const topWidth = w * 0.35;
      const bottomWidth = w * 0.85;
      const topY = h * 0.15;
      const bottomY = h * 0.88;

      ctx.beginPath();
      ctx.moveTo((w - topWidth) / 2, topY);
      ctx.lineTo((w + topWidth) / 2, topY);
      ctx.lineTo((w + bottomWidth) / 2, bottomY);
      ctx.lineTo((w - bottomWidth) / 2, bottomY);
      ctx.closePath();
      ctx.fillStyle = '#141816';
      ctx.fill();
      ctx.strokeStyle = '#3a3f3c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw 6 String Highway Lines
      for (let i = 0; i <= 6; i++) {
        const topX = (w - topWidth) / 2 + (topWidth / 6) * i;
        const botX = (w - bottomWidth) / 2 + (bottomWidth / 6) * i;

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, bottomY);
        ctx.strokeStyle = i === 0 || i === 6 ? '#d9563a' : '#2a2f2c';
        ctx.lineWidth = i === 0 || i === 6 ? 3 : 1.5;
        ctx.stroke();
      }

      // Hit Target Line (Boutique target bar)
      ctx.beginPath();
      ctx.moveTo((w - bottomWidth) / 2, bottomY);
      ctx.lineTo((w + bottomWidth) / 2, bottomY);
      ctx.strokeStyle = '#7fbf4d';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Render Notes in chart
      const highwaySpeed = 3.5;
      const chart = currentChartRef.current || [];

      chart.forEach((note, idx) => {
        const timeDiff = note.time - currentTime;
        if (timeDiff >= -0.3 && timeDiff <= highwaySpeed) {
          const progress = 1 - (timeDiff / highwaySpeed);
          const currentY = topY + (bottomY - topY) * progress;
          const currentRoadWidth = topWidth + (bottomWidth - topWidth) * progress;
          const stringIndex = note.string ? (6 - note.string) : 2;
          const stringX = (w - currentRoadWidth) / 2 + (currentRoadWidth / 6) * (stringIndex + 0.5);

          const radius = 8 + progress * 14;

          // Note Circle
          ctx.beginPath();
          ctx.arc(stringX, currentY, radius, 0, Math.PI * 2);
          ctx.fillStyle = note.chord ? '#d9563a' : '#3f7a26';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Note Text
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(10, Math.round(progress * 13))}px 'IBM Plex Mono'`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note.chord || note.note || '•', stringX, currentY);
        }
      });

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-5 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP HEADER & SONG SELECTOR */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
              <Gamepad2 className="w-5 h-5 text-oficina-terracotta" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
                <span>Arcade de Notas &amp; Músicas (Guitar Hero)</span>
                <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                  6 CORDAS
                </span>
              </h2>
              <p className="text-xs text-oficina-bodyText">
                Toque as notas e acordes no tempo exato sincronizados com a música original
              </p>
            </div>
          </div>

          {/* Difficulty Buttons */}
          <div className="flex items-center gap-1 bg-oficina-surface p-1 rounded-sm border border-oficina-border font-mono text-xs">
            {GUITAR_HERO_DIFFICULTIES.map(diff => (
              <button
                key={diff.level}
                onClick={() => setSelectedDifficulty(diff.level)}
                className={`px-2.5 py-1 rounded-[2px] font-bold transition ${
                  selectedDifficulty === diff.level
                    ? 'bg-oficina-chassis text-[#f3f1ec]'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-oficina-borderLight">
          {GUITAR_HERO_SONGS.map((song, idx) => {
            const isSelected = selectedSongIndex === idx;
            return (
              <button
                key={song.id}
                onClick={() => setSelectedSongIndex(idx)}
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

      {/* 2. GAME HUD & SCORE BOARD */}
      <div className="bg-oficina-chassis text-[#f3f1ec] border border-[#3a3f3c] rounded-sm p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className={`px-4 py-1.5 rounded-sm font-bold flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-oficina-amber text-oficina-chassis'
                : 'bg-oficina-oliveGlow text-oficina-chassis'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Começar'}</span>
          </button>

          <button
            onClick={handleResetGame}
            className="px-3 py-1.5 bg-[#2a2f2c] border border-[#3a3f3c] rounded-sm text-[#cfcbc2] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-[#9c988f] block">PONTOS</span>
            <span className="text-base font-black text-white">{score}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#9c988f] block">COMBO</span>
            <span className="text-base font-black text-oficina-oliveGlow">{combo}x</span>
          </div>
          <div>
            <span className="text-[10px] text-[#9c988f] block">ROCK METER</span>
            <span className="text-base font-black text-oficina-amber">{rockMeter}%</span>
          </div>
        </div>
      </div>

      {/* 3. 3D HIGHWAY CANVAS & YOUTUBE STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: 3D Highway (7 cols) */}
        <div className="lg:col-span-7 bg-[#141816] border border-oficina-border rounded-sm overflow-hidden relative shadow-inner h-[460px]">
          <canvas
            ref={canvasRef}
            width={600}
            height={460}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: YouTube Player (5 cols) */}
        <div className="lg:col-span-5 bg-black border border-oficina-border rounded-sm overflow-hidden relative shadow-inner h-[460px] flex items-center justify-center">
          <div id="hero-youtube-iframe" className="w-full h-full" />
        </div>

      </div>

    </div>
  );
}
