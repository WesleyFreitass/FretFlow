import React from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Settings, 
  Guitar, 
  Music, 
  Sparkles, 
  Activity, 
  Video,
  Headphones,
  Flame 
} from 'lucide-react';

export default function Header({ 
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

  return (
    <header className="bg-[#111827]/90 backdrop-blur border-b border-slate-800/80 sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <img src="/icon.png" alt="FretFlow Icon" className="w-10 h-10 object-contain shrink-0 drop-shadow-md" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Fret<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Flow</span>
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">
              Desktop Studio
            </span>
          </div>
          <p className="text-xs text-slate-400">Assistente Inteligente de Guitarra em Tempo Real</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex items-center bg-[#090d16] p-1.5 rounded-xl border border-slate-800 shadow-inner flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('tuner')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'tuner'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Afinador & Prática</span>
        </button>

        <button
          onClick={() => setActiveTab('pedalboard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'pedalboard'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Pedaleira & Efeitos</span>
        </button>

        <button
          onClick={() => setActiveTab('trainer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'trainer'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Treino de Acordes</span>
        </button>
      </nav>

      {/* Audio Hub & Settings */}
      <div className="flex items-center gap-2.5">
        {/* Live Mini VU Meter */}
        <div className="flex items-center gap-2 bg-[#090d16] px-3 py-1.5 rounded-lg border border-slate-800" title="Sinal de Entrada da Guitarra">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${
              !audioActive 
                ? 'bg-slate-600' 
                : isSignalActive 
                  ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' 
                  : 'bg-amber-500'
            }`} />
            <span className="text-xs text-slate-300 font-mono font-medium">
              {!audioActive ? 'DESLIGADO' : isSignalActive ? 'SINAL OK' : 'AGUARDANDO'}
            </span>
          </div>

          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden ml-1">
            <div 
              className={`h-full transition-all duration-75 ${
                vuPercentage > 85 ? 'bg-rose-500' : vuPercentage > 40 ? 'bg-emerald-400' : 'bg-sky-400'
              }`}
              style={{ width: `${audioActive ? vuPercentage : 0}%` }}
            />
          </div>
        </div>

        {/* Headphone Direct Monitor Quick Toggle */}
        <button
          onClick={onToggleMonitoring}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            monitoringEnabled
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700/80 hover:text-slate-200'
          }`}
          title={monitoringEnabled ? 'Retorno no Fone ATIVO (Clique para silenciar retorno)' : 'Retorno no Fone DESLIGADO (Clique para ativar som no fone)'}
        >
          <Headphones className={`w-4 h-4 ${monitoringEnabled ? 'text-sky-400' : 'opacity-60'}`} />
          <span className="hidden sm:inline">Retorno {monitoringEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Audio Input Toggle Button */}
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
            audioActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
          }`}
        >
          {audioActive ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Ouvindo Guitarra</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span>Ligar Áudio</span>
            </>
          )}
        </button>

        {/* Audio Settings Modal Trigger */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl transition shadow-md"
          title="Configurações de Dispositivo de Áudio, Retorno e Sensibilidade"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
