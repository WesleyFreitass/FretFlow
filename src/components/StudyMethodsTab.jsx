import React, { useState, useEffect, useRef } from 'react';
import { STUDY_PHASES, STRUMMING_GROOVES } from '../data/studyRoadmap';
import { CHORD_DEFINITIONS, GUITAR_STRINGS, NOTE_NAMES } from '../audio/chordDictionary';
import Fretboard from './Fretboard';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Compass, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Zap, 
  Award, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  Volume2, 
  BookOpen, 
  Trophy, 
  Layers, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Music,
  Activity,
  Gauge
} from 'lucide-react';

export default function StudyMethodsTab({ 
  pitchData, 
  chordData, 
  chromagram, 
  isAudible,
  onNavigateTab 
}) {
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' | 'lab'
  const [activeTool, setActiveTool] = useState('speed_trainer'); // 'speed_trainer' | 'strumming' | 'power_chords' | 'barre'
  
  // Progress Persistence in localStorage
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('fretflow_study_progress_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const toggleStepCompleted = (stepId) => {
    setCompletedSteps(prev => {
      const next = prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId];
      try {
        localStorage.setItem('fretflow_study_progress_v1', JSON.stringify(next));
      } catch (_) {}

      if (next.includes(stepId)) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
      return next;
    });
  };

  // Total Progress Math
  const totalSteps = 14;
  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100);

  // TOOL 1: SPEED TRAINER
  const [speedPattern, setSpeedPattern] = useState('1-2-3-4');
  const [speedBpm, setSpeedBpm] = useState(60);
  const [speedTargetBpm, setSpeedTargetBpm] = useState(90);
  const [speedAutoAcc, setSpeedAutoAcc] = useState(true);
  const [isSpeedPlaying, setIsSpeedPlaying] = useState(false);
  const [speedCurrentFretIndex, setSpeedCurrentFretIndex] = useState(0);
  const [speedSelectedString, setSpeedSelectedString] = useState(6);
  const [speedRepCount, setSpeedRepCount] = useState(0);

  const speedTimerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const PATTERNS_MAP = {
    '1-2-3-4': [1, 2, 3, 4],
    '1-3-2-4': [1, 3, 2, 4],
    '1-4-2-3': [1, 4, 2, 3],
    '4-3-2-1': [4, 3, 2, 1]
  };

  const currentPatternFrets = PATTERNS_MAP[speedPattern] || [1, 2, 3, 4];

  const playClick = (isHigh) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isHigh ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isHigh ? 1300 : 750, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  };

  useEffect(() => {
    if (!isSpeedPlaying) {
      if (speedTimerRef.current) clearInterval(speedTimerRef.current);
      return;
    }

    const intervalMs = (60 / speedBpm) * 1000;

    speedTimerRef.current = setInterval(() => {
      setSpeedCurrentFretIndex(prev => {
        const next = (prev + 1) % currentPatternFrets.length;
        playClick(next === 0);

        if (next === 0) {
          setSpeedRepCount(r => {
            const nextR = r + 1;
            if (speedAutoAcc && nextR % 4 === 0) {
              setSpeedBpm(b => Math.min(speedTargetBpm, b + 2));
            }
            return nextR;
          });
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (speedTimerRef.current) clearInterval(speedTimerRef.current);
    };
  }, [isSpeedPlaying, speedBpm, currentPatternFrets, speedAutoAcc, speedTargetBpm]);

  // TOOL 2: STRUMMING TRAINER
  const [strumGrooveIndex, setStrumGrooveIndex] = useState(0);
  const [strumBpm, setStrumBpm] = useState(80);
  const [isStrumPlaying, setIsStrumPlaying] = useState(false);
  const [strumCurrentStep, setStrumCurrentStep] = useState(0);

  const strumTimerRef = useRef(null);
  const activeGroove = STRUMMING_GROOVES[strumGrooveIndex];

  useEffect(() => {
    if (!isStrumPlaying) {
      if (strumTimerRef.current) clearInterval(strumTimerRef.current);
      return;
    }

    const subdivisionMs = (60 / strumBpm / 2) * 1000;

    strumTimerRef.current = setInterval(() => {
      setStrumCurrentStep(prev => {
        const next = (prev + 1) % activeGroove.pattern.length;
        const stroke = activeGroove.pattern[next];
        if (stroke && stroke !== '-') {
          playClick(next === 0);
        }
        return next;
      });
    }, subdivisionMs);

    return () => {
      if (strumTimerRef.current) clearInterval(strumTimerRef.current);
    };
  }, [isStrumPlaying, strumBpm, activeGroove]);

  // TOOL 3: POWER CHORD TRAINER
  const [selectedPowerRoot, setSelectedPowerRoot] = useState('E5');

  // TOOL 4: BARRE CHORD TRAINER
  const [selectedBarreChord, setSelectedBarreChord] = useState('F');

  const handleLaunchStep = (step) => {
    if (step.toolType === 'hero' && onNavigateTab) {
      onNavigateTab('hero');
      return;
    }
    if (step.toolType === 'chord_trainer' && onNavigateTab) {
      onNavigateTab('trainer');
      return;
    }

    setViewMode('lab');
    if (step.toolType === 'speed_trainer') {
      setActiveTool('speed_trainer');
      if (step.preset?.pattern) setSpeedPattern(step.preset.pattern);
      if (step.preset?.bpm) setSpeedBpm(step.preset.bpm);
    } else if (step.toolType === 'strumming_trainer') {
      setActiveTool('strumming');
      if (step.preset?.bpm) setStrumBpm(step.preset.bpm);
    } else if (step.toolType === 'power_chord_trainer') {
      setActiveTool('power_chords');
    } else if (step.toolType === 'barre_trainer') {
      setActiveTool('barre');
      if (step.preset?.chords?.[0]) setSelectedBarreChord(step.preset.chords[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP HEADER & OVERALL PROGRESS */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
              <GraduationCap className="w-5 h-5 text-oficina-amberDark" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
                <span>Trilha de Estudos &amp; Métodos</span>
                <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
                  MÉTODO GUIADO
                </span>
              </h2>
              <p className="text-xs text-oficina-bodyText">
                Ordem sugerida passo a passo com ferramentas de treino prático na guitarra real
              </p>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1.5 bg-oficina-surface p-1 rounded-sm border border-oficina-border font-mono text-xs">
            <button
              onClick={() => setViewMode('roadmap')}
              className={`px-3 py-1.5 rounded-[2px] font-bold transition flex items-center gap-1.5 ${
                viewMode === 'roadmap'
                  ? 'bg-oficina-chassis text-[#f3f1ec]'
                  : 'text-oficina-bodyText hover:text-oficina-darkText'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Trilha Guiada</span>
            </button>

            <button
              onClick={() => setViewMode('lab')}
              className={`px-3 py-1.5 rounded-[2px] font-bold transition flex items-center gap-1.5 ${
                viewMode === 'lab'
                  ? 'bg-oficina-chassis text-[#f3f1ec]'
                  : 'text-oficina-bodyText hover:text-oficina-darkText'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Laboratório de Treino</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-oficina-surface p-3 rounded-sm border border-oficina-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-oficina-darkText font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-oficina-amberDark" />
              Progresso no Método:
            </span>
            <span className="font-mono font-bold text-oficina-darkText">
              {completedSteps.length} de {totalSteps} Etapas Concluídas ({progressPercent}%)
            </span>
          </div>

          <div className="h-2 bg-[#eae6da] border border-oficina-border rounded-[2px] overflow-hidden">
            <div 
              className="h-full bg-oficina-olive transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: ROADMAP */}
      {viewMode === 'roadmap' && (
        <div className="space-y-5">
          {STUDY_PHASES.map((phase) => (
            <div key={phase.id} className="bg-oficina-card border border-oficina-border rounded-sm p-5 shadow-sm space-y-4">
              
              {/* Phase Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-oficina-borderLight pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-oficina-surface border border-oficina-border text-oficina-darkText">
                      {phase.title.split(':')[0]}
                    </span>
                    <h3 className="text-sm font-extrabold text-oficina-darkText">
                      {phase.title.split(':')[1]}
                    </h3>
                  </div>
                  <p className="text-xs text-oficina-bodyText mt-0.5">{phase.subtitle}</p>
                </div>

                <div className="text-xs font-mono text-oficina-mutedText">
                  {phase.steps.filter(s => completedSteps.includes(s.id)).length}/{phase.steps.length} Concluídas
                </div>
              </div>

              {/* Steps List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {phase.steps.map((step) => {
                  const isDone = completedSteps.includes(step.id);

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-[3px] border flex flex-col justify-between space-y-3 transition-all ${
                        isDone 
                          ? 'bg-oficina-oliveLight/50 border-oficina-olive/40 shadow-sm' 
                          : 'bg-oficina-card border-oficina-borderLight hover:border-oficina-border'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-oficina-surface border border-oficina-border text-oficina-bodyText">
                            Etapa {step.number} • {step.lessonRef}
                          </span>

                          <button
                            onClick={() => toggleStepCompleted(step.id)}
                            className={`p-1 rounded-[2px] transition ${
                              isDone 
                                ? 'bg-oficina-olive text-white' 
                                : 'bg-oficina-surface border border-oficina-border text-oficina-mutedText hover:text-oficina-darkText'
                            }`}
                            title={isDone ? 'Marcar como não concluído' : 'Marcar como concluído'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className={`text-xs font-bold ${isDone ? 'text-[#2c3d21]' : 'text-oficina-darkText'}`}>
                          {step.title}
                        </h4>

                        <p className="text-[11px] text-oficina-bodyText leading-relaxed">
                          {step.description}
                        </p>

                        <div className="bg-oficina-surface p-2 rounded-[2px] border border-oficina-border text-[10px] text-oficina-darkText">
                          <strong>Meta:</strong> {step.goal}
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchStep(step)}
                        className={`w-full py-1.5 px-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                          isDone
                            ? 'bg-oficina-surface border border-oficina-border text-oficina-darkText hover:bg-[#eae6da]'
                            : 'bg-oficina-chassis text-[#f3f1ec] hover:brightness-110 shadow-sm'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-oficina-terracotta" />
                        <span>{isDone ? 'Treinar Novamente' : 'Treinar Agora'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: LAB OF TOOLS */}
      {viewMode === 'lab' && (
        <div className="bg-oficina-card border border-oficina-border rounded-sm p-5 shadow-sm space-y-5">
          
          {/* Tool Selector Buttons */}
          <div className="flex flex-wrap gap-1.5 border-b border-oficina-borderLight pb-3 font-mono text-xs">
            {[
              { id: 'speed_trainer', label: '⚡ Acelerador 1-2-3-4' },
              { id: 'strumming', label: '🥁 Máquina de Ritmos & Levadas' },
              { id: 'power_chords', label: '🔥 Laboratório de Power Chords' },
              { id: 'barre', label: '🔒 Domador de Pestanas' }
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3 py-1.5 rounded-sm border transition font-bold ${
                  activeTool === tool.id
                    ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis'
                    : 'bg-oficina-surface border-oficina-border text-oficina-bodyText hover:border-oficina-borderDark'
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>

          {/* TOOL 1: SPEED TRAINER CONTENT */}
          {activeTool === 'speed_trainer' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-oficina-darkText">Acelerador Cromático de Dedos (1-2-3-4)</h3>
                  <p className="text-xs text-oficina-bodyText">Aumenta o BPM automaticamente a cada 4 repetições limpas</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-oficina-surface px-3 py-1.5 rounded-sm border border-oficina-border font-mono text-xs">
                    <span className="text-oficina-mutedText font-bold">BPM:</span>
                    <span className="font-black text-oficina-darkText">{speedBpm}</span>
                  </div>

                  <button
                    onClick={() => setIsSpeedPlaying(!isSpeedPlaying)}
                    className={`px-4 py-1.5 rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition ${
                      isSpeedPlaying ? 'bg-oficina-amber text-oficina-darkText' : 'bg-oficina-olive text-white'
                    }`}
                  >
                    {isSpeedPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSpeedPlaying ? 'Pausar' : 'Iniciar Metrônomo'}</span>
                  </button>
                </div>
              </div>

              {/* Fret Visualizer */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                {currentPatternFrets.map((fret, idx) => {
                  const isCurrent = isSpeedPlaying && speedCurrentFretIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-sm border transition-all ${
                        isCurrent
                          ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-md scale-105'
                          : 'bg-oficina-surface border-oficina-border text-oficina-darkText'
                      }`}
                    >
                      <span className="text-[10px] text-oficina-mutedText block">Dedo / Casa</span>
                      <span className="text-3xl font-black">{fret}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOOL 2: STRUMMING TRAINER CONTENT */}
          {activeTool === 'strumming' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-oficina-darkText">{activeGroove.name}</h3>
                  <p className="text-xs text-oficina-bodyText">{activeGroove.description}</p>
                </div>

                <button
                  onClick={() => setIsStrumPlaying(!isStrumPlaying)}
                  className={`px-4 py-1.5 rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition ${
                    isStrumPlaying ? 'bg-oficina-amber text-oficina-darkText' : 'bg-oficina-olive text-white'
                  }`}
                >
                  {isStrumPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isStrumPlaying ? 'Pausar' : 'Iniciar Levada'}</span>
                </button>
              </div>

              {/* Strum Stroke Blocks */}
              <div className="grid grid-cols-8 gap-1.5 text-center font-mono text-xs">
                {activeGroove.pattern.map((stroke, idx) => {
                  const isCurrent = isStrumPlaying && strumCurrentStep === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-sm border transition-all ${
                        isCurrent
                          ? 'bg-oficina-terracotta text-white border-oficina-terracotta shadow-md scale-105 font-black'
                          : stroke !== '-'
                            ? 'bg-oficina-surface border-oficina-border text-oficina-darkText font-bold'
                            : 'bg-oficina-card border-oficina-borderLight text-oficina-mutedText'
                      }`}
                    >
                      <span className="text-[9px] block text-oficina-mutedText">{idx + 1}</span>
                      <span className="text-lg">{stroke === 'D' ? '↓' : stroke === 'U' ? '↑' : stroke === 'X' ? '✕' : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TOOL 3 & 4: POWER CHORDS & BARRE */}
          {(activeTool === 'power_chords' || activeTool === 'barre') && (
            <div className="space-y-4">
              <Fretboard chord={CHORD_DEFINITIONS[activeTool === 'power_chords' ? selectedPowerRoot : selectedBarreChord]} />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
