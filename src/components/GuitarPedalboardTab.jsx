import React, { useState, useEffect } from 'react';
import { 
  AMPLITUBE_PEDALS, 
  PEDAL_CATEGORIES, 
  ARTIST_PRESETS
} from '../data/amplitubePedals';
import {
  AMPLITUBE_AMPS,
  AMP_CATEGORIES
} from '../data/amplitubeAmps';
import { globalAudio } from '../audio/audioManager';
import { 
  Flame, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Sliders, 
  Volume2, 
  Search, 
  X, 
  Power, 
  Sparkles, 
  Check, 
  RotateCcw,
  Layers,
  HelpCircle,
  FolderOpen,
  Save,
  Radio,
  SlidersHorizontal,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Star,
  Edit3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const USER_PRESETS_STORAGE_KEY = 'fretflow_user_presets_v1';
const PINNED_PRESETS_STORAGE_KEY = 'fretflow_pinned_presets_v2';

export default function GuitarPedalboardTab({ 
  audioActive, 
  isAudible, 
  rmsLevel = 0 
}) {
  // 1. User Custom Presets from localStorage
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_PRESETS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // 2. Up to 6 Pinned / Favorite Preset IDs for the Quick Bar (defaults to 'padrao' only)
  const [pinnedPresetIds, setPinnedPresetIds] = useState(() => {
    try {
      const saved = localStorage.getItem(PINNED_PRESETS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 6);
      }
    } catch (_) {}
    return ['padrao'];
  });

  // Modal Save Preset State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [presetSaveName, setPresetSaveName] = useState('');
  const [saveMode, setSaveMode] = useState('update'); // 'update' or 'new'

  // Modal Import Preset State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Drag & Drop State for Pedals
  const [draggedPedalIndex, setDraggedPedalIndex] = useState(null);
  const [dragOverPedalIndex, setDragOverPedalIndex] = useState(null);
  const [isAmpDropTargetActive, setIsAmpDropTargetActive] = useState(false);

  // Right-Side Equipment Sidebar State (Collapsible, collapsed by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('pedals'); // 'pedals' or 'amps'
  const [sidebarPedalCategory, setSidebarPedalCategory] = useState('Todos');
  const [sidebarPedalSearch, setSidebarPedalSearch] = useState('');
  const [sidebarAmpCategory, setSidebarAmpCategory] = useState('Todos');
  const [sidebarAmpSearch, setSidebarAmpSearch] = useState('');

  // Inline Click-to-Type Knob Editing State
  const [editingKnobInfo, setEditingKnobInfo] = useState(null); // { targetType, instanceId, knobId, tempVal, min, max, unit }

  // Initial default board setup (Clean Sound: Base Amplifier only, no pedals)
  const [activePedals, setActivePedals] = useState([]);

  // Selected Amplifier Model & Settings (Clean Fender 65 Twin Reverb)
  const [selectedAmpId, setSelectedAmpId] = useState('65_twin_reverb');
  const [ampSettings, setAmpSettings] = useState({
    model: '65_twin_reverb',
    ampDspType: 'clean_blackface',
    gain: 2.8,
    bass: 5.0,
    middle: 5.0,
    treble: 5.5,
    presence: 5.0,
    master: 7.0
  });

  // Active current amp metadata
  const currentAmp = AMPLITUBE_AMPS.find(a => a.id === selectedAmpId) || AMPLITUBE_AMPS[6] || AMPLITUBE_AMPS[0];

  // Real-time synchronization with DSP Audio Engine
  useEffect(() => {
    globalAudio.syncPedalboard(activePedals, ampSettings);
  }, [activePedals, ampSettings]);

  const [selectedPresetId, setSelectedPresetId] = useState('padrao');

  // Filtered pedals in sidebar
  const filteredSidebarPedals = AMPLITUBE_PEDALS.filter(pedal => {
    const matchesCategory = sidebarPedalCategory === 'Todos' || pedal.category === sidebarPedalCategory;
    const query = sidebarPedalSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      pedal.name.toLowerCase().includes(query) || 
      pedal.gearRef.toLowerCase().includes(query) ||
      pedal.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Filtered amps in sidebar
  const filteredSidebarAmps = AMPLITUBE_AMPS.filter(amp => {
    const matchesCategory = sidebarAmpCategory === 'Todos' || amp.category === sidebarAmpCategory;
    const query = sidebarAmpSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      amp.name.toLowerCase().includes(query) || 
      amp.brand.toLowerCase().includes(query) ||
      amp.gearRef.toLowerCase().includes(query) ||
      amp.tubes.toLowerCase().includes(query) ||
      amp.cabinet.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // All combined presets (Official + Custom)
  const allPresets = [...customPresets, ...ARTIST_PRESETS];

  // Active Selected Preset Object
  const currentActivePreset = allPresets.find(p => p.id === selectedPresetId);

  // Change Amplifier
  const handleSelectAmplifier = (ampId) => {
    const amp = AMPLITUBE_AMPS.find(a => a.id === ampId) || AMPLITUBE_AMPS[0];
    setSelectedAmpId(ampId);
    setAmpSettings(prev => ({
      ...prev,
      model: ampId,
      ampDspType: amp.dspType || 'clean_blackface'
    }));
  };

  // Add pedal template to board at specific index or append
  const handleAddPedalAt = (pedalTemplate, targetIndex = null) => {
    const defaultKnobs = {};
    pedalTemplate.knobs?.forEach(k => {
      defaultKnobs[k.id] = k.default;
    });

    const defaultSwitches = {};
    pedalTemplate.switches?.forEach(s => {
      defaultSwitches[s.id] = s.default;
    });

    const newPedal = {
      ...pedalTemplate,
      instanceId: `pedal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      isBypassed: false,
      knobValues: defaultKnobs,
      switchValues: defaultSwitches
    };

    setActivePedals(prev => {
      const copy = [...prev];
      if (targetIndex === null || targetIndex >= copy.length) {
        copy.push(newPedal);
      } else {
        copy.splice(targetIndex, 0, newPedal);
      }
      return copy;
    });
  };

  // Remove pedal
  const handleRemovePedal = (instanceId) => {
    setActivePedals(prev => prev.filter(p => p.instanceId !== instanceId));
  };

  // Reorder pedal (Arrow Buttons)
  const handleMovePedal = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= activePedals.length) return;

    setActivePedals(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Drag & Drop Handlers from Sidebar or Reordering active pedals
  const handleInternalDragStart = (e, index) => {
    setDraggedPedalIndex(index);
    e.dataTransfer.effectAllowed = 'all';
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.setData('fretflow/source', 'active_pedal');
    e.dataTransfer.setData('fretflow/index', index.toString());
  };

  const handleSidebarDragStart = (e, item, type) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.setData('fretflow/source', 'sidebar');
    e.dataTransfer.setData('fretflow/type', type);
    e.dataTransfer.setData('fretflow/id', item.id);
  };

  const handlePedalSlotDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedPedalIndex !== null ? 'move' : 'copy';
    if (dragOverPedalIndex !== index) {
      setDragOverPedalIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedPedalIndex(null);
    setDragOverPedalIndex(null);
    setIsAmpDropTargetActive(false);
  };

  const handlePedalSlotDrop = (e, targetIndex) => {
    e.preventDefault();
    const source = e.dataTransfer.getData('fretflow/source');

    if (source === 'sidebar') {
      const type = e.dataTransfer.getData('fretflow/type');
      const itemId = e.dataTransfer.getData('fretflow/id');

      if (type === 'pedal') {
        const template = AMPLITUBE_PEDALS.find(p => p.id === itemId);
        if (template) {
          handleAddPedalAt(template, targetIndex);
        }
      } else if (type === 'amp') {
        handleSelectAmplifier(itemId);
      }
    } else {
      // Reordering internal active pedals
      let fromIdx = draggedPedalIndex;
      if (fromIdx === null) {
        const dataIdx = e.dataTransfer.getData('fretflow/index') || e.dataTransfer.getData('text/plain');
        if (dataIdx) {
          const parsed = parseInt(dataIdx, 10);
          if (!isNaN(parsed)) fromIdx = parsed;
        }
      }

      if (fromIdx !== null && fromIdx !== targetIndex && fromIdx >= 0 && fromIdx < activePedals.length) {
        setActivePedals(prev => {
          const copy = [...prev];
          const [draggedItem] = copy.splice(fromIdx, 1);
          copy.splice(targetIndex, 0, draggedItem);
          return copy;
        });
      }
    }

    setDraggedPedalIndex(null);
    setDragOverPedalIndex(null);
  };

  const handleAmpDrop = (e) => {
    e.preventDefault();
    setIsAmpDropTargetActive(false);
    const source = e.dataTransfer.getData('fretflow/source');
    if (source === 'sidebar') {
      const type = e.dataTransfer.getData('fretflow/type');
      const itemId = e.dataTransfer.getData('fretflow/id');
      if (type === 'amp') {
        handleSelectAmplifier(itemId);
      }
    }
  };

  // Toggle Bypass
  const handleToggleBypass = (instanceId) => {
    setActivePedals(prev => prev.map(p => {
      if (p.instanceId === instanceId) {
        return { ...p, isBypassed: !p.isBypassed };
      }
      return p;
    }));
  };

  // Update Knob Value with Range Validation
  const handleKnobChange = (instanceId, knobId, value, min, max) => {
    let parsed = parseFloat(value);
    if (isNaN(parsed)) parsed = 0;
    if (min !== undefined && parsed < min) parsed = min;
    if (max !== undefined && parsed > max) parsed = max;

    setActivePedals(prev => prev.map(p => {
      if (p.instanceId === instanceId) {
        return {
          ...p,
          knobValues: { ...p.knobValues, [knobId]: parsed }
        };
      }
      return p;
    }));
  };

  // Mouse Wheel Micro-Adjustment for Pedal Knobs
  const handleKnobWheel = (e, instanceId, knob) => {
    e.preventDefault();
    const currentVal = activePedals.find(p => p.instanceId === instanceId)?.knobValues[knob.id] ?? knob.default;
    const step = knob.unit === 'Hz' ? 20 : knob.unit === 'ms' ? 1 : 0.1;
    const delta = e.deltaY < 0 ? step : -step;
    const nextVal = Math.max(knob.min, Math.min(knob.max, parseFloat((currentVal + delta).toFixed(2))));
    handleKnobChange(instanceId, knob.id, nextVal, knob.min, knob.max);
  };

  // Mouse Wheel Micro-Adjustment for Amp Knobs
  const handleAmpKnobWheel = (e, key) => {
    e.preventDefault();
    const currentVal = ampSettings[key] || 5;
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const nextVal = Math.max(0, Math.min(10, parseFloat((currentVal + delta).toFixed(1))));
    setAmpSettings(s => ({ ...s, [key]: nextVal }));
  };

  // Update Switch Value
  const handleSwitchChange = (instanceId, switchId, option) => {
    setActivePedals(prev => prev.map(p => {
      if (p.instanceId === instanceId) {
        return {
          ...p,
          switchValues: { ...p.switchValues, [switchId]: option }
        };
      }
      return p;
    }));
  };

  // Apply Built-in Song Preset or Custom Preset
  const handleApplyPreset = (preset) => {
    if (!preset) return;
    setSelectedPresetId(preset.id);

    if (preset.ampId) {
      handleSelectAmplifier(preset.ampId);
    }

    if (preset.isCustom && preset.activePedals) {
      setActivePedals(preset.activePedals);
      if (preset.ampSettings) {
        setAmpSettings(preset.ampSettings);
        if (preset.ampSettings.model) setSelectedAmpId(preset.ampSettings.model);
      }
      return;
    }

    const newBoard = (preset.pedalIds || []).map(id => {
      const template = AMPLITUBE_PEDALS.find(p => p.id === id) || AMPLITUBE_PEDALS[0];
      const defaultKnobs = {};
      template.knobs?.forEach(k => { defaultKnobs[k.id] = k.default; });
      const defaultSwitches = {};
      template.switches?.forEach(s => { defaultSwitches[s.id] = s.default; });

      return {
        ...template,
        instanceId: `preset_${preset.id}_${id}_${Date.now()}`,
        isBypassed: false,
        knobValues: defaultKnobs,
        switchValues: defaultSwitches
      };
    });

    setActivePedals(newBoard);
  };

  // Toggle Pinned / Favorite Preset for the 6 Quick Slots
  const handleTogglePinPreset = (e, presetId) => {
    if (e) e.stopPropagation();
    let updated;
    if (pinnedPresetIds.includes(presetId)) {
      if (pinnedPresetIds.length <= 1) return;
      updated = pinnedPresetIds.filter(id => id !== presetId);
    } else {
      if (pinnedPresetIds.length >= 6) {
        updated = [...pinnedPresetIds.slice(1), presetId];
      } else {
        updated = [...pinnedPresetIds, presetId];
      }
    }
    setPinnedPresetIds(updated);
    try {
      localStorage.setItem(PINNED_PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  // Save / Update Custom Preset
  const handleConfirmSavePreset = (e) => {
    e.preventDefault();

    if (saveMode === 'update' && currentActivePreset?.isCustom) {
      const updatedList = customPresets.map(p => {
        if (p.id === currentActivePreset.id) {
          return {
            ...p,
            activePedals: JSON.parse(JSON.stringify(activePedals)),
            ampSettings: JSON.parse(JSON.stringify(ampSettings)),
            ampId: selectedAmpId
          };
        }
        return p;
      });

      setCustomPresets(updatedList);
      try {
        localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (_) {}

      setIsSaveModalOpen(false);
      return;
    }

    if (!presetSaveName.trim()) return;

    const newCustom = {
      id: `custom_${Date.now()}`,
      name: presetSaveName.trim(),
      artist: '',
      description: `Preset com ${activePedals.length} pedais e amplificador ${currentAmp.name}`,
      isCustom: true,
      activePedals: JSON.parse(JSON.stringify(activePedals)),
      ampSettings: JSON.parse(JSON.stringify(ampSettings)),
      ampId: selectedAmpId
    };

    const updated = [newCustom, ...customPresets];
    setCustomPresets(updated);
    try {
      localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    if (!pinnedPresetIds.includes(newCustom.id)) {
      const newPins = pinnedPresetIds.length >= 6 
        ? [...pinnedPresetIds.slice(1), newCustom.id]
        : [...pinnedPresetIds, newCustom.id];
      setPinnedPresetIds(newPins);
      try {
        localStorage.setItem(PINNED_PRESETS_STORAGE_KEY, JSON.stringify(newPins));
      } catch (_) {}
    }

    setSelectedPresetId(newCustom.id);
    setPresetSaveName('');
    setIsSaveModalOpen(false);
  };

  // Delete Custom Preset
  const handleDeleteCustomPreset = (e, presetId) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== presetId);
    setCustomPresets(updated);
    try {
      localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}

    if (pinnedPresetIds.includes(presetId)) {
      const newPins = pinnedPresetIds.filter(id => id !== presetId);
      setPinnedPresetIds(newPins.length ? newPins : ['padrao']);
      try {
        localStorage.setItem(PINNED_PRESETS_STORAGE_KEY, JSON.stringify(newPins));
      } catch (_) {}
    }

    if (selectedPresetId === presetId) {
      handleApplyPreset(ARTIST_PRESETS[0]);
    }
  };

  // Smart Pedal & Amp Resolvers for AI Import
  const resolvePedalTemplate = (rawId) => {
    if (!rawId) return AMPLITUBE_PEDALS[0];
    const idClean = String(rawId).toLowerCase().trim();

    let found = AMPLITUBE_PEDALS.find(p => p.id === rawId || p.id.toLowerCase() === idClean);
    if (found) return found;

    const ALIAS_MAP = {
      'noise_killer': 'noise_gate',
      'noisekiller': 'noise_gate',
      'noise_suppressor': 'noise_gate',
      'noisegate': 'noise_gate',
      'gate_pedal': 'gate',
      'studio_reverb': 'x_space',
      'reverb_studio': 'x_space',
      'digital_reverb': 'x_space',
      'spring_reverb': 'reverb_63',
      'reverb': 'reverb_63',
      'plate_reverb': 'x_space',
      'hall_reverb': 'x_space',
      'delay_standard': 'delay_standard',
      'digital_delay': 'ddelay',
      'analog_delay': 'sax_ad',
      'ts9': 'overscream',
      'ts808': 'overscream',
      'tube_screamer': 'overscream',
      'tubescreamer': 'overscream',
      'ds1': 'distortion_ds1',
      'boss_ds1': 'distortion_ds1',
      'rat': 'prodrive',
      'proco_rat': 'prodrive',
      'metal_zone': 'metal_distortion',
      'whammy': 'wharmonator',
      'chorus': 'analog_chorus',
      'small_clone': 'nirvana',
      'phase90': 'phaze_nine',
      'phase_90': 'phaze_nine',
      'ce2': 'chorus_1',
      'ce1': 'chorus_1',
      'big_muff': 'bigpig',
      'bigmuff': 'bigpig',
      'fuzz_face': 'fuzz_age',
      'dyna_comp': 'dcomp'
    };

    if (ALIAS_MAP[idClean]) {
      found = AMPLITUBE_PEDALS.find(p => p.id === ALIAS_MAP[idClean]);
      if (found) return found;
    }

    const normSearch = idClean.replace(/[_\-\s]/g, '');
    found = AMPLITUBE_PEDALS.find(p => p.id.replace(/[_\-\s]/g, '') === normSearch);
    if (found) return found;

    found = AMPLITUBE_PEDALS.find(p => 
      p.name.toLowerCase().includes(idClean) || 
      p.gearRef.toLowerCase().includes(idClean) ||
      idClean.includes(p.id.toLowerCase())
    );
    if (found) return found;

    if (idClean.includes('reverb')) return AMPLITUBE_PEDALS.find(p => p.category === 'Reverb') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('gate') || idClean.includes('noise')) return AMPLITUBE_PEDALS.find(p => p.id === 'noise_gate' || p.id === 'gate') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('delay') || idClean.includes('echo')) return AMPLITUBE_PEDALS.find(p => p.category === 'Delay') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('fuzz')) return AMPLITUBE_PEDALS.find(p => p.category === 'Fuzz') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('dist') || idClean.includes('drive') || idClean.includes('lead')) return AMPLITUBE_PEDALS.find(p => p.category === 'Distortion') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('chorus') || idClean.includes('flang') || idClean.includes('phase') || idClean.includes('trem')) return AMPLITUBE_PEDALS.find(p => p.category === 'Modulation') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('wah')) return AMPLITUBE_PEDALS.find(p => p.category === 'Filter') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('comp')) return AMPLITUBE_PEDALS.find(p => p.category === 'Dynamics') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('pitch') || idClean.includes('oct')) return AMPLITUBE_PEDALS.find(p => p.category === 'Pitch') || AMPLITUBE_PEDALS[0];
    if (idClean.includes('eq')) return AMPLITUBE_PEDALS.find(p => p.category === 'EQ') || AMPLITUBE_PEDALS[0];

    return AMPLITUBE_PEDALS[0];
  };

  const resolveAmpTemplate = (rawId) => {
    if (!rawId) return AMPLITUBE_AMPS[0];
    const idClean = String(rawId).toLowerCase().trim();

    let found = AMPLITUBE_AMPS.find(a => a.id === rawId || a.id.toLowerCase() === idClean);
    if (found) return found;

    const AMP_ALIASES = {
      'jcm800': 'brit_8000',
      'jcm900': 'brit_9000',
      'plexi': 'british_lead_s100',
      'twin': '65_twin_reverb',
      'twin_reverb': '65_twin_reverb',
      'ac30': 'british_blue_tube_30tb',
      'rectifier': 'dual_rectifier',
      'recto': 'dual_rectifier',
      'orange': 'rockerverb_50',
      '5150': 'metal_lead_v',
      '6505': 'metal_lead_v',
      'jc120': 'jazz_amp_120',
      'svt': 'svx_cl'
    };

    if (AMP_ALIASES[idClean]) {
      found = AMPLITUBE_AMPS.find(a => a.id === AMP_ALIASES[idClean]);
      if (found) return found;
    }

    const normSearch = idClean.replace(/[_\-\s]/g, '');
    found = AMPLITUBE_AMPS.find(a => a.id.replace(/[_\-\s]/g, '') === normSearch);
    if (found) return found;

    found = AMPLITUBE_AMPS.find(a => 
      a.name.toLowerCase().includes(idClean) || 
      a.gearRef.toLowerCase().includes(idClean) ||
      idClean.includes(a.id.toLowerCase())
    );
    if (found) return found;

    return AMPLITUBE_AMPS[0];
  };

  // Import Preset from JSON
  const handleConfirmImportJson = (e) => {
    e.preventDefault();
    setImportError('');
    setImportSuccess(false);

    try {
      let cleanJson = importJsonText.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleanJson);
      const presetList = Array.isArray(parsed) ? parsed : [parsed];
      if (presetList.length === 0) throw new Error('Nenhum preset válido encontrado.');

      let lastImportedId = null;
      const newCustomList = [...customPresets];

      for (const p of presetList) {
        if (!p.name) throw new Error("O preset precisa ter pelo menos um 'name'.");

        const matchedAmp = resolveAmpTemplate(p.ampId);

        const ampKnobs = {
          gain: 3.5,
          bass: 5.0,
          middle: 5.0,
          treble: 5.5,
          presence: 5.0,
          master: 7.0,
          ...(p.ampKnobs || {}),
          model: matchedAmp.id,
          ampDspType: matchedAmp.dspType || 'clean_blackface'
        };

        const rawPedals = p.pedals || [];
        const builtPedals = rawPedals.map(rp => {
          const pedalId = typeof rp === 'string' ? rp : rp.id;
          const template = resolvePedalTemplate(pedalId);

          const defaultKnobs = {};
          template.knobs?.forEach(k => { defaultKnobs[k.id] = k.default; });
          if (rp.knobs) {
            Object.keys(rp.knobs).forEach(rk => {
              const matchedKnob = template.knobs?.find(k => k.id.toLowerCase() === rk.toLowerCase());
              if (matchedKnob) {
                defaultKnobs[matchedKnob.id] = rp.knobs[rk];
              } else {
                defaultKnobs[rk] = rp.knobs[rk];
              }
            });
          }

          const defaultSwitches = {};
          template.switches?.forEach(s => { defaultSwitches[s.id] = s.default; });
          if (rp.switches) {
            Object.assign(defaultSwitches, rp.switches);
          }

          return {
            ...template,
            instanceId: `import_${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            isBypassed: rp.isBypassed !== undefined ? !!rp.isBypassed : false,
            knobValues: defaultKnobs,
            switchValues: defaultSwitches
          };
        });

        const newPresetObj = {
          id: `custom_ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: p.name,
          artist: p.artist || '',
          description: p.description || `Preset com ${builtPedals.length} pedais e amplificador ${matchedAmp.name}`,
          isCustom: true,
          activePedals: builtPedals,
          ampSettings: ampKnobs,
          ampId: matchedAmp.id
        };

        newCustomList.unshift(newPresetObj);
        lastImportedId = newPresetObj.id;
      }

      setCustomPresets(newCustomList);
      try {
        localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(newCustomList));
      } catch (_) {}

      const firstImported = newCustomList.find(p => p.id === lastImportedId);
      if (firstImported) {
        handleApplyPreset(firstImported);
      }

      setImportSuccess(true);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportJsonText('');
        setImportSuccess(false);
      }, 600);

    } catch (err) {
      setImportError(`Erro ao importar: ${err.message || 'JSON inválido'}`);
    }
  };

  // Sample JSON Template
  const sampleJsonTemplate = JSON.stringify({
    "name": "Sweet Child O' Mine",
    "artist": "Guns N' Roses",
    "description": "Timbre clássico de Slash com Wah, OverScream e JCM800",
    "ampId": "brit_8000",
    "ampKnobs": {
      "gain": 7.0,
      "bass": 6.5,
      "middle": 7.0,
      "treble": 6.0,
      "presence": 6.5,
      "master": 7.5
    },
    "pedals": [
      {
        "id": "wah_gcb95",
        "isBypassed": false,
        "knobs": { "pedal": 65 }
      },
      {
        "id": "overscream",
        "isBypassed": false,
        "knobs": { "overdrive": 5.0, "tone": 6.5, "level": 7.5 }
      },
      {
        "id": "ddelay",
        "isBypassed": false,
        "knobs": { "time": 360, "feedback": 25, "mix": 30 }
      },
      {
        "id": "reverb_63",
        "isBypassed": false,
        "knobs": { "dwell": 4.5, "tone": 5.0, "mix": 25 }
      }
    ]
  }, null, 2);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleJsonTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // Render pinned presets for the quick bar (up to 6, with fallback)
  const validQuickPresets = pinnedPresetIds
    .map(id => allPresets.find(p => p.id === id))
    .filter(Boolean);
  const displayedQuickPresets = validQuickPresets.length > 0
    ? validQuickPresets.slice(0, 6)
    : [allPresets.find(p => p.id === 'padrao') || allPresets[0]].filter(Boolean);

  return (
    <div className="flex flex-col xl:flex-row items-stretch gap-5 max-w-[1700px] mx-auto select-none font-sans animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* 1. MAIN BOARD COLUMN (LEFT / CENTER) */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 w-full space-y-5 flex flex-col transition-all duration-300">
        
        {/* PRESET TOOLBAR & HEADER */}
        <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-oficina-surface text-oficina-darkText border border-oficina-border rounded-sm">
                <Flame className="w-5 h-5 text-oficina-terracotta" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-oficina-darkText">
                  Pedaleira e Efeitos
                </h2>
                <p className="text-xs text-oficina-bodyText">
                  Monte sua cadeia de sinal arrastando equipamentos da barra lateral
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Import Preset Button */}
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2 bg-oficina-surface hover:bg-oficina-card border border-oficina-border hover:border-oficina-darkText font-mono font-bold text-xs text-oficina-darkText rounded-sm transition shadow-sm flex items-center gap-1.5"
                title="Importar preset colando o JSON"
              >
                <Download className="w-4 h-4 text-oficina-olive" />
                <span>Importar Preset</span>
              </button>

              {/* Save / Update Preset Button */}
              <button
                onClick={() => {
                  setSaveMode(currentActivePreset?.isCustom ? 'update' : 'new');
                  setPresetSaveName(currentActivePreset?.isCustom ? currentActivePreset.name : '');
                  setIsSaveModalOpen(true);
                }}
                className="px-3.5 py-2 bg-oficina-surface hover:bg-oficina-card border border-oficina-border hover:border-oficina-darkText font-mono font-bold text-xs text-oficina-darkText rounded-sm transition shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-oficina-terracotta" />
                <span>{currentActivePreset?.isCustom ? 'Salvar / Atualizar' : 'Salvar Preset'}</span>
              </button>
            </div>
          </div>

          {/* Action Controls & Preset Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-oficina-borderLight font-mono text-xs">
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-oficina-terracotta uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-oficina-terracotta" />
                <span>PRESETS FAVORITOS:</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Dropdown with all presets */}
              <select
                value={selectedPresetId || 'padrao'}
                onChange={(e) => {
                  const found = allPresets.find(p => p.id === e.target.value);
                  if (found) handleApplyPreset(found);
                }}
                className="bg-oficina-surface text-xs font-mono font-bold text-oficina-darkText border border-oficina-border rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-oficina-darkText"
              >
                {allPresets.map(p => (
                  <option key={p.id} value={p.id}>
                    {pinnedPresetIds.includes(p.id) ? '★ ' : '   '}
                    {p.artist && p.artist !== 'Meu Preset' && p.artist !== 'Preset IA' && p.artist.trim() !== '' ? `${p.name} (${p.artist})` : p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setActivePedals([]);
                  setSelectedPresetId('padrao');
                  handleSelectAmplifier('65_twin_reverb');
                }}
                className="px-2.5 py-1.5 bg-oficina-surface border border-oficina-border text-[11px] text-oficina-mutedText hover:text-rose-600 hover:border-rose-300 font-bold rounded-sm transition flex items-center gap-1"
                title="Limpar todos os pedais e voltar ao som limpo do amplificador base"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            </div>

          </div>

          {/* Presets Grid (Strictly 6 Favorited Slots - Left Aligned Text) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full font-mono">
            {displayedQuickPresets.map(preset => {
              const isSelected = selectedPresetId === preset.id;
              const isPinned = pinnedPresetIds.includes(preset.id);

              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 pl-7 pr-3 rounded-[2px] border text-left transition flex flex-col items-start justify-center gap-0.5 overflow-hidden cursor-pointer relative group ${
                    isSelected
                      ? 'bg-oficina-chassis text-[#f3f1ec] border-oficina-chassis shadow-sm'
                      : 'bg-oficina-surface border-oficina-border text-oficina-darkText hover:border-oficina-borderDark'
                  }`}
                  title={preset.name}
                >
                  {/* Pin/Favorite Toggle Star Button */}
                  <button
                    onClick={(e) => handleTogglePinPreset(e, preset.id)}
                    className={`absolute top-2.5 left-2 p-0.5 rounded transition ${
                      isPinned ? 'text-amber-400 opacity-90' : 'text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                    }`}
                    title={isPinned ? 'Desfavoritar' : 'Favoritar'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  </button>

                  {preset.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomPreset(e, preset.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-rose-500/20 text-rose-400 rounded transition"
                      title="Excluir preset salvo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  <span className="text-xs font-bold truncate w-full text-left block" title={preset.name}>
                    {preset.name}
                  </span>
                  {preset.artist && preset.artist !== 'Meu Preset' && preset.artist !== 'Preset IA' && preset.artist.trim() !== '' && (
                    <span className="text-[9px] opacity-70 truncate w-full text-left block">{preset.artist}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Preset Description Banner with Instant Favorite Toggle */}
          {selectedPresetId && (
            <div className="bg-oficina-surface border border-oficina-border rounded-sm p-2.5 px-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs text-oficina-bodyText font-mono">
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2 h-2 rounded-full bg-oficina-terracotta shrink-0"></span>
                <span className="font-bold text-oficina-darkText shrink-0">
                  {currentActivePreset?.name}
                  {currentActivePreset?.description ? ':' : ''}
                </span>
                <span className="truncate">
                  {currentActivePreset?.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleTogglePinPreset(e, selectedPresetId)}
                  className={`px-2.5 py-1 rounded-[2px] font-bold text-[11px] transition flex items-center gap-1.5 border ${
                    pinnedPresetIds.includes(selectedPresetId)
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'bg-oficina-card text-oficina-darkText border-oficina-border hover:border-oficina-darkText'
                  }`}
                  title={pinnedPresetIds.includes(selectedPresetId) ? 'Desfavoritar este preset' : 'Favoritar este preset'}
                >
                  <Star className={`w-3.5 h-3.5 ${pinnedPresetIds.includes(selectedPresetId) ? 'fill-current text-amber-500' : 'text-oficina-mutedText'}`} />
                  <span>{pinnedPresetIds.includes(selectedPresetId) ? 'Favorito' : 'Favoritar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PHYSICAL SIGNAL CHAIN STAGE */}
        <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-6 shadow-sm space-y-4">
          
          {/* Signal Path Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-bold text-oficina-mutedText uppercase tracking-wider border-b border-oficina-borderLight pb-2">
            <div className="flex items-center gap-2">
              <span className="text-oficina-terracotta">● ENTRADA</span>
              <span>→</span>
              <span className="text-oficina-darkText">{activePedals.length} PEDAIS NA CADEIA</span>
              <span>→</span>
              <span className="text-oficina-olive">{currentAmp.name}</span>
              <span>→</span>
              <span className="text-oficina-oliveGlow">SAÍDA MASTER</span>
            </div>
            <div className="flex items-center gap-2">
              {!isSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-2.5 py-1 rounded-[2px] bg-oficina-terracotta/10 hover:bg-oficina-terracotta/20 text-oficina-terracotta border border-oficina-terracotta/30 font-mono text-[10px] font-extrabold flex items-center gap-1.5 transition shadow-xs"
                  title="Abrir catálogo de 110 pedais e 111 amplificadores"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>+ ABRIR EQUIPAMENTOS</span>
                </button>
              )}
              <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-[2px] border border-amber-500/20 font-sans normal-case text-[11px]">
                Use fones de ouvido para retorno direto sem microfonia
              </span>
            </div>
          </div>

          {/* Scrollable Stompbox Rack + Amplifier (with Drag & Drop Dropzones) */}
          <div className="overflow-x-auto custom-scrollbar pb-3">
            <div className="flex items-start gap-4 min-w-max">

              {/* ACTIVE PEDALS IN CHAIN */}
              {activePedals.map((pedal, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === activePedals.length - 1;
                const isDragging = draggedPedalIndex === idx;
                const isOver = dragOverPedalIndex === idx;

                return (
                  <div
                    key={pedal.instanceId}
                    onDragOver={(e) => handlePedalSlotDragOver(e, idx)}
                    onDrop={(e) => handlePedalSlotDrop(e, idx)}
                    className={`w-56 rounded-sm border p-4 flex flex-col justify-between shadow-md transition-all relative shrink-0 min-h-[440px] ${
                      isDragging ? 'opacity-40 scale-95' : 'opacity-100'
                    } ${
                      isOver ? 'ring-2 ring-oficina-terracotta scale-105 shadow-xl' : ''
                    }`}
                    style={{
                      backgroundColor: pedal.chassis.bg,
                      borderColor: pedal.chassis.border,
                      color: pedal.chassis.text
                    }}
                  >
                    {/* Top Action Header with High-Contrast Drag Gripper Handle */}
                    <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: `${pedal.chassis.border}88` }}>
                      <div className="flex items-center gap-1">
                        
                        {/* ONLY THIS GRIPPER IS DRAGGABLE FOR REORDERING */}
                        <div 
                          draggable={true}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            handleInternalDragStart(e, idx);
                          }}
                          onDragEnd={handleDragEnd}
                          className="p-1 cursor-grab active:cursor-grabbing rounded-[2px] transition flex items-center justify-center border border-black/20 hover:scale-110 shadow-inner"
                          style={{
                            backgroundColor: `${pedal.chassis.text}22`,
                            color: pedal.chassis.text
                          }}
                          title="Segure e arraste este ícone para mover o pedal de lugar"
                        >
                          <GripVertical className="w-4 h-4" style={{ color: pedal.chassis.text }} />
                        </div>

                        {/* Arrow Reorder Buttons */}
                        <button
                          disabled={isFirst}
                          onClick={() => handleMovePedal(idx, -1)}
                          className={`p-1 rounded-[2px] transition ${
                            isFirst ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/20'
                          }`}
                          title="Mover para a esquerda"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => handleMovePedal(idx, 1)}
                          className={`p-1 rounded-[2px] transition ${
                            isLast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/20'
                          }`}
                          title="Mover para a direita"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-75">
                        {pedal.category}
                      </span>

                      <button
                        onClick={() => handleRemovePedal(pedal.instanceId)}
                        className="p-1 hover:bg-rose-500/20 text-rose-300 rounded-[2px] transition"
                        title="Remover Pedal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Pedal Brand Name & Reference */}
                    <div className="text-center space-y-0.5 my-1">
                      <h3 className="font-black text-sm tracking-wide uppercase truncate font-sans">
                        {pedal.name}
                      </h3>
                      <div className="font-mono text-[9px] opacity-70 truncate" title={pedal.gearRef}>
                        {pedal.gearRef}
                      </div>
                    </div>

                    {/* Rotary Knobs Stage with Fine Step & Click-to-Type Edit */}
                    <div className="grid grid-cols-2 gap-2.5 my-2.5">
                      {pedal.knobs?.map(knob => {
                        const currentVal = pedal.knobValues[knob.id] !== undefined ? pedal.knobValues[knob.id] : knob.default;
                        const isEditing = editingKnobInfo?.instanceId === pedal.instanceId && editingKnobInfo?.knobId === knob.id;
                        const stepVal = knob.unit === 'Hz' ? 10 : knob.unit === 'ms' ? 1 : 0.1;

                        return (
                          <div key={knob.id} className="flex flex-col items-center space-y-1">
                            <label className="font-mono text-[9px] font-bold tracking-wider opacity-90 truncate w-full text-center">
                              {knob.label}
                            </label>
                            
                            {/* Rotary Slider */}
                            <input
                              type="range"
                              min={knob.min}
                              max={knob.max}
                              step={stepVal}
                              value={currentVal}
                              onWheel={(e) => handleKnobWheel(e, pedal.instanceId, knob)}
                              onChange={(e) => handleKnobChange(pedal.instanceId, knob.id, e.target.value, knob.min, knob.max)}
                              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-white"
                              title={`Ajuste fino: ${currentVal}${knob.unit}. Use a rodinha do mouse ou clique no número abaixo para digitar.`}
                            />

                            {/* Editable Value Badge */}
                            {isEditing ? (
                              <input
                                type="number"
                                autoFocus
                                step={stepVal}
                                min={knob.min}
                                max={knob.max}
                                value={editingKnobInfo.tempVal}
                                onChange={(e) => setEditingKnobInfo(prev => ({ ...prev, tempVal: e.target.value }))}
                                onBlur={() => {
                                  handleKnobChange(pedal.instanceId, knob.id, editingKnobInfo.tempVal, knob.min, knob.max);
                                  setEditingKnobInfo(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleKnobChange(pedal.instanceId, knob.id, editingKnobInfo.tempVal, knob.min, knob.max);
                                    setEditingKnobInfo(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingKnobInfo(null);
                                  }
                                }}
                                className="w-16 h-5 px-1 text-center bg-black text-white font-mono text-[10px] font-bold rounded border border-white focus:outline-none"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingKnobInfo({ instanceId: pedal.instanceId, knobId: knob.id, tempVal: currentVal })}
                                className="font-mono text-[9px] font-bold opacity-80 hover:opacity-100 hover:bg-black/30 px-1 py-0.5 rounded cursor-text flex items-center gap-0.5"
                                title="Clique para digitar o valor exato no teclado"
                              >
                                <span>{typeof currentVal === 'number' && currentVal % 1 !== 0 ? currentVal.toFixed(1) : currentVal}{knob.unit}</span>
                                <Edit3 className="w-2.5 h-2.5 opacity-40" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mode Switches if available */}
                    {pedal.switches && pedal.switches.length > 0 && (
                    <div className="space-y-1.5 my-2 pt-2 border-t" style={{ borderColor: `${pedal.chassis.border}88` }}>
                      {pedal.switches.map(sw => {
                        const activeOpt = pedal.switchValues[sw.id] || sw.default;

                        return (
                          <div key={sw.id} className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold opacity-75">{sw.label}:</span>
                            <div className="flex gap-1">
                              {sw.options.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => handleSwitchChange(pedal.instanceId, sw.id, opt)}
                                  className={`px-1.5 py-0.5 rounded-[2px] font-bold text-[9px] transition ${
                                    activeOpt === opt
                                      ? 'bg-white text-black shadow-sm font-black'
                                      : 'bg-black/30 text-white/80 hover:bg-black/50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    )}

                    {/* Footswitch & Glowing LED Section */}
                    <div className="pt-3 pb-2 mt-auto flex flex-col items-center gap-2 border-t border-black/20">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 border border-black/30">
                        <span 
                          className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: !pedal.isBypassed ? pedal.chassis.led : '#52525b',
                            boxShadow: !pedal.isBypassed ? `0 0 8px ${pedal.chassis.led}` : 'none'
                          }}
                        />
                        <span className="font-mono text-[8px] font-bold tracking-widest uppercase">
                          {!pedal.isBypassed ? 'ON' : 'OFF'}
                        </span>
                      </div>

                      <div className="p-1 rounded-full bg-black/20 shadow-inner">
                        <button
                          onClick={() => handleToggleBypass(pedal.instanceId)}
                          className="w-11 h-11 rounded-full border border-[#cbd5e1] bg-gradient-to-b from-[#f8fafc] via-[#cbd5e1] to-[#64748b] shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center cursor-pointer"
                          title={pedal.isBypassed ? 'Ligar Pedal' : 'Desligar (Bypass)'}
                        >
                          <div className="w-7 h-7 rounded-full border border-black/20 bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] flex items-center justify-center shadow-inner">
                            <Power className={`w-3.5 h-3.5 ${!pedal.isBypassed ? 'text-emerald-800 font-bold' : 'text-zinc-600'}`} />
                          </div>
                        </button>
                      </div>
                      
                      <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider">
                        {!pedal.isBypassed ? 'ATIVO' : 'BYPASS'}
                      </span>
                    </div>

                  </div>
                );
              })}

              {/* EMPTY RACK PLACEHOLDER (ONLY IF NO PEDALS) */}
              {activePedals.length === 0 && (
                <div
                  onDragOver={(e) => handlePedalSlotDragOver(e, 0)}
                  onDrop={(e) => handlePedalSlotDrop(e, 0)}
                  onClick={() => {
                    setIsSidebarOpen(true);
                    setSidebarTab('pedals');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsSidebarOpen(true);
                      setSidebarTab('pedals');
                    }
                  }}
                  title="Clique para abrir o catálogo de pedais"
                  className={`w-52 rounded-sm border-2 border-dashed p-6 flex flex-col items-center justify-center space-y-2 transition shrink-0 min-h-[440px] text-center cursor-pointer group ${
                    dragOverPedalIndex === 0 
                      ? 'border-oficina-terracotta bg-oficina-terracotta/10 scale-105 shadow-xl' 
                      : 'border-oficina-border bg-oficina-surface/50 text-oficina-mutedText hover:border-oficina-terracotta hover:bg-oficina-surface'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSidebarOpen(true);
                      setSidebarTab('pedals');
                    }}
                    className="p-3 rounded-full bg-oficina-card border border-oficina-border shadow-sm group-hover:border-oficina-terracotta group-hover:scale-110 transition cursor-pointer"
                    title="Abrir catálogo de pedais"
                  >
                    <Plus className="w-6 h-6 text-oficina-terracotta" />
                  </button>
                  <span className="font-mono text-xs font-bold uppercase text-oficina-darkText group-hover:text-oficina-terracotta transition-colors">
                    Rack Vazio
                  </span>
                  <span className="text-[10px] text-oficina-mutedText text-center max-w-[130px] group-hover:text-oficina-bodyText transition-colors">
                    Arraste pedais da barra lateral à direita ou clique no "+"
                  </span>
                </div>
              )}

              {/* DYNAMIC AMPLIFIER STAGE (DROPPABLE FOR AMPS) */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                  setIsAmpDropTargetActive(true);
                }}
                onDragLeave={() => setIsAmpDropTargetActive(false)}
                onDrop={handleAmpDrop}
                className={`w-80 rounded-sm border-2 p-4 flex flex-col justify-between shadow-2xl shrink-0 min-h-[440px] transition-all duration-200 relative ${
                  isAmpDropTargetActive ? 'ring-4 ring-oficina-terracotta scale-105 shadow-2xl' : ''
                }`}
                style={{
                  backgroundColor: currentAmp.chassis.bg,
                  borderColor: currentAmp.chassis.border,
                  color: currentAmp.chassis.text
                }}
              >
                {isAmpDropTargetActive && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center rounded-sm z-20 font-mono font-black text-amber-400 text-xs tracking-wider">
                    ⚡ SOLTE O AMPLIFICADOR AQUI ⚡
                  </div>
                )}

                <div>
                  {/* Amp Header & Model Selector */}
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: `${currentAmp.chassis.border}88` }}>
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-oficina-terracotta flex items-center gap-1">
                      <Radio className="w-3 h-3 text-oficina-terracotta" />
                      <span>AMP STAGE</span>
                    </span>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-[2px] font-bold bg-black/40 text-amber-300 border border-amber-500/40">
                      {currentAmp.category}
                    </span>
                  </div>

                  {/* Model Selector Button & Info */}
                  <div className="my-2.5">
                    <label className="font-mono text-[9px] font-bold opacity-75 uppercase block mb-1">
                      CABEÇOTE ATIVO ({currentAmp.brand}):
                    </label>

                    <select
                      value={selectedAmpId}
                      onChange={(e) => handleSelectAmplifier(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-[2px] px-2 py-1.5 font-mono text-xs font-bold text-white focus:outline-none cursor-pointer"
                    >
                      {AMPLITUBE_AMPS.map(amp => (
                        <option key={amp.id} value={amp.id} className="bg-zinc-900 text-white">
                          [{amp.category}] {amp.name} ({amp.brand})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amp Info Banner */}
                  <div className="text-center py-1.5 space-y-0.5 border-y my-2" style={{ borderColor: `${currentAmp.chassis.border}55` }}>
                    <h3 className="font-black text-sm tracking-wider uppercase truncate">
                      {currentAmp.name}
                    </h3>
                    <div className="font-mono text-[9px] opacity-75 truncate" title={currentAmp.gearRef}>
                      {currentAmp.tubes}
                    </div>
                  </div>

                  {/* Amp Tone Stack Knobs */}
                  <div className="grid grid-cols-3 gap-2 my-3 font-mono text-[9px]">
                    {['gain', 'bass', 'middle', 'treble', 'presence', 'master'].map(k => (
                      <div key={k} className="flex flex-col items-center space-y-1">
                        <span className="opacity-80 font-bold uppercase">{k}</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={ampSettings[k]}
                          onWheel={(e) => handleAmpKnobWheel(e, k)}
                          onChange={(e) => setAmpSettings(s => ({ ...s, [k]: parseFloat(e.target.value) }))}
                          className="w-full h-1 bg-black/50 rounded accent-oficina-terracotta cursor-pointer"
                        />
                        <span className="font-bold">{ampSettings[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speaker Grille Cloth Texture */}
                <div className="h-16 w-full rounded-[2px] border border-black/40 bg-[#0f0e0d] p-2 flex items-center justify-between relative overflow-hidden mt-3 shadow-inner">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:6px_6px]"></div>
                  
                  <div className="z-10 flex flex-col justify-center">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-wider opacity-60">Gabinete Emulado:</span>
                    <span className="font-mono text-[10px] font-extrabold truncate max-w-[180px]">
                      {currentAmp.cabinet.replace('Gabinete ', '')}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full border-2 border-white/20 bg-black/60 flex items-center justify-center z-10 shadow-md">
                    <span className="font-mono text-[8px] font-black text-amber-400">CAB</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. RECOLHÍVEL RIGHT-SIDE EQUIPMENT SIDEBAR (PEDAIS & AMPS) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. RECOLHÍVEL RIGHT-SIDE EQUIPMENT SIDEBAR (PEDAIS & AMPS) */}
      {/* ========================================================================= */}
      <div 
        className={`relative shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? 'w-full xl:w-80 2xl:w-96 min-h-[520px] xl:min-h-0' 
            : 'w-full xl:w-14 min-h-[56px] xl:min-h-0'
        }`}
      >
        {isSidebarOpen ? (
          <div className="absolute inset-0 bg-oficina-card border border-oficina-border rounded-sm p-4 flex flex-col shadow-sm space-y-4 overflow-hidden animate-fadeIn">
            {/* Sidebar Header */}
            <div className="border-b border-oficina-border pb-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-oficina-terracotta" />
                <h3 className="font-extrabold text-sm text-oficina-darkText uppercase tracking-wider">
                  Equipamentos
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-oficina-olive bg-oficina-oliveLight px-2 py-0.5 rounded-sm">
                  Arraste
                </span>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-oficina-mutedText hover:text-oficina-darkText rounded hover:bg-black/10 transition"
                  title="Recolher catálogo de equipamentos"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Switcher: Pedais vs Amplificadores */}
            <div className="flex p-1 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs shrink-0">
              <button
                type="button"
                onClick={() => setSidebarTab('pedals')}
                className={`flex-1 py-1.5 rounded-[2px] font-bold transition flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'pedals'
                    ? 'bg-oficina-chassis text-white shadow-sm font-black'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
              >
                <span>Pedais</span>
                <span className="text-[10px] opacity-75">({AMPLITUBE_PEDALS.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSidebarTab('amps')}
                className={`flex-1 py-1.5 rounded-[2px] font-bold transition flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'amps'
                    ? 'bg-oficina-chassis text-white shadow-sm font-black'
                    : 'text-oficina-bodyText hover:text-oficina-darkText'
                }`}
              >
                <span>Amps</span>
                <span className="text-[10px] opacity-75">({AMPLITUBE_AMPS.length})</span>
              </button>
            </div>

            {/* PEDAIS TAB VIEW */}
            {sidebarTab === 'pedals' && (
              <div className="space-y-3 flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Search Input */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-oficina-mutedText absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar pedais..."
                    value={sidebarPedalSearch}
                    onChange={(e) => setSidebarPedalSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs text-oficina-darkText placeholder:text-oficina-mutedText focus:outline-none"
                  />
                  {sidebarPedalSearch && (
                    <button
                      onClick={() => setSidebarPedalSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-oficina-mutedText hover:text-oficina-darkText"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Chips Filter */}
                <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 font-mono text-[10px] shrink-0">
                  {PEDAL_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSidebarPedalCategory(category)}
                      className={`px-2 py-1 rounded-[2px] font-bold border transition shrink-0 ${
                        sidebarPedalCategory === category
                          ? 'bg-oficina-chassis text-white border-oficina-chassis'
                          : 'bg-oficina-surface border-oficina-border text-oficina-bodyText hover:border-oficina-borderDark'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Scrollable Pedals List */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {filteredSidebarPedals.map(pedal => (
                    <div
                      key={pedal.id}
                      draggable={true}
                      onDragStart={(e) => handleSidebarDragStart(e, pedal, 'pedal')}
                      className="p-2.5 rounded-sm border transition flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing hover:scale-[1.01] shadow-xs group"
                      style={{
                        backgroundColor: pedal.chassis.bg,
                        borderColor: pedal.chassis.border,
                        color: pedal.chassis.text
                      }}
                      title="Clique e arraste este pedal para a pedaleira"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: pedal.chassis.led, boxShadow: `0 0 5px ${pedal.chassis.led}` }}
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs uppercase truncate">
                              {pedal.name}
                            </span>
                            <span className="font-mono text-[8px] px-1 rounded bg-black/30 opacity-80 uppercase">
                              {pedal.category}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] opacity-75 truncate block" title={pedal.gearRef}>
                            {pedal.gearRef}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddPedalAt(pedal)}
                        className="p-1 rounded-[2px] bg-black/30 hover:bg-black/60 border border-white/20 text-white transition shrink-0 opacity-80 group-hover:opacity-100"
                        title="Adicionar pedal à pedaleira"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {filteredSidebarPedals.length === 0 && (
                    <div className="text-center py-8 text-oficina-mutedText font-mono text-xs">
                      Nenhum pedal encontrado.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AMPS TAB VIEW */}
            {sidebarTab === 'amps' && (
              <div className="space-y-3 flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Search Input */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-oficina-mutedText absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar amplificadores..."
                    value={sidebarAmpSearch}
                    onChange={(e) => setSidebarAmpSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs text-oficina-darkText placeholder:text-oficina-mutedText focus:outline-none"
                  />
                  {sidebarAmpSearch && (
                    <button
                      onClick={() => setSidebarAmpSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-oficina-mutedText hover:text-oficina-darkText"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Chips Filter */}
                <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 font-mono text-[10px] shrink-0">
                  {AMP_CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSidebarAmpCategory(category)}
                      className={`px-2 py-1 rounded-[2px] font-bold border transition shrink-0 ${
                        sidebarAmpCategory === category
                          ? 'bg-oficina-chassis text-white border-oficina-chassis'
                          : 'bg-oficina-surface border-oficina-border text-oficina-bodyText hover:border-oficina-borderDark'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Scrollable Amps List */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {filteredSidebarAmps.map(amp => {
                    const isCurrent = amp.id === selectedAmpId;

                    return (
                      <div
                        key={amp.id}
                        draggable={true}
                        onDragStart={(e) => handleSidebarDragStart(e, amp, 'amp')}
                        onClick={() => handleSelectAmplifier(amp.id)}
                        className={`p-2.5 rounded-sm border-2 transition flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing hover:scale-[1.01] shadow-xs group ${
                          isCurrent ? 'ring-2 ring-oficina-terracotta' : ''
                        }`}
                        style={{
                          backgroundColor: amp.chassis.bg,
                          borderColor: amp.chassis.border,
                          color: amp.chassis.text
                        }}
                        title="Arraste ou clique para ativar este amplificador"
                      >
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs uppercase truncate">
                              {amp.name}
                            </span>
                            <span className="font-mono text-[8px] px-1 rounded bg-black/40 uppercase">
                              {amp.category}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] opacity-75 truncate block" title={amp.gearRef}>
                            {amp.brand} · {amp.tubes}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAmplifier(amp.id);
                          }}
                          className="p-1 rounded-[2px] bg-black/40 hover:bg-black/70 border border-white/20 text-white transition shrink-0 text-[10px] font-mono font-bold"
                        >
                          {isCurrent ? 'ATIVO' : 'USAR'}
                        </button>
                      </div>
                    );
                  })}

                  {filteredSidebarAmps.length === 0 && (
                    <div className="text-center py-8 text-oficina-mutedText font-mono text-xs">
                      Nenhum amplificador encontrado.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* COLLAPSED STRIP BUTTON */
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="w-full h-full absolute inset-0 bg-oficina-card hover:bg-oficina-surface border border-oficina-border hover:border-oficina-terracotta/60 rounded-sm p-2 flex xl:flex-col items-center justify-between shadow-sm cursor-pointer group transition-all duration-200"
            title="Clique para expandir o catálogo de equipamentos (110 pedais + 111 amplificadores)"
          >
            <div className="flex xl:flex-col items-center gap-3">
              <div className="p-2 bg-oficina-surface group-hover:bg-oficina-terracotta/10 border border-oficina-border group-hover:border-oficina-terracotta/40 rounded-sm text-oficina-terracotta transition shadow-inner">
                <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-mono font-black text-xs text-oficina-darkText xl:[writing-mode:vertical-rl] xl:rotate-180 uppercase tracking-widest group-hover:text-oficina-terracotta transition">
                EQUIPAMENTOS
              </span>
              <span className="font-mono font-bold text-[10px] text-oficina-mutedText bg-oficina-surface px-1.5 py-0.5 rounded border border-oficina-border">
                110+
              </span>
            </div>
            
            <div className="p-1 rounded text-oficina-mutedText group-hover:text-oficina-terracotta group-hover:bg-oficina-surface transition">
              <ChevronLeft className="w-4 h-4 hidden xl:block group-hover:-translate-x-0.5 transition-transform" />
              <Plus className="w-4 h-4 xl:hidden" />
            </div>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAIS DE IMPORTAÇÃO E SALVAMENTO */}
      {/* ========================================================================= */}

      {/* MODAL "IMPORTAR PRESET" */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleConfirmImportJson} className="bg-oficina-card border border-oficina-border rounded-sm max-w-xl w-full shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-oficina-border pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-oficina-olive" />
                <h3 className="font-extrabold text-sm text-oficina-darkText uppercase tracking-wider">
                  Importar Preset de Timbre
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError('');
                }}
                className="text-oficina-mutedText hover:text-oficina-darkText"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-bold text-oficina-darkText block">
                  Cole o código JSON do Preset:
                </label>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="font-mono text-[11px] text-oficina-terracotta hover:underline font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTemplate ? 'Copiado!' : 'Copiar Modelo JSON'}</span>
                </button>
              </div>

              <textarea
                required
                autoFocus
                rows={10}
                placeholder='Cole o JSON gerado aqui... Ex: { "name": "Sweet Child", "ampId": "brit_8000", "pedals": [...] }'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-3 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs text-oficina-darkText placeholder:text-oficina-mutedText focus:outline-none focus:border-oficina-darkText resize-none custom-scrollbar"
              />

              {importError && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-xs rounded-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-mono text-xs rounded-sm flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Preset importado e carregado com sucesso!</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-oficina-border font-mono text-xs">
              <span className="text-[11px] text-oficina-bodyText">
                Aceita blocos de código com ou sem markdown ```json.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-oficina-surface border border-oficina-border text-oficina-bodyText font-bold rounded-sm hover:border-oficina-borderDark"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-oficina-olive hover:brightness-110 text-white font-bold rounded-sm shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Importar e Aplicar</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL "SALVAR / ATUALIZAR PRESET" */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleConfirmSavePreset} className="bg-oficina-card border border-oficina-border rounded-sm max-w-md w-full shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-oficina-border pb-3">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-oficina-terracotta" />
                <h3 className="font-extrabold text-sm text-oficina-darkText uppercase tracking-wider">
                  {currentActivePreset?.isCustom ? 'Atualizar / Salvar Preset' : 'Salvar Preset de Timbre'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="text-oficina-mutedText hover:text-oficina-darkText"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentActivePreset?.isCustom && (
              <div className="flex gap-2 p-1 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setSaveMode('update')}
                  className={`flex-1 py-1.5 rounded-[2px] font-bold transition ${
                    saveMode === 'update'
                      ? 'bg-oficina-chassis text-white shadow-sm'
                      : 'text-oficina-bodyText hover:text-oficina-darkText'
                  }`}
                >
                  Atualizar Atual
                </button>
                <button
                  type="button"
                  onClick={() => setSaveMode('new')}
                  className={`flex-1 py-1.5 rounded-[2px] font-bold transition ${
                    saveMode === 'new'
                      ? 'bg-oficina-chassis text-white shadow-sm'
                      : 'text-oficina-bodyText hover:text-oficina-darkText'
                  }`}
                >
                  Salvar Como Novo
                </button>
              </div>
            )}

            {saveMode === 'update' && currentActivePreset?.isCustom ? (
              <div className="p-3 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs space-y-1">
                <span className="font-bold text-oficina-darkText block">
                  Atualizar "{currentActivePreset.name}"
                </span>
                <p className="text-[11px] text-oficina-bodyText">
                  As novas posições dos knobs, pedais e amplificador serão gravadas diretamente neste preset sem duplicá-lo.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-oficina-darkText block">
                  Nome do Novo Preset:
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ex: Meu Solo 80s, Crunch Suave, High Gain..."
                  value={presetSaveName}
                  onChange={(e) => setPresetSaveName(e.target.value)}
                  className="w-full px-3 py-2 bg-oficina-surface border border-oficina-border rounded-sm font-mono text-xs text-oficina-darkText focus:outline-none focus:border-oficina-darkText"
                />
                <p className="text-[11px] text-oficina-bodyText font-mono">
                  Serão salvos os {activePedals.length} pedais ativos, posições dos knobs e o amplificador {currentAmp.name}.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-oficina-border font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 bg-oficina-surface border border-oficina-border text-oficina-bodyText font-bold rounded-sm hover:border-oficina-borderDark"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-oficina-terracotta hover:brightness-110 text-white font-bold rounded-sm shadow-sm"
              >
                {saveMode === 'update' && currentActivePreset?.isCustom ? 'Confirmar Atualização' : 'Salvar Novo Preset'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
