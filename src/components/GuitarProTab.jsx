import React, { useState, useEffect, useRef } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  AlertCircle,
  Sliders,
  Music2,
  Check,
  Search,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  FolderOpen,
  Volume2,
  Music
} from 'lucide-react';
import { searchSongsterr, loadSongsterrTab } from '../services/songsterrService';

// Curated popular songs ready for 1-click instant import
const CURATED_SONGS = [
  {
    songId: 23,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    genre: "Classic Rock",
    trackName: "Slash | Lead Guitar"
  },
  {
    songId: 14,
    title: "Come As You Are",
    artist: "Nirvana",
    genre: "Grunge / Rock",
    trackName: "Kurt Cobain | Rhythm Guitar"
  },
  {
    songId: 329,
    title: "Smoke On The Water",
    artist: "Deep Purple",
    genre: "Hard Rock",
    trackName: "Ritchie Blackmore | Main Riff"
  },
  {
    songId: 439171,
    title: "Nothing Else Matters",
    artist: "Metallica",
    genre: "Metal / Ballad",
    trackName: "James Hetfield | Lead Guitar"
  },
  {
    songId: 757,
    title: "Hotel California",
    artist: "Eagles",
    genre: "Classic Rock",
    trackName: "Acoustic / 12-String"
  },
  {
    songId: 588,
    title: "Back In Black",
    artist: "AC/DC",
    genre: "Hard Rock",
    trackName: "Angus Young | Lead Guitar"
  }
];

