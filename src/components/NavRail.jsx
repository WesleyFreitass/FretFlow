import React from 'react';
import { 
  Home, 
  BookOpen, 
  Wrench, 
  Trophy, 
  Music, 
  Settings, 
  Guitar, 
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';

export default function NavRail({ 
  activeTab, 
  setActiveTab, 
  onOpenSettings 
}) {
  const navItems = [
    { id: 'home', label: 'Home / Highway', icon: Home },
    { id: 'lessons', label: 'Aulas & Lições', icon: BookOpen },
    { id: 'practice', label: 'Practice Tools', icon: Wrench },
    { id: 'community', label: 'Desafios & Rank', icon: Trophy },
    { id: 'songs', label: 'Músicas & YouTube', icon: Music },
    { id: 'pedalboard', label: 'Pedaleira Studio', icon: Flame }
  ];

  return (
    <nav className="w-20 lg:w-56 flex-shrink-0 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between p-3 select-none z-30 shadow-2xl">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/30 flex-shrink-0">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Guitar className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
              GUITAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">FLOW</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Studio Desktop</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
                title={item.label}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full shadow-md shadow-sky-400" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="hidden lg:inline truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings at Bottom */}
      <div className="pt-3 border-t border-slate-800/80">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition border border-transparent"
          title="Configurações de Áudio & Dispositivos"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:inline">Configurações</span>
        </button>
      </div>
    </nav>
  );
}
