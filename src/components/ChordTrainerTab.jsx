import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CHORD_DEFINITIONS, 
  NOTE_NAMES, 
  NOTE_NAMES_PT, 
  identifyChordFromFrets, 
  getCompatibleScalesForChord 
} from '../audio/chordDictionary';
import { SAMPLE_PROGRESSIONS } from '../data/sampleSongs';
import Fretboard from './Fretboard';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  BookOpen, 
  Info, 
  Search,
  Zap,
  Music,
  Compass,
  Check,
  TrendingUp
} from 'lucide-react';

const CHORD_CATEGORIES = [
  { id: 'iniciante', label: 'Essenciais Iniciante', keys: ['C', 'D', 'E', 'G', 'A', 'Em', 'Am'] },
  { id: 'menores', label: 'Menores Emotivos', keys: ['Em', 'Am', 'Dm', 'Bm', 'F#m', 'C#m'] },
  { id: 'pestanas', label: 'O Desafio da Pestana', keys: ['F', 'Bm', 'F#m', 'C#m', 'B'] },
  { id: 'power', label: 'Power Chords (Rock)', keys: ['E5', 'A5', 'D5', 'G5', 'C5'] },
  { id: 'setimas', label: 'Acordes com 7ª (Blues / Pop)', keys: ['A7', 'E7', 'D7', 'G7', 'C7', 'B7'] },
  { id: 'todos', label: 'Todos os Acordes', keys: Object.keys(CHORD_DEFINITIONS) }
];

const CHORD_TIPS = {
  'C': 'Dobre bem a 1ª falange do dedo 1 (indicador) para a ponta dele não encostar nem abafar a 1ª corda (Mizinha solta). A 6ª corda não é tocada.',
  'D': 'Posicione os dedos bem próximos aos trastes metálicos. Toque apenas a partir da 4ª corda (Ré solta); a 5ª e 6ª cordas não são tocadas (ignoradas).',
  'G': 'Estique bem o dedo 2 na 6ª corda casa 3 e o dedo 1 na 5ª corda casa 2. Deixe a palma da mão arqueada para não abafar as cordas centrais soltas.',
  'Em': 'Apenas 2 dedos! Mantenha o polegar no meio das costas do braço da guitarra para dar firmeza aos dedos 2 e 3.',
  'Am': 'Mantenha os dedos arqueados em forma de arco. Toque a partir da 5ª corda (Lá solta). Mesmo formato do Mi Maior (E), só que uma corda abaixo!',
  'F': 'Para a pestana soar limpa, role o dedo indicador ligeiramente de lado (na parte óssea lateral) e pressione perto do traste metálico da casa 1.',
  'Bm': 'Pestana na casa 2 com o polegar bem firme no centro do braço. Toque da 5ª corda para baixo; a 6ª corda não é tocada.',
  'A': 'Junte os dedos 1, 2 e 3 em linha reta na casa 2. Deixe a 1ª corda (Mizinha) livre para soar.',
  'E': 'Use as pontas dos dedos e palhete todas as 6 cordas com força uniforme.',
  'A7': 'Deixe a 3ª corda (Sol solta) vibrar com clareza no centro do acorde.',
  'D7': 'Formato triangular invertido na casa 1 e 2. Toque da 4ª corda para baixo.',
  'E7': 'Acorde de apenas 2 dedos. Excelente para blues com a 4ª corda livre.',
  'E5': 'Power chord de rock pesado. Toque apenas as cordas 6 e 5; as demais cordas não são tocadas.'
};

function getStrummingInstruction(frets) {
  if (!frets || frets.length < 6) return 'Palhete as cordas indicadas no diagrama.';
  if (frets[0] === -1 && frets[1] === -1) {
    return 'Toque apenas a partir da 4ª corda (Ré) para baixo. A 5ª e a 6ª cordas não são tocadas (ignoradas).';
  }
  if (frets[0] === -1) {
    return 'Toque a partir da 5ª corda (Lá) para baixo. A 6ª corda não é tocada (ignorada).';
  }
  return 'Toque todas as 6 cordas com palhetada cheia, uniforme e vigorosa!';
}

function getFingerLocations(chord) {
  if (!chord || !chord.fingers || !chord.frets) {
    return { d1: 'Livre', d2: 'Livre', d3: 'Livre', d4: 'Livre' };
  }
  const stringNames = ['6ª', '5ª', '4ª', '3ª', '2ª', '1ª'];
  const res = { d1: 'Livre', d2: 'Livre', d3: 'Livre', d4: 'Livre' };

  for (let i = 0; i < 6; i++) {
    const finger = chord.fingers[i];
    const fret = chord.frets[i];
    if (finger > 0 && fret > 0) {
      const key = `d${finger}`;
      if (res[key] === 'Livre') {
        res[key] = `${stringNames[i]} / casa ${fret}`;
      } else {
        res[key] = `Pestana / casa ${fret}`;
      }
    }
  }
  return res;
}

function getFreqBandMagnitude(freqBuffer, minHz, maxHz, sampleRate = 44100) {
  if (!freqBuffer || freqBuffer.length === 0) return 0;
  const binWidth = (sampleRate / 2) / freqBuffer.length;
  const minBin = Math.max(0, Math.floor(minHz / binWidth));
  const maxBin = Math.min(freqBuffer.length - 1, Math.ceil(maxHz / binWidth));
  let maxVal = -120;
  for (let b = minBin; b <= maxBin; b++) {
    if (freqBuffer[b] > maxVal) maxVal = freqBuffer[b];
  }
  return maxVal > -85 ? Math.pow(10, maxVal / 20) : 0;
}

