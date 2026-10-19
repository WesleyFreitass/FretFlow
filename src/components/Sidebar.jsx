import React from 'react';
import { 
  Radio, 
  Flame, 
  Sparkles, 
  Video, 
  Gamepad2,
  Settings, 
  Guitar, 
  Volume2, 
  VolumeX, 
  Headphones,
  Sliders,
  GraduationCap,
  Compass,
  FileText,
  Kanban
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  audioActive, 
  onToggleAudio, 
  onOpenSettings, 
  rmsLevel = 0,
  noiseGate = 0.015,
  monitoringEnabled = true,
  onToggleMonitoring
}) {
  const isSignalActive = rmsLevel >= noiseGate;
  const vuPercentage = Math.min(100, Math.round((rmsLevel / 0.15) * 100));

  const navItems = [
    { 
      id: 'tuner', 
      label: 'Afinador', 
      icon: Radio
    },
    { 
      id: 'pedalboard', 
      label: 'Pedaleira & Efeitos', 
      icon: Flame
    },
    { 
      id: 'trainer', 
      label: 'Treino de Acordes', 
      icon: Sparkles
    },
    { 
      id: 'methods', 
      label: 'Trilha & Métodos', 
      icon: GraduationCap
    },
    { 
      id: 'scales', 
      label: 'Escalas & Modos', 
      icon: Compass
    },
    { 
      id: 'guitarpro', 
      label: 'Guitar Pro Tabs', 
      icon: FileText
    },
    { 
      id: 'hero', 
      label: 'Arcade de Notas (Hero)', 
      icon: Gamepad2
    },
    { 
      id: 'youtube', 
      label: 'Modo YouTube', 
      icon: Video
    },
    {
      id: 'kanban',
      label: 'Kanban de Ideias',
      icon: Kanban
    }
  ];

  return (
    <aside className="w-56 lg:w-60 flex-shrink-0 bg-oficina-sidebar border-r border-oficina-borderDark flex flex-col justify-between p-3.5 select-none z-30 h-full font-sans">
      
      {/* 1. NAVIGATION MODULES */}
      <div className="space-y-3 overflow-y-auto custom-scrollbar">
        <div className="font-mono text-[10px] font-bold tracking-[0.16em] text-oficina-mutedText px-2 pt-1 uppercase">
          MÓDULOS
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[3px] transition-all text-left text-[13px] ${
                  isActive
                    ? 'bg-oficina-chassis text-[#f3f1ec] font-extrabold shadow-sm'
                    : 'text-oficina-darkText font-semibold hover:bg-[#ded9cc]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-oficina-terracotta' : 'text-oficina-mutedText'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. FOOTER: SYSTEM METRICS & SETTINGS */}
      <div className="space-y-3 pt-3 border-t border-oficina-border flex-shrink-0 font-mono text-[11px] text-oficina-bodyText">
        
        {/* Signal & Gate Metrics */}
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between items-center">
            <span className="text-oficina-mutedText">Monitoring</span>
            <span className={monitoringEnabled ? 'text-oficina-olive font-bold' : 'text-oficina-mutedText'}>
              {monitoringEnabled ? '0 ms' : 'Mute'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-oficina-mutedText">Noise gate</span>
            <span className="text-oficina-olive font-bold">on</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-oficina-mutedText">Latência</span>
            <span className="text-oficina-darkText font-bold">5.2 ms</span>
          </div>
        </div>

        {/* Level Meter Strip */}
        <div className="px-1 space-y-1">
          <div className="flex justify-between text-[10px] text-oficina-mutedText">
            <span>SINAL INPUT</span>
            <span>{isSignalActive ? 'ATIVO' : 'SILÊNCIO'}</span>
          </div>
          <div className="h-2 bg-[#eae6da] border border-oficina-border rounded-[2px] overflow-hidden">
            <div 
              className="h-full bg-oficina-olive transition-all duration-75"
              style={{ width: `${vuPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onToggleMonitoring}
            className={`py-1.5 px-2 rounded-[2px] text-center border font-bold text-[10px] flex items-center justify-center gap-1 transition ${
              monitoringEnabled
                ? 'bg-oficina-card border-oficina-border text-oficina-olive'
                : 'bg-[#eae6da] border-oficina-border text-oficina-mutedText'
            }`}
            title="Retorno Direto no Fone"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>FONE</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="py-1.5 px-2 rounded-[2px] bg-oficina-card border border-oficina-border hover:border-oficina-borderDark text-oficina-darkText font-bold text-[10px] flex items-center justify-center gap-1 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>CONFIG</span>
          </button>
        </div>

      </div>

    </aside>
  );
}
