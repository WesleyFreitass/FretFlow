import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GUITAR_HERO_STRINGS, GUITAR_HERO_DIFFICULTIES } from '../data/guitarHeroSongs';
import { searchSongsterr, fetchSongMeta, fetchTrackPart } from '../services/songsterrService';
import { 
  filterGuitarTracks, 
  getPrimaryGuitarTrack, 
  convertSongsterrPartToChart,
  normalizeNoteName,
  generateCalibrationChart 
} from '../services/tabChartConverter';
import { autoFindYouTubeId } from '../services/youtubeSearchService';
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
  Search, 
  Volume2, 
  Music, 
  Star,
  Sliders,
  Check,
  Loader2,
  Guitar,
  Layers,
  Mic,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Info,
  Timer,
  ChevronDown,
  X
} from 'lucide-react';

// Curated guitar songs with exact offset to sync with YouTube video audio
const HERO_PRESETS = [
  {
    id: 'test_open_strings',
    title: "🧪 Treino: 6 Cordas Soltas",
    artist: "Calibração de Microfone",
    songsterrId: null,
    youtubeId: null,
    bpm: 60,
    offsetSec: 0.0,
    tag: 'Ultra Fácil • Teste',
    description: 'Teste perfeito: notas lentas nas 6 cordas soltas com microfone limpo'
  },
  {
    id: 'seven_nation',
    title: "Seven Nation Army",
    artist: "The White Stripes",
    songsterrId: 91317,
    youtubeId: '0J2QdDbelmY',
    bpm: 124,
    offsetSec: 0.3,
    tag: '1 Corda • Fácil',
    description: 'O riff mais famoso do rock tocado em uma única corda'
  },
  {
    id: 'come_as_you_are',
    title: "Come As You Are",
    artist: "Nirvana",
    songsterrId: 14,
    youtubeId: 'vabnZ9-ex7o',
    bpm: 120,
    offsetSec: 2.3, // Vídeo do Nirvana tem 2.3s de áudio antes da primeira palhetada
    tag: '2 Cordas • Lento',
    description: 'Casas 0, 1 e 2 nas cordas 6 e 5 em andamento bem calmo'
  },
  {
    id: 'smoke_on_the_water',
    title: "Smoke On The Water",
    artist: "Deep Purple",
    songsterrId: 329,
    youtubeId: 'zUwEIt9ez7M',
    bpm: 112,
    offsetSec: 0.5,
    tag: 'Riff 0-3-5',
    description: 'O clássico riff das 4ª e 3ª cordas na 5ª casa'
  },
  {
    id: 'the_trooper',
    title: "The Trooper",
    artist: "Iron Maiden",
    songsterrId: 338,
    youtubeId: 't24ij5kI2cg',
    bpm: 160,
    offsetSec: 1.2,
    tag: 'Heavy Metal Clássico',
    description: 'Riff galopante e harmonia icônica de Dave Murray e Adrian Smith'
  },
  {
    id: 'sweet_child',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    songsterrId: 23,
    youtubeId: '1w7OgIMMRc4',
    bpm: 125,
    offsetSec: 0.8, // Slash inicia riff após breve silêncio
    tag: 'Solo de Slash',
    description: 'O riff de abertura mais marcante da história da guitarra'
  },
  {
    id: 'knockin',
    title: "Knockin' On Heaven's Door",
    artist: "Guns N' Roses",
    songsterrId: 481,
    youtubeId: 'f8OHybVhQwc',
    bpm: 70,
    offsetSec: 0.6,
    tag: 'Balada & Solo',
    description: 'Balada lenta com solo melódico expressivo de Slash'
  },
  {
    id: 'creep',
    title: "Creep",
    artist: "Radiohead",
    songsterrId: 97,
    youtubeId: 'XFkzRNyygfk',
    bpm: 92,
    offsetSec: 0.5,
    tag: 'Arpejo & Explosão',
    description: 'Arpejos limpos e o famoso ataque de palhetada distorcida'
  },
  {
    id: 'californication',
    title: "Californication",
    artist: "Red Hot Chili Peppers",
    songsterrId: 439,
    youtubeId: 'YlUKcNNmywk',
    bpm: 96,
    offsetSec: 1.0,
    tag: 'John Frusciante',
    description: 'Dedilhado melódico inconfundível de John Frusciante'
  },
  {
    id: 'comfortably_numb',
    title: "Comfortably Numb",
    artist: "Pink Floyd",
    songsterrId: 271,
    youtubeId: '7f3EGjRxxNI',
    bpm: 127,
    offsetSec: 1.5,
    tag: 'David Gilmour',
    description: 'Considerado um dos maiores solos de guitarra de todos os tempos'
  },
  {
    id: 'nothing_else_matters',
    title: "Nothing Else Matters",
    artist: "Metallica",
    songsterrId: 439171,
    youtubeId: 'tAGnKpE4NCI',
    bpm: 142,
    offsetSec: 1.0,
    tag: 'Dedilhado Metal',
    description: 'Dedilhado clássico em cordas soltas'
  },
  {
    id: 'back_in_black',
    title: "Back In Black",
    artist: "AC/DC",
    songsterrId: 1024,
    youtubeId: 'pAgnJDJN4VA',
    bpm: 90,
    offsetSec: 1.6, // Contagem de chimbal da bateria antes do riff
    tag: 'Hard Rock Puro',
    description: 'Riff pesado de Angus e Malcolm Young'
  },
  {
    id: 'paranoid',
    title: "Paranoid",
    artist: "Black Sabbath",
    songsterrId: 296,
    youtubeId: 'BOTIIw76qiE',
    bpm: 164,
    offsetSec: 0.4,
    tag: 'Heavy Metal Pai',
    description: 'O riff imortal de Tony Iommi em Mi menor'
  }
];

