import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  GUITAR_SCALES, 
  ROOT_NOTES, 
  INTERVAL_LABELS, 
  calculateFretboardNotes 
} from '../data/guitarScales';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  Volume2, 
  Check, 
  RotateCcw, 
  Play, 
  Pause, 
  Flame, 
  Zap, 
  Eye, 
  BookOpen, 
  HelpCircle,
  Trophy,
  Award
} from 'lucide-react';

const STRING_NAMES = ['1ª e', '2ª B', '3ª G', '4ª D', '5ª A', '6ª E'];

export default function ScaleExplorerTab({ 
  pitchData, 
  chordData, 
  chromagram, 
  isAudible 
}) {
  const [selectedRoot, setSelectedRoot] = useState('A');
  const [selectedScaleId, setSelectedScaleId] = useState('pentatonic_minor');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [viewMode, setViewMode] = useState('all');
  const [labelMode, setLabelMode] = useState('notes');
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [hitNotes, setHitNotes] = useState(new Set());

  const currentScale = useMemo(() => {
    return GUITAR_SCALES.find(s => s.id === selectedScaleId) || GUITAR_SCALES[0];
  }, [selectedScaleId]);

  const fretboardData = useMemo(() => {
    return calculateFretboardNotes(selectedRoot, currentScale.intervals, currentScale.blueNoteInterval);
  }, [selectedRoot, currentScale]);

  const categories = ['Todas', 'Pentatônicas', 'Blues', 'Modos Gregos', 'Menores Especiais'];

  const filteredScales = useMemo(() => {
    if (activeCategory === 'Todas') return GUITAR_SCALES;
    return GUITAR_SCALES.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const getFretRangeForShape = (root, shape) => {
    const rootIdx = ROOT_NOTES.indexOf(root);
    const baseFret = (rootIdx - 4 + 12) % 12;

    switch (shape) {
      case 'shape1': return [baseFret, baseFret + 4];
      case 'shape2': return [baseFret + 2, baseFret + 6];
      case 'shape3': return [baseFret + 5, baseFret + 9];
      case 'shape4': return [baseFret + 7, baseFret + 11];
      case 'shape5': return [baseFret + 9, baseFret + 13];
      default: return [0, 24];
    }
  };

  const [shapeMinFret, shapeMaxFret] = useMemo(() => {
    if (viewMode.startsWith('shape')) {
      return getFretRangeForShape(selectedRoot, viewMode);
    }
    return [0, 24];
  }, [selectedRoot, viewMode]);

  useEffect(() => {
    if (!isChallengeActive || !isAudible || !pitchData) return;

    const detectedNote = pitchData.noteName;
    if (detectedNote) {
      const rootIndex = ROOT_NOTES.indexOf(selectedRoot);
      const noteIndex = ROOT_NOTES.indexOf(detectedNote);
      const semitoneInterval = (noteIndex - rootIndex + 12) % 12;

      if (currentScale.intervals.includes(semitoneInterval)) {
        setHitNotes(prev => {
          const next = new Set(prev);
          next.add(detectedNote);

          if (next.size >= currentScale.intervals.length) {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          }
          return next;
        });
      }
    }
  }, [pitchData, isAudible, isChallengeActive, currentScale, selectedRoot]);

  const handleResetChallenge = () => {
    setHitNotes(new Set());
  };

  return (
    <div className="space-y-5 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP HEADER & CATEGORY FILTER */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
              <Compass className="w-5 h-5 text-oficina-petrol" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
                <span>Visualizador de Escalas &amp; Modos Gregos</span>
                <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                  24 TRASTES PRO
                </span>
              </h2>
              <p className="text-xs text-oficina-bodyText">
                {currentScale.description}
              </p>
            </div>
          </div>

          {/* Label Toggle */}
          <div className="flex items-center gap-1.5 bg-oficina-surface p-1 rounded-sm border border-oficina-border font-mono text-xs">
            <button
              onClick={() => setLabelMode('notes')}
              className={`px-3 py-1.5 rounded-[2px] font-bold transition ${
                labelMode === 'notes'
                  ? 'bg-oficina-chassis text-[#f3f1ec]'
                  : 'text-oficina-bodyText hover:text-oficina-darkText'
              }`}
            >
              Nomes das Notas
            </button>
            <button
              onClick={() => setLabelMode('intervals')}
              className={`px-3 py-1.5 rounded-[2px] font-bold transition ${
                labelMode === 'intervals'
                  ? 'bg-oficina-chassis text-[#f3f1ec]'
                  : 'text-oficina-bodyText hover:text-oficina-darkText'
              }`}
            >
              Intervalos (T, b3, 5...)
            </button>
          </div>
        </div>

        {/* Categories & Root Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-oficina-borderLight">
          
          {/* Root Notes */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
              TÔNICA FUNDAMENTAL
            </label>
            <div className="flex flex-wrap gap-1">
              {ROOT_NOTES.map(note => (
                <button
                  key={note}
                  onClick={() => {
                    setSelectedRoot(note);
                    handleResetChallenge();
                  }}
                  className={`w-8 h-8 rounded-sm font-mono font-bold text-xs border transition ${
                    selectedRoot === note
                      ? 'bg-oficina-terracotta text-white border-oficina-terracotta shadow-sm font-black'
                      : 'bg-oficina-surface border-oficina-border text-oficina-darkText hover:border-oficina-borderDark'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Scales Selector */}
          <div className="md:col-span-8 space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                TIPO DE ESCALA / MODO
              </label>
              <div className="flex gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold transition ${
                      activeCategory === cat
                        ? 'bg-oficina-chassis text-[#f3f1ec]'
                        : 'bg-oficina-surface text-oficina-mutedText hover:text-oficina-darkText'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {filteredScales.map(scale => {
                const isSelected = selectedScaleId === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      setSelectedScaleId(scale.id);
                      handleResetChallenge();
                    }}
                    className={`p-2 rounded-sm border text-left font-mono transition ${
                      isSelected
                        ? 'bg-oficina-surface border-oficina-chassis font-bold text-oficina-darkText shadow-sm'
                        : 'bg-oficina-card border-oficina-borderLight text-oficina-bodyText hover:border-oficina-border'
                    }`}
                  >
                    <div className="text-xs font-bold font-sans text-oficina-darkText truncate">{scale.name}</div>
                    <div className="text-[10px] text-oficina-mutedText truncate">{scale.mood || scale.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 2. 24-FRET WOODEN FRETBOARD */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-extrabold text-oficina-darkText uppercase tracking-wider">
              {selectedRoot} {currentScale.name} — Braço Completo (24 Casas)
            </h3>
            <p className="text-[11px] text-oficina-bodyText">
              Notas da escala: {currentScale.intervals.map(i => ROOT_NOTES[(ROOT_NOTES.indexOf(selectedRoot) + i) % 12]).join(' - ')} {currentScale.artists ? `· Artistas: ${currentScale.artists}` : ''}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-oficina-terracotta border border-white"></span>
              <span>Tônica (1)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-oficina-olive border border-white"></span>
              <span>Nota da Escala</span>
            </span>
            {currentScale.blueNoteInterval !== undefined && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-oficina-petrol border border-white"></span>
                <span>Blue Note (b5)</span>
              </span>
            )}
          </div>
        </div>

        {/* 24-Fret Scrollable Wood Stage */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="fretboard-wood-boutique border-2 border-[#42220b] rounded-[3px] p-4 shadow-inner min-w-[1000px]">
            
            {/* Header: Frets 0 to 24 */}
            <div className="grid grid-cols-25 gap-0 text-center font-mono text-[9px] text-[#e3d3b6] pb-1.5 border-b border-black/25">
              <div className="font-bold text-[#f6efe2]">Nut</div>
              {Array.from({ length: 24 }).map((_, idx) => (
                <div key={idx + 1} className="font-bold">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* 6 Guitar Strings with Fret Notes */}
            <div className="space-y-3 pt-2 relative">
              {fretboardData.map((fretsOnString, strIdx) => {
                const stringThickness = `${1.2 + (5 - strIdx) * 0.4}px`;
                const stringName = STRING_NAMES[strIdx] || `${strIdx + 1}ª`;

                return (
                  <div key={strIdx} className="grid grid-cols-25 items-center relative">
                    {/* Nut label */}
                    <div className="font-mono font-bold text-xs text-[#f6efe2] pr-1">
                      {stringName}
                    </div>

                    {/* 24 Frets */}
                    {fretsOnString.map((fret) => {
                      const isVisible = viewMode === 'all' || (fret.fret >= shapeMinFret && fret.fret <= shapeMaxFret);
                      const isTonic = fret.isRoot;
                      const isBlue = fret.isBlueNote;
                      const isInScale = fret.inScale;

                      return (
                        <div
                          key={fret.fret}
                          className="relative h-6 flex items-center justify-center border-r border-[#e8e2d4]/30"
                        >
                          {/* Metal String Line */}
                          <div
                            className="absolute inset-x-0 bg-gradient-to-r from-[#e8e2d4] via-[#f4f2ec] to-[#e8e2d4] shadow-sm"
                            style={{ height: stringThickness }}
                          />

                          {/* Note Dot Marker */}
                          {isInScale && isVisible && (
                            <div
                              className={`relative z-20 w-5 h-5 rounded-full font-mono font-bold text-[9px] flex items-center justify-center shadow-md border-2 border-white transition-transform ${
                                isTonic
                                  ? 'bg-oficina-terracotta text-white'
                                  : isBlue
                                    ? 'bg-oficina-petrol text-white'
                                    : 'bg-oficina-olive text-white'
                              }`}
                            >
                              {labelMode === 'notes' ? fret.noteName : fret.intervalShort}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
