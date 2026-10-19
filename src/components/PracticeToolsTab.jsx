import React, { useState, useEffect } from 'react';
import { BACKING_TRACKS } from '../data/sampleSongs';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Music, 
  HelpCircle, 
  Check, 
  RotateCcw, 
  Layers, 
  Volume2, 
  Flame,
  Award
} from 'lucide-react';

const SCALE_PRESETS = [
  { id: 'penta_minor', name: 'Pentatônica Menor', intervals: [0, 3, 5, 7, 10], desc: 'A escala fundamental do Rock, Blues e Heavy Metal.' },
  { id: 'penta_major', name: 'Pentatônica Maior', intervals: [0, 2, 4, 7, 9], desc: 'Sonoridade brilhante e melódica (Country, Pop, Southern Rock).' },
  { id: 'blues', name: 'Escala Blues (com Blue Note)', intervals: [0, 3, 5, 6, 7, 10], desc: 'Adiciona a Blue Note (b5) para a clássica malícia do blues.' },
  { id: 'dorian', name: 'Modo Dórico', intervals: [0, 2, 3, 5, 7, 9, 10], desc: 'Sonoridade menor sofisticada com 6ª maior (Santana, Pink Floyd).' },
  { id: 'aeolian', name: 'Escala Menor Natural (Eólio)', intervals: [0, 2, 3, 5, 7, 8, 10], desc: 'A escala menor padrão de baladas e solos épicos.' },
  { id: 'major', name: 'Escala Maior (Jônio)', intervals: [0, 2, 4, 5, 7, 9, 11], desc: 'A mãe de todas as escalas da teoria ocidental.' }
];

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']; // Strings 1 to 6

