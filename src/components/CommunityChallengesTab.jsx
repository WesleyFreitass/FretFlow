import React from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Star,
  Users,
  ChevronRight
} from 'lucide-react';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Lucas "Slash" M.', score: 48520, combo: 142, accuracy: 99.4, country: '🇧🇷' },
  { rank: 2, name: 'Carlos Hendrix', score: 46800, combo: 128, accuracy: 98.2, country: '🇧🇷' },
  { rank: 3, name: 'Dave G.', score: 44200, combo: 110, accuracy: 97.0, country: '🇺🇸' },
  { rank: 4, name: 'Você (Guitarrista)', score: 38900, combo: 85, accuracy: 95.8, country: '🇧🇷', isUser: true },
  { rank: 5, name: 'Matheus Mayer', score: 36400, combo: 74, accuracy: 94.2, country: '🇧🇷' }
];

const ACHIEVEMENTS = [
  { id: 'first_solo', title: 'Primeiro Solo 3D', desc: 'Completou um solo na Highway com mais de 80% de precisão', icon: '🎸', unlocked: true },
  { id: 'combo_50', title: 'Mestre do Ritmo', desc: 'Atingiu um Combo de 50x sem errar nenhuma nota', icon: '🔥', unlocked: true },
  { id: 'streak_7', title: 'Hábito de Aço', desc: 'Praticou por 7 dias consecutivos', icon: '⚡', unlocked: true },
  { id: 'ear_master', title: 'Ouvido Absoluto', desc: 'Acertou 10 notas seguidas no Quiz Auditivo', icon: '🎯', unlocked: false }
];

export default function CommunityChallengesTab({
  onStartChallenge
}) {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar select-none">
      
      {/* 1. WEEKLY CHALLENGE BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black rounded-full border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Desafio da Semana
            </span>
            <span className="text-xs text-slate-400 font-semibold">Termina em 2 dias</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            Solo Lendário: <span className="text-sky-400">Comfortably Numb</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Acerte a sequência de bends no compasso 4 com mais de 95% de precisão para desbloquear a insígnia exclusiva e subir no ranking global!
          </p>
        </div>

        <button
          onClick={onStartChallenge}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-sky-500/30 hover:brightness-110 transition flex items-center gap-2"
        >
          <span>Participar do Duelo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. LEADERBOARD & STREAK HABIT TRACKER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaderboard Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Ranking Global da Comunidade</span>
            </h3>
            <span className="text-xs text-slate-400">Top 5 Pontuações</span>
          </div>

          <div className="space-y-2">
            {LEADERBOARD_DATA.map((player) => (
              <div
                key={player.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  player.isUser
                    ? 'bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                    : 'bg-[#090d16] border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg font-black font-mono text-xs flex items-center justify-center ${
                    player.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40'
                      : player.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : player.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                  }`}>
                    {player.rank}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{player.name}</span>
                      <span>{player.country}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Precisão: {player.accuracy}% • Max Combo: {player.combo}x
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono font-black text-sm text-sky-400">
                  {player.score.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits & Daily Streak Progress (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Consistência & Streaks</span>
            </h3>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              124 Dias
            </span>
          </div>

          {/* Week Days Bubbles */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => (
              <div key={day} className="space-y-1">
                <div className={`h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  idx < 5 
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-[#090d16] border border-slate-800 text-slate-500'
                }`}>
                  {idx < 5 ? '✓' : ''}
                </div>
                <span className="text-[10px] text-slate-400">{day}</span>
              </div>
            ))}
          </div>

          {/* Daily Goal */}
          <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Meta Diária (20 min)</span>
              <span className="font-mono text-emerald-400 font-bold">15 / 20 min</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. ACHIEVEMENTS CARDS */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Conquistas Desbloqueadas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition ${
                ach.unlocked 
                  ? 'bg-[#111827] border-slate-700 shadow-lg shadow-black/30' 
                  : 'bg-[#090d16]/60 border-slate-800/60 opacity-50'
              }`}
            >
              <div className="text-2xl p-2 bg-[#090d16] rounded-xl border border-slate-800">
                {ach.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{ach.title}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
