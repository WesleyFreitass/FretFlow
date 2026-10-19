import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Flame, 
  Lock, 
  Sparkles, 
  Star,
  ChevronRight 
} from 'lucide-react';

const LESSON_MODULES = [
  {
    id: 'mod_1',
    level: 'Nível 1',
    title: 'Fundamentos: Cordas Soltas & Postura',
    duration: '15 min',
    completed: true,
    description: 'Aprenda a afinar sua guitarra, postura correta da mão direita e palhetada alternada nas 6 cordas.',
    lessons: [
      { id: '1.1', title: 'Afinação Padrão (E A D G B e)', duration: '3 min', completed: true },
      { id: '1.2', title: 'Exercício 1-2-3-4 de Independência dos Dedos', duration: '5 min', completed: true },
      { id: '1.3', title: 'Palhetada Alternada para Baixo e para Cima', duration: '7 min', completed: true }
    ]
  },
  {
    id: 'mod_2',
    level: 'Nível 2',
    title: 'Os Primeiros Acordes Abertos (C, G, D, Em, Am)',
    duration: '25 min',
    completed: true,
    description: 'Domine a transição entre os acordes mais famosos do mundo sem engasgar o ritmo.',
    lessons: [
      { id: '2.1', title: 'Montagem Limpa do Mi Menor (Em) e Dó Maior (C)', duration: '8 min', completed: true },
      { id: '2.2', title: 'O Triângulo de Ouro: G, D e Am', duration: '10 min', completed: true },
      { id: '2.3', title: 'Música Prática: Knockin\' on Heaven\'s Door', duration: '7 min', completed: true }
    ]
  },
  {
    id: 'mod_3',
    level: 'Nível 3',
    title: 'Power Chords & Levadas de Rock',
    duration: '30 min',
    completed: false,
    description: 'Descubra a força dos Power Chords de 5ª (E5, A5, G5, C5) e a técnica de palm-muting.',
    lessons: [
      { id: '3.1', title: 'Formato Móvel de Power Chord na 5ª e 6ª corda', duration: '10 min', completed: true },
      { id: '3.2', title: 'Técnica de Palm Mute com a palma da mão direita', duration: '10 min', completed: false },
      { id: '3.3', title: 'Música Prática: Smells Like Teen Spirit (Nirvana)', duration: '10 min', completed: false }
    ]
  },
  {
    id: 'mod_4',
    level: 'Nível 4',
    title: 'A Escala Pentatônica & Seu Primeiro Solo',
    duration: '40 min',
    completed: false,
    description: 'O segredo dos grandes solos de guitarra. O padrão mais importante de toda a história do Rock.',
    lessons: [
      { id: '4.1', title: 'Padrão 1 da Pentatônica Menor de Lá (Am)', duration: '12 min', completed: false },
      { id: '4.2', title: 'Como Conectar Frases e Riffs Melódicos', duration: '14 min', completed: false },
      { id: '4.3', title: 'Solo Prático: Comfortably Numb no Modo 3D', duration: '14 min', completed: false }
    ]
  }
];

export default function LessonsTab({
  onStartLesson
}) {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar select-none">
      
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>Trilha de Aprendizado de Guitarra</span>
          </h2>
          <p className="text-xs text-slate-400">Do zero ao seu primeiro solo na esteira 3D interativa</p>
        </div>

        <div className="flex items-center gap-2 bg-[#090d16] px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Progresso:</span>
          <span className="text-xs font-mono font-black text-emerald-400">55% Concluído</span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {LESSON_MODULES.map((module) => (
          <div
            key={module.id}
            className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-sky-500/15 text-sky-300 font-bold text-xs rounded-xl border border-sky-500/30">
                  {module.level}
                </span>
                <h3 className="text-base font-black text-white">{module.title}</h3>
              </div>

              <span className="text-xs font-mono text-slate-400">{module.duration}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{module.description}</p>

            {/* Lessons in Module */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {module.lessons.map(ls => (
                <div
                  key={ls.id}
                  className="bg-[#090d16] p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 hover:border-sky-500/40 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      ls.completed 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ls.completed ? '✓' : ls.id}
                    </div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition">
                      {ls.title}
                    </span>
                  </div>

                  <button
                    onClick={onStartLesson}
                    className="px-3 py-1.5 bg-slate-800 group-hover:bg-sky-500 group-hover:text-white text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Iniciar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
