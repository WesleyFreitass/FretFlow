import { PitchDetector } from './pitchDetector.js';
import { ChordDetector } from './chordDetector.js';
import { GuitarFxChain, ARTIST_PRESETS as LEGACY_PRESETS } from './guitarFxChain.js';
import { PedalDspEngine } from './pedalDspEngine.js';

const SETTINGS_STORAGE_KEY = 'fretflow_audio_settings_v1';

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.sourceNode = null;
    this.channelSplitter = null;
    this.channelMerger = null;
    this.analyserNode = null;
    this.gainNode = null;

    // Load persisted settings from localStorage
    const saved = this.loadSavedSettings();

    // Modular AmpliTube Pedalboard DSP Engine
    this.pedalDspEngine = null;
    this.activePedals = [];
    this.ampSettings = { model: 'twin', gain: 4.5, bass: 5.5, middle: 6.0, treble: 6.5, presence: 5.0, master: 7.5 };

    // Legacy FX Engine
    this.fxChain = null;
    this.currentPresetId = saved.currentPresetId || 'padrao';

    // Headphone monitoring output node
    this.monitorGainNode = null;

    this.pitchDetector = null;
    this.chordDetector = null;

    this.isRunning = false;
    this.animationFrameId = null;

    // Configuration
    this.fftSize = 4096;
    this.timeDomainBuffer = null;
    this.frequencyBuffer = null;

    this.inputGain = saved.inputGain ?? 1.2;
    this.noiseGate = saved.noiseGate ?? 0.015; // RMS threshold
    this.selectedDeviceId = saved.selectedDeviceId ?? 'default';
    this.selectedOutputDeviceId = saved.selectedOutputDeviceId ?? 'default';

    // Channel routing: 'ch1' (Input 1 -> L+R), 'ch2' (Input 2 -> L+R), 'sum' (L+R -> L+R), 'stereo' (L->L, R->R)
    this.inputChannelMode = saved.inputChannelMode ?? 'ch1';

    // Monitoring settings
    this.monitoringEnabled = saved.monitoringEnabled ?? true;
    this.monitorVolume = saved.monitorVolume ?? 0.9;
    this.referenceFrequency = saved.referenceFrequency ?? 440;
    this.latencyMode = saved.latencyMode ?? 'low';

    // Callbacks for subscribers
    this.onAudioFrame = null;
  }

  loadSavedSettings() {
    try {
      const item = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn('Falha ao carregar configurações do localStorage:', e);
    }
    return {};
  }

  saveSettings() {
    try {
      const data = {
        inputGain: this.inputGain,
        noiseGate: this.noiseGate,
        selectedDeviceId: this.selectedDeviceId,
        selectedOutputDeviceId: this.selectedOutputDeviceId,
        inputChannelMode: this.inputChannelMode,
        monitoringEnabled: this.monitoringEnabled,
        monitorVolume: this.monitorVolume,
        referenceFrequency: this.referenceFrequency,
        latencyMode: this.latencyMode,
        currentPresetId: this.currentPresetId
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Falha ao persistir configurações no localStorage:', e);
    }
  }

  resetToDefaults() {
    this.inputGain = 1.2;
    this.noiseGate = 0.015;
    this.selectedDeviceId = 'default';
    this.selectedOutputDeviceId = 'default';
    this.inputChannelMode = 'ch1';
    this.monitoringEnabled = true;
    this.monitorVolume = 0.9;
    this.referenceFrequency = 440;
    this.latencyMode = 'low';
    this.currentPresetId = 'natural_clean_guitar';
    this.saveSettings();

    this.setInputChannelMode('ch1');
    this.setGain(1.2);
    this.setNoiseGate(0.015);
    this.setMonitoring(true);
    this.setMonitorVolume(0.9);
  }

  async getAudioInputDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (err) {
      console.error('Erro ao enumerar dispositivos de entrada:', err);
      return [];
    }
  }

  async getAudioOutputDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audiooutput');
    } catch (err) {
      console.error('Erro ao enumerar dispositivos de saída:', err);
      return [];
    }
  }

  async setOutputDevice(deviceId) {
    this.selectedOutputDeviceId = deviceId;
    this.saveSettings();

    if (this.audioContext && typeof this.audioContext.setSinkId === 'function' && deviceId) {
      try {
        await this.audioContext.setSinkId(deviceId === 'default' ? '' : deviceId);
      } catch (err) {
        console.warn('Erro ao definir dispositivo de saída:', err);
      }
    }
  }

  setInputChannelMode(mode) {
    this.inputChannelMode = mode;
    this.saveSettings();
    this.connectChannelRouting();
  }

  connectChannelRouting() {
    if (!this.sourceNode || !this.channelSplitter || !this.channelMerger || !this.gainNode) return;

    try {
      this.channelSplitter.disconnect();
    } catch (_) {}
    try {
      this.channelMerger.disconnect();
    } catch (_) {}

    try {
      this.sourceNode.disconnect(this.channelSplitter);
    } catch (_) {}
    this.sourceNode.connect(this.channelSplitter);

    if (this.inputChannelMode === 'ch2') {
      this.channelSplitter.connect(this.channelMerger, 1, 0); // Ch2 to L
      this.channelSplitter.connect(this.channelMerger, 1, 1); // Ch2 to R
    } else if (this.inputChannelMode === 'sum') {
      this.channelSplitter.connect(this.channelMerger, 0, 0);
      this.channelSplitter.connect(this.channelMerger, 1, 0);
      this.channelSplitter.connect(this.channelMerger, 0, 1);
      this.channelSplitter.connect(this.channelMerger, 1, 1);
    } else if (this.inputChannelMode === 'stereo') {
      this.channelSplitter.connect(this.channelMerger, 0, 0);
      this.channelSplitter.connect(this.channelMerger, 1, 1);
    } else {
      // Default 'ch1': Channel 1 (Left/Input 1) -> Both Left and Right of Merger
      this.channelSplitter.connect(this.channelMerger, 0, 0); // Ch1 to L
      this.channelSplitter.connect(this.channelMerger, 0, 1); // Ch1 to R
    }

    this.channelMerger.connect(this.gainNode);
  }

  async init(deviceId = null) {
    if (this.isRunning) {
      this.stop();
    }

    if (deviceId) {
      this.selectedDeviceId = deviceId;
      this.saveSettings();
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx({
        latencyHint: this.latencyMode === 'low' ? 'interactive' : 'playback',
        sampleRate: 44100
      });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Apply output device if saved & supported
      if (this.selectedOutputDeviceId && this.selectedOutputDeviceId !== 'default' && typeof this.audioContext.setSinkId === 'function') {
        try {
          await this.audioContext.setSinkId(this.selectedOutputDeviceId);
        } catch (e) {
          console.warn('SinkId não suportado:', e);
        }
      }

      const activeDeviceId = this.selectedDeviceId;
      const constraints = {
        audio: {
          deviceId: activeDeviceId && activeDeviceId !== 'default' ? { exact: activeDeviceId } : undefined,
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          channelCount: { ideal: 2 },
          latency: this.latencyMode === 'low' ? 0.005 : 0.015
        },
        video: false
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Stereo Channel Splitter and Merger
      this.channelSplitter = this.audioContext.createChannelSplitter(2);
      this.channelMerger = this.audioContext.createChannelMerger(2);

      // Clean Gain Node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(this.inputGain, this.audioContext.currentTime);

      // Connect channel routing
      this.connectChannelRouting();

      // Analyser Node for Pitch & Chord Detection
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = this.fftSize;
      this.analyserNode.smoothingTimeConstant = 0.2;

      // Connect Detection Branch
      this.gainNode.connect(this.analyserNode);

      // Connect Modular AmpliTube Pedalboard DSP Engine
      this.pedalDspEngine = new PedalDspEngine(this.audioContext);
      if (this.activePedals && this.activePedals.length > 0) {
        this.pedalDspEngine.rebuildChain(this.activePedals);
      }
      if (this.ampSettings) {
        this.pedalDspEngine.updateAmpSettings(this.ampSettings);
      }

      // Master Monitor Gain Node
      this.monitorGainNode = this.audioContext.createGain();
      const effectiveGain = this.monitoringEnabled ? this.monitorVolume : 0;
      this.monitorGainNode.gain.setValueAtTime(effectiveGain, this.audioContext.currentTime);

      // Connect DSP Chain: Gain -> Pedalboard DSP Engine -> Monitor Gain -> Speakers
      this.gainNode.connect(this.pedalDspEngine.inputNode);
      this.pedalDspEngine.outputNode.connect(this.monitorGainNode);
      this.monitorGainNode.connect(this.audioContext.destination);

      const sampleRate = this.audioContext.sampleRate;
      this.pitchDetector = new PitchDetector(sampleRate, this.fftSize);
      this.chordDetector = new ChordDetector(sampleRate, this.fftSize);

      this.timeDomainBuffer = new Float32Array(this.fftSize);
      this.frequencyBuffer = new Float32Array(this.analyserNode.frequencyBinCount);

      this.isRunning = true;
      this.startProcessingLoop();

      return true;
    } catch (err) {
      console.error('Falha ao inicializar AudioManager:', err);
      this.isRunning = false;
      throw err;
    }
  }

  syncPedalboard(activePedals, ampSettings) {
    if (activePedals) {
      this.activePedals = activePedals;
    }
    if (ampSettings) {
      this.ampSettings = ampSettings;
    }
    if (this.pedalDspEngine && this.audioContext) {
      if (activePedals) {
        this.pedalDspEngine.rebuildChain(activePedals);
      }
      if (ampSettings) {
        this.pedalDspEngine.updateAmpSettings(ampSettings);
      }
    }
  }

  setMonitoring(enabled) {
    this.monitoringEnabled = Boolean(enabled);
    this.saveSettings();
    if (this.monitorGainNode && this.audioContext) {
      const targetGain = this.monitoringEnabled ? this.monitorVolume : 0;
      this.monitorGainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, 0.02);
    }
  }

  setMonitorVolume(volume) {
    this.monitorVolume = Math.max(0, Math.min(2.0, volume));
    this.saveSettings();
    if (this.monitorGainNode && this.audioContext && this.monitoringEnabled) {
      this.monitorGainNode.gain.setTargetAtTime(this.monitorVolume, this.audioContext.currentTime, 0.02);
    }
  }

  setReferenceFrequency(freq) {
    this.referenceFrequency = freq;
    this.saveSettings();
  }

  setLatencyMode(mode) {
    this.latencyMode = mode;
    this.saveSettings();
  }

  setGain(value) {
    this.inputGain = value;
    this.saveSettings();
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    }
  }

  setNoiseGate(value) {
    this.noiseGate = value;
    this.saveSettings();
  }

  startProcessingLoop() {
    const processFrame = () => {
      if (!this.isRunning) return;

      this.analyserNode.getFloatTimeDomainData(this.timeDomainBuffer);
      this.analyserNode.getFloatFrequencyData(this.frequencyBuffer);

      // Calculate current input volume (RMS)
      let sum = 0;
      for (let i = 0; i < this.timeDomainBuffer.length; i++) {
        sum += this.timeDomainBuffer[i] * this.timeDomainBuffer[i];
      }
      const rms = Math.sqrt(sum / this.timeDomainBuffer.length);
      const isAudible = rms >= this.noiseGate;

      let detectedPitch = null;
      let detectedChordData = { chord: null, chromagram: new Array(12).fill(0) };

      if (isAudible) {
        // Detect single pitch
        detectedPitch = this.pitchDetector.detectPitch(this.timeDomainBuffer, this.noiseGate);

        // Detect polyphonic chord (passing detectedPitch to suppress single-note false positives)
        detectedChordData = this.chordDetector.detectChord(this.frequencyBuffer, 0.58, detectedPitch);
      }

      if (this.fxChain) {
        this.fxChain.processNoiseGate(rms);
      }

      if (this.onAudioFrame) {
        this.onAudioFrame({
          rms,
          isAudible,
          pitch: detectedPitch,
          chord: detectedChordData.chord,
          chromagram: detectedChordData.chromagram,
          timeDomainBuffer: this.timeDomainBuffer,
          frequencyBuffer: this.frequencyBuffer,
          monitoringEnabled: this.monitoringEnabled,
          noiseGate: this.noiseGate
        });
      }

      this.animationFrameId = requestAnimationFrame(processFrame);
    };

    this.animationFrameId = requestAnimationFrame(processFrame);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        console.error('Erro ao fechar AudioContext:', e);
      }
      this.audioContext = null;
    }
  }
}

// Global Singleton instance
export const globalAudio = new AudioManager();