export default function ChordTrainerTab({ 
  chordData, 
  pitchData, 
  isAudible,
  chromagram = new Array(12).fill(0),
  frequencyBuffer = null,
  rmsLevel = 0,
  audioActive = false,
  onToggleAudio = null
}) {
  // Modes: 'diagnostic' (Treino Livre), 'progression' (Troca no Compasso & Speed Trainer), 'reverse' (Dicionário Reverso & Escalas)
  const [activeMode, setActiveMode] = useState('diagnostic');
  const [selectedChordKey, setSelectedChordKey] = useState('C');
  const [activeCategory, setActiveCategory] = useState('iniciante');
  const [searchQuery, setSearchQuery] = useState('');

  // Progression & Speed Trainer Mode State
  const [selectedProgIndex, setSelectedProgIndex] = useState(0);
  const [bpm, setBpm] = useState(75);
  const [isPlayingProgression, setIsPlayingProgression] = useState(false);
  const [isSpeedTrainerActive, setIsSpeedTrainerActive] = useState(true);
  const [currentProgChordIdx, setCurrentProgChordIdx] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [progScore, setProgScore] = useState(0);
  const [speedStreak, setSpeedStreak] = useState(0); // 0 to 5 for +2 BPM jump
  const [speedBoostNotification, setSpeedBoostNotification] = useState(null);
  const [isCurrentChordHit, setIsCurrentChordHit] = useState(false);

  // Diagnostic State with Strum Lifecycle & Envelope Tracking
  const [diagnosticFeedback, setDiagnosticFeedback] = useState(null);
  const stableMatchCounterRef = useRef(0);
  const lastRmsRef = useRef(0);
  const strumStartTimeRef = useRef(0);
  const currentStrumAchievedSuccessRef = useRef(false);
  const wasAudibleRef = useRef(false);
  const silenceTimeoutRef = useRef(null);

  // Progression Refs for stable timer and measure latch
  const chordHitInMeasureRef = useRef(false);
  const currentProgChordIdxRef = useRef(0);
  const activeProgressionRef = useRef(SAMPLE_PROGRESSIONS[0]);

  // Reverse Chord & Scale Explorer State
  const [reverseFrets, setReverseFrets] = useState([-1, 3, 2, 0, 1, 0]); // Default C
  const [selectedScalePreview, setSelectedScalePreview] = useState(null); // Selected scale for fretboard overlay
  const [reverseInputMode, setReverseInputMode] = useState('interactive'); // 'interactive' or 'microphone'
  const [reverseFretView, setReverseFretView] = useState(5); // 5 frets (focused) or 12 frets (full neck)

  const activeChordObj = CHORD_DEFINITIONS[selectedChordKey] || CHORD_DEFINITIONS['C'];
  const activeProgression = SAMPLE_PROGRESSIONS[selectedProgIndex] || SAMPLE_PROGRESSIONS[0];

  // Keep progression refs synchronized
  useEffect(() => {
    currentProgChordIdxRef.current = currentProgChordIdx;
  }, [currentProgChordIdx]);

  useEffect(() => {
    activeProgressionRef.current = activeProgression;
  }, [activeProgression]);

  const progTimerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const playClick = (isAccent) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isAccent ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 1200 : 700, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (_) {}
  };

  // Continuous measure audio listener: catches any clean strum across the 4 beats
  useEffect(() => {
    if (activeMode !== 'progression' || !isPlayingProgression) return;
    if (!isAudible) return;

    const chordsList = activeProgressionRef.current?.chords;
    const targetChordName = chordsList ? chordsList[currentProgChordIdxRef.current] : null;
    if (!targetChordName) return;

    // 1. Check direct chord recognition name or full name
    const isNameMatch = chordData && (
      chordData.name === targetChordName ||
      chordData.fullName?.toLowerCase().includes(targetChordName.toLowerCase()) ||
      (targetChordName.endsWith('5') && chordData.name === targetChordName.replace('5', ''))
    );

    // 2. Chromagram check: verify if the target chord pitch classes are present
    let isChromaMatch = false;
    const chordDef = CHORD_DEFINITIONS[targetChordName];
    if (chordDef && chordDef.pitchClasses && chromagram && chromagram.length === 12) {
      const allPresent = chordDef.pitchClasses.every(pc => (chromagram[pc] || 0) >= 0.22);
      if (allPresent) {
        isChromaMatch = true;
      }
    }

    if (isNameMatch || isChromaMatch) {
      chordHitInMeasureRef.current = true;
      setIsCurrentChordHit(true);
    }
  }, [activeMode, isPlayingProgression, isAudible, chordData, chromagram]);

  // Progression & Speed Trainer Metronome Loop
  useEffect(() => {
    if (!isPlayingProgression) {
      if (progTimerRef.current) clearInterval(progTimerRef.current);
      chordHitInMeasureRef.current = false;
      setIsCurrentChordHit(false);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;

    progTimerRef.current = setInterval(() => {
      setCurrentBeat(prevBeat => {
        const nextBeat = (prevBeat % 4) + 1;
        playClick(nextBeat === 1);

        if (nextBeat === 1) {
          // Check if current chord was played cleanly during the measure
          const wasHit = chordHitInMeasureRef.current;
          chordHitInMeasureRef.current = false;
          setIsCurrentChordHit(false);

          if (wasHit) {
            setProgScore(s => s + 150);
            
            if (isSpeedTrainerActive) {
              setSpeedStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak >= 5) {
                  // Speed Jump +2 BPM!
                  setBpm(b => {
                    const nextBpm = Math.min(220, b + 2);
                    setSpeedBoostNotification(`🚀 +2 BPM! Velocidade aumentada para ${nextBpm} BPM!`);
                    setTimeout(() => setSpeedBoostNotification(null), 3000);
                    return nextBpm;
                  });
                  try {
                    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
                  } catch (_) {}
                  return 0; // reset streak for next 5
                }
                return newStreak;
              });
            }
          } else {
            if (isSpeedTrainerActive) {
              // Missed chord resets streak
              setSpeedStreak(0);
            }
          }

          setCurrentProgChordIdx(prevIdx => {
            const list = activeProgressionRef.current?.chords || [];
            const nextIdx = list.length > 0 ? (prevIdx + 1) % list.length : 0;
            currentProgChordIdxRef.current = nextIdx;
            return nextIdx;
          });
        }

        return nextBeat;
      });
    }, intervalMs);

    return () => {
      if (progTimerRef.current) clearInterval(progTimerRef.current);
    };
  }, [isPlayingProgression, bpm, isSpeedTrainerActive]);

  // Robust Chord Diagnostic Engine with Strum Envelope Lifecycle & String Accuracy
  useEffect(() => {
    if (activeMode !== 'diagnostic') {
      stableMatchCounterRef.current = 0;
      currentStrumAchievedSuccessRef.current = false;
      return;
    }

    const now = Date.now();

    if (!isAudible) {
      wasAudibleRef.current = false;
      stableMatchCounterRef.current = 0;
      lastRmsRef.current = 0;
      if (!silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          currentStrumAchievedSuccessRef.current = false;
          setDiagnosticFeedback(null);
          silenceTimeoutRef.current = null;
        }, 650);
      }
      return;
    }

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    const isNewAttack = !wasAudibleRef.current || (rmsLevel > 0.035 && rmsLevel - lastRmsRef.current > 0.025);
    if (isNewAttack) {
      strumStartTimeRef.current = now;
      currentStrumAchievedSuccessRef.current = false;
      stableMatchCounterRef.current = 0;
    }
    wasAudibleRef.current = true;
    lastRmsRef.current = rmsLevel;

    const strumAge = now - strumStartTimeRef.current;
    const targetChord = activeChordObj;
    const targetPitchClasses = targetChord.pitchClasses || [0, 4, 7];
    const rootIndex = NOTE_NAMES.indexOf(targetChord.root);
    const rootEnergy = rootIndex >= 0 ? chromagram[rootIndex] : 0;

    // 1. Forbidden Bass Strings Detection (e.g. hitting 6th string E2 on a C chord, or 5th/6th on a D chord)
    let forbiddenStringError = null;
    if (frequencyBuffer && targetChord.frets) {
      const lowEMag = getFreqBandMagnitude(frequencyBuffer, 75, 92); // Low E (E2 ~ 82.4Hz)
      const lowAMag = getFreqBandMagnitude(frequencyBuffer, 102, 118); // Low A (A2 ~ 110.0Hz)

      if (targetChord.frets[0] === -1 && lowEMag > 0.04) {
        forbiddenStringError = {
          string: '6ª corda (Mi grave)',
          title: 'Corda 6ª (Mi grave) soando indevidamente!',
          detail: `A 6ª corda não deve ser tocada no ${targetChord.name}. O baixo deve ser a 5ª corda (Dó). Encoste de leve a ponta do polegar para abafá-la ou toque apenas da 5ª corda para baixo.`
        };
      } else if (targetChord.frets[0] === -1 && targetChord.frets[1] === -1 && lowAMag > 0.05) {
        forbiddenStringError = {
          string: '5ª corda (Lá grave)',
          title: 'Corda 5ª (Lá grave) soando indevidamente!',
          detail: `No acorde ${targetChord.name}, toque apenas da 4ª corda para baixo. As cordas 5ª e 6ª são ignoradas.`
        };
      }
    }

    if (forbiddenStringError) {
      currentStrumAchievedSuccessRef.current = false;
      setDiagnosticFeedback({
        status: 'warning',
        title: forbiddenStringError.title,
        description: forbiddenStringError.detail,
        confidence: 50
      });
      return;
    }

    // If this strum already achieved clean success, maintain it during natural acoustic decay!
    if (currentStrumAchievedSuccessRef.current) {
      return;
    }

    // 2. Monophonic Single Note Check (plucking only 1 string)
    const isOnlySingleNote = pitchData && pitchData.confidence > 0.84;

    // 3. Chord Tone Presence Check (calibrated with 0.35 threshold to reject single-string overtone leakage)
    let missingNotes = [];
    let presentNotes = [];
    let inChordEnergy = 0;
    let outChordEnergy = 0;

    targetPitchClasses.forEach((pc, idx) => {
      const energy = chromagram[pc] || 0;
      const noteName = targetChord.notes[idx] || NOTE_NAMES[pc];
      inChordEnergy += energy;

      if (energy >= 0.35) {
        presentNotes.push(noteName);
      } else {
        missingNotes.push(noteName);
      }
    });

    // 4. Intruder Notes Check
    let intruderNotes = [];
    for (let pc = 0; pc < 12; pc++) {
      if (!targetPitchClasses.includes(pc)) {
        const energy = chromagram[pc] || 0;
        outChordEnergy += energy;
        if (energy > 0.42 && energy > rootEnergy * 0.65) {
          intruderNotes.push(NOTE_NAMES[pc]);
        }
      }
    }

    const isAllNotesPresent = missingNotes.length === 0;
    const isRootStrong = rootEnergy >= 0.32;
    const isNoIntruders = intruderNotes.length === 0;
    const energyRatio = inChordEnergy / (inChordEnergy + outChordEnergy + 0.001);

    const isStrictlyCorrect = !isOnlySingleNote && 
                              isRootStrong && 
                              isAllNotesPresent && 
                              isNoIntruders && 
                              energyRatio >= 0.55;

    if (isStrictlyCorrect) {
      stableMatchCounterRef.current += 1;
      if (stableMatchCounterRef.current >= 2) {
        currentStrumAchievedSuccessRef.current = true;
        setDiagnosticFeedback({
          status: 'perfect',
          title: 'Acorde limpo — 98% de precisão!',
          description: `Todas as notas (${targetChord.notes.join(', ')}) soaram perfeitas e sem cordas proibidas.`,
          confidence: 98
        });
      }
      return;
    }

    // Delay defect warning by 120ms to allow pick sweep to finish across strings
    if (strumAge > 120) {
      stableMatchCounterRef.current = 0;

      if (isOnlySingleNote) {
        setDiagnosticFeedback({
          status: 'warning',
          title: `Apenas 1 nota detectada: ${pitchData.noteName}`,
          description: `Você tocou apenas a nota ${pitchData.noteName}. Para o acorde ${targetChord.name}, posicione os dedos e palhete todas as cordas ativas juntas!`,
          confidence: 55
        });
      } else if (missingNotes.length > 0 && presentNotes.length > 0) {
        setDiagnosticFeedback({
          status: 'warning',
          title: `Acorde incompleto — falta: ${missingNotes.join(', ')}`,
          description: `Você tocou apenas parte do acorde. A nota ${missingNotes.join(', ')} não soou com clareza. Palhete todas as cordas ativas do ${targetChord.name}!`,
          confidence: 60
        });
      } else if (intruderNotes.length > 0) {
        setDiagnosticFeedback({
          status: 'warning',
          title: `Nota errada detectada: ${intruderNotes.join(', ')}`,
          description: `Uma nota intrusa está soando. Verifique se algum dedo não está esbarrando em cordas vizinhas.`,
          confidence: 45
        });
      } else if (chordData && chordData.name !== selectedChordKey && chordData.name !== 'Ruído') {
        setDiagnosticFeedback({
          status: 'error',
          title: `Acorde detectado: ${chordData.name} (${chordData.fullName || ''})`,
          description: `Você está tocando ${chordData.fullName || chordData.name}. Posicione os dedos no formato do ${targetChord.name} (${targetChord.fullName}).`,
          confidence: 40
        });
      }
    }
  }, [chordData, pitchData, chromagram, frequencyBuffer, rmsLevel, isAudible, selectedChordKey, activeChordObj, activeMode]);

  // Reverse Chord Identification Result
  const identifiedReverseChord = useMemo(() => {
    if (reverseInputMode === 'microphone') {
      // 1. Genuine Polyphonic Chord Match (when multiple strings are strummed)
      if (chordData && chordData.name && chordData.name !== 'Ruído') {
        const chordDef = CHORD_DEFINITIONS[chordData.name];
        return {
          name: chordData.name,
          fullName: chordDef?.fullName || chordData.fullName || `${chordData.name} Detectado pelo Microfone`,
          quality: chordDef?.category || chordData.quality || 'Major',
          root: chordDef?.root || chordData.root || chordData.name.replace(/[^A-G#b]/g, ''),
          bass: chordDef?.root || chordData.root || chordData.name,
          notes: chordDef?.notes || chordData.notes || [],
          pitchClasses: chordDef?.pitchClasses || chordData.pitchClasses || [],
          isSingleNote: false
        };
      }

      // 2. High-confidence Single Note Detection (when only 1 string is plucked)
      if (pitchData && pitchData.confidence >= 0.75 && pitchData.noteName) {
        const noteName = pitchData.noteName;
        const noteNamePt = pitchData.noteNamePt || NOTE_NAMES_PT[pitchData.noteIndex];
        return {
          name: noteName,
          fullName: `Nota ${noteName} (${noteNamePt})${pitchData.octave !== undefined ? ` — Oitava ${pitchData.octave}` : ''}`,
          quality: 'single_note',
          root: noteName,
          bass: noteName,
          notes: [noteName],
          pitchClasses: [pitchData.noteIndex],
          isSingleNote: true,
          octave: pitchData.octave,
          cents: pitchData.cents
        };
      }

      return null;
    }
    return identifyChordFromFrets(reverseFrets);
  }, [reverseFrets, reverseInputMode, chordData, pitchData]);

  // Compatible scales for the identified chord
  const compatibleScales = useMemo(() => {
    if (!identifiedReverseChord) return [];
    return getCompatibleScalesForChord(identifiedReverseChord.root, identifiedReverseChord.quality);
  }, [identifiedReverseChord]);

  // Handle interactive fret click in Reverse Chord mode
  const handleFretClickReverse = (stringFretIndex, fret) => {
    setReverseFrets(prev => {
      const copy = [...prev];
      // If clicked the same fret, mute it (-1)
      if (copy[stringFretIndex] === fret) {
        copy[stringFretIndex] = -1;
      } else {
        copy[stringFretIndex] = fret;
      }
      return copy;
    });
  };

  const handleOpenStringClickReverse = (stringFretIndex) => {
    setReverseFrets(prev => {
      const copy = [...prev];
      if (copy[stringFretIndex] === 0) {
        copy[stringFretIndex] = -1; // mute
      } else {
        copy[stringFretIndex] = 0; // open string
      }
      return copy;
    });
  };

  const displayedChordKeys = useMemo(() => {
    const categoryConfig = CHORD_CATEGORIES.find(c => c.id === activeCategory) || CHORD_CATEGORIES[0];
    let keys = categoryConfig.keys.filter(k => CHORD_DEFINITIONS[k]);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      keys = Object.keys(CHORD_DEFINITIONS).filter(k => {
        const chord = CHORD_DEFINITIONS[k];
        return (
          chord.name.toLowerCase().includes(q) ||
          chord.fullName.toLowerCase().includes(q) ||
          (chord.difficulty && chord.difficulty.toLowerCase().includes(q))
        );
      });
    }

    return keys;
  }, [activeCategory, searchQuery]);

  const fingerLocations = useMemo(() => getFingerLocations(activeChordObj), [activeChordObj]);
  const strumInstruction = useMemo(() => getStrummingInstruction(activeChordObj.frets), [activeChordObj]);

  return (
    <div className="space-y-4 animate-fadeIn select-none max-w-6xl mx-auto font-sans">
      
      {/* 1. TOP BAR & MODE SWITCH */}
      <div className="bg-oficina-card border border-oficina-border rounded-sm p-3.5 lg:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-oficina-darkText flex items-center gap-2">
            <span>Treinador &amp; Diagnóstico de Acordes</span>
            <span className="text-[10px] bg-oficina-oliveLight text-oficina-olive font-mono font-bold px-2 py-0.5 rounded-sm border border-oficina-olive/30">
              MODO DIDÁTICO
            </span>
          </h2>
          <p className="text-xs text-oficina-bodyText mt-0.5">
            Dicionário interativo, troca de acordes no compasso e dicionário reverso com sugestão de escalas
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center gap-1 bg-oficina-surface p-1 rounded-sm border border-oficina-border font-mono text-xs">
          <button
            onClick={() => {
              setActiveMode('diagnostic');
              stableMatchCounterRef.current = 0;
            }}
            className={`px-3 py-1.5 rounded-[2px] font-bold transition ${
              activeMode === 'diagnostic'
                ? 'bg-oficina-chassis text-[#f3f1ec]'
                : 'text-oficina-bodyText hover:text-oficina-darkText'
            }`}
          >
            Treino Livre
          </button>

          <button
            onClick={() => {
              setActiveMode('progression');
              stableMatchCounterRef.current = 0;
            }}
            className={`px-3 py-1.5 rounded-[2px] font-bold transition ${
              activeMode === 'progression'
                ? 'bg-oficina-chassis text-[#f3f1ec]'
                : 'text-oficina-bodyText hover:text-oficina-darkText'
            }`}
          >
            Troca no Compasso &amp; Speed
          </button>

          <button
            onClick={() => {
              setActiveMode('reverse');
              setSelectedScalePreview(null);
            }}
            className={`px-3 py-1.5 rounded-[2px] font-bold transition ${
              activeMode === 'reverse'
                ? 'bg-oficina-chassis text-[#f3f1ec]'
                : 'text-oficina-bodyText hover:text-oficina-darkText'
            }`}
          >
            Dicionário Reverso &amp; Escalas
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DIAGNÓSTICO E TREINO LIVRE */}
      {/* ========================================================================= */}
      {activeMode === 'diagnostic' && (
        <div className="space-y-4">
          
          {/* CATEGORIES & CHORD CARDS */}
          <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm space-y-3">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                CATEGORIAS DE ESTUDO
              </span>

              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  placeholder="Buscar acorde (Dó, Em, Pestana)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-oficina-surface border border-oficina-border rounded-sm pl-7 pr-3 py-1.5 text-xs text-oficina-darkText placeholder-oficina-mutedText focus:outline-none focus:border-oficina-darkText font-mono"
                />
                <Search className="w-3.5 h-3.5 text-oficina-mutedText absolute left-2 top-2" />
              </div>
            </div>

            {/* Category Grid (Clean text, No icons, Full Width) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
              {CHORD_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id && !searchQuery;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery('');
                      stableMatchCounterRef.current = 0;
                    }}
                    className={`w-full py-2 px-2 text-center rounded-[2px] text-xs font-bold transition border truncate ${
                      isActive
                        ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-xs'
                        : 'bg-oficina-surface text-oficina-bodyText border-oficina-border hover:border-oficina-borderDark'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Chord Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
              {displayedChordKeys.map(chordKey => {
                const isSelected = selectedChordKey === chordKey;
                const chord = CHORD_DEFINITIONS[chordKey];
                if (!chord) return null;

                return (
                  <button
                    key={chordKey}
                    onClick={() => {
                      setSelectedChordKey(chordKey);
                      setDiagnosticFeedback(null);
                      stableMatchCounterRef.current = 0;
                      successHoldUntilRef.current = 0;
                    }}
                    className={`p-2.5 rounded-[3px] border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-oficina-surface border-oficina-chassis shadow-sm ring-2 ring-oficina-chassis/20'
                        : 'bg-oficina-card border-oficina-borderLight hover:border-oficina-border hover:bg-oficina-surface'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xl font-extrabold font-sans tracking-tight text-oficina-darkText`}>
                          {chord.name}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] bg-oficina-surface border border-oficina-border text-oficina-bodyText">
                          {chord.difficulty?.includes('Pestana') ? 'Pestana' : 'Básico'}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-oficina-bodyText mt-0.5 truncate">{chord.fullName}</h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN STAGE: COACH CARD + FRETBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: Smart Diagnostic Coach Card (5 cols) */}
            <div className="lg:col-span-5 bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                
                {/* Header with Cifra & Full Name */}
                <div className="flex items-baseline justify-between border-b border-oficina-borderLight pb-2.5">
                  <div>
                    <div className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                      ACORDE ATIVO
                    </div>
                    <div className="text-3xl font-extrabold text-oficina-darkText flex items-baseline gap-2 mt-0.5 tracking-tight">
                      <span>{activeChordObj.name}</span>
                      <span className="text-base font-semibold text-oficina-mutedText">{activeChordObj.fullName}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs border border-oficina-border px-2.5 py-1 rounded-[2px] text-oficina-bodyText font-semibold">
                    {activeChordObj.difficulty}
                  </span>
                </div>

                {/* Strumming Instruction Alert (Ignored strings) */}
                <div className="bg-oficina-surface border border-oficina-border rounded-[3px] p-2.5 text-xs">
                  <strong className="text-oficina-darkText block font-sans">Como Palhetar:</strong>
                  <span className="text-oficina-bodyText leading-snug">{strumInstruction}</span>
                </div>

                {/* Real-time Diagnostic Feedback Banner with Success Latch */}
                <div className={`p-3 rounded-[3px] border-l-4 text-xs space-y-1 transition-all ${
                  diagnosticFeedback?.status === 'perfect'
                    ? 'bg-oficina-oliveLight border-oficina-olive text-[#2c3d21] shadow-xs'
                    : diagnosticFeedback?.status === 'warning'
                      ? 'bg-[#fff8e6] border-oficina-amber text-[#593d00]'
                      : diagnosticFeedback?.status === 'error'
                        ? 'bg-[#ffebe6] border-oficina-terracotta text-[#5c1c0e]'
                        : 'bg-oficina-surface border-oficina-border text-oficina-bodyText'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {diagnosticFeedback?.status === 'perfect' && <CheckCircle2 className="w-4 h-4 text-oficina-olive" />}
                    <span>{diagnosticFeedback ? diagnosticFeedback.title : 'Toque o acorde na guitarra para avaliar o som...'}</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {diagnosticFeedback ? diagnosticFeedback.description : `Palhete as cordas ativas do ${activeChordObj.name} (${activeChordObj.fullName}).`}
                  </p>
                </div>

              </div>

              {/* Anatomical Tips */}
              <div className="bg-oficina-surface border border-oficina-border rounded-[3px] p-2.5 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-oficina-darkText">
                  <Info className="w-3.5 h-3.5 text-oficina-terracotta" />
                  <span>Dica de Postura do Professor:</span>
                </div>
                <p className="text-[11px] text-oficina-bodyText leading-relaxed">
                  {CHORD_TIPS[selectedChordKey] || 'Mantenha os dedos arqueados e pressione as cordas perto do traste metálico para evitar ruídos.'}
                </p>
              </div>
            </div>

            {/* Right: Interactive Fretboard Visualizer (7 cols) */}
            <div className="lg:col-span-7 bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm space-y-3 flex flex-col justify-between">
              <Fretboard chord={activeChordObj} embedded={true} />

              {/* Bottom: Mapa Anatômico dos Dedos (Opção 2) + Notas do Acorde */}
              <div className="space-y-3 pt-2.5 border-t border-oficina-borderLight">
                
                {/* Header do Mapa Anatômico */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                    <span className="w-2 h-2 rounded-full bg-oficina-terracotta" />
                    <span>MAPA ANATÔMICO DOS DEDOS</span>
                  </div>
                  <span className="font-mono text-[10px] text-oficina-mutedText hidden sm:inline">
                    Polegar no centro das costas do braço
                  </span>
                </div>

                {/* 4 Cards Anatômicos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { num: 1, name: 'Indicador', loc: fingerLocations.d1, active: fingerLocations.d1 !== 'Livre', color: 'bg-oficina-terracotta', activeText: 'text-oficina-terracotta' },
                    { num: 2, name: 'Médio', loc: fingerLocations.d2, active: fingerLocations.d2 !== 'Livre', color: 'bg-oficina-amberDark', activeText: 'text-oficina-amberDark' },
                    { num: 3, name: 'Anelar', loc: fingerLocations.d3, active: fingerLocations.d3 !== 'Livre', color: 'bg-oficina-petrol', activeText: 'text-oficina-petrol' },
                    { num: 4, name: 'Mínimo', loc: fingerLocations.d4, active: fingerLocations.d4 !== 'Livre', color: 'bg-[#7a5879]', activeText: 'text-[#7a5879]' }
                  ].map(f => (
                    <div
                      key={f.num}
                      className={`p-2 rounded-[3px] border transition flex items-center gap-2.5 ${
                        f.active
                          ? 'bg-oficina-surface border-oficina-border shadow-xs'
                          : 'bg-oficina-card border-oficina-borderLight opacity-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                          f.active ? f.color : 'bg-[#a39684]'
                        }`}
                      >
                        {f.num}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-oficina-darkText block leading-tight">
                          {f.name}
                        </span>
                        <span
                          className={`font-mono text-[10px] truncate block ${
                            f.active ? `${f.activeText} font-bold` : 'text-oficina-mutedText'
                          }`}
                        >
                          {f.loc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes in chord badge row */}
                <div className="flex items-center justify-between font-mono text-xs text-oficina-bodyText pt-2 border-t border-oficina-borderLight">
                  <span className="font-semibold text-oficina-darkText">Notas do acorde</span>
                  <div className="flex gap-1.5">
                    {activeChordObj.notes.map(n => {
                      const noteIdx = NOTE_NAMES.indexOf(n);
                      const isRinging = isAudible && chromagram && chromagram[noteIdx] > 0.25;

                      return (
                        <span
                          key={n}
                          className={`px-2.5 py-1 rounded-[2px] font-mono font-bold text-xs transition-all ${
                            isRinging
                              ? 'bg-oficina-olive text-[#fffefa] shadow-sm font-black'
                              : 'bg-oficina-olive/80 text-[#fffefa]'
                          }`}
                        >
                          {n} {isRinging && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: PROGRESSÃO & SPEED TRAINER ADAPTATIVO */}
      {/* ========================================================================= */}
      {activeMode === 'progression' && (
        <div className="bg-oficina-card border border-oficina-border rounded-sm p-5 shadow-sm space-y-4">
          
          {/* Progression Style Selector Bar */}
          <div className="bg-oficina-surface border border-oficina-border p-3 rounded-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-oficina-mutedText">
                Repertório &amp; Estilos Harmônicos ({SAMPLE_PROGRESSIONS.length} opções disponíveis):
              </span>
              <span className="font-mono text-xs font-bold text-oficina-darkText">
                Pontuação: <span className="text-oficina-terracotta font-black">{progScore} pts</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {SAMPLE_PROGRESSIONS.map((prog, idx) => {
                const isSelected = selectedProgIndex === idx;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setSelectedProgIndex(idx);
                      setCurrentProgChordIdx(0);
                      currentProgChordIdxRef.current = 0;
                      setCurrentBeat(1);
                      setSpeedStreak(0);
                      chordHitInMeasureRef.current = false;
                      setIsCurrentChordHit(false);
                    }}
                    className={`p-2.5 rounded-sm border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-xs'
                        : 'bg-oficina-card text-oficina-darkText border-oficina-border hover:border-oficina-borderDark hover:bg-oficina-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs truncate">{prog.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-oficina-olive shrink-0 ml-1" />}
                    </div>
                    <span className={`font-mono text-[10px] mt-1.5 truncate ${isSelected ? 'text-[#ded6c8] font-bold' : 'text-oficina-mutedText'}`}>
                      {prog.chords.join(' → ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header Controls & Speed Boost Notification */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-oficina-darkText uppercase tracking-wider">
                  {activeProgression.name}
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded-sm font-bold">
                  SPEED TRAINER +2 BPM
                </span>
              </div>
              <p className="text-xs text-oficina-bodyText mt-0.5">{activeProgression.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed Trainer Adaptive Switch */}
              <button
                onClick={() => setIsSpeedTrainerActive(!isSpeedTrainerActive)}
                className={`px-2.5 py-1.5 rounded-sm border font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                  isSpeedTrainerActive
                    ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                    : 'bg-oficina-surface text-oficina-mutedText border-oficina-border'
                }`}
                title="Aumenta +2 BPM a cada 5 trocas limpas consecutivas"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Adaptativo: {isSpeedTrainerActive ? 'ATIVO' : 'OFF'}</span>
              </button>

              {/* BPM Adjust */}
              <div className="flex items-center gap-2 bg-oficina-surface px-3 py-1.5 rounded-sm border border-oficina-border font-mono text-xs">
                <span className="text-oficina-mutedText font-bold">BPM:</span>
                <button onClick={() => setBpm(b => Math.max(40, b - 5))} className="px-2 py-0.5 bg-oficina-card border border-oficina-border font-bold hover:bg-oficina-surface">-</button>
                <span className="font-black text-oficina-darkText w-8 text-center">{bpm}</span>
                <button onClick={() => setBpm(b => Math.min(220, b + 5))} className="px-2 py-0.5 bg-oficina-card border border-oficina-border font-bold hover:bg-oficina-surface">+</button>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={() => setIsPlayingProgression(!isPlayingProgression)}
                className={`px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 shadow-sm transition ${
                  isPlayingProgression 
                    ? 'bg-oficina-amber text-oficina-darkText font-black' 
                    : 'bg-oficina-olive text-white font-black'
                }`}
              >
                {isPlayingProgression ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingProgression ? 'Pausar' : 'Iniciar Treino'}</span>
              </button>
            </div>
          </div>

          {/* Speed Boost Notification Banner */}
          {speedBoostNotification && (
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-700 rounded-sm font-mono text-xs font-bold text-center animate-bounce">
              {speedBoostNotification}
            </div>
          )}

          {/* Speed Streak Progress Bar */}
          {isSpeedTrainerActive && (
            <div className="bg-oficina-surface border border-oficina-border p-3 rounded-sm space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-oficina-darkText flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>Meta de Aceleração (+2 BPM a cada 5 trocas limpas):</span>
                </span>
                <span className="font-black text-amber-600">{speedStreak} / 5 acertos</span>
              </div>
              <div className="w-full bg-oficina-card h-2 rounded-full overflow-hidden border border-oficina-border">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(speedStreak / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Chords Sequence Grid */}
          <div className={`grid gap-3 ${
            activeProgression.chords.length === 2 
              ? 'grid-cols-2' 
              : activeProgression.chords.length === 3 
                ? 'grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-4'
          }`}>
            {activeProgression.chords.map((chordName, idx) => {
              const isCurrent = isPlayingProgression && currentProgChordIdx === idx;
              const chordObj = CHORD_DEFINITIONS[chordName];

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-[3px] border flex flex-col items-center justify-between text-center transition-all ${
                    isCurrent
                      ? 'bg-oficina-surface border-oficina-chassis shadow-md ring-2 ring-oficina-chassis/20'
                      : 'bg-oficina-card border-oficina-borderLight'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase font-bold text-oficina-mutedText">Compasso {idx + 1}</span>
                  <div className="text-3xl font-black font-sans my-1 text-oficina-darkText">
                    {chordName}
                  </div>
                  <span className="text-xs text-oficina-bodyText font-medium">{chordObj?.fullName || chordName}</span>

                  {isCurrent ? (
                    <div className="mt-2 w-full flex flex-col items-center gap-1.5 pt-1.5 border-t border-oficina-borderLight">
                      {/* Beat indicator dots */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(b => (
                          <div
                            key={b}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              currentBeat === b 
                                ? 'bg-oficina-terracotta scale-125 shadow-xs' 
                                : currentBeat > b 
                                  ? 'bg-oficina-olive' 
                                  : 'bg-oficina-border'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Real-time Measure Audio Detection Badge */}
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] transition-all ${
                        isCurrentChordHit
                          ? 'bg-oficina-olive text-white shadow-xs'
                          : 'bg-oficina-card text-oficina-mutedText border border-oficina-border'
                      }`}>
                        {isCurrentChordHit ? '✓ Acorde Detectado!' : `Aguardando palhetada (tempo ${currentBeat})`}
                      </span>
                    </div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-oficina-borderLight">
            <Fretboard chord={CHORD_DEFINITIONS[activeProgression.chords[currentProgChordIdx]] || CHORD_DEFINITIONS[activeProgression.chords[0]]} embedded={true} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: DICIONÁRIO REVERSO & ESCALAS COMPATÍVEIS */}
      {/* ========================================================================= */}
      {activeMode === 'reverse' && (
        <div className="space-y-4">
          
          {/* Header & Input Selector */}
          <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-oficina-darkText uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-500" />
                <span>Dicionário Reverso de Acordes &amp; Escalas Compatíveis</span>
              </h3>
              <p className="text-xs text-oficina-bodyText">
                Monte um formato no braço ou toque na guitarra para identificar o nome formal e descobrir escalas para solo
              </p>
            </div>

            {/* Mode Switch (Fretboard Click vs Microphone) */}
            <div className="flex items-center gap-1.5 bg-oficina-surface p-1 rounded-sm border border-oficina-border font-mono text-xs">
              <button
                onClick={() => setReverseInputMode('interactive')}
                className={`px-3 py-1 rounded-[2px] font-bold transition ${
                  reverseInputMode === 'interactive'
                    ? 'bg-oficina-chassis text-[#f3f1ec]'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
              >
                Braço Interativo
              </button>
              <button
                onClick={() => setReverseInputMode('microphone')}
                className={`px-3 py-1 rounded-[2px] font-bold transition ${
                  reverseInputMode === 'microphone'
                    ? 'bg-oficina-chassis text-[#f3f1ec]'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
              >
                Microfone / Guitarra Real
              </button>
            </div>
          </div>

          {/* Interactive / Microphone Fretboard Stage */}
          <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm space-y-3">
            <Fretboard 
              customFrets={reverseInputMode === 'microphone' 
                ? (chordData?.name && CHORD_DEFINITIONS[chordData.name] ? CHORD_DEFINITIONS[chordData.name].frets : null) 
                : reverseFrets}
              singleNote={reverseInputMode === 'microphone' && identifiedReverseChord?.isSingleNote ? pitchData : null}
              interactive={reverseInputMode === 'interactive'}
              onFretClick={handleFretClickReverse}
              onOpenStringClick={handleOpenStringClickReverse}
              highlightScalePcs={selectedScalePreview ? selectedScalePreview.pitchClasses : null}
              fretCount={reverseFretView}
            />

            {reverseInputMode === 'interactive' ? (
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-oficina-mutedText pt-1 border-t border-oficina-borderLight">
                <span>💡 Dica: Clique nas casas para posicionar notas. Clique na letra da corda (Nut) para alternar Solta/Ignorada.</span>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-oficina-surface border border-oficina-border rounded-sm p-0.5 font-mono text-[11px]">
                    <button
                      onClick={() => setReverseFretView(5)}
                      className={`px-2 py-0.5 rounded-xs font-bold transition ${reverseFretView === 5 ? 'bg-oficina-chassis text-white shadow-2xs' : 'text-oficina-mutedText hover:text-oficina-darkText'}`}
                      title="Exibir 5 casas (focado e espaçoso)"
                    >
                      5 Casas
                    </button>
                    <button
                      onClick={() => setReverseFretView(12)}
                      className={`px-2 py-0.5 rounded-xs font-bold transition ${reverseFretView === 12 ? 'bg-oficina-chassis text-white shadow-2xs' : 'text-oficina-mutedText hover:text-oficina-darkText'}`}
                      title="Exibir 12 casas (braço completo)"
                    >
                      12 Casas
                    </button>
                  </div>

                  <button
                    onClick={() => setReverseFrets([-1, -1, -1, -1, -1, -1])}
                    className="px-2 py-1 bg-oficina-surface hover:bg-rose-500/10 border border-oficina-border hover:border-rose-400 text-oficina-darkText hover:text-rose-600 rounded-sm font-bold transition"
                  >
                    Limpar Braço
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs pt-1 border-t border-oficina-borderLight">
                {!audioActive ? (
                  <>
                    <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Entrada de Áudio Desligada — O microfone não está captando som
                    </span>
                    {onToggleAudio && (
                      <button
                        onClick={onToggleAudio}
                        className="px-3 py-1 bg-oficina-terracotta text-white font-mono font-bold text-xs rounded-sm hover:brightness-110 shadow-xs"
                      >
                        Ligar Microfone
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 text-oficina-olive font-bold">
                      <span className="w-2 h-2 rounded-full bg-oficina-olive animate-pulse" />
                      Microfone Conectado: toque qualquer acorde ou nota na guitarra física
                    </span>
                    <span className="text-oficina-darkText font-mono text-[11px] font-bold bg-oficina-surface px-2.5 py-1 rounded border border-oficina-border">
                      {chordData?.name ? `Acorde: ${chordData.name}` : pitchData?.noteName ? `Nota: ${pitchData.noteName}` : 'Aguardando palhetada...'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Detected Chord Analysis & Compatible Scales */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: Identified Chord Card (5 cols) */}
            <div className="lg:col-span-5 bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm space-y-3">
              <div className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                {identifiedReverseChord?.isSingleNote ? 'NOTA DETECTADA (INDIVIDUAL)' : 'ACORDE IDENTIFICADO'}
              </div>

              {identifiedReverseChord ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-oficina-borderLight pb-2">
                    <div>
                      <div className="text-3xl font-black text-oficina-darkText tracking-tight">
                        {identifiedReverseChord.name}
                      </div>
                      <h4 className="text-xs font-bold text-oficina-bodyText mt-0.5">
                        {identifiedReverseChord.fullName}
                      </h4>
                    </div>
                    <span className={`font-mono text-[10px] font-bold border px-2 py-1 rounded ${
                      identifiedReverseChord.isSingleNote 
                        ? 'bg-amber-500/10 text-amber-700 border-amber-500/30' 
                        : 'bg-oficina-surface border-oficina-border text-cyan-600'
                    }`}>
                      {identifiedReverseChord.isSingleNote ? 'Nota Simples' : identifiedReverseChord.quality}
                    </span>
                  </div>

                  {/* Notes In Chord or Single Note */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold uppercase text-oficina-mutedText">
                      {identifiedReverseChord.isSingleNote ? 'Nota Fundamental:' : 'Notas Formadoras:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {identifiedReverseChord.notes.map(n => (
                        <span key={n} className="px-2.5 py-1 bg-oficina-chassis text-[#f3f1ec] font-mono font-bold text-xs rounded-sm">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Single Note Pedagogical Tip */}
                  {identifiedReverseChord.isSingleNote && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-sm text-xs font-mono text-amber-800 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nota individual detectada</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Você tocou 1 nota isolada ({identifiedReverseChord.name}). Para identificar um acorde completo, palhete 3 ou mais cordas juntas com batida cheia!
                      </p>
                    </div>
                  )}

                  {/* Bass note info */}
                  {!identifiedReverseChord.isSingleNote && identifiedReverseChord.bass && (
                    <div className="p-2.5 bg-oficina-surface border border-oficina-border rounded-sm text-xs font-mono">
                      <span className="text-oficina-mutedText">Nota do Baixo (Root): </span>
                      <strong className="text-oficina-darkText">{identifiedReverseChord.bass}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-oficina-mutedText font-mono text-xs">
                  {reverseInputMode === 'microphone' 
                    ? 'Toque um acorde ou nota na sua guitarra para o microfone identificar...'
                    : 'Coloque notas no braço interativo para identificar o acorde...'}
                </div>
              )}
            </div>

            {/* Right: Compatible Scales for Solo / Improvisation (7 cols) */}
            <div className="lg:col-span-7 bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                <span>ESCALAS COMPATÍVEIS PARA SOLO &amp; IMPROVISAÇÃO</span>
                {selectedScalePreview && (
                  <button 
                    onClick={() => setSelectedScalePreview(null)}
                    className="text-rose-500 hover:underline"
                  >
                    ✕ Limpar Destaque
                  </button>
                )}
              </div>

              {compatibleScales.length > 0 ? (
                <div className="space-y-2.5">
                  {compatibleScales.map((scale, sIdx) => {
                    const isSelected = selectedScalePreview?.name === scale.name;
                    return (
                      <div
                        key={sIdx}
                        onClick={() => setSelectedScalePreview(isSelected ? null : scale)}
                        className={`p-3 rounded-sm border transition cursor-pointer ${
                          isSelected
                            ? 'bg-oficina-surface border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-oficina-surface border-oficina-border hover:border-oficina-borderDark'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-oficina-darkText font-sans">
                            {scale.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            {scale.compatibility}
                          </span>
                        </div>

                        <p className="text-[11px] text-oficina-bodyText mt-1 leading-snug">
                          {scale.desc}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-oficina-borderLight font-mono text-[10px]">
                          <div className="flex gap-1">
                            {scale.notes.map(n => (
                              <span key={n} className="px-1.5 py-0.5 bg-oficina-card border border-oficina-border rounded font-bold text-oficina-darkText">
                                {n}
                              </span>
                            ))}
                          </div>
                          <span className="text-oficina-mutedText">
                            {isSelected ? '✓ Exibindo no braço' : 'Clique para destacar no braço'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-oficina-mutedText font-mono text-xs">
                  {reverseInputMode === 'microphone'
                    ? 'Aguardando acorde pelo microfone para calcular escalas compatíveis...'
                    : 'Nenhum acorde detectado ainda para calcular escalas compatíveis.'}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