export default function GuitarHeroTab({ 
  pitchData, 
  chordData, 
  chromagram, 
  isAudible 
}) {
  // Selection States
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3); // 1 to 4
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null); // null, 2, 1
  const [audioOffsetMs, setAudioOffsetMs] = useState(0);
  const [isSongDrawerOpen, setIsSongDrawerOpen] = useState(false);

  // Tab & Track Data
  const [currentSongInfo, setCurrentSongInfo] = useState(HERO_PRESETS[0]);
  const currentSongInfoRef = useRef(currentSongInfo);
  currentSongInfoRef.current = currentSongInfo;
  const [availableGuitarTracks, setAvailableGuitarTracks] = useState([]);
  const [selectedGuitarTrack, setSelectedGuitarTrack] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [chartLoadError, setChartLoadError] = useState(null);

  // Search Catalog States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Game Scoring States
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [rockMeter, setRockMeter] = useState(50);
  const [starPower, setStarPower] = useState(0);
  const [isStarPowerActive, setIsStarPowerActive] = useState(false);
  const [recentHitFeedback, setRecentHitFeedback] = useState(null);

  // Target Note Display State
  const [activeTargetNote, setActiveTargetNote] = useState(null);

  // Refs for real-time 60FPS loop
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const playerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const gameTimeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const audioPropsRef = useRef({ pitchData, chordData, isAudible });
  audioPropsRef.current = { pitchData, chordData, isAudible };

  const audioOffsetRef = useRef(audioOffsetMs);
  audioOffsetRef.current = audioOffsetMs;

  const noteHitsRef = useRef({});
  const activeSparksRef = useRef({}); // lane index -> { time, color }

  const multiplierRef = useRef(multiplier);
  multiplierRef.current = multiplier;

  const currentChartRef = useRef([]);
  const difficultyRef = useRef(selectedDifficulty);
  difficultyRef.current = selectedDifficulty;

  // Helper to extract active chart according to difficulty
  useEffect(() => {
    if (!chartData || !chartData.charts) {
      currentChartRef.current = [];
      return;
    }
    const key = `level${selectedDifficulty}`;
    currentChartRef.current = chartData.charts[key] || chartData.charts.level3 || [];
  }, [chartData, selectedDifficulty]);

  // Load Song Tab & Convert strictly GUITAR track
  const loadSongTab = useCallback(async (songsterrId, songTitle, artist, ytId = null, targetTrackIdx = null, initialOffset = 0.5) => {
    setIsLoadingChart(true);
    setChartLoadError(null);
    handleResetGame();

    // 1. Built-in Calibration mode (Zero noise, 6 open strings)
    if (!songsterrId || songsterrId === 'test_open_strings') {
      const generated = generateCalibrationChart();
      setChartData(generated);
      const calibTrack = { 
        originalIndex: 0, 
        name: '6 Cordas Soltas (Treino de Precisão)', 
        instrument: 'Violão / Guitarra Real' 
      };
      setAvailableGuitarTracks([calibTrack]);
      setSelectedGuitarTrack(calibTrack);
      setCurrentSongInfo({
        id: 'test_open_strings',
        title: "🧪 Treino: 6 Cordas Soltas",
        artist: "Calibração de Microfone",
        songsterrId: null,
        youtubeId: null,
        bpm: 60,
        offsetSec: 0.0
      });
      setIsLoadingChart(false);
      return;
    }

    // 2. Songsterr Tab with strict guitar filter
    try {
      const meta = await fetchSongMeta(songsterrId);
      
      // STRICT FILTER: ONLY GUITAR TRACKS (no bass, no drums, no vocals, no keyboards)
      const guitarTracks = filterGuitarTracks(meta);

      if (guitarTracks.length === 0) {
        throw new Error('Nenhuma faixa de guitarra identificada nesta tablatura.');
      }

      setAvailableGuitarTracks(guitarTracks);

      // Select target track or recommended primary guitar (Lead/Solo)
      let activeTrack = null;
      if (typeof targetTrackIdx === 'number') {
        activeTrack = guitarTracks.find(t => t.originalIndex === targetTrackIdx) || guitarTracks[0];
      } else {
        activeTrack = getPrimaryGuitarTrack(meta, guitarTracks);
      }
      setSelectedGuitarTrack(activeTrack);

      // Download actual tab part from Songsterr CDN
      const part = await fetchTrackPart(songsterrId, meta.revisionId, meta.image, activeTrack.originalIndex);

      // Convert part into 3D Highway Chart
      const generated = convertSongsterrPartToChart(meta, part, activeTrack);
      setChartData(generated);

      // Auto-resolve official YouTube video if not already specified
      let resolvedYtId = ytId;
      if (!resolvedYtId) {
        try {
          resolvedYtId = await autoFindYouTubeId(meta.title || songTitle, meta.artist || artist);
        } catch (_) {}
      }

      setCurrentSongInfo({
        id: `song-${songsterrId}`,
        title: meta.title || songTitle,
        artist: meta.artist || artist,
        songsterrId,
        youtubeId: resolvedYtId || null,
        bpm: generated.bpm || meta.tempo || 120,
        offsetSec: (typeof initialOffset === 'number') ? initialOffset : 0.5
      });

    } catch (err) {
      console.error('Erro ao processar tablatura para o Arcade:', err);
      setChartLoadError(err.message || 'Erro ao carregar notas da guitarra.');
    } finally {
      setIsLoadingChart(false);
    }
  }, []);

  // Initial Load with first preset (🧪 Treino 6 Cordas Soltas)
  useEffect(() => {
    const preset = HERO_PRESETS[0];
    loadSongTab(preset.songsterrId, preset.title, preset.artist, preset.youtubeId, null, preset.offsetSec);
  }, []);

  // Preset Selection Handler
  const handleSelectPreset = (idx) => {
    setSelectedPresetIndex(idx);
    setShowSearchResults(false);
    const preset = HERO_PRESETS[idx];
    loadSongTab(preset.songsterrId, preset.title, preset.artist, preset.youtubeId, null, preset.offsetSec);
  };

  // Change active guitar track (e.g. Lead -> Rhythm)
  const handleSwitchGuitarTrack = async (track) => {
    if (!currentSongInfo.songsterrId || track.originalIndex === selectedGuitarTrack?.originalIndex) return;
    setIsLoadingChart(true);
    handleResetGame();
    try {
      const meta = await fetchSongMeta(currentSongInfo.songsterrId);
      const part = await fetchTrackPart(currentSongInfo.songsterrId, meta.revisionId, meta.image, track.originalIndex);
      const generated = convertSongsterrPartToChart(meta, part, track);
      setSelectedGuitarTrack(track);
      setChartData(generated);
    } catch (err) {
      console.warn('Erro ao trocar faixa de guitarra:', err);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Live Catalog Search Debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchSongsterr(searchQuery.trim());
        setSearchResults(results.slice(0, 8));
        setShowSearchResults(true);
      } catch (err) {
        console.warn('Erro na busca do Arcade:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // YouTube Iframe Integration
  useEffect(() => {
    if (!currentSongInfo.youtubeId) {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); playerRef.current = null; } catch (_) {}
      }
      return;
    }

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
  }, [currentSongInfo.youtubeId]);

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player || !currentSongInfo.youtubeId) return;
    const container = document.getElementById('hero-youtube-iframe');
    if (!container) return;

    try {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('hero-youtube-iframe', {
        height: '100%',
        width: '100%',
        videoId: currentSongInfo.youtubeId,
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

  const playCountInBeep = (freq = 880) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (_) {}
  };

  const handleResetGame = () => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
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
    noteHitsRef.current = {};
    activeSparksRef.current = {};
  };

  const handlePlayPause = () => {
    // 1. If currently in countdown, cancel it immediately
    if (countdown !== null) {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setCountdown(null);
      return;
    }

    // 2. If already playing, pause immediately
    if (isPlaying) {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    } else {
      // 3. 2-Second Delay Countdown before starting
      setCountdown(2);
      playCountInBeep(880);

      countdownTimerRef.current = setTimeout(() => {
        setCountdown(1);
        playCountInBeep(880);

        countdownTimerRef.current = setTimeout(() => {
          setCountdown(null);
          playCountInBeep(1760);
          if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
          setIsPlaying(true);
          countdownTimerRef.current = null;
        }, 1000);
      }, 1000);
    }
  };

  // Note Hit / Miss logic
  const triggerNoteHit = (note, diff) => {
    const isPerfect = Math.abs(diff) <= 0.12;
    const basePts = isPerfect ? 100 : 70;
    const earned = basePts * multiplierRef.current * (isStarPowerActive ? 2 : 1);

    setScore(s => s + earned);
    setCombo(c => {
      const next = c + 1;
      setMaxCombo(m => Math.max(m, next));
      if (next >= 30) setMultiplier(4);
      else if (next >= 20) setMultiplier(3);
      else if (next >= 10) setMultiplier(2);
      return next;
    });

    setRockMeter(r => Math.min(100, r + 4));
    if (note.isStar) {
      setStarPower(sp => Math.min(100, sp + 10));
    }

    setRecentHitFeedback({
      type: isPerfect ? 'PERFEITO!' : 'MUITO BOM!',
      color: isPerfect ? '#10b981' : '#f59e0b',
      text: note.text,
      lane: note.lane,
      earned
    });

    activeSparksRef.current[note.lane] = {
      time: Date.now(),
      color: GUITAR_HERO_STRINGS[note.lane]?.color || '#ffffff'
    };
  };

  const triggerNoteMiss = (note) => {
    setCombo(0);
    setMultiplier(1);
    setRockMeter(r => Math.max(0, r - 3));
    setRecentHitFeedback({
      type: 'ERROU',
      color: '#ef4444',
      text: note.text,
      lane: note.lane,
      earned: 0
    });
  };

  // Helper to identify which string lane is vibrating based on audio pitch
  const getLaneFromPitch = (pitch, activeTarget = null) => {
    if (!pitch) return -1;
    const noteName = pitch.noteName || pitch.note;
    const freq = pitch.frequency;
    const midi = pitch.midi;

    // 1. Target note match during active play: if a note is currently at the strike bar
    if (activeTarget) {
      const normDetected = normalizeNoteName(noteName);
      const normTarget = normalizeNoteName(activeTarget.note);
      if (normDetected === normTarget) {
        return activeTarget.lane;
      }
    }

    // 2. Physical Pitch / Frequency & MIDI mapping to the 6 guitar strings:
    // 6ª Corda (Low E): E2 (82.4Hz, MIDI 40) up to G#2 (103.8Hz, MIDI 44)
    // Note: 6ª corda casa 3 é G2 (~98Hz, MIDI 43) -> pertence à 6ª Corda!
    if ((typeof midi === 'number' && midi <= 44) || (typeof freq === 'number' && freq < 107)) {
      return 0; // 6ª Corda (Mizona - Vermelho)
    }

    // 5ª Corda (A): A2 (110Hz, MIDI 45) up to C#3 (138.6Hz, MIDI 49)
    if ((typeof midi === 'number' && midi <= 49) || (typeof freq === 'number' && freq < 144)) {
      return 1; // 5ª Corda (Lá - Amarelo)
    }

    // 4ª Corda (D): D3 (146.8Hz, MIDI 50) up to F#3 (185Hz, MIDI 54)
    if ((typeof midi === 'number' && midi <= 54) || (typeof freq === 'number' && freq < 192)) {
      return 2; // 4ª Corda (Ré - Azul)
    }

    // 3ª Corda (G): G3 (196Hz, MIDI 55) up to A#3 (233Hz, MIDI 58)
    if ((typeof midi === 'number' && midi <= 58) || (typeof freq === 'number' && freq < 242)) {
      return 3; // 3ª Corda (Sol - Laranja)
    }

    // 2ª Corda (B): B3 (246.9Hz, MIDI 59) up to D#4 (311Hz, MIDI 63)
    if ((typeof midi === 'number' && midi <= 63) || (typeof freq === 'number' && freq < 320)) {
      return 4; // 2ª Corda (Si - Verde)
    }

    // 1ª Corda (High e): E4 (329.6Hz, MIDI 64+)
    return 5; // 1ª Corda (Mizinha - Roxo)
  };

  // 60FPS 3D Highway Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderLoop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const songOffset = currentSongInfoRef.current?.offsetSec || 0;
      const userOffset = (audioOffsetRef.current || 0) / 1000;
      const totalOffset = songOffset + userOffset;

      if (isPlayingRef.current) {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const ytTime = playerRef.current.getCurrentTime();
          gameTimeRef.current = Math.max(0, ytTime - totalOffset);
        } else {
          gameTimeRef.current += dt;
        }
      }

      const currentTime = gameTimeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Highway Background
      ctx.fillStyle = '#141715';
      ctx.fillRect(0, 0, w, h);

      // 2. 3D Perspective Highway Road
      const topWidth = w * 0.32;
      const bottomWidth = w * 0.88;
      const topY = h * 0.12;
      const bottomY = h * 0.86;

      ctx.beginPath();
      ctx.moveTo((w - topWidth) / 2, topY);
      ctx.lineTo((w + topWidth) / 2, topY);
      ctx.lineTo((w + bottomWidth) / 2, bottomY);
      ctx.lineTo((w - bottomWidth) / 2, bottomY);
      ctx.closePath();

      // Highway surface gradient
      const roadGrad = ctx.createLinearGradient(0, topY, 0, bottomY);
      roadGrad.addColorStop(0, '#1c221e');
      roadGrad.addColorStop(1, '#0e1210');
      ctx.fillStyle = roadGrad;
      ctx.fill();

      ctx.strokeStyle = '#2d3830';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 3. Find current nearest upcoming note & detect real-time string pluck
      const chart = currentChartRef.current || [];
      let nearestTarget = null;
      for (let i = 0; i < chart.length; i++) {
        const timeDiff = chart[i].time - currentTime;
        if (timeDiff >= -0.15 && timeDiff <= 2.5 && (!nearestTarget || timeDiff < nearestTarget.diff)) {
          nearestTarget = { ...chart[i], diff: timeDiff };
        }
      }

      // Check live microphone input to flash the string catcher in real-time
      const currentAudio = audioPropsRef.current;
      const isAudible = currentAudio.isAudible;
      const pitchData = currentAudio.pitchData;

      if (isAudible && pitchData && (pitchData.confidence === undefined || pitchData.confidence > 0.6)) {
        const detectedLane = getLaneFromPitch(pitchData, nearestTarget);
        if (detectedLane >= 0 && detectedLane <= 5) {
          const existing = activeSparksRef.current[detectedLane];
          if (!existing || (Date.now() - existing.time > 100)) {
            activeSparksRef.current[detectedLane] = {
              time: Date.now(),
              color: GUITAR_HERO_STRINGS[detectedLane]?.color || '#ffffff'
            };
          }
        }
      }

      // 4. Draw 6 String Highway Lines (Lane dividers)
      for (let i = 0; i <= 6; i++) {
        const topX = (w - topWidth) / 2 + (topWidth / 6) * i;
        const botX = (w - bottomWidth) / 2 + (bottomWidth / 6) * i;

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, bottomY);
        ctx.strokeStyle = i === 0 || i === 6 ? '#d9563a' : '#27312b';
        ctx.lineWidth = i === 0 || i === 6 ? 3 : 1.5;
        ctx.stroke();
      }

      // Draw dynamic glowing laser down the plucked string lane
      for (let lane = 0; lane < 6; lane++) {
        const spark = activeSparksRef.current[lane];
        if (spark) {
          const elapsed = Date.now() - spark.time;
          if (elapsed < 320) {
            const alpha = 1 - (elapsed / 320);
            const stringDef = GUITAR_HERO_STRINGS[lane];
            const laneTopX = (w - topWidth) / 2 + (topWidth / 6) * (lane + 0.5);
            const laneBotX = (w - bottomWidth) / 2 + (bottomWidth / 6) * (lane + 0.5);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(laneTopX, topY);
            ctx.lineTo(laneBotX, bottomY);
            ctx.strokeStyle = stringDef.color;
            ctx.globalAlpha = alpha * 0.45;
            ctx.lineWidth = 14 * alpha;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 5. Hit Strike Line & 6 Catchers Bar
      ctx.beginPath();
      ctx.moveTo((w - bottomWidth) / 2, bottomY);
      ctx.lineTo((w + bottomWidth) / 2, bottomY);
      ctx.strokeStyle = isStarPowerActive ? '#38bdf8' : '#7fbf4d';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw the 6 Catchers on strike bar with interactive blinking
      for (let lane = 0; lane < 6; lane++) {
        const laneX = (w - bottomWidth) / 2 + (bottomWidth / 6) * (lane + 0.5);
        const stringDef = GUITAR_HERO_STRINGS[lane];
        const spark = activeSparksRef.current[lane];
        const elapsed = spark ? (Date.now() - spark.time) : 9999;
        const isFlashing = elapsed < 320;
        const flashIntensity = isFlashing ? (1 - elapsed / 320) : 0;

        ctx.save();

        if (isFlashing) {
          // Expanding Shockwave Ring
          const waveRadius = 18 + (elapsed / 320) * 22;
          ctx.beginPath();
          ctx.arc(laneX, bottomY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = stringDef.color;
          ctx.globalAlpha = flashIntensity * 0.85;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Outer Bloom Glow
          ctx.beginPath();
          ctx.arc(laneX, bottomY, 26, 0, Math.PI * 2);
          ctx.fillStyle = stringDef.color;
          ctx.globalAlpha = flashIntensity * 0.4;
          ctx.fill();
        }

        // Catcher Base Circle
        const baseRadius = 16 + flashIntensity * 6;
        ctx.beginPath();
        ctx.arc(laneX, bottomY, baseRadius, 0, Math.PI * 2);
        ctx.globalAlpha = 1.0;

        if (isFlashing) {
          const grad = ctx.createRadialGradient(laneX, bottomY, 2, laneX, bottomY, baseRadius);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, stringDef.color);
          grad.addColorStop(1, stringDef.border || stringDef.color);
          ctx.fillStyle = grad;
          ctx.shadowColor = stringDef.color;
          ctx.shadowBlur = 18 * flashIntensity;
        } else {
          ctx.fillStyle = 'rgba(20, 24, 22, 0.9)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        ctx.strokeStyle = isFlashing ? '#ffffff' : stringDef.color;
        ctx.lineWidth = isFlashing ? 3.5 : 2;
        ctx.stroke();

        // String name label inside catcher
        ctx.fillStyle = isFlashing ? '#141715' : stringDef.color;
        ctx.font = `bold ${Math.round(10 + flashIntensity * 2)}px "IBM Plex Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stringDef.name, laneX, bottomY);

        ctx.restore();
      }

      // 6. Render Chart Notes & Hit Detection
      const highwaySpeed = 3.2; // seconds visible on screen
      // Dynamic tolerance based on difficulty: Level 4 (Pro) requires precision, Level 1 is forgiving
      const hitTolerance = difficultyRef.current === 4 ? 0.14 : difficultyRef.current === 1 ? 0.30 : 0.22;
      const detectedNote = currentAudio.pitchData?.noteName || currentAudio.pitchData?.note;
      const detectedMidi = currentAudio.pitchData?.midi;

      for (let i = 0; i < chart.length; i++) {
        const note = chart[i];
        const timeDiff = note.time - currentTime;

        // Find current nearest upcoming note for display
        if (timeDiff >= -0.1 && timeDiff <= 2.5 && (!nearestTarget || timeDiff < nearestTarget.diff)) {
          nearestTarget = { ...note, diff: timeDiff };
        }

        // Note is within visible screen window
        if (timeDiff >= -0.35 && timeDiff <= highwaySpeed) {
          const progress = 1 - (timeDiff / highwaySpeed);
          const currentY = topY + (bottomY - topY) * progress;
          const currentRoadWidth = topWidth + (bottomWidth - topWidth) * progress;
          const lane = typeof note.lane === 'number' ? note.lane : 2;
          const stringX = (w - currentRoadWidth) / 2 + (currentRoadWidth / 6) * (lane + 0.5);

          const radius = 9 + progress * 13;
          const stringDef = GUITAR_HERO_STRINGS[lane] || GUITAR_HERO_STRINGS[0];
          const isHit = noteHitsRef.current[note.id] === 'HIT';

          if (!isHit) {
            // Draw Gem Glow if Star Power Note
            if (note.isStar) {
              ctx.beginPath();
              ctx.arc(stringX, currentY, radius + 5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
              ctx.fill();
            }

            // Gem Body
            ctx.beginPath();
            ctx.arc(stringX, currentY, radius, 0, Math.PI * 2);
            ctx.fillStyle = note.isStar ? '#eab308' : stringDef.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.stroke();

            // Bold Fret Number inside Gem
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(9, Math.round(progress * 13))}px "IBM Plex Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(note.text || '0', stringX, currentY);
          }
        }

        // Hit Detection Window Checking
        if (isPlayingRef.current && !noteHitsRef.current[note.id]) {
          const strikeDiff = currentTime - note.time;

          // Note inside strike window
          if (Math.abs(strikeDiff) <= hitTolerance && isAudible && detectedNote) {
            const normDetected = normalizeNoteName(detectedNote);
            const normTarget = normalizeNoteName(note.note);

            const pitchMatches = (normDetected === normTarget) ||
              (typeof detectedMidi === 'number' && typeof note.midi === 'number' && Math.abs(detectedMidi - note.midi) <= 0.6);

            if (pitchMatches) {
              noteHitsRef.current[note.id] = 'HIT';
              triggerNoteHit(note, strikeDiff);
            }
          } else if (strikeDiff > hitTolerance) {
            // Note passed strike line without being hit
            noteHitsRef.current[note.id] = 'MISSED';
            triggerNoteMiss(note);
          }
        }
      }

      setActiveTargetNote(nearestTarget);
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isStarPowerActive]);

  return (
    <div className="space-y-2 animate-fadeIn select-none max-w-7xl mx-auto font-sans">
      
      {/* 1. COMPACT TOP TOOLBAR: Song Selector, Difficulty & Real-Time Sync */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Left: Song Picker Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSongDrawerOpen(prev => !prev)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-oficina-surface border border-oficina-border hover:border-oficina-chassis transition text-left group"
              title="Clique para pesquisar ou trocar de música"
            >
              <Guitar className="w-4 h-4 text-oficina-terracotta shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col min-w-0 max-w-[180px] sm:max-w-[240px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-oficina-darkText truncate">
                    {currentSongInfo.title}
                  </span>
                  <span className="text-[9px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-1.5 py-0.5 rounded-sm border border-oficina-olive/30 shrink-0">
                    GUITARRA
                  </span>
                </div>
                <span className="text-[10px] text-oficina-mutedText truncate">
                  {currentSongInfo.artist}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-oficina-mutedText transition-transform ${isSongDrawerOpen ? 'rotate-180 text-oficina-olive' : ''}`} />
            </button>

            {/* Guitar Track Switcher (if multiple guitar tracks available) */}
            {availableGuitarTracks.length > 1 && (
              <div className="hidden xl:flex items-center gap-1 border-l border-oficina-border pl-2">
                {availableGuitarTracks.map((track) => {
                  const isCurrent = track.originalIndex === selectedGuitarTrack?.originalIndex;
                  return (
                    <button
                      key={track.originalIndex}
                      onClick={() => handleSwitchGuitarTrack(track)}
                      className={`px-2 py-1 rounded-sm text-[10px] font-mono font-bold transition flex items-center gap-1 border ${
                        isCurrent
                          ? 'bg-oficina-oliveLight border-oficina-olive text-oficina-darkText shadow-sm'
                          : 'bg-oficina-surface border-oficina-border text-oficina-mutedText hover:text-oficina-darkText'
                      }`}
                    >
                      <span>🎸</span>
                      <span className="max-w-[90px] truncate">{track.name || `Pista #${track.originalIndex + 1}`}</span>
                      {isCurrent && <Check className="w-2.5 h-2.5 text-oficina-olive" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center/Right: Difficulty Selector */}
          <div className="flex items-center gap-1 bg-oficina-surface p-0.5 rounded-sm border border-oficina-border font-mono text-[11px]">
            {GUITAR_HERO_DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-2.5 py-1 rounded-[2px] font-bold transition text-[11px] ${
                  selectedDifficulty === diff.id
                    ? 'bg-oficina-chassis text-[#f3f1ec] shadow-sm'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
                title={diff.description}
              >
                {diff.tag}
              </button>
            ))}
          </div>

          {/* Right: Live Sincronia / Video Offset Micro-Adjustment */}
          <div className="flex items-center gap-1.5 bg-oficina-surface border border-oficina-border px-2 py-1 rounded-sm text-xs font-mono">
            <span className="text-[10px] text-oficina-mutedText font-bold hidden sm:inline">
              ⏱️ Sincronia:
            </span>
            <button
              onClick={() => setAudioOffsetMs(prev => prev - 100)}
              title="Adiantar notas (-0.1s)"
              className="w-5 h-5 flex items-center justify-center rounded bg-oficina-card hover:bg-oficina-border text-oficina-darkText font-bold border border-oficina-border text-xs"
            >
              -
            </button>
            <span 
              className="text-xs font-mono font-bold text-oficina-terracotta min-w-[42px] text-center" 
              title="Ajuste fino de latência: tempo do vídeo ajustado em relação à tablatura"
            >
              {(((currentSongInfo?.offsetSec || 0) + (audioOffsetMs / 1000))).toFixed(1)}s
            </span>
            <button
              onClick={() => setAudioOffsetMs(prev => prev + 100)}
              title="Atrasar notas (+0.1s)"
              className="w-5 h-5 flex items-center justify-center rounded bg-oficina-card hover:bg-oficina-border text-oficina-darkText font-bold border border-oficina-border text-xs"
            >
              +
            </button>
          </div>

        </div>

        {/* Collapsible Song Drawer (Dropdown) */}
        {isSongDrawerOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-oficina-borderLight space-y-2.5 animate-fadeIn">
            
            {/* Search Input Bar */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-oficina-surface border border-oficina-border rounded-sm px-3 py-1.5 shadow-inner">
                <Search className="w-3.5 h-3.5 text-oficina-olive shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar qualquer música ou banda (ex: Iron Maiden, Nirvana, Red Hot, Metallica)..."
                  className="w-full bg-transparent text-xs text-oficina-darkText placeholder-oficina-mutedText font-medium outline-none"
                  autoFocus
                />
                {isSearching && <Loader2 className="w-3.5 h-3.5 text-oficina-olive animate-spin shrink-0" />}
              </div>

              {/* Live Search Results Popover */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-oficina-card border border-oficina-border rounded-sm shadow-2xl z-40 max-h-56 overflow-y-auto divide-y divide-oficina-borderLight">
                  {searchResults.map((res) => (
                    <button
                      key={res.songId}
                      onClick={() => {
                        loadSongTab(res.songId, res.title, res.artist);
                        setShowSearchResults(false);
                        setSearchQuery('');
                        setIsSongDrawerOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-oficina-surface transition flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-oficina-darkText group-hover:text-oficina-olive transition">
                          {res.title}
                        </h4>
                        <p className="text-[10px] text-oficina-mutedText">{res.artist}</p>
                      </div>
                      <span className="text-[10px] font-mono text-oficina-olive font-bold px-2 py-0.5 bg-oficina-oliveLight rounded-sm border border-oficina-olive/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tocar
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick 1-Click Song Presets */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-oficina-mutedText">
                <span>CLÁSSICOS RECOMENDADOS:</span>
                {isLoadingChart && (
                  <span className="text-oficina-amber font-bold flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> Carregando tablatura e vídeo...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                {HERO_PRESETS.map((preset, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        handleSelectPreset(idx);
                        setIsSongDrawerOpen(false);
                      }}
                      className={`p-2 rounded-sm border text-left transition ${
                        isSelected
                          ? 'bg-oficina-surface border-oficina-chassis shadow-sm ring-1 ring-oficina-olive/50'
                          : 'bg-oficina-card border-oficina-borderLight hover:border-oficina-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-oficina-darkText truncate">{preset.title}</h4>
                        {preset.id === 'test_open_strings' && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded-sm font-bold shrink-0">1º</span>
                        )}
                      </div>
                      <p className="text-[9px] text-oficina-mutedText truncate">{preset.artist}</p>
                      <span className="text-[8px] font-mono text-oficina-terracotta block mt-0.5 font-bold truncate">
                        {preset.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 2. FIXED-HEIGHT LIVE AUDIO MONITOR (ZERO LAYOUT SHIFT / NO JITTER) */}
      {(() => {
        const detectedLane = pitchData ? getLaneFromPitch(pitchData, activeTargetNote) : -1;
        const detectedStringInfo = detectedLane >= 0 ? GUITAR_HERO_STRINGS[detectedLane] : null;
        const baseMidiForLane = detectedLane >= 0 ? [40, 45, 50, 55, 59, 64][detectedLane] : null;
        const detectedFret = (baseMidiForLane !== null && typeof pitchData?.midi === 'number') 
          ? Math.max(0, pitchData.midi - baseMidiForLane) 
          : null;

        return (
          <div className="h-10 min-h-[40px] max-h-[40px] bg-oficina-card border border-oficina-border rounded-sm px-3 flex items-center justify-between gap-3 font-mono text-xs shadow-sm overflow-hidden select-none">
            
            {/* Left: Fixed-width detected note info slot */}
            <div className="w-80 min-w-[320px] max-w-[320px] shrink-0 h-full flex items-center gap-2 overflow-hidden">
              <div className={`p-1.5 rounded-sm border shrink-0 transition-colors ${
                isAudible 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 animate-pulse' 
                  : 'bg-oficina-surface border-oficina-border text-oficina-mutedText'
              }`}>
                <Mic className="w-3.5 h-3.5" />
              </div>

              <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                <span className="text-[10px] text-oficina-mutedText font-bold shrink-0">
                  DETECTADO:
                </span>
                {pitchData?.noteName ? (
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="px-2 py-0.5 bg-[#161a18] border border-[#353c38] rounded-sm text-white font-black text-xs shrink-0 flex items-center gap-1 shadow-sm">
                      <span className="text-white">{pitchData.noteName}{pitchData.octave !== undefined ? pitchData.octave : ''}</span>
                      <span className="text-[9px] font-mono text-[#9c988f]">
                        {pitchData.frequency ? `${pitchData.frequency.toFixed(0)}Hz` : ''}
                      </span>
                    </span>

                    {detectedStringInfo && (
                      <span 
                        className="px-2 py-0.5 rounded-sm font-bold text-[11px] border shrink-0 flex items-center gap-1.5 shadow-sm bg-[#161a18]"
                        style={{ 
                          borderColor: detectedStringInfo.color,
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: detectedStringInfo.color }}
                        />
                        <span className="text-white font-bold">
                          {detectedStringInfo.stringNum}ª Corda
                        </span>
                        {detectedFret !== null && (
                          <span className="text-[#cfcbc2] font-medium ml-0.5">
                            (Casa {detectedFret})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-oficina-mutedText italic truncate">
                    Aguardando palhetada...
                  </span>
                )}
              </div>
            </div>

            {/* Right: Target Note slot + Headphone hint */}
            <div className="flex items-center gap-3 overflow-hidden">
              {activeTargetNote && (
                <div className="w-56 shrink-0 flex items-center gap-1.5 bg-oficina-surface px-2 py-0.5 rounded-sm border border-oficina-border text-[11px] truncate whitespace-nowrap">
                  <span className="text-[9px] text-oficina-mutedText uppercase font-bold shrink-0">Alvo:</span>
                  <span className="font-bold text-oficina-terracotta truncate">
                    {activeTargetNote.stringNum}ª Corda • Casa {activeTargetNote.fret} ({activeTargetNote.note})
                  </span>
                </div>
              )}

              <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-oficina-mutedText bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm truncate shrink-0">
                <Headphones className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Use fones para o som do vídeo não vazar no microfone</span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* 3. COMPACT GAME HUD & SCORE BOARD */}
      <div className="h-11 min-h-[44px] max-h-[44px] bg-oficina-chassis text-[#f3f1ec] border border-[#3a3f3c] rounded-sm px-3 py-1 flex items-center justify-between gap-3 font-mono text-xs shadow-sm overflow-hidden select-none">
        
        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePlayPause}
            className={`px-3 py-1.5 rounded-sm font-bold flex items-center gap-1.5 transition text-xs ${
              countdown !== null
                ? 'bg-oficina-amber text-oficina-chassis animate-pulse ring-2 ring-oficina-amber/50'
                : isPlaying
                ? 'bg-oficina-amber text-oficina-chassis'
                : 'bg-oficina-oliveGlow text-oficina-chassis hover:brightness-110'
            }`}
          >
            {countdown !== null ? (
              <>
                <Timer className="w-3.5 h-3.5 animate-spin" />
                <span>COMEÇANDO EM {countdown}s</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>COMEÇAR (2s)</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetGame}
            title="Reiniciar música"
            className="p-1.5 bg-[#2a2f2c] border border-[#3a3f3c] rounded-sm text-[#cfcbc2] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {recentHitFeedback && (
            <div 
              className="px-2 py-0.5 rounded-sm font-black text-[11px] animate-bounce shrink-0"
              style={{ backgroundColor: recentHitFeedback.color, color: '#141816' }}
            >
              {recentHitFeedback.type}
            </div>
          )}
        </div>

        {/* Scoring Stats */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs shrink-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] text-[#9c988f]">PONTUAÇÃO</span>
            <span className="text-sm font-black text-white">{score}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] text-[#9c988f]">COMBO</span>
            <span className="text-sm font-black text-oficina-oliveGlow">{combo}x</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] text-[#9c988f]">MULT</span>
            <span className="text-sm font-black text-oficina-amber">{multiplier}x</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] text-[#9c988f]">ROCK</span>
            <span className="text-sm font-black text-[#60a5fa]">{rockMeter}%</span>
          </div>
        </div>

      </div>

      {/* 4. 3D HIGHWAY CANVAS & STAGE (COMPACT ZERO-SCROLL HEIGHT: 420px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* Left: 3D Perspective Highway (7 cols) */}
        <div className="lg:col-span-7 bg-[#141816] border border-oficina-border rounded-sm overflow-hidden relative shadow-inner h-[420px]">
          <canvas
            ref={canvasRef}
            width={600}
            height={420}
            className="w-full h-full object-cover"
          />

          {/* 2-Second Countdown Highway Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/65 backdrop-blur-[2px] pointer-events-none animate-fadeIn">
              <div className="w-24 h-24 rounded-full border-4 border-oficina-oliveGlow flex items-center justify-center bg-oficina-chassis/90 shadow-2xl animate-bounce">
                <span className="text-6xl font-black font-mono text-oficina-oliveGlow">
                  {countdown}
                </span>
              </div>
              <p className="text-xs font-mono text-[#f3f1ec] font-bold mt-4 uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded-sm border border-white/10 shadow-lg">
                🎸 Posicione as mãos na guitarra!
              </p>
            </div>
          )}

          {/* String Color Legend Bottom Bar */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] font-mono text-[#9c988f] bg-black/60 px-3 py-1 rounded-sm backdrop-blur-sm border border-white/10">
            <span>6ª Mizona (Vermelha)</span>
            <span>5ª Lá (Amarela)</span>
            <span>4ª Ré (Azul)</span>
            <span>3ª Sol (Laranja)</span>
            <span>2ª Si (Verde)</span>
            <span>1ª Mizinha (Roxa)</span>
          </div>
        </div>

        {/* Right: Stage (YouTube Player OR Clean Calibration Mode) (5 cols) */}
        <div className="lg:col-span-5 bg-black border border-oficina-border rounded-sm overflow-hidden relative shadow-inner h-[420px] flex flex-col justify-between">
          
          {currentSongInfo.youtubeId ? (
            <>
              <div id="hero-youtube-iframe" className="w-full h-full" />

              {/* Automated Sync Status Footer */}
              <div className="px-3.5 py-2.5 bg-oficina-chassis border-t border-[#3a3f3c] flex items-center justify-between font-mono text-xs text-[#9c988f]">
                <span className="flex items-center gap-1.5 text-oficina-oliveGlow font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-oficina-oliveGlow" /> Vídeo &amp; Áudio Sincronizados Automaticamente
                </span>
                <span className="text-[10px] text-white/60 font-bold">{currentSongInfo.bpm} BPM</span>
              </div>
            </>
          ) : (
            /* Calibration Clean Stage */
            <div className="w-full h-full bg-[#1a1e1c] p-6 flex flex-col justify-between font-mono text-[#f3f1ec]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-sm text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Modo de Calibração Ativo
                </div>
                <h3 className="text-base font-bold text-white">Treino de Precisão das 6 Cordas</h3>
                <p className="text-xs text-[#a39f96] leading-relaxed">
                  Este modo não possui vídeo de fundo para que o microfone ouça **100% limpo** o som da sua guitarra acústica ou elétrica.
                </p>
              </div>

              {/* Step by step guide */}
              <div className="bg-[#121513] border border-[#2d3830] p-4 rounded-sm space-y-2 text-xs">
                <span className="text-[10px] text-[#9c988f] block uppercase font-bold">Como praticar:</span>
                <p className="text-xs text-[#dcd7cb]">
                  1. Clique em <strong className="text-oficina-oliveGlow">COMEÇAR</strong> no painel de controle.
                </p>
                <p className="text-xs text-[#dcd7cb]">
                  2. Acompanhe a esteira 3D: cada corda solta descerá devagar (6ª, 5ª, 4ª, 3ª, 2ª, 1ª).
                </p>
                <p className="text-xs text-[#dcd7cb]">
                  3. Palhete a corda quando a gema circular atingir a barra verde na base!
                </p>
              </div>

              <div className="text-[11px] text-[#9c988f] flex items-center gap-2">
                <Info className="w-4 h-4 text-oficina-amber shrink-0" />
                <span>Se a nota acender em verde na barra de cima, seu microfone está calibrado perfeitamente!</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