export default function PracticeToolsTab({
  pitchData,
  chordData,
  isAudible
}) {
  const [selectedRoot, setSelectedRoot] = useState('A');
  const [selectedScale, setSelectedScale] = useState(SCALE_PRESETS[0]);
  const [activePracticeSubtab, setActivePracticeSubtab] = useState('scales'); // 'scales' | 'quiz' | 'backing'

  // Ear Training Quiz State
  const [quizTarget, setQuizTarget] = useState({ note: 'A', octave: 2 });
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const generateNewQuizQuestion = () => {
    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    setQuizTarget({ note: randomNote, octave: Math.floor(Math.random() * 2) + 2 });
    setQuizFeedback(null);
  };

  // Evaluate quiz answer in real-time when user plays on guitar
  useEffect(() => {
    if (activePracticeSubtab === 'quiz' && isAudible && pitchData) {
      if (pitchData.note === quizTarget.note) {
        setQuizScore(s => s + 100);
        setQuizStreak(st => st + 1);
        setQuizFeedback({ status: 'correct', text: `CORRETO! Você tocou a nota ${quizTarget.note}!` });

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          generateNewQuizQuestion();
        }, 1200);
      }
    }
  }, [pitchData, isAudible, quizTarget, activePracticeSubtab]);

  // Compute notes in selected scale
  const rootIndex = NOTES.indexOf(selectedRoot);
  const scaleNotes = selectedScale.intervals.map(inter => NOTES[(rootIndex + inter) % 12]);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar select-none">
      
      {/* Subtab Navigation Pill Bar */}
      <div className="flex items-center justify-between bg-[#111827] border border-slate-800 p-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePracticeSubtab('scales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activePracticeSubtab === 'scales'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Visualizador de Escalas & Modos</span>
          </button>

          <button
            onClick={() => setActivePracticeSubtab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activePracticeSubtab === 'quiz'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz de Reconhecimento Auditivo</span>
          </button>

          <button
            onClick={() => setActivePracticeSubtab('backing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activePracticeSubtab === 'backing'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Backing Tracks & Jam</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-semibold hidden md:block">
          Suíte de Estudo Avançado
        </div>
      </div>

      {/* 1. SCALE EXPLORER TAB */}
      {activePracticeSubtab === 'scales' && (
        <div className="space-y-6">
          {/* Key & Scale Selection Controls */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Escolha o Tom Raiz:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {NOTES.map(note => (
                  <button
                    key={note}
                    onClick={() => setSelectedRoot(note)}
                    className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition ${
                      selectedRoot === note
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                        : 'bg-[#090d16] text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Escolha o Tipo de Escala / Modo:</span>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                {SCALE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedScale(preset)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedScale.id === preset.id
                        ? 'bg-sky-500/20 border-sky-500/60 shadow-md shadow-sky-500/10'
                        : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-extrabold ${selectedScale.id === preset.id ? 'text-sky-300' : 'text-slate-200'}`}>
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Notes Summary */}
            <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Notas na Escala de <span className="text-amber-400 font-extrabold">{selectedRoot} {selectedScale.name}</span>:
              </div>
              <div className="flex gap-2">
                {scaleNotes.map(n => (
                  <span
                    key={n}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                      n === selectedRoot
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-sky-300'
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Full 15-Fret Neck Visualizer */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white">Mapa Completo de Notas no Braço da Guitarra:</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Raiz ({selectedRoot})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" /> Notas da Escala
                </span>
              </span>
            </div>

            <div className="overflow-x-auto pb-2 custom-scrollbar">
              <div className="min-w-[850px] bg-[#1c1917] border-2 border-stone-800 rounded-2xl p-4 relative shadow-inner">
                {/* 6 Strings */}
                {STANDARD_TUNING.map((openNote, stringIdx) => {
                  const openNoteIndex = NOTES.indexOf(openNote);

                  return (
                    <div key={stringIdx} className="flex items-center h-9 relative border-b border-stone-800/80 last:border-0">
                      {/* String Label */}
                      <div className="w-8 text-xs font-mono font-black text-amber-400 flex items-center justify-center flex-shrink-0">
                        {openNote}
                      </div>

                      {/* 15 Frets per string */}
                      {Array.from({ length: 16 }).map((_, fret) => {
                        const noteAtFret = NOTES[(openNoteIndex + fret) % 12];
                        const isScaleNote = scaleNotes.includes(noteAtFret);
                        const isRoot = noteAtFret === selectedRoot;

                        return (
                          <div 
                            key={fret} 
                            className="flex-1 flex items-center justify-center border-r border-stone-700/60 relative h-full"
                          >
                            {isScaleNote && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-md z-10 ${
                                isRoot 
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-black scale-110 shadow-amber-500/40' 
                                  : 'bg-sky-500 text-white shadow-sky-500/30'
                              }`}>
                                {noteAtFret}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Fret Number Markers */}
                <div className="flex items-center mt-2 pl-8 text-[11px] font-mono text-stone-400">
                  {Array.from({ length: 16 }).map((_, f) => (
                    <div key={f} className="flex-1 text-center font-semibold">
                      {f === 0 ? 'Nut' : f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EAR TRAINING & FRETBOARD QUIZ */}
      {activePracticeSubtab === 'quiz' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto text-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Quiz Interativo de Reconhecimento no Braço</h3>
              <p className="text-xs text-slate-400">Toque a nota pedida na sua guitarra real para avançar</p>
            </div>
          </div>

          {/* Target Note Display Box */}
          <div className="bg-[#090d16] border-2 border-slate-800 rounded-3xl p-8 w-full flex flex-col items-center space-y-2 shadow-2xl">
            <span className="text-xs uppercase font-bold text-slate-400">Toque na sua Guitarra a Nota:</span>
            <div className="text-7xl font-black font-mono text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              {quizTarget.note}
            </div>
            <span className="text-xs text-slate-400">Pode ser em qualquer corda ou oitava</span>
          </div>

          {/* Feedback & Score */}
          <div className="flex items-center justify-between w-full bg-[#090d16] p-4 rounded-xl border border-slate-800">
            <div className="text-left">
              <span className="text-xs text-slate-400">Pontuação</span>
              <div className="text-2xl font-black font-mono text-emerald-400">{quizScore} pts</div>
            </div>

            <div className="text-center">
              {quizFeedback && (
                <div className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-bounce-short">
                  {quizFeedback.text}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Streak Acertos</span>
              <div className="text-2xl font-black font-mono text-amber-400 flex items-center gap-1 justify-end">
                <Flame className="w-5 h-5 text-orange-500" />
                {quizStreak}
              </div>
            </div>
          </div>

          <button
            onClick={generateNewQuizQuestion}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Pular / Nova Nota
          </button>
        </div>
      )}

      {/* 3. BACKING TRACKS JAM TAB */}
      {activePracticeSubtab === 'backing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BACKING_TRACKS.map(track => (
            <div
              key={track.id}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-sky-500/50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white">{track.title}</h4>
                  <p className="text-xs text-slate-400">{track.genre} • {track.bpm} BPM</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/15 text-amber-300 font-mono font-black text-xs rounded-xl border border-amber-500/30">
                  Tom: {track.key}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{track.description}</p>

              <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Escala Sugerida:</div>
                <div className="text-xs font-bold text-sky-400">{track.scale}</div>
                <div className="text-[10px] text-slate-400">Progressão: {track.chords}</div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
