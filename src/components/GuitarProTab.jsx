import React, { useState, useEffect, useRef } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Volume2, 
  Sliders, 
  FileText, 
  Layers, 
  Check, 
  Sparkles, 
  Zap, 
  Eye,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  AlertCircle,
  VolumeX
} from 'lucide-react';

const BUILTIN_TABS = [
  {
    id: 'aula_20',
    title: 'Aula 20: Exercícios de Coordenação & Técnica (Team Alabama)',
    artist: 'Maurício Alabama',
    file: '/tabs/aula_20_coordenacao.gp5',
    category: 'Exercícios',
    description: 'Padrões de digitação no braço com palhetada alternada e independência dos dedos (20 GP.gp5).'
  },
  {
    id: 'aula_30',
    title: 'Aula 30: Estudo de Repertório Completo',
    artist: 'Maurício Alabama',
    file: '/tabs/aula_30_repertorio.gp5',
    category: 'Repertório',
    description: 'Aplicação prática das técnicas de solo, ritmo e dinâmica de palco.'
  }
];

export default function GuitarProTab({ 
  pitchData, 
  chordData, 
  isAudible 
}) {
  const [selectedTabId, setSelectedTabId] = useState('aula_20');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [customTabName, setCustomTabName] = useState(null);
  const [loadedScoreInfo, setLoadedScoreInfo] = useState({ title: '', artist: '', tempo: 120, tracks: [] });
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isAlphaTabReady, setIsAlphaTabReady] = useState(false);
  const [isSoundFontReady, setIsSoundFontReady] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalTimeSec, setTotalTimeSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const containerRef = useRef(null);
  const alphaTabApiRef = useRef(null);
  const fileInputRef = useRef(null);

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
          logLevel: 'debug'
        },
        display: {
          layoutMode: alphaTab.LayoutMode.Page,
          staveProfile: alphaTab.StaveProfile.ScoreTab, // Partitura + Tablatura simultâneas
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
          soundFont: '/soundfont/sonivox.sf2' // Local soundfont
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
        setErrorMessage(null);
        setLoadedScoreInfo({
          title: score.title || 'Partitura Carregada',
          artist: score.artist || 'Maurício Alabama',
          tempo: score.tempo || 120,
          tracks: score.tracks || []
        });
        if (score.tracks && score.tracks.length > 0) {
          setSelectedTrackIndex(0);
        }
      });

      api.renderFinished.on(() => {
        setIsAlphaTabReady(true);
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
        setErrorMessage(`Não foi possível abrir este arquivo: ${err.message || 'formato incompatível'}`);
      });

      // Load initial built-in tab
      api.load(BUILTIN_TABS[0].file);

    } catch (e) {
      console.warn('Erro ao inicializar AlphaTab:', e);
    }

    return () => {
      if (alphaTabApiRef.current) {
        try { alphaTabApiRef.current.destroy(); } catch (_) {}
      }
    };
  }, []);

  useEffect(() => {
    if (alphaTabApiRef.current && isAlphaTabReady) {
      try {
        alphaTabApiRef.current.settings.display.scale = zoomLevel;
        alphaTabApiRef.current.updateSettings();
        alphaTabApiRef.current.render();
      } catch (_) {}
    }
  }, [zoomLevel, isAlphaTabReady]);

  useEffect(() => {
    if (alphaTabApiRef.current && isAlphaTabReady) {
      try {
        alphaTabApiRef.current.playbackSpeed = playbackSpeed;
      } catch (_) {}
    }
  }, [playbackSpeed, isAlphaTabReady]);

  const handlePlayPause = () => {
    if (alphaTabApiRef.current) {
      try {
        const isNowPlaying = alphaTabApiRef.current.playPause();
        setIsPlaying(isNowPlaying);
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

  const handleSelectTab = (tab) => {
    setSelectedTabId(tab.id);
    setCustomTabName(null);
    setErrorMessage(null);
    if (alphaTabApiRef.current) {
      alphaTabApiRef.current.load(tab.file);
    }
  };

  const handleTrackChange = (trackIndex) => {
    setSelectedTrackIndex(trackIndex);
    if (alphaTabApiRef.current && loadedScoreInfo.tracks[trackIndex]) {
      try {
        alphaTabApiRef.current.renderTracks([loadedScoreInfo.tracks[trackIndex]]);
      } catch (_) {}
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer && alphaTabApiRef.current) {
        setCustomTabName(file.name);
        setSelectedTabId('custom');
        try {
          const uint8Data = new Uint8Array(buffer);
          alphaTabApiRef.current.load(uint8Data);
        } catch (err) {
          console.error("Erro ao carregar GP5:", err);
          setErrorMessage("Erro ao processar o arquivo Guitar Pro. Verifique se o arquivo .gp5/.gpx é válido.");
        }
      }
    };
    reader.onerror = () => {
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
    <div className="space-y-5 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP CONTROLS & TRANSPORT BAR */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
              <FileText className="w-5 h-5 text-oficina-olive" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
                <span>Guitar Pro Player &amp; Leitor de Partituras</span>
                <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                  ALPHATAB DSP
                </span>
                {isSoundFontReady && (
                  <span className="text-[10px] bg-oficina-surface text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-border">
                    Áudio MIDI Ativo ✓
                  </span>
                )}
              </h2>
              <p className="text-xs text-oficina-bodyText">
                {customTabName 
                  ? `Arquivo Importado: ${customTabName} · ${loadedScoreInfo.title}` 
                  : 'Reproduza arquivos .gp3, .gp4, .gp5 e .gpx com cursor sincronizado e sintetizador MIDI'}
              </p>
            </div>
          </div>

          {/* Upload Custom File Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-oficina-surface border border-oficina-border hover:border-oficina-borderDark font-mono font-bold text-xs rounded-sm cursor-pointer transition flex items-center gap-2 text-oficina-darkText shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-oficina-terracotta" />
            <span>{customTabName ? 'Trocar Arquivo GP5' : 'Abrir Arquivo (.gp3, .gp4, .gp5, .gpx)'}</span>
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-100 border border-rose-300 rounded-sm p-3 flex items-center gap-2 text-xs text-rose-900 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Transport Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-oficina-borderLight">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handlePlayPause}
              className={`px-4 py-1.5 rounded-sm font-bold flex items-center gap-1.5 shadow-sm transition ${
                isPlaying
                  ? 'bg-oficina-amber text-oficina-darkText font-black'
                  : 'bg-oficina-olive text-white font-black'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pausar' : 'Tocar Partitura'}</span>
            </button>

            <button
              onClick={handleStop}
              className="px-3 py-1.5 bg-oficina-surface border border-oficina-border text-oficina-bodyText hover:text-oficina-darkText rounded-sm font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            {/* Time / Progress info */}
            <div className="flex items-center gap-1 text-oficina-darkText font-mono font-bold px-2">
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

          {/* Zoom Controls & Tracks */}
          <div className="flex items-center gap-3 font-mono text-xs">
            {loadedScoreInfo.tracks.length > 1 && (
              <div className="flex items-center gap-1 bg-oficina-surface px-2.5 py-1 rounded-sm border border-oficina-border">
                <span className="text-oficina-mutedText text-[10px] font-bold">Instrumento:</span>
                <select
                  value={selectedTrackIndex}
                  onChange={(e) => handleTrackChange(parseInt(e.target.value))}
                  className="bg-oficina-card text-xs font-mono font-bold text-oficina-darkText border border-oficina-border rounded-[2px] px-1.5 py-0.5 focus:outline-none"
                >
                  {loadedScoreInfo.tracks.map((tr, idx) => (
                    <option key={idx} value={idx}>
                      {tr.name || `Faixa ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.1))}
                className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-bold text-oficina-darkText">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(1.5, z + 0.1))}
                className="p-1.5 bg-oficina-surface border border-oficina-border rounded-sm text-oficina-bodyText hover:text-oficina-darkText"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-oficina-borderLight">
          {BUILTIN_TABS.map((tab) => {
            const isSelected = selectedTabId === tab.id && !customTabName;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab)}
                className={`p-3 rounded-sm border text-left transition ${
                  isSelected
                    ? 'bg-oficina-surface border-oficina-chassis shadow-sm'
                    : 'bg-oficina-card border-oficina-borderLight hover:border-oficina-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-oficina-darkText truncate">{tab.title}</h4>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] bg-oficina-surface border border-oficina-border text-oficina-mutedText">
                    {tab.category}
                  </span>
                </div>
                <p className="text-[11px] text-oficina-mutedText mt-0.5 truncate">{tab.description}</p>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. ALPHATAB SCORE VIEWER STAGE */}
      <div className="bg-[#ffffff] border border-oficina-border rounded-sm p-6 lg:p-8 shadow-sm overflow-x-auto min-h-[500px] relative">
        <div ref={containerRef} className="w-full text-black relative" />
      </div>

    </div>
  );
}