export default function GuitarProTab({ 
  pitchData, 
  chordData, 
  isAudible 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [customTabName, setCustomTabName] = useState(null);
  const [loadedScoreInfo, setLoadedScoreInfo] = useState({ title: '', artist: '', tempo: 120, tracks: [] });
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [staveProfileMode, setStaveProfileMode] = useState('default'); // 'default', 'scoreTab', 'tabOnly'
  const [isAlphaTabReady, setIsAlphaTabReady] = useState(false);
  const [isSoundFontReady, setIsSoundFontReady] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalTimeSec, setTotalTimeSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Search Modal & Query State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSongsterrId, setActiveSongsterrId] = useState(null);

  const containerRef = useRef(null);
  const alphaTabApiRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInitialMountRef = useRef(true);
  const searchTimeoutRef = useRef(null);

  // Initialize AlphaTab once on mount (CLEAN - with NO default tab loaded)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (alphaTabApiRef.current) {
        alphaTabApiRef.current.destroy();
      }

      const settings = {
        core: {
          engine: 'svg',
          fontDirectory: '/font/',
          useWorkers: false, // Ensures rendering reliability
          logLevel: 'debug'
        },
        display: {
          layoutMode: alphaTab.LayoutMode.Page,
          staveProfile: alphaTab.StaveProfile.Default,
          scale: zoomLevel
        },
        notation: {
          elements: {
            scoreTitle: true,
            scoreSubTitle: true,
            scoreArtist: true,
            scoreAlbum: false,
            scoreWordsAndMusic: false,
            effectBand: true
          }
        },
        player: {
          enablePlayer: true,
          enableCursor: true,
          enableUserInteraction: true,
          scrollElement: container.parentElement,
          soundFont: '/soundfont/sonivox.sf2'
        }
      };

      const api = new alphaTab.AlphaTabApi(container, settings);
      alphaTabApiRef.current = api;

      api.soundFontLoaded.on(() => {
        setIsSoundFontReady(true);
      });

      api.playerReady.on(() => {
        setIsSoundFontReady(true);
      });

      api.soundFontLoadFailed.on((err) => {
        console.warn('AlphaTab soundFontLoadFailed:', err);
      });

      api.scoreLoaded.on((score) => {
        setIsAlphaTabReady(true);
        setIsLoadingFile(false);
        setErrorMessage(null);

        // Auto-select primary guitar/stringed track if available, else first track
        let defaultIdx = 0;
        if (score.tracks && score.tracks.length > 0) {
          const foundIdx = score.tracks.findIndex(t => {
            const name = (t.name || '').toLowerCase();
            const isStringed = t.staves && t.staves.some(s => s.isStringed);
            return isStringed || name.includes('guitar') || name.includes('viol') || name.includes('solo') || name.includes('lead') || name.includes('base');
          });
          if (foundIdx >= 0) defaultIdx = foundIdx;
        }

        setSelectedTrackIndex(defaultIdx);
        setLoadedScoreInfo({
          title: score.title || 'Partitura Carregada',
          artist: score.artist || '',
          tempo: score.tempo || 120,
          tracks: score.tracks || []
        });

        // Ensure the chosen track renders immediately
        if (score.tracks && score.tracks[defaultIdx]) {
          try {
            api.renderTracks([score.tracks[defaultIdx]]);
          } catch (_) {}
        }
      });

      api.renderFinished.on(() => {
        setIsAlphaTabReady(true);
        setIsLoadingFile(false);
      });

      api.playerStateChanged.on((args) => {
        setIsPlaying(args.state === alphaTab.synth.PlayerState.Playing);
      });

      api.playerPositionChanged.on((args) => {
        setCurrentTimeSec(Math.round(args.currentTime / 1000));
        if (args.endTime > 0) {
          setTotalTimeSec(Math.round(args.endTime / 1000));
          setCurrentProgress(Math.round((args.currentTime / args.endTime) * 100));
        }
      });

      api.error.on((err) => {
        console.error('AlphaTab Error:', err);
        setIsLoadingFile(false);
        setErrorMessage(`Não foi possível abrir este arquivo: ${err.message || 'formato incompatível'}`);
      });

      // NOTE: No default tab is loaded on mount. Starts completely clean!

    } catch (e) {
      console.warn('Erro ao inicializar AlphaTab:', e);
      setIsLoadingFile(false);
    }

    return () => {
      if (alphaTabApiRef.current) {
        try { alphaTabApiRef.current.destroy(); } catch (_) {}
      }
    };
  }, []);

  // Update zoom level smoothly without re-initializing
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (alphaTabApiRef.current && isAlphaTabReady) {
      try {
        alphaTabApiRef.current.settings.display.scale = zoomLevel;
        alphaTabApiRef.current.updateSettings();
        alphaTabApiRef.current.render();
      } catch (_) {}
    }
  }, [zoomLevel]);

  // Update playback speed
  useEffect(() => {
    if (alphaTabApiRef.current && isAlphaTabReady) {
      try {
        alphaTabApiRef.current.playbackSpeed = playbackSpeed;
      } catch (_) {}
    }
  }, [playbackSpeed]);

  // Handle Search Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchSongsterr(searchQuery);
        setSearchResults(results.slice(0, 15));
      } catch (err) {
        console.error("Erro na busca:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  // Toggle Notation profile (Score + Tab, Tab Only, Default)
  const handleChangeStaveProfile = (profileMode) => {
    setStaveProfileMode(profileMode);
    if (!alphaTabApiRef.current) return;
    try {
      if (profileMode === 'scoreTab') {
        alphaTabApiRef.current.settings.display.staveProfile = alphaTab.StaveProfile.ScoreTab;
      } else if (profileMode === 'tabOnly') {
        alphaTabApiRef.current.settings.display.staveProfile = alphaTab.StaveProfile.Tab;
      } else {
        alphaTabApiRef.current.settings.display.staveProfile = alphaTab.StaveProfile.Default;
      }
      alphaTabApiRef.current.updateSettings();
      alphaTabApiRef.current.render();
    } catch (err) {
      console.warn("Erro ao trocar perfil de pauta:", err);
    }
  };

  const handlePlayPause = async () => {
    if (!alphaTabApiRef.current) return;
    try {
      // Resume Web Audio AudioContext if it was suspended by browser autoplay policy
      if (window.AudioContext || window.webkitAudioContext) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContextClass();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
        } catch (_) {}
      }
      alphaTabApiRef.current.playPause();
    } catch (e) {
      console.error("Erro no playPause:", e);
    }
  };

  const handleStop = () => {
    if (alphaTabApiRef.current) {
      try {
        alphaTabApiRef.current.stop();
        setIsPlaying(false);
        setCurrentProgress(0);
        setCurrentTimeSec(0);
      } catch (e) {
        console.error("Erro no stop:", e);
      }
    }
  };

  const handleTrackChange = (trackIndex) => {
    setSelectedTrackIndex(trackIndex);
    if (!alphaTabApiRef.current || !alphaTabApiRef.current.score) return;

    try {
      if (trackIndex === -1) {
        alphaTabApiRef.current.renderTracks(alphaTabApiRef.current.score.tracks);
      } else if (alphaTabApiRef.current.score.tracks[trackIndex]) {
        alphaTabApiRef.current.renderTracks([alphaTabApiRef.current.score.tracks[trackIndex]]);
      }
    } catch (err) {
      console.error("Erro ao trocar instrumento:", err);
    }
  };

  // Upload local GP file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsLoadingFile(true);
    setLoadingStatusText(`Carregando ${file.name}...`);
    setActiveSongsterrId(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer && alphaTabApiRef.current) {
        setCustomTabName(file.name);
        try {
          const uint8Data = new Uint8Array(buffer);
          alphaTabApiRef.current.load(uint8Data);
        } catch (err) {
          console.error("Erro ao carregar arquivo GP:", err);
          setIsLoadingFile(false);
          setErrorMessage("Erro ao processar o arquivo Guitar Pro. Verifique se o arquivo .gp3, .gp4, .gp5 ou .gpx é válido.");
        }
      }
    };
    reader.onerror = () => {
      setIsLoadingFile(false);
      setErrorMessage("Erro ao ler o arquivo do seu computador.");
    };
    reader.readAsArrayBuffer(file);
  };

  // Drag & drop GP file directly onto window/container
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileUpload(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Import online tab directly from Songsterr
  const handleLoadSongsterrSong = async (songId, targetTrackIndex = null) => {
    setErrorMessage(null);
    setIsLoadingFile(true);
    setLoadingStatusText("Baixando partitura e notas do Songsterr...");
    setIsSearchModalOpen(false);

    try {
      const result = await loadSongsterrTab(songId, targetTrackIndex);
      setActiveSongsterrId(songId);
      setCustomTabName(null);

      if (alphaTabApiRef.current) {
        setLoadingStatusText("Renderizando tablatura e preparando áudio...");
        alphaTabApiRef.current.tex(result.alphaTex);
      }
    } catch (err) {
      console.error("Erro ao carregar música do Songsterr:", err);
      setIsLoadingFile(false);
      setErrorMessage(`Erro ao carregar tablatura do Songsterr: ${err.message || 'Música indisponível'}`);
    }
  };

  // Close current tab and return to clean search/import view
  const handleClearTab = () => {
    if (alphaTabApiRef.current) {
      try {
        alphaTabApiRef.current.stop();
        alphaTabApiRef.current.renderScore(null);
      } catch (_) {}
    }
    setLoadedScoreInfo({ title: '', artist: '', tempo: 120, tracks: [] });
    setCustomTabName(null);
    setActiveSongsterrId(null);
    setIsPlaying(false);
    setCurrentProgress(0);
    setCurrentTimeSec(0);
    setErrorMessage(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const hasLoadedTab = Boolean(customTabName || loadedScoreInfo.title);

  return (
    <div 
      className="space-y-4 animate-fadeIn select-none max-w-6xl mx-auto font-sans"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      
      {/* 1. TOP CONTROLS & TRANSPORT BAR */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        
        {/* Header Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm shadow-2xs">
              <FileText className="w-5 h-5 text-oficina-olive" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-oficina-darkText">
                  {hasLoadedTab 
                    ? (customTabName || loadedScoreInfo.title)
                    : 'Guitar Pro Tabs & Player'}
                </h2>
                {loadedScoreInfo.artist && (
                  <span className="text-xs text-oficina-mutedText font-semibold">
                    · {loadedScoreInfo.artist}
                  </span>
                )}
                {isSoundFontReady && (
                  <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    Sintetizador Ativo ✓
                  </span>
                )}
                {activeSongsterrId && (
                  <a
                    href={`https://www.songsterr.com/a/wa/song?id=${activeSongsterrId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded-sm border border-blue-200 hover:bg-blue-100 flex items-center gap-1 transition"
                    title="Abrir no Songsterr em nova aba"
                  >
                    <span>Songsterr ↗</span>
                  </a>
                )}
              </div>
              <p className="text-xs text-oficina-bodyText mt-0.5">
                {hasLoadedTab 
                  ? `Andamento: ${loadedScoreInfo.tempo} BPM. Partitura, tablatura e sintetizador sincronizados.`
                  : 'Pesquise milhões de músicas online ou abra seu arquivo (.gp3, .gp4, .gp5, .gpx) sem complicação.'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Search Online & Upload Local */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Online Tab Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3.5 py-2 bg-oficina-olive text-white font-mono font-bold text-xs rounded-sm cursor-pointer transition flex items-center gap-2 shadow-sm hover:brightness-105"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar Músicas Online</span>
            </button>

            {/* Upload Custom File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-oficina-surface border border-oficina-border hover:border-oficina-borderDark font-mono font-bold text-xs rounded-sm cursor-pointer transition flex items-center gap-2 text-oficina-darkText shadow-sm hover:bg-[#fffefa]"
            >
              <Upload className="w-3.5 h-3.5 text-oficina-terracotta" />
              <span>{hasLoadedTab ? 'Trocar Arquivo GP' : 'Abrir Arquivo GP'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".gp,.gp3,.gp4,.gp5,.gpx"
                onChange={handleFileUpload}
                onClick={(e) => { e.target.value = null; }}
                className="hidden"
              />
            </button>

            {/* Clear / Close Tab Button (if tab is open) */}
            {hasLoadedTab && (
              <button
                onClick={handleClearTab}
                className="px-2.5 py-2 bg-oficina-surface border border-oficina-border text-oficina-mutedText hover:text-rose-600 font-mono font-bold text-xs rounded-sm cursor-pointer transition flex items-center gap-1 shadow-2xs"
                title="Fechar tablatura e voltar para início"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fechar</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-100 border border-rose-300 rounded-sm p-3 flex items-center gap-2 text-xs text-rose-900 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Transport Toolbar (Shown when a tab is loaded) */}
        {hasLoadedTab && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-oficina-borderLight">
            
            {/* Left Controls: Play/Pause, Stop, Time, Speed */}
            <div className="flex items-center gap-2.5 font-mono text-xs flex-wrap">
              <button
                onClick={handlePlayPause}
                disabled={isLoadingFile}
                className={`px-4 py-1.5 rounded-sm font-bold flex items-center gap-1.5 shadow-sm transition ${
                  isPlaying
                    ? 'bg-oficina-amber text-oficina-darkText font-black'
                    : 'bg-oficina-olive text-white font-black hover:brightness-105'
                } ${isLoadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausar' : 'Tocar Partitura'}</span>
              </button>

              <button
                onClick={handleStop}
                disabled={isLoadingFile}
                className="px-3 py-1.5 bg-oficina-surface border border-oficina-border text-oficina-bodyText hover:text-oficina-darkText rounded-sm font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>

              {/* Time / Progress info */}
              <div className="flex items-center gap-1 text-oficina-darkText font-mono font-bold px-2 bg-oficina-surface py-1 rounded-sm border border-oficina-border/60">
                <span>{formatTime(currentTimeSec)}</span>
                <span className="text-oficina-mutedText">/</span>
                <span className="text-oficina-mutedText">{formatTime(totalTimeSec)}</span>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 bg-oficina-surface px-2.5 py-1 rounded-sm border border-oficina-border">
                <span className="text-oficina-mutedText text-[10px] font-bold">Velocidade:</span>
                {[0.5, 0.75, 1.0, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold transition cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-oficina-chassis text-[#f3f1ec]'
                        : 'text-oficina-bodyText hover:text-oficina-darkText'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Right Controls: Tracks, Stave Profile, Zoom */}
            <div className="flex items-center gap-2.5 font-mono text-xs flex-wrap">
              
              {/* Instrument Track Selector */}
              {loadedScoreInfo.tracks.length > 0 && (
                <div className="flex items-center gap-1.5 bg-oficina-surface px-2.5 py-1 rounded-sm border border-oficina-border">
                  <span className="text-oficina-mutedText text-[10px] font-bold">Faixa:</span>
                  <select
                    value={selectedTrackIndex}
                    onChange={(e) => handleTrackChange(parseInt(e.target.value))}
                    className="bg-oficina-card text-xs font-mono font-bold text-oficina-darkText border border-oficina-border rounded-[2px] px-2 py-0.5 focus:outline-none cursor-pointer"
                  >
                    {loadedScoreInfo.tracks.length > 1 && (
                      <option value={-1}>[Todas as Faixas Simultâneas]</option>
                    )}
                    {loadedScoreInfo.tracks.map((tr, idx) => (
                      <option key={idx} value={idx}>
                        {tr.name || `Faixa ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Notation Mode: Score+Tab, Tab Only */}
              <div className="flex items-center bg-oficina-surface p-0.5 rounded-sm border border-oficina-border">
                <button
                  onClick={() => handleChangeStaveProfile('default')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition cursor-pointer ${
                    staveProfileMode === 'default'
                      ? 'bg-oficina-chassis text-[#f3f1ec]'
                      : 'text-oficina-bodyText hover:text-oficina-darkText'
                  }`}
                  title="Padrão Automático"
                >
                  Padrão
                </button>
                <button
                  onClick={() => handleChangeStaveProfile('tabOnly')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition cursor-pointer ${
                    staveProfileMode === 'tabOnly'
                      ? 'bg-oficina-chassis text-[#f3f1ec]'
                      : 'text-oficina-bodyText hover:text-oficina-darkText'
                  }`}
                  title="Mostrar apenas Tablatura"
                >
                  Só Tab
                </button>
                <button
                  onClick={() => handleChangeStaveProfile('scoreTab')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition cursor-pointer ${
                    staveProfileMode === 'scoreTab'
                      ? 'bg-oficina-chassis text-[#f3f1ec]'
                      : 'text-oficina-bodyText hover:text-oficina-darkText'
                  }`}
                  title="Partitura e Tablatura juntas"
                >
                  Score + Tab
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.1))}
                  className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText shadow-2xs cursor-pointer"
                  title="Reduzir Zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-oficina-darkText">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}
                  className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText shadow-2xs cursor-pointer"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. MAIN STAGE: EMPTY STATE vs ALPHATAB VIEWER */}
      {!hasLoadedTab ? (
        /* CLEAN EMPTY STATE / HUB */
        <div className="bg-oficina-card border border-oficina-border rounded-sm p-8 lg:p-12 shadow-sm text-center space-y-8 animate-fadeIn">
          
          {/* Hero Header */}
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-oficina-surface border border-oficina-border flex items-center justify-center text-oficina-olive shadow-2xs">
              <Music2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-oficina-darkText">
              Pronto para Tocar com Partitura e Tablatura
            </h3>
            <p className="text-sm text-oficina-bodyText leading-relaxed">
              Pesquise qualquer música no catálogo online do Songsterr ou arraste um arquivo Guitar Pro (<span className="font-mono text-xs font-bold text-oficina-darkText">.gp3, .gp4, .gp5, .gpx</span>) para começar.
            </p>
          </div>

          {/* Quick Action Center */}
          <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-4 bg-oficina-olive text-white rounded-sm font-mono font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-sm hover:brightness-105 transition cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>Buscar Online (Songsterr)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-oficina-surface border border-oficina-border hover:border-oficina-borderDark text-oficina-darkText rounded-sm font-mono font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-2xs transition hover:bg-[#fffefa] cursor-pointer"
            >
              <FolderOpen className="w-5 h-5 text-oficina-terracotta" />
              <span>Abrir do Computador</span>
            </button>
          </div>

          {/* Curated Popular Songs */}
          <div className="max-w-4xl mx-auto pt-6 border-t border-oficina-borderLight space-y-4">
            <div className="flex items-center justify-between text-left">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-oficina-mutedText font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-oficina-amber" />
                  Músicas Populares em 1 Clique
                </span>
                <p className="text-xs text-oficina-bodyText mt-0.5">
                  Clique em qualquer uma para testar o leitor imediatamente:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CURATED_SONGS.map((song) => (
                <div
                  key={song.songId}
                  onClick={() => handleLoadSongsterrSong(song.songId)}
                  className="p-3 bg-oficina-surface border border-oficina-border hover:border-oficina-olive/60 rounded-sm text-left transition hover:shadow-sm cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-oficina-mutedText uppercase">
                        {song.genre}
                      </span>
                      <Play className="w-3.5 h-3.5 text-oficina-olive opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <h4 className="text-sm font-bold text-oficina-darkText mt-1 group-hover:text-oficina-olive transition">
                      {song.title}
                    </h4>
                    <p className="text-xs text-oficina-mutedText font-semibold">
                      {song.artist}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-oficina-border/50 flex items-center justify-between text-[11px] font-mono text-oficina-bodyText">
                    <span className="text-oficina-olive font-bold truncate">
                      {song.trackName}
                    </span>
                    <span className="text-xs text-oficina-mutedText">Carregar →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drag & Drop Prompt footer */}
          <div className="pt-2 text-[11px] font-mono text-oficina-mutedText">
            Dica: Você também pode simplesmente arrastar e soltar um arquivo <span className="font-bold">.gp5</span> em qualquer lugar desta tela!
          </div>

        </div>
      ) : (
        /* ALPHATAB SCORE VIEWER STAGE */
        <div className="bg-[#ffffff] border border-oficina-border rounded-sm p-6 lg:p-8 shadow-sm overflow-x-auto min-h-[550px] relative">
          <div ref={containerRef} className="w-full text-black relative" />
        </div>
      )}

      {/* Hidden container ref when tab is not loaded so AlphaTab remains instantiated */}
      {!hasLoadedTab && (
        <div className="hidden">
          <div ref={containerRef} />
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoadingFile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center z-50 gap-3">
          <div className="bg-oficina-card border border-oficina-border p-6 rounded-sm shadow-xl flex flex-col items-center gap-3 max-w-sm text-center">
            <div className="w-9 h-9 border-3 border-oficina-olive border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-mono font-bold text-oficina-darkText">
              {loadingStatusText || 'Carregando partitura...'}
            </span>
            <p className="text-xs text-oficina-mutedText">
              Processando compassos, afinação e sintetizador de áudio.
            </p>
          </div>
        </div>
      )}

      {/* 3. SONGSTERR SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-oficina-card border border-oficina-border rounded-sm shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-oficina-border flex items-center justify-between bg-oficina-surface">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-oficina-olive text-white rounded-sm">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-oficina-darkText">
                    Buscar Tablaturas no Songsterr
                  </h3>
                  <p className="text-xs text-oficina-mutedText font-mono">
                    Milhões de músicas com partituras e tablaturas completas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 text-oficina-mutedText hover:text-oficina-darkText rounded-sm transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-oficina-borderLight bg-oficina-card">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-oficina-mutedText" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite o nome da música ou artista (ex: Metallica, Pink Floyd, Iron Maiden)..."
                  autoFocus
                  className="w-full pl-9 pr-10 py-2.5 bg-oficina-surface border border-oficina-border rounded-sm text-xs font-mono font-bold text-oficina-darkText focus:outline-none focus:border-oficina-olive shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-oficina-mutedText hover:text-oficina-darkText text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Results List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {isSearching && (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-oficina-mutedText font-mono text-xs">
                  <div className="w-6 h-6 border-2 border-oficina-olive border-t-transparent rounded-full animate-spin"></div>
                  <span>Pesquisando no catálogo do Songsterr...</span>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-oficina-mutedText px-1">
                    {searchResults.length} músicas encontradas:
                  </div>
                  {searchResults.map((song) => {
                    const guitarTracks = (song.tracks || []).filter(t => {
                      const name = (t.instrument || t.name || '').toLowerCase();
                      return name.includes('guitar') || name.includes('viol') || name.includes('bass') || name.includes('lead') || name.includes('rhythm');
                    });

                    return (
                      <div
                        key={song.songId}
                        className="p-3 bg-oficina-surface border border-oficina-border hover:border-oficina-olive/60 rounded-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-oficina-darkText">
                              {song.title}
                            </span>
                            <span className="text-xs text-oficina-mutedText font-semibold">
                              · {song.artist}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-oficina-bodyText">
                            <span className="bg-oficina-card px-1.5 py-0.5 rounded-[2px] border border-oficina-border">
                              {song.tracks?.length || 1} faixas
                            </span>
                            {guitarTracks.slice(0, 3).map((t, i) => (
                              <span key={i} className="text-oficina-olive font-bold">
                                • {t.name || t.instrument}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://www.songsterr.com/a/wa/song?id=${song.songId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-oficina-mutedText hover:text-oficina-darkText border border-oficina-border rounded-sm bg-oficina-card hover:bg-oficina-surface transition"
                            title="Ver detalhes no Songsterr.com ↗"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleLoadSongsterrSong(song.songId)}
                            className="px-3 py-1.5 bg-oficina-olive text-white font-mono font-bold text-xs rounded-sm hover:brightness-105 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Importar Tablatura</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isSearching && searchQuery && searchResults.length === 0 && (
                <div className="py-12 text-center space-y-2 text-oficina-mutedText">
                  <Music className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-mono">Nenhuma música encontrada para "{searchQuery}".</p>
                  <p className="text-[11px] text-oficina-mutedText">Tente buscar apenas o nome do artista ou música.</p>
                </div>
              )}

              {!isSearching && !searchQuery && (
                <div className="space-y-4 py-2">
                  <div className="text-xs font-mono font-bold text-oficina-mutedText uppercase tracking-wider px-1">
                    Sugestões Populares:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURATED_SONGS.map((song) => (
                      <button
                        key={song.songId}
                        onClick={() => handleLoadSongsterrSong(song.songId)}
                        className="p-2.5 bg-oficina-surface border border-oficina-border hover:border-oficina-olive rounded-sm text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-oficina-darkText group-hover:text-oficina-olive">
                            {song.title}
                          </div>
                          <div className="text-[11px] text-oficina-mutedText">
                            {song.artist} · <span className="font-mono text-oficina-olive">{song.trackName}</span>
                          </div>
                        </div>
                        <Play className="w-3.5 h-3.5 text-oficina-olive opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-oficina-border bg-oficina-surface flex items-center justify-between text-[11px] font-mono text-oficina-mutedText">
              <span>Integração de busca via catálogo público Songsterr</span>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="px-3 py-1 bg-oficina-card border border-oficina-border rounded-sm hover:text-oficina-darkText font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
