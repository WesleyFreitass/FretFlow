import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StudyMethodsTab from './components/StudyMethodsTab';
import ScaleExplorerTab from './components/ScaleExplorerTab';
import GuitarProTab from './components/GuitarProTab';
import TunerTab from './components/TunerTab';
import GuitarPedalboardTab from './components/GuitarPedalboardTab';
import ChordTrainerTab from './components/ChordTrainerTab';
import GuitarHeroTab from './components/GuitarHeroTab';
import YouTubeSongTab from './components/YouTubeSongTab';
import KanbanBoardTab from './components/KanbanBoardTab';
import AudioSettingsModal from './components/AudioSettingsModal';
import { globalAudio } from './audio/audioManager';
import { Volume2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tuner');
  const [audioActive, setAudioActive] = useState(false);
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio frame state
  const [audioState, setAudioState] = useState({
    rms: 0,
    isAudible: false,
    pitch: null,
    chord: null,
    chromagram: new Array(12).fill(0),
    timeDomainBuffer: null,
    frequencyBuffer: null
  });

  const [errorMessage, setErrorMessage] = useState(null);

  // Audio Frame Subscription
  useEffect(() => {
    globalAudio.onAudioFrame = (frameData) => {
      setAudioState(frameData);
      if (frameData.monitoringEnabled !== undefined && frameData.monitoringEnabled !== monitoringEnabled) {
        setMonitoringEnabled(frameData.monitoringEnabled);
      }
    };

    return () => {
      globalAudio.stop();
    };
  }, []);

  const handleToggleAudio = async () => {
    if (audioActive) {
      globalAudio.stop();
      setAudioActive(false);
    } else {
      try {
        setErrorMessage(null);
        await globalAudio.init(globalAudio.selectedDeviceId);
        setAudioActive(true);
      } catch (err) {
        console.error('Erro ao ativar áudio:', err);
        setErrorMessage('Não foi possível acessar a entrada de áudio. Verifique se o microfone/interface está conectado e conceda permissão.');
        setAudioActive(false);
      }
    }
  };

  const handleToggleMonitoring = () => {
    const nextVal = !monitoringEnabled;
    setMonitoringEnabled(nextVal);
    globalAudio.setMonitoring(nextVal);
  };

  const handleDeviceChange = async (deviceId) => {
    if (audioActive) {
      try {
        await globalAudio.init(deviceId);
      } catch (err) {
        console.error('Erro ao trocar dispositivo:', err);
      }
    } else {
      globalAudio.selectedDeviceId = deviceId;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-oficina-bg text-oficina-darkText flex flex-col font-sans selection:bg-oficina-terracotta selection:text-white">
      
      {/* 1. TOPBAR BOUTIQUE CHASSIS */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-oficina-chassis text-[#f3f1ec] border-b border-[#3a3f3c] z-50 shrink-0">
        <div className="flex items-center gap-3.5">
          <img src="/icon.png" alt="FretFlow" className="w-10 h-10 object-contain shrink-0 drop-shadow-md" />
          <div className="flex flex-col">
            <div className="text-base font-extrabold tracking-wide leading-tight">FretFlow</div>
            <div className="text-[11px] text-[#9c988f] font-mono leading-tight">Estúdio de guitarra, efeitos DSP &amp; aprendizado</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 font-mono text-xs">
          {/* Signal Indicator */}
          <div className="flex items-center gap-2 border border-[#3a3f3c] bg-[#171b19] px-3 py-1.5 rounded-sm">
            <span className={`w-2 h-2 rounded-full ${audioActive ? 'bg-oficina-oliveGlow animate-fretpulse shadow-sm shadow-[#7fbf4d]' : 'bg-[#555a57]'}`}></span>
            <span className="text-[#cfcbc2] font-semibold">
              INPUT 1 · {audioActive ? '5.2 ms' : 'STANDBY'}
            </span>
          </div>

          {/* Audio Toggle Button */}
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-1.5 rounded-sm font-bold text-xs uppercase tracking-wider transition ${
              audioActive
                ? 'bg-oficina-oliveGlow text-oficina-chassis font-black shadow-sm'
                : 'bg-[#3a3f3c] text-[#cfcbc2] hover:bg-[#4a4f4c]'
            }`}
          >
            {audioActive ? 'ÁUDIO ATIVO' : 'LIGAR ÁUDIO'}
          </button>
        </div>
      </header>

      {/* 2. MAIN APP FRAME: SIDEBAR + ACTIVE TAB STAGE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR COM OS 8 MÓDULOS */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          audioActive={audioActive}
          onToggleAudio={handleToggleAudio}
          onOpenSettings={() => setIsSettingsOpen(true)}
          rmsLevel={audioState.rms}
          noiseGate={globalAudio.noiseGate}
          monitoringEnabled={monitoringEnabled}
          onToggleMonitoring={handleToggleMonitoring}
        />

        {/* ACTIVE TAB VIEWPORT */}
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-8 bg-oficina-surface space-y-6">
          
          {/* Banner de Ativação do Áudio quando inativo */}
          {!audioActive && (
            <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-oficina-oliveLight text-oficina-olive rounded-sm">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-oficina-darkText uppercase tracking-wider">
                    Conecte sua Guitarra ao FretFlow
                  </h3>
                  <p className="text-xs text-oficina-bodyText mt-0.5">
                    Clique no botão acima ou ao lado para iniciar o processamento em tempo real.
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleAudio}
                className="px-4 py-2 bg-oficina-terracotta hover:brightness-110 text-white font-mono font-bold text-xs rounded-sm transition shadow-sm"
              >
                Ligar Entrada de Áudio
              </button>
            </div>
          )}

          {/* Notificação de Erro */}
          {errorMessage && (
            <div className="bg-rose-100 border border-rose-300 rounded-sm p-3.5 flex items-center gap-3 text-rose-900 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold font-mono underline"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Renderização da Aba Ativa */}
          {activeTab === 'tuner' && (
            <TunerTab
              pitchData={audioState.pitch}
              chordData={audioState.chord}
              chromagram={audioState.chromagram}
              timeDomainBuffer={audioState.timeDomainBuffer}
              frequencyBuffer={audioState.frequencyBuffer}
              isAudible={audioState.isAudible}
              rmsLevel={audioState.rms}
            />
          )}

          {activeTab === 'pedalboard' && (
            <GuitarPedalboardTab
              audioActive={audioActive}
              isAudible={audioState.isAudible}
              rmsLevel={audioState.rms}
            />
          )}

          {activeTab === 'trainer' && (
            <ChordTrainerTab
              chordData={audioState.chord}
              pitchData={audioState.pitch}
              isAudible={audioState.isAudible}
              chromagram={audioState.chromagram}
              frequencyBuffer={audioState.frequencyBuffer}
              rmsLevel={audioState.rms}
              audioActive={audioActive}
              onToggleAudio={handleToggleAudio}
            />
          )}

          {activeTab === 'methods' && (
            <StudyMethodsTab
              pitchData={audioState.pitch}
              chordData={audioState.chord}
              chromagram={audioState.chromagram}
              isAudible={audioState.isAudible}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'scales' && (
            <ScaleExplorerTab
              pitchData={audioState.pitch}
              chordData={audioState.chord}
              chromagram={audioState.chromagram}
              isAudible={audioState.isAudible}
            />
          )}

          {activeTab === 'guitarpro' && (
            <GuitarProTab
              pitchData={audioState.pitch}
              chordData={audioState.chord}
              isAudible={audioState.isAudible}
            />
          )}

          {activeTab === 'hero' && (
            <GuitarHeroTab
              pitchData={audioState.pitch}
              chordData={audioState.chord}
              chromagram={audioState.chromagram}
              isAudible={audioState.isAudible}
            />
          )}

          {activeTab === 'youtube' && (
            <YouTubeSongTab
              chordData={audioState.chord}
              pitchData={audioState.pitch}
              isAudible={audioState.isAudible}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoardTab />
          )}

        </main>
      </div>

      {/* MODAL DE CONFIGURAÇÕES DE ÁUDIO */}
      {isSettingsOpen && (
        <AudioSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onDeviceChange={handleDeviceChange}
        />
      )}

    </div>
  );
}
