import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Volume2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Headphones,
  Radio,
  Speaker,
  Settings2,
  Zap,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { globalAudio } from '../audio/audioManager';

export default function AudioSettingsModal({ 
  isOpen, 
  onClose, 
  rmsLevel = 0, 
  onDeviceChange 
}) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('devices');

  const [inputDevices, setInputDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState('default');
  const [selectedOutputDevice, setSelectedOutputDevice] = useState('default');
  const [inputChannelMode, setInputChannelMode] = useState('ch1');
  
  const [gain, setGain] = useState(1.2);
  const [noiseGate, setNoiseGate] = useState(0.015);
  
  // Monitoring states
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [monitorVolume, setMonitorVolume] = useState(0.9);
  const [referenceFreq, setReferenceFreq] = useState(440);
  const [latencyMode, setLatencyMode] = useState('low');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCalibratingNoise, setIsCalibratingNoise] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDevices();
      setGain(globalAudio.inputGain);
      setNoiseGate(globalAudio.noiseGate);
      setMonitoringEnabled(globalAudio.monitoringEnabled);
      setMonitorVolume(globalAudio.monitorVolume);
      setInputChannelMode(globalAudio.inputChannelMode || 'ch1');
      setReferenceFreq(globalAudio.referenceFrequency || 440);
      setLatencyMode(globalAudio.latencyMode || 'low');
    }
  }, [isOpen]);

  const triggerSavedFeedback = () => {
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const loadDevices = async () => {
    setIsLoading(true);
    const inDevs = await globalAudio.getAudioInputDevices();
    const outDevs = await globalAudio.getAudioOutputDevices();
    
    setInputDevices(inDevs);
    setOutputDevices(outDevs);
    
    setSelectedInputDevice(globalAudio.selectedDeviceId || 'default');
    setSelectedOutputDevice(globalAudio.selectedOutputDeviceId || 'default');
    setIsLoading(false);
  };

  const handleInputDeviceSelect = async (deviceId) => {
    setSelectedInputDevice(deviceId);
    if (onDeviceChange) {
      await onDeviceChange(deviceId);
    }
    triggerSavedFeedback();
  };

  const handleOutputDeviceSelect = async (deviceId) => {
    setSelectedOutputDevice(deviceId);
    await globalAudio.setOutputDevice(deviceId);
    triggerSavedFeedback();
  };

  const handleInputChannelChange = (mode) => {
    setInputChannelMode(mode);
    globalAudio.setInputChannelMode(mode);
    triggerSavedFeedback();
  };

  const handleGainChange = (e) => {
    const val = parseFloat(e.target.value);
    setGain(val);
    globalAudio.setGain(val);
    triggerSavedFeedback();
  };

  const handleNoiseGateChange = (e) => {
    const val = parseFloat(e.target.value);
    setNoiseGate(val);
    globalAudio.setNoiseGate(val);
    triggerSavedFeedback();
  };

  const handleMonitoringToggle = (enabled) => {
    setMonitoringEnabled(enabled);
    globalAudio.setMonitoring(enabled);
    triggerSavedFeedback();
  };

  const handleMonitorVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setMonitorVolume(val);
    globalAudio.setMonitorVolume(val);
    triggerSavedFeedback();
  };

  const handleRefFreqChange = (freq) => {
    setReferenceFreq(freq);
    globalAudio.setReferenceFrequency(freq);
    triggerSavedFeedback();
  };

  const handleLatencyModeChange = (mode) => {
    setLatencyMode(mode);
    globalAudio.setLatencyMode(mode);
    triggerSavedFeedback();
  };

  const handleAutoCalibrateNoise = () => {
    setIsCalibratingNoise(true);
    const measuredLevels = [];
    const startTime = Date.now();

    const interval = setInterval(() => {
      measuredLevels.push(rmsLevel);

      if (Date.now() - startTime >= 1200) {
        clearInterval(interval);
        setIsCalibratingNoise(false);

        const avgNoise = measuredLevels.reduce((a, b) => a + b, 0) / (measuredLevels.length || 1);
        const calibratedGate = Math.max(0.006, Math.min(0.05, avgNoise * 1.45));
        
        setNoiseGate(calibratedGate);
        globalAudio.setNoiseGate(calibratedGate);
        triggerSavedFeedback();
      }
    }, 50);
  };

  const handleResetToDefaults = () => {
    globalAudio.resetToDefaults();
    setGain(1.2);
    setNoiseGate(0.015);
    setMonitoringEnabled(true);
    setMonitorVolume(0.9);
    setSelectedInputDevice('default');
    setSelectedOutputDevice('default');
    setInputChannelMode('ch1');
    setReferenceFreq(440);
    setLatencyMode('low');
    triggerSavedFeedback();
  };

  if (!isOpen) return null;

  const vuPercentage = Math.min(100, Math.round((rmsLevel / 0.15) * 100));
  const isSignalOverGate = rmsLevel >= noiseGate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-oficina-card border border-oficina-border rounded-sm shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-oficina-chassis text-[#f3f1ec] px-5 py-4 flex items-center justify-between border-b border-[#3a3f3c]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-oficina-terracotta flex items-center justify-center font-mono font-bold text-xs text-[#1f2321]">
              ⚙
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">Configurações de Áudio &amp; Interface</h3>
              <p className="text-[11px] text-[#9c988f] font-mono">Calibração de dispositivos, ganho e roteamento</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedBadge && (
              <span className="font-mono text-[10px] text-oficina-oliveGlow font-bold">
                ✓ Salvo
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#9c988f] hover:text-white rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-oficina-border bg-oficina-surface px-5 pt-2 gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveSettingsTab('devices')}
            className={`px-4 py-2 rounded-t-[2px] font-bold border-t border-x transition ${
              activeSettingsTab === 'devices'
                ? 'bg-oficina-card border-oficina-border text-oficina-darkText -mb-[1px]'
                : 'border-transparent text-oficina-mutedText hover:text-oficina-darkText'
            }`}
          >
            Dispositivos &amp; Canais
          </button>
          <button
            onClick={() => setActiveSettingsTab('calibration')}
            className={`px-4 py-2 rounded-t-[2px] font-bold border-t border-x transition ${
              activeSettingsTab === 'calibration'
                ? 'bg-oficina-card border-oficina-border text-oficina-darkText -mb-[1px]'
                : 'border-transparent text-oficina-mutedText hover:text-oficina-darkText'
            }`}
          >
            Ganho &amp; Noise Gate
          </button>
          <button
            onClick={() => setActiveSettingsTab('general')}
            className={`px-4 py-2 rounded-t-[2px] font-bold border-t border-x transition ${
              activeSettingsTab === 'general'
                ? 'bg-oficina-card border-oficina-border text-oficina-darkText -mb-[1px]'
                : 'border-transparent text-oficina-mutedText hover:text-oficina-darkText'
            }`}
          >
            Monitoramento &amp; Avançado
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
          
          {/* TAB 1: DEVICES */}
          {activeSettingsTab === 'devices' && (
            <div className="space-y-4">
              {/* Input device */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                    DISPOSITIVO DE ENTRADA (GUITARRA)
                  </label>
                  <button
                    onClick={loadDevices}
                    className="font-mono text-[10px] text-oficina-petrol font-bold flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </button>
                </div>

                <select
                  value={selectedInputDevice}
                  onChange={(e) => handleInputDeviceSelect(e.target.value)}
                  className="w-full bg-oficina-surface border border-oficina-border rounded-sm p-2 text-xs font-mono font-bold text-oficina-darkText focus:outline-none focus:border-oficina-darkText"
                >
                  <option value="default">Padrão do Sistema</option>
                  {inputDevices.map((dev) => (
                    <option key={dev.deviceId} value={dev.deviceId}>
                      {dev.label || `Entrada ${dev.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Output device */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                  DISPOSITIVO DE SAÍDA (FONE / CAIXAS)
                </label>
                <select
                  value={selectedOutputDevice}
                  onChange={(e) => handleOutputDeviceSelect(e.target.value)}
                  className="w-full bg-oficina-surface border border-oficina-border rounded-sm p-2 text-xs font-mono font-bold text-oficina-darkText focus:outline-none focus:border-oficina-darkText"
                >
                  <option value="default">Padrão do Sistema</option>
                  {outputDevices.map((dev) => (
                    <option key={dev.deviceId} value={dev.deviceId}>
                      {dev.label || `Saída ${dev.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Routing */}
              <div className="space-y-1.5 pt-2 border-t border-oficina-borderLight">
                <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                  ROTEAMENTO DE ENTRADA (INTERFACE)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInputChannelChange('ch1')}
                    className={`p-2.5 rounded-sm border text-left font-mono transition ${
                      inputChannelMode === 'ch1'
                        ? 'bg-oficina-surface border-oficina-chassis font-bold text-oficina-darkText'
                        : 'bg-oficina-card border-oficina-border text-oficina-bodyText'
                    }`}
                  >
                    <strong className="block text-xs">Canal 1 (Mono)</strong>
                    <span className="text-[10px] text-oficina-mutedText">Input 1 para E + D</span>
                  </button>

                  <button
                    onClick={() => handleInputChannelChange('ch2')}
                    className={`p-2.5 rounded-sm border text-left font-mono transition ${
                      inputChannelMode === 'ch2'
                        ? 'bg-oficina-surface border-oficina-chassis font-bold text-oficina-darkText'
                        : 'bg-oficina-card border-oficina-border text-oficina-bodyText'
                    }`}
                  >
                    <strong className="block text-xs">Canal 2 (Mono)</strong>
                    <span className="text-[10px] text-oficina-mutedText">Input 2 para E + D</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALIBRATION */}
          {activeSettingsTab === 'calibration' && (
            <div className="space-y-5">
              
              {/* Live VU Meter */}
              <div className="bg-oficina-surface border border-oficina-border rounded-sm p-4 space-y-2">
                <div className="flex justify-between font-mono text-[10px] text-oficina-mutedText">
                  <span>NÍVEL DE ENTRADA</span>
                  <span className={isSignalOverGate ? 'text-oficina-olive font-bold' : 'text-oficina-mutedText'}>
                    {isSignalOverGate ? 'SINAL ACIMA DO GATE' : 'GATE FECHADO (SILÊNCIO)'}
                  </span>
                </div>
                <div className="h-3 bg-[#eae6da] border border-oficina-border rounded-[2px] overflow-hidden">
                  <div 
                    className="h-full bg-oficina-olive transition-all duration-75"
                    style={{ width: `${vuPercentage}%` }}
                  />
                </div>
              </div>

              {/* Input Gain Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="font-bold text-oficina-darkText">Ganho de Entrada:</span>
                  <span className="text-oficina-petrol font-bold">{gain.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={gain}
                  onChange={handleGainChange}
                  className="w-full accent-oficina-terracotta"
                />
              </div>

              {/* Noise Gate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="font-bold text-oficina-darkText">Limiar do Noise Gate:</span>
                  <span className="text-oficina-olive font-bold">{(noiseGate * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.002"
                  max="0.06"
                  step="0.001"
                  value={noiseGate}
                  onChange={handleNoiseGateChange}
                  className="w-full accent-oficina-olive"
                />
                <button
                  onClick={handleAutoCalibrateNoise}
                  disabled={isCalibratingNoise}
                  className="w-full mt-2 py-2 bg-oficina-surface border border-oficina-border hover:border-oficina-borderDark font-mono font-bold text-xs rounded-sm transition text-oficina-darkText"
                >
                  {isCalibratingNoise ? 'Medindo silêncio da sala...' : '🎯 Calibrar Silêncio Automaticamente'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: GENERAL & MONITORING */}
          {activeSettingsTab === 'general' && (
            <div className="space-y-4">
              
              {/* Direct Monitor Toggle */}
              <div className="p-3.5 bg-oficina-surface border border-oficina-border rounded-sm flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-sans text-oficina-darkText">Retorno Direto (Direct Monitor)</strong>
                  <span className="text-[11px] text-oficina-mutedText">Escutar a guitarra com os efeitos no fone</span>
                </div>
                <button
                  onClick={() => handleMonitoringToggle(!monitoringEnabled)}
                  className={`px-3 py-1.5 rounded-sm font-mono font-bold text-xs transition ${
                    monitoringEnabled
                      ? 'bg-oficina-olive text-white shadow-sm'
                      : 'bg-[#eae6da] text-oficina-mutedText'
                  }`}
                >
                  {monitoringEnabled ? 'LIGADO' : 'MUTADO'}
                </button>
              </div>

              {/* Reference Frequency */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold tracking-[0.14em] text-oficina-mutedText uppercase">
                  FREQUÊNCIA DE REFERÊNCIA (LÁ / A4)
                </label>
                <div className="flex gap-2">
                  {[432, 440, 442, 444].map((f) => (
                    <button
                      key={f}
                      onClick={() => handleRefFreqChange(f)}
                      className={`flex-1 py-1.5 font-mono text-xs font-bold rounded-sm border transition ${
                        referenceFreq === f
                          ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis'
                          : 'bg-oficina-surface border-oficina-border text-oficina-bodyText'
                      }`}
                    >
                      {f} Hz
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-oficina-surface px-6 py-3.5 border-t border-oficina-border flex justify-between items-center">
          <button
            onClick={handleResetToDefaults}
            className="text-xs font-mono text-oficina-mutedText hover:text-oficina-terracotta underline"
          >
            Restaurar Padrões de Fábrica
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-oficina-chassis text-[#f3f1ec] font-mono font-bold text-xs rounded-sm hover:brightness-110 shadow-sm"
          >
            Concluir &amp; Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
