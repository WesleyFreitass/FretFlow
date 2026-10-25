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
  Check
} from 'lucide-react';

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
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalTimeSec, setTotalTimeSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const containerRef = useRef(null);
  const alphaTabApiRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInitialMountRef = useRef(true);

  // Initialize AlphaTab once on mount
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
          useWorkers: false, // Process on main thread to guarantee 100% rendering reliability across browsers
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

      // Load initial built-in tab
      setIsLoadingFile(true);
      api.load('/tabs/aula_20_coordenacao.gp5');

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

  const handlePlayPause = () => {
    if (alphaTabApiRef.current) {
      try {
        alphaTabApiRef.current.playPause();
      } catch (e) {
        console.error("Erro no playPause:", e);
      }
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
        // Render all tracks simultaneously
        alphaTabApiRef.current.renderTracks(alphaTabApiRef.current.score.tracks);
      } else if (alphaTabApiRef.current.score.tracks[trackIndex]) {
        alphaTabApiRef.current.renderTracks([alphaTabApiRef.current.score.tracks[trackIndex]]);
      }
    } catch (err) {
      console.error("Erro ao trocar instrumento:", err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsLoadingFile(true);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP CONTROLS & TRANSPORT BAR */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        
        {/* Header Title & Upload Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm shadow-2xs">
              <FileText className="w-5 h-5 text-oficina-olive" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-oficina-darkText">
                  {customTabName ? customTabName : (loadedScoreInfo.title || 'Guitar Pro Player')}
                </h2>
                {loadedScoreInfo.artist && (
                  <span className="text-xs text-oficina-mutedText font-semibold">
                    · {loadedScoreInfo.artist}
                  </span>
                )}
                {isSoundFontReady && (
                  <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                    Sintetizador Ativo ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-oficina-bodyText mt-0.5">
                {customTabName 
                  ? `Arquivo importado com sucesso. Andamento: ${loadedScoreInfo.tempo} BPM.` 
                  : 'Abra qualquer arquivo (.gp3, .gp4, .gp5, .gpx) para tocar com partitura, tablatura e áudio sincronizado.'}
              </p>
            </div>
          </div>

          {/* Upload Custom File Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-oficina-surface border border-oficina-border hover:border-oficina-borderDark font-mono font-bold text-xs rounded-sm cursor-pointer transition flex items-center gap-2 text-oficina-darkText shadow-sm hover:bg-[#fffefa]"
            >
              <Upload className="w-3.5 h-3.5 text-oficina-terracotta" />
              <span>{customTabName ? 'Trocar Arquivo GP' : 'Abrir Tablatura (.gp3, .gp4, .gp5, .gpx)'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".gp,.gp3,.gp4,.gp5,.gpx"
                onChange={handleFileUpload}
                onClick={(e) => { e.target.value = null; }}
                className="hidden"
              />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-100 border border-rose-300 rounded-sm p-3 flex items-center gap-2 text-xs text-rose-900 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Transport Toolbar */}
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
              className="px-3 py-1.5 bg-oficina-surface border border-oficina-border text-oficina-bodyText hover:text-oficina-darkText rounded-sm font-bold flex items-center gap-1 shadow-2xs"
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
                  className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold transition ${
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
                className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition ${
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
                className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition ${
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
                className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] transition ${
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
                className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText shadow-2xs"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-xs font-bold text-oficina-darkText">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}
                className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText shadow-2xs"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 2. ALPHATAB SCORE VIEWER STAGE */}
      <div className="bg-[#ffffff] border border-oficina-border rounded-sm p-6 lg:p-8 shadow-sm overflow-x-auto min-h-[550px] relative">
        {isLoadingFile && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 gap-3">
            <div className="w-8 h-8 border-3 border-oficina-olive border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono font-bold text-oficina-darkText">
              Carregando e renderizando partitura...
            </span>
          </div>
        )}
        <div ref={containerRef} className="w-full text-black relative" />
      </div>

    </div>
  );
}
