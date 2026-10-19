// =========================================================================
// CATÁLOGO COMPLETO DE PEDAIS AMPLITUBE (110 PEDAIS · 10 CATEGORIAS)
// =========================================================================

export const PEDAL_CATEGORIES = [
  'Todos',
  'Distortion',
  'Delay',
  'Modulation',
  'Filter',
  'Dynamics',
  'Fuzz',
  'Pitch',
  'EQ',
  'Reverb',
  'Other'
];

export const AMPLITUBE_PEDALS = [
  // =========================================================================
  // 1. DELAY (11 PEDAIS)
  // =========================================================================
  {
    id: 'ddelay',
    name: 'DDelay',
    category: 'Delay',
    gearRef: 'AmpliTube Studio Digital Delay',
    description: 'Delay digital de estúdio com precisão cristalina de milissegundos, feedback infinito e filtro hi-cut.',
    chassis: { bg: '#2b303c', border: '#444c5e', text: '#e6ebf5', accent: '#3b82f6', led: '#60a5fa' },
    knobs: [
      { id: 'time', label: 'TIME', min: 20, max: 1200, default: 380, unit: 'ms' },
      { id: 'feedback', label: 'F.BACK', min: 0, max: 100, default: 45, unit: '%' },
      { id: 'level', label: 'E.LEVEL', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'hicut', label: 'HI-CUT', min: 1000, max: 12000, default: 6000, unit: 'Hz' }
    ],
    dspType: 'delay_digital'
  },
  {
    id: 'sax_ad',
    name: 'Analog Delay - SAX AD',
    category: 'Delay',
    gearRef: 'Ibanez / Maxon AD-9 Analog Delay',
    description: 'Delay analógico clássico com circuito BBD (Bucket Brigade) aveludado, quente e repetições orgânicas.',
    chassis: { bg: '#992244', border: '#b83258', text: '#ffeaef', accent: '#ff4d79', led: '#ff2a5f' },
    knobs: [
      { id: 'time', label: 'DELAY TIME', min: 20, max: 350, default: 220, unit: 'ms' },
      { id: 'feedback', label: 'REPEAT', min: 0, max: 100, default: 55, unit: '%' },
      { id: 'level', label: 'DELAY LEVEL', min: 0, max: 100, default: 60, unit: '%' }
    ],
    dspType: 'delay_analog'
  },
  {
    id: 'delay_standard',
    name: 'delay',
    category: 'Delay',
    gearRef: 'AmpliTube Classic Stomp Delay',
    description: 'Stompbox de delay direto e intuitivo para solos marcantes e ambiências dinâmicas.',
    chassis: { bg: '#1f3d36', border: '#2f5a50', text: '#e2f5ee', accent: '#2dd4bf', led: '#5eead4' },
    knobs: [
      { id: 'time', label: 'TIME', min: 50, max: 800, default: 320, unit: 'ms' },
      { id: 'feedback', label: 'FEEDBACK', min: 0, max: 100, default: 40, unit: '%' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 45, unit: '%' }
    ],
    dspType: 'delay_digital'
  },
  {
    id: 'echoman',
    name: 'EchoMan',
    category: 'Delay',
    gearRef: 'Electro-Harmonix Deluxe Memory Man',
    description: 'O lendário delay analógico dos anos 70 com modulação de Chorus/Vibrato nas repetições.',
    chassis: { bg: '#d4d8dd', border: '#8b949e', text: '#111827', accent: '#2563eb', led: '#ef4444' },
    knobs: [
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' },
      { id: 'blend', label: 'BLEND', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'feedback', label: 'FEEDBACK', min: 0, max: 100, default: 48, unit: '%' },
      { id: 'delay', label: 'DELAY', min: 30, max: 550, default: 350, unit: 'ms' },
      { id: 'depth', label: 'CHOR/VIB', min: 0, max: 100, default: 35, unit: '%' }
    ],
    switches: [
      { id: 'modMode', label: 'MODE', options: ['CHORUS', 'VIBRATO'], default: 'CHORUS' }
    ],
    dspType: 'delay_echoman'
  },
  {
    id: 'eptapeecho',
    name: 'EpTapeEcho',
    category: 'Delay',
    gearRef: 'Maestro Echoplex EP-3 Tape Echo',
    description: 'Eco de fita vintage com saturação aveludada do pré-amplificador e oscilação analógica (flutter).',
    chassis: { bg: '#1c1c1c', border: '#b45309', text: '#fbbf24', accent: '#d97706', led: '#f59e0b' },
    knobs: [
      { id: 'delay', label: 'DELAY TIME', min: 80, max: 700, default: 280, unit: 'ms' },
      { id: 'sustain', label: 'SUSTAIN', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'volume', label: 'ECHO VOL', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'recordLevel', label: 'PREAMP GAIN', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'delay_tape'
  },
  {
    id: 'replica_trex',
    name: 'Replica Trex',
    category: 'Delay',
    gearRef: 'T-Rex Replica Boutique Delay',
    description: 'Delay boutique aclamado com chave Brown para repetições quentes e subdivisão rítmica.',
    chassis: { bg: '#8b6534', border: '#a87e47', text: '#fffbeb', accent: '#f59e0b', led: '#10b981' },
    knobs: [
      { id: 'echo', label: 'ECHO', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'repeat', label: 'REPEAT', min: 0, max: 100, default: 45, unit: '%' },
      { id: 'tempo', label: 'TEMPO', min: 20, max: 1500, default: 420, unit: 'ms' },
      { id: 'level', label: 'LEVEL', min: 0, max: 100, default: 70, unit: '%' }
    ],
    switches: [
      { id: 'brown', label: 'BROWN', options: ['OFF', 'ON'], default: 'ON' },
      { id: 'subdiv', label: 'SUBDIV', options: ['1/4', 'TRI'], default: '1/4' }
    ],
    dspType: 'delay_replica'
  },
  {
    id: 'sste',
    name: 'SSte',
    category: 'Delay',
    gearRef: 'Solid State Tape Echo (EP-4)',
    description: 'Eco de fita transistorizado com resposta dinâmica firme, corte de graves e médios encorpados.',
    chassis: { bg: '#292524', border: '#44403c', text: '#e7e5e4', accent: '#a8a29e', led: '#ef4444' },
    knobs: [
      { id: 'time', label: 'MOTOR SPEED', min: 60, max: 650, default: 260, unit: 'ms' },
      { id: 'repeats', label: 'REPEATS', min: 0, max: 100, default: 45, unit: '%' },
      { id: 'tone', label: 'BASS / TREBLE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mix', label: 'ECHO MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'delay_tape'
  },
  {
    id: 'tapdelay',
    name: 'TapDelay',
    category: 'Delay',
    gearRef: 'AmpliTube Tap Tempo Stereo Delay',
    description: 'Delay estéreo sincronizado com tap-tempo e múltiplos padrões de repetição.',
    chassis: { bg: '#0e7490', border: '#155e75', text: '#ecfeff', accent: '#06b6d4', led: '#67e8f9' },
    knobs: [
      { id: 'bpm', label: 'BPM', min: 40, max: 240, default: 120, unit: 'bpm' },
      { id: 'feedback', label: 'FDBK', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'spread', label: 'STEREO SPREAD', min: 0, max: 100, default: 75, unit: '%' }
    ],
    dspType: 'delay_digital'
  },
  {
    id: 'tape_echo_fender',
    name: 'Tape Echo Fender',
    category: 'Delay',
    gearRef: 'Fender 1960s Tube Tape Reverb/Echo Unit',
    description: 'O clássico eco de fita da Fender dos anos 60 com saturação e espelhamento suave.',
    chassis: { bg: '#451a03', border: '#78350f', text: '#fef3c7', accent: '#d97706', led: '#f59e0b' },
    knobs: [
      { id: 'dwell', label: 'DWELL', min: 0, max: 10, default: 6, unit: '' },
      { id: 'delay', label: 'DELAY', min: 50, max: 600, default: 290, unit: 'ms' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 55, unit: '%' }
    ],
    dspType: 'delay_tape'
  },
  {
    id: 'x_time',
    name: 'X-Time',
    category: 'Delay',
    gearRef: 'IK Multimedia X-GEAR X-TIME DSP Pedal',
    description: 'O pedal topo de linha com 16 algoritmos de delay de estúdio (Tape, Analog, Shimmer, Reverse, Mod).',
    chassis: { bg: '#0f172a', border: '#1e293b', text: '#f8fafc', accent: '#38bdf8', led: '#0ea5e9' },
    knobs: [
      { id: 'time', label: 'TIME', min: 10, max: 2000, default: 450, unit: 'ms' },
      { id: 'feedback', label: 'FDBK', min: 0, max: 100, default: 55, unit: '%' },
      { id: 'filter', label: 'FILTER', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mod', label: 'MOD', min: 0, max: 100, default: 40, unit: '%' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    switches: [
      { id: 'algo', label: 'ALGO', options: ['TAPE', 'ANALOG', 'SHIMMER', 'REVERSE'], default: 'TAPE' }
    ],
    dspType: 'delay_xtime'
  },
  {
    id: 'oil_can_delay',
    name: 'oil Can Delay Morley',
    category: 'Delay',
    gearRef: 'Morley / Tel-Ray Oil Can Delay',
    description: 'Raríssimo eco eletrostático por lata de óleo giratória com timbre escuro, aquoso e oscilante.',
    chassis: { bg: '#365314', border: '#4d7c0f', text: '#f7fee7', accent: '#84cc16', led: '#a3e635' },
    knobs: [
      { id: 'delay', label: 'DELAY', min: 40, max: 400, default: 180, unit: 'ms' },
      { id: 'sustain', label: 'SUSTAIN', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'vibrato', label: 'OIL VIBRATO', min: 0, max: 100, default: 45, unit: '%' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'delay_oilcan'
  },

  // =========================================================================
  // 2. DISTORTION & OVERDRIVE (24 PEDAIS)
  // =========================================================================
  {
    id: 'ampless',
    name: 'AmpLess',
    category: 'Distortion',
    gearRef: 'Tech 21 SansAmp Classic',
    description: 'O lendário simulador analógico de amplificadores e distorção direta com chaves de caráter.',
    chassis: { bg: '#1c1917', border: '#44403c', text: '#fafaf9', accent: '#ca8a04', led: '#eab308' },
    knobs: [
      { id: 'preamp', label: 'PREAMP', min: 0, max: 10, default: 7, unit: '' },
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'high', label: 'HIGH', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    switches: [
      { id: 'char', label: 'VOICING', options: ['CLEAN', 'LEAD', 'CRUNCH'], default: 'LEAD' }
    ],
    dspType: 'distortion_ampless'
  },
  {
    id: 'bigpig',
    name: 'BigPig',
    category: 'Distortion',
    gearRef: 'Electro-Harmonix Big Muff Pi (NYC)',
    description: 'O clássico fuzz/distortion novaiorquino com parede de som encorpada e sustain infinito.',
    chassis: { bg: '#475569', border: '#64748b', text: '#f1f5f9', accent: '#ef4444', led: '#dc2626' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'sustain', label: 'SUSTAIN', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'fuzz_bigmuff'
  },
  {
    id: 'crusher',
    name: 'Crusher',
    category: 'Distortion',
    gearRef: 'AmpliTube Modern High Gain Distortion',
    description: 'Distorção brutal moderna para afinações baixas (Drop D / Drop C) e metal extremo.',
    chassis: { bg: '#18181b', border: '#27272a', text: '#fafafa', accent: '#dc2626', led: '#ef4444' },
    knobs: [
      { id: 'gain', label: 'CRUSH GAIN', min: 0, max: 10, default: 8, unit: '' },
      { id: 'bass', label: 'BASS', min: 0, max: 10, default: 7, unit: '' },
      { id: 'treble', label: 'TREBLE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'OUTPUT', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'distortion_highgain'
  },
  {
    id: 'diode_overdrive',
    name: 'Diode Overdrive',
    category: 'Distortion',
    gearRef: 'AmpliTube Asymmetrical Diode Overdrive',
    description: 'Overdrive quente e expressivo com saturação natural de diodos.',
    chassis: { bg: '#713f12', border: '#854d0e', text: '#fef9c3', accent: '#eab308', led: '#facc15' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'overdrive_warm'
  },
  {
    id: 'distortion_ds1',
    name: 'Distortion',
    category: 'Distortion',
    gearRef: 'Boss DS-1 Distortion',
    description: 'O icônico pedal laranja que definiu o som do Hard Rock, Grunge e solos clássicos.',
    chassis: { bg: '#ea580c', border: '#c2410c', text: '#ffffff', accent: '#fff', led: '#ef4444' },
    knobs: [
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' },
      { id: 'dist', label: 'DIST', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'distortion_ds1'
  },
  {
    id: 'feedback_df2',
    name: 'Feedback',
    category: 'Distortion',
    gearRef: 'Boss DF-2 Super Feedbacker & Distortion',
    description: 'Distorção de alto ganho com gerador e sustentador automático de harmônicos.',
    chassis: { bg: '#b91c1c', border: '#991b1b', text: '#fee2e2', accent: '#fca5a5', led: '#ef4444' },
    knobs: [
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'dist', label: 'DIST', min: 0, max: 10, default: 8, unit: '' },
      { id: 'feed', label: 'FEEDBACK', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'distortion_feedback'
  },
  {
    id: 'metal_distortion',
    name: 'Metal Distortion',
    category: 'Distortion',
    gearRef: 'Boss MT-2 Metal Zone',
    description: 'Distorção lendária de metal com equalizador duplo paramétrico para cortar os médios.',
    chassis: { bg: '#18181b', border: '#3f3f46', text: '#fafafa', accent: '#f97316', led: '#dc2626' },
    knobs: [
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' },
      { id: 'high', label: 'HIGH', min: 0, max: 10, default: 6, unit: '' },
      { id: 'low', label: 'LOW', min: 0, max: 10, default: 7, unit: '' },
      { id: 'mid', label: 'MID', min: 0, max: 10, default: 3, unit: '' },
      { id: 'midFreq', label: 'MID FREQ', min: 200, max: 5000, default: 1200, unit: 'Hz' },
      { id: 'dist', label: 'DIST', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'distortion_metalzone'
  },
  {
    id: 'metal_distortion_2',
    name: 'Metal Distortion 2',
    category: 'Distortion',
    gearRef: 'Boss HM-2 Heavy Metal',
    description: 'O famoso timbre "motosserra" do Death Metal sueco com todos os knobs no máximo.',
    chassis: { bg: '#09090b', border: '#27272a', text: '#f97316', accent: '#ea580c', led: '#ef4444' },
    knobs: [
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'low', label: 'COLOR L', min: 0, max: 10, default: 10, unit: '' },
      { id: 'high', label: 'COLOR H', min: 0, max: 10, default: 10, unit: '' },
      { id: 'dist', label: 'DIST', min: 0, max: 10, default: 10, unit: '' }
    ],
    dspType: 'distortion_hm2'
  },
  {
    id: 'moller',
    name: 'Moller',
    category: 'Distortion',
    gearRef: 'T-Rex Möller Boutique Overdrive',
    description: 'Overdrive dinamarquês boutique com estágio independente de Clean Boost e botão de Mix.',
    chassis: { bg: '#475569', border: '#64748b', text: '#f8fafc', accent: '#38bdf8', led: '#0284c7' },
    knobs: [
      { id: 'overdrive', label: 'OVERDRIVE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'boost', label: 'BOOST', min: 0, max: 20, default: 8, unit: 'dB' }
    ],
    switches: [
      { id: 'bass', label: 'BASS', options: ['NORMAL', 'BOOST'], default: 'NORMAL' }
    ],
    dspType: 'overdrive_moller'
  },
  {
    id: 'mudhoney',
    name: 'Mudhoney',
    category: 'Distortion',
    gearRef: 'T-Rex Mudhoney Dual Overdrive / Fuzz',
    description: 'Overdrive quente e aveludado que se transforma em um Fuzz cortante ao acionar o Boost.',
    chassis: { bg: '#ca8a04', border: '#a16207', text: '#451a03', accent: '#78350f', led: '#15803d' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' }
    ],
    switches: [
      { id: 'boost', label: 'BOOST', options: ['OFF', 'ON'], default: 'OFF' }
    ],
    dspType: 'distortion_mudhoney'
  },
  {
    id: 'ocd',
    name: 'OCD',
    category: 'Distortion',
    gearRef: 'Fulltone OCD (Obsessive Compulsive Drive)',
    description: 'Overdrive/Distorção extremamente dinâmico com recorte MOSFET e chave HP/LP.',
    chassis: { bg: '#f8fafc', border: '#cbd5e1', text: '#0f172a', accent: '#0284c7', led: '#0284c7' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 6, unit: '' },
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['HP', 'LP'], default: 'HP' }
    ],
    dspType: 'overdrive_ocd'
  },
  {
    id: 'octoblue',
    name: 'OctoBlue',
    category: 'Distortion',
    gearRef: 'T-Rex Octavius / Octavia Drive',
    description: 'Fuzz e overdrive com oitava acima harmônica analógica.',
    chassis: { bg: '#1d4ed8', border: '#1e40af', text: '#eff6ff', accent: '#60a5fa', led: '#93c5fd' },
    knobs: [
      { id: 'gain', label: 'DRIVE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'octave', label: 'OCTAVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'fuzz_octave'
  },
  {
    id: 'overdrive_sd1',
    name: 'Overdrive',
    category: 'Distortion',
    gearRef: 'Boss SD-1 Super Overdrive',
    description: 'O clássico pedal amarelo de overdrive assimétrico para timbres de blues e rock cremosos.',
    chassis: { bg: '#eab308', border: '#ca8a04', text: '#1c1917', accent: '#000', led: '#ef4444' },
    knobs: [
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'overdrive_sd1'
  },
  {
    id: 'overscream',
    name: 'OverScream',
    category: 'Distortion',
    gearRef: 'Ibanez TS9 / TS808 Tube Screamer',
    description: 'O pedal verde mais famoso da história: médios destacados que empurram qualquer amplificador.',
    chassis: { bg: '#15803d', border: '#166534', text: '#f0fdf4', accent: '#86efac', led: '#ef4444' },
    knobs: [
      { id: 'overdrive', label: 'OVERDRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'overdrive_ts'
  },
  {
    id: 'pinnacle_deluxe',
    name: 'Pinnacle Deluxe',
    category: 'Distortion',
    gearRef: 'Wampler Pinnacle Deluxe',
    description: 'O timbre "Brown Sound" de Eddie Van Halen com chave Vintage/Modern, Sag e Boost independente.',
    chassis: { bg: '#7c2d12', border: '#9a3412', text: '#ffedd5', accent: '#ea580c', led: '#f97316' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'contour', label: 'CONTOUR', min: 0, max: 10, default: 5, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 6, unit: '' }
    ],
    switches: [
      { id: 'vintage', label: 'VOICE', options: ['VINTAGE', 'MODERN'], default: 'MODERN' },
      { id: 'boost', label: 'GAIN BOOST', options: ['OFF', 'ON'], default: 'ON' }
    ],
    dspType: 'distortion_pinnacle'
  },
  {
    id: 'power_grid',
    name: 'Power Grid',
    category: 'Distortion',
    gearRef: 'Seymour Duncan Power Grid Distortion',
    description: 'Distorção analógica de alto ganho com equalizador ativo de 3 bandas (Bass, Mid, Treble).',
    chassis: { bg: '#1e293b', border: '#334155', text: '#f8fafc', accent: '#f59e0b', led: '#3b82f6' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'bass', label: 'BASS', min: 0, max: 10, default: 6, unit: '' },
      { id: 'mid', label: 'MID', min: 0, max: 10, default: 5, unit: '' },
      { id: 'treble', label: 'TREBLE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'distortion_powergrid'
  },
  {
    id: 'prodrive',
    name: 'PROdrive',
    category: 'Distortion',
    gearRef: 'ProCo Rat 2 Distortion',
    description: 'O clássico roedor com chip LM308 que vai do overdrive quente ao fuzz ríspido.',
    chassis: { bg: '#111827', border: '#374151', text: '#ffffff', accent: '#ef4444', led: '#ef4444' },
    knobs: [
      { id: 'distortion', label: 'DISTORTION', min: 0, max: 10, default: 6, unit: '' },
      { id: 'filter', label: 'FILTER', min: 0, max: 10, default: 4, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'distortion_rat'
  },
  {
    id: 'satch_dist',
    name: 'Satch Dist',
    category: 'Distortion',
    gearRef: 'Vox Satchurator (Joe Satriani)',
    description: 'Pedal signature de Joe Satriani com botão de ganho extra "More" e chave Pad para captadores ativos.',
    chassis: { bg: '#b91c1c', border: '#dc2626', text: '#ffffff', accent: '#f87171', led: '#fbbf24' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 6, unit: '' }
    ],
    switches: [
      { id: 'more', label: 'MORE', options: ['OFF', 'ON'], default: 'OFF' }
    ],
    dspType: 'distortion_satch'
  },
  {
    id: 'satch_overdrive',
    name: 'Satch Overdrive',
    category: 'Distortion',
    gearRef: 'Vox Ice 9 (Joe Satriani)',
    description: 'Overdrive signature de Joe Satriani com chave Vintage/Custom e botão More.',
    chassis: { bg: '#0284c7', border: '#0369a1', text: '#ffffff', accent: '#7dd3fc', led: '#38bdf8' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 6, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'bass', label: 'BASS', min: 0, max: 10, default: 5, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' }
    ],
    switches: [
      { id: 'voice', label: 'VOICE', options: ['VINTAGE', 'CUSTOM'], default: 'CUSTOM' }
    ],
    dspType: 'overdrive_warm'
  },
  {
    id: 'svx_od',
    name: 'SVX-OD',
    category: 'Distortion',
    gearRef: 'Ampeg SVX Bass Overdrive',
    description: 'Overdrive encorpado e valvulado ideal para guitarras com graves pesados ou contrabaixo.',
    chassis: { bg: '#1f2937', border: '#374151', text: '#e5e7eb', accent: '#60a5fa', led: '#3b82f6' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'blend', label: 'BLEND', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'treble', label: 'TREBLE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'overdrive_warm'
  },
  {
    id: 'the_ambassdor',
    name: "The Ambass'dor",
    category: 'Distortion',
    gearRef: "Marshall The Guv'nor",
    description: 'O clássico pedal britânico dourado que transforma qualquer amp limpo em um stack Marshall JCM800.',
    chassis: { bg: '#292524', border: '#ca8a04', text: '#fef08a', accent: '#eab308', led: '#ef4444' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'bass', label: 'BASS', min: 0, max: 10, default: 6, unit: '' },
      { id: 'mid', label: 'MIDDLE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'treble', label: 'TREBLE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'distortion_guvnor'
  },
  {
    id: 'tube_overdrive',
    name: 'Tube Overdrive',
    category: 'Distortion',
    gearRef: 'B.K. Butler Tube Driver',
    description: 'Overdrive alimentado por válvula 12AX7 de estúdio: o som de David Gilmour e Eric Johnson.',
    chassis: { bg: '#1c1917', border: '#78716c', text: '#fafaf9', accent: '#fbbf24', led: '#f59e0b' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'hi', label: 'HI', min: 0, max: 10, default: 5, unit: '' },
      { id: 'lo', label: 'LO', min: 0, max: 10, default: 6, unit: '' },
      { id: 'out', label: 'OUTPUT', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'overdrive_tubedriver'
  },
  {
    id: 'varidiode_plus',
    name: 'VariDiode+',
    category: 'Distortion',
    gearRef: 'AmpliTube Custom Shop Variable Diode Distortion',
    description: 'Distorção customizável com seletor de diodos (Silício, Germânio, LED e MOSFET).',
    chassis: { bg: '#312e81', border: '#4338ca', text: '#e0e7ff', accent: '#818cf8', led: '#a5b4fc' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' }
    ],
    switches: [
      { id: 'diode', label: 'CLIPPING', options: ['SILICON', 'GERMANIUM', 'LED', 'MOSFET'], default: 'SILICON' }
    ],
    dspType: 'distortion_varidiode'
  },
  {
    id: 'x_drive',
    name: 'X-DRIVE',
    category: 'Distortion',
    gearRef: 'IK Multimedia X-GEAR X-DRIVE DSP Pedal',
    description: 'Pedal DSP com 16 algoritmos de overdrive, distorção e fuzz modelados digitalmente.',
    chassis: { bg: '#831843', border: '#9d174d', text: '#fdf2f8', accent: '#f472b6', led: '#ec4899' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'bass', label: 'BASS', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mid', label: 'MID', min: 0, max: 10, default: 6, unit: '' },
      { id: 'treble', label: 'TREBLE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'volume', label: 'VOL', min: 0, max: 10, default: 7, unit: '' }
    ],
    switches: [
      { id: 'algo', label: 'MODEL', options: ['MODERN', 'VINTAGE', 'METAL', 'FUZZ'], default: 'MODERN' }
    ],
    dspType: 'distortion_xdrive'
  },

  // =========================================================================
  // 3. DYNAMICS & BOOSTERS (9 PEDAIS)
  // =========================================================================
  {
    id: 'booster',
    name: 'Booster',
    category: 'Dynamics',
    gearRef: 'AmpliTube Clean Booster',
    description: 'Clean boost transparente de até +20dB para aumentar o volume de solos ou empurrar válvulas.',
    chassis: { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff', accent: '#93c5fd', led: '#60a5fa' },
    knobs: [
      { id: 'boost', label: 'BOOST', min: 0, max: 20, default: 10, unit: 'dB' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' }
    ],
    dspType: 'dynamics_boost'
  },
  {
    id: 'compressor_studio',
    name: 'Compressor',
    category: 'Dynamics',
    gearRef: 'AmpliTube Studio Compressor',
    description: 'Compressor completo com Attack, Release, Ratio e Threshold para controle fino de dinâmica.',
    chassis: { bg: '#047857', border: '#065f46', text: '#ecfdf5', accent: '#34d399', led: '#10b981' },
    knobs: [
      { id: 'threshold', label: 'THRESH', min: -40, max: 0, default: -20, unit: 'dB' },
      { id: 'ratio', label: 'RATIO', min: 1, max: 12, default: 4, unit: ':1' },
      { id: 'attack', label: 'ATTACK', min: 1, max: 100, default: 15, unit: 'ms' },
      { id: 'release', label: 'RELEASE', min: 20, max: 500, default: 120, unit: 'ms' },
      { id: 'gain', label: 'GAIN', min: 0, max: 20, default: 6, unit: 'dB' }
    ],
    dspType: 'dynamics_compressor'
  },
  {
    id: 'dcomp',
    name: 'Dcomp',
    category: 'Dynamics',
    gearRef: 'MXR Dyna Comp',
    description: 'O clássico compressor vermelho de dois botões: percussivo, aveludado e com sustain marcante.',
    chassis: { bg: '#b91c1c', border: '#991b1b', text: '#ffffff', accent: '#fca5a5', led: '#ef4444' },
    knobs: [
      { id: 'output', label: 'OUTPUT', min: 0, max: 10, default: 7, unit: '' },
      { id: 'sensitivity', label: 'SENSITIVITY', min: 0, max: 10, default: 5, unit: '' }
    ],
    dspType: 'dynamics_dynacomp'
  },
  {
    id: 'fender_compressor',
    name: 'Fender Compressor',
    category: 'Dynamics',
    gearRef: 'Fender Vintage Stompbox Compressor',
    description: 'Compressor clássico com resposta limpa, natural e sustentação estendida sem distorção.',
    chassis: { bg: '#1c1917', border: '#ca8a04', text: '#fef08a', accent: '#eab308', led: '#ca8a04' },
    knobs: [
      { id: 'sustain', label: 'SUSTAIN', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'dynamics_dynacomp'
  },
  {
    id: 'gate',
    name: 'Gate',
    category: 'Dynamics',
    gearRef: 'AmpliTube Fast Noise Gate',
    description: 'Gate de corte rápido para eliminar ruídos de captadores single-coil e chiados de ganho alto.',
    chassis: { bg: '#374151', border: '#4b5563', text: '#f3f4f6', accent: '#9ca3af', led: '#10b981' },
    knobs: [
      { id: 'threshold', label: 'THRESHOLD', min: -60, max: -10, default: -35, unit: 'dB' },
      { id: 'release', label: 'RELEASE', min: 10, max: 300, default: 40, unit: 'ms' }
    ],
    dspType: 'dynamics_gate'
  },
  {
    id: 'noise_gate',
    name: 'Noise Gate',
    category: 'Dynamics',
    gearRef: 'Boss NS-2 Noise Suppressor',
    description: 'Supressor de ruído inteligente com circuito de detecção rápida para solos e bases pesadas.',
    chassis: { bg: '#f1f5f9', border: '#94a3b8', text: '#0f172a', accent: '#ef4444', led: '#ef4444' },
    knobs: [
      { id: 'threshold', label: 'THRESHOLD', min: -60, max: -10, default: -30, unit: 'dB' },
      { id: 'decay', label: 'DECAY', min: 10, max: 500, default: 50, unit: 'ms' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['REDUCTION', 'MUTE'], default: 'REDUCTION' }
    ],
    dspType: 'dynamics_gate'
  },
  {
    id: 'red_special',
    name: 'Red Special',
    category: 'Dynamics',
    gearRef: 'Brian May KAT / Fryer Treble Booster Preamp',
    description: 'O compressor e treble booster com corte agudo característico de Brian May no Queen.',
    chassis: { bg: '#7f1d1d', border: '#991b1b', text: '#fef2f2', accent: '#f87171', led: '#ef4444' },
    knobs: [
      { id: 'gain', label: 'BOOST', min: 0, max: 25, default: 14, unit: 'dB' },
      { id: 'tone', label: 'BRIGHTNESS', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'dynamics_trebleboost'
  },
  {
    id: 'svx_compressor',
    name: 'SVX Compressor',
    category: 'Dynamics',
    gearRef: 'Ampeg SVX Opto Compressor',
    description: 'Compressor óptico de estúdio com ataque suave e controle de punch para instrumentos graves.',
    chassis: { bg: '#0f172a', border: '#1e293b', text: '#f8fafc', accent: '#38bdf8', led: '#0ea5e9' },
    knobs: [
      { id: 'comp', label: 'COMPRESSION', min: 0, max: 10, default: 5, unit: '' },
      { id: 'release', label: 'RELEASE', min: 20, max: 800, default: 180, unit: 'ms' },
      { id: 'gain', label: 'MAKEUP GAIN', min: 0, max: 20, default: 6, unit: 'dB' }
    ],
    dspType: 'dynamics_compressor'
  },
  {
    id: 'treble_booster',
    name: 'Treble Booster',
    category: 'Dynamics',
    gearRef: 'Dallas Rangemaster Treble Booster (Germanium)',
    description: 'O lendário circuito de germânio que empurrou os amplificadores Vox e Marshall no clássico Rock britânico.',
    chassis: { bg: '#78716c', border: '#a8a29e', text: '#fafaf9', accent: '#d97706', led: '#f59e0b' },
    knobs: [
      { id: 'boost', label: 'BOOST', min: 0, max: 24, default: 12, unit: 'dB' }
    ],
    dspType: 'dynamics_trebleboost'
  },

  // =========================================================================
  // 4. EQ (4 PEDAIS)
  // =========================================================================
  {
    id: 'eq_6band',
    name: '6 Band EQ',
    category: 'EQ',
    gearRef: 'MXR 6-Band Graphic EQ',
    description: 'Equalizador gráfico de 6 frequências com corte e ganho de ±18dB por banda.',
    chassis: { bg: '#1e3a8a', border: '#1d4ed8', text: '#eff6ff', accent: '#60a5fa', led: '#93c5fd' },
    knobs: [
      { id: 'band100', label: '100Hz', min: -18, max: 18, default: 0, unit: 'dB' },
      { id: 'band200', label: '200Hz', min: -18, max: 18, default: 2, unit: 'dB' },
      { id: 'band400', label: '400Hz', min: -18, max: 18, default: 0, unit: 'dB' },
      { id: 'band800', label: '800Hz', min: -18, max: 18, default: -2, unit: 'dB' },
      { id: 'band1k6', label: '1.6k', min: -18, max: 18, default: 3, unit: 'dB' },
      { id: 'band3k2', label: '3.2k', min: -18, max: 18, default: 2, unit: 'dB' }
    ],
    dspType: 'eq_graphic'
  },
  {
    id: 'eq_7band',
    name: '7 Band Graphic',
    category: 'EQ',
    gearRef: 'Boss GE-7 Graphic Equalizer',
    description: 'O padrão da indústria com 7 bandas de frequência (100Hz a 6.4kHz) e slider de Level geral.',
    chassis: { bg: '#94a3b8', border: '#64748b', text: '#0f172a', accent: '#ef4444', led: '#ef4444' },
    knobs: [
      { id: 'b100', label: '100', min: -15, max: 15, default: 0, unit: 'dB' },
      { id: 'b200', label: '200', min: -15, max: 15, default: 1, unit: 'dB' },
      { id: 'b400', label: '400', min: -15, max: 15, default: 0, unit: 'dB' },
      { id: 'b800', label: '800', min: -15, max: 15, default: -1, unit: 'dB' },
      { id: 'b1k6', label: '1.6k', min: -15, max: 15, default: 2, unit: 'dB' },
      { id: 'b3k2', label: '3.2k', min: -15, max: 15, default: 3, unit: 'dB' },
      { id: 'b6k4', label: '6.4k', min: -15, max: 15, default: 1, unit: 'dB' },
      { id: 'level', label: 'LEVEL', min: -15, max: 15, default: 0, unit: 'dB' }
    ],
    dspType: 'eq_graphic'
  },
  {
    id: 'eq_10band',
    name: '10 Band Graphic',
    category: 'EQ',
    gearRef: 'MXR 10-Band Graphic EQ',
    description: 'Equalizador gráfico de precisão cirúrgica de 31.25Hz a 16kHz com controles independentes de Gain e Volume.',
    chassis: { bg: '#09090b', border: '#27272a', text: '#fafafa', accent: '#3b82f6', led: '#3b82f6' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: -12, max: 12, default: 0, unit: 'dB' },
      { id: 'b31', label: '31Hz', min: -12, max: 12, default: 0, unit: 'dB' },
      { id: 'b62', label: '62Hz', min: -12, max: 12, default: 1, unit: 'dB' },
      { id: 'b125', label: '125Hz', min: -12, max: 12, default: 2, unit: 'dB' },
      { id: 'b250', label: '250Hz', min: -12, max: 12, default: 0, unit: 'dB' },
      { id: 'b500', label: '500Hz', min: -12, max: 12, default: -2, unit: 'dB' },
      { id: 'b1k', label: '1kHz', min: -12, max: 12, default: 2, unit: 'dB' },
      { id: 'b2k', label: '2kHz', min: -12, max: 12, default: 3, unit: 'dB' },
      { id: 'b4k', label: '4kHz', min: -12, max: 12, default: 2, unit: 'dB' },
      { id: 'b8k', label: '8kHz', min: -12, max: 12, default: 1, unit: 'dB' },
      { id: 'b16k', label: '16kHz', min: -12, max: 12, default: 0, unit: 'dB' },
      { id: 'vol', label: 'VOL', min: -12, max: 12, default: 0, unit: 'dB' }
    ],
    dspType: 'eq_graphic'
  },
  {
    id: 'pre_eq_3',
    name: 'Pre EQ 3',
    category: 'EQ',
    gearRef: 'AmpliTube 3-Band Parametric Preamp EQ',
    description: 'Equalizador paramétrico de 3 bandas com varredura contínua de frequência de médios.',
    chassis: { bg: '#431407', border: '#7c2d12', text: '#ffedd5', accent: '#f97316', led: '#ea580c' },
    knobs: [
      { id: 'low', label: 'LOW', min: -12, max: 12, default: 2, unit: 'dB' },
      { id: 'mid', label: 'MID GAIN', min: -12, max: 12, default: -2, unit: 'dB' },
      { id: 'midFreq', label: 'MID FREQ', min: 250, max: 4000, default: 1000, unit: 'Hz' },
      { id: 'high', label: 'HIGH', min: -12, max: 12, default: 3, unit: 'dB' }
    ],
    dspType: 'eq_parametric'
  },

  // =========================================================================
  // 5. FILTER & WAH (21 PEDAIS)
  // =========================================================================
  {
    id: 'bass_wah',
    name: 'Bass Wah',
    category: 'Filter',
    gearRef: 'Dunlop Cry Baby Bass 105Q',
    description: 'Wah com varredura calibrada para instrumentos graves e controle de Q.',
    chassis: { bg: '#ffffff', border: '#0284c7', text: '#0f172a', accent: '#0284c7', led: '#0ea5e9' },
    knobs: [
      { id: 'volume', label: 'BOOST', min: 0, max: 15, default: 5, unit: 'dB' },
      { id: 'q', label: 'Q CONTROL', min: 1, max: 10, default: 5, unit: '' },
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'contour_wah',
    name: 'Contour Wah',
    category: 'Filter',
    gearRef: 'AmpliTube Resonant Contour Wah',
    description: 'Wah com controle de contorno harmônico e corpo de graves personalizável.',
    chassis: { bg: '#18181b', border: '#3f3f46', text: '#fafafa', accent: '#10b981', led: '#10b981' },
    knobs: [
      { id: 'contour', label: 'CONTOUR', min: 0, max: 10, default: 6, unit: '' },
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 5, unit: '' },
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'dime_noise_gate',
    name: 'Dime Noise Gate',
    category: 'Filter',
    gearRef: 'MXR Dimebag Darrell DD-11 Noise Gate',
    description: 'O noise gate camuflado signature de Dimebag Darrell com corte agressivo para staccatos.',
    chassis: { bg: '#365314', border: '#4d7c0f', text: '#ecfccb', accent: '#a3e635', led: '#84cc16' },
    knobs: [
      { id: 'trigger', label: 'TRIGGER', min: -60, max: -10, default: -28, unit: 'dB' },
      { id: 'sensitivity', label: 'SENS', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'dynamics_gate'
  },
  {
    id: 'dime_wah',
    name: 'Dime Wah',
    category: 'Filter',
    gearRef: 'Dunlop Cry Baby From Hell DB-01 (Dimebag)',
    description: 'O wah mais versátil do metal: camuflagem, boost de até +17dB, ajuste fino e seletor de varredura.',
    chassis: { bg: '#1c1917', border: '#84cc16', text: '#f7fee7', accent: '#65a30d', led: '#84cc16' },
    knobs: [
      { id: 'boost', label: 'BOOST', min: 0, max: 17, default: 8, unit: 'dB' },
      { id: 'q', label: 'FINE TUNE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    switches: [
      { id: 'range', label: 'SWEEP', options: ['WIDE', 'NORMAL'], default: 'WIDE' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'envelope_filter',
    name: 'Envelope Filter',
    category: 'Filter',
    gearRef: 'Electro-Harmonix Q-Tron / Doctor Q',
    description: 'Auto-wah com filtro dinâmico que abre e fecha conforme a intensidade da sua palhetada.',
    chassis: { bg: '#701a75', border: '#86198f', text: '#fdf4ff', accent: '#e879f9', led: '#d946ef' },
    knobs: [
      { id: 'sensitivity', label: 'SENSITIVITY', min: 0, max: 10, default: 6, unit: '' },
      { id: 'range', label: 'RANGE', min: 0, max: 10, default: 5, unit: '' }
    ],
    switches: [
      { id: 'mode', label: 'FILTER', options: ['LP', 'BP', 'HP'], default: 'BP' }
    ],
    dspType: 'filter_envelope'
  },
  {
    id: 'svx_envelope_filter',
    name: 'SVX Envelope Filter',
    category: 'Filter',
    gearRef: 'Ampeg SVX Dynamic Bass Envelope',
    description: 'Filtro dinâmico com graves espessos e varredura funky para baixo e guitarra.',
    chassis: { bg: '#0f172a', border: '#334155', text: '#f8fafc', accent: '#0284c7', led: '#38bdf8' },
    knobs: [
      { id: 'sens', label: 'SENSITIVITY', min: 0, max: 10, default: 5, unit: '' },
      { id: 'q', label: 'RESONANCE', min: 1, max: 10, default: 6, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 60, unit: '%' }
    ],
    dspType: 'filter_envelope'
  },
  {
    id: 'fender_wah',
    name: 'Fender Wah',
    category: 'Filter',
    gearRef: 'Fender 1970s Chrome Treadle Wah',
    description: 'Wah vintage cromado dos anos 70 com varredura ampla e resposta aveludada.',
    chassis: { bg: '#e2e8f0', border: '#94a3b8', text: '#0f172a', accent: '#0284c7', led: '#0284c7' },
    knobs: [
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'tone', label: 'SWEEP TONE', min: 0, max: 10, default: 5, unit: '' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'fuzz_wah',
    name: 'Fuzz Wah',
    category: 'Filter',
    gearRef: 'Vintage Combined Fuzz & Wah Pedal',
    description: 'Dose dupla psicodélica: estágio de Fuzz rasgado alimentando diretamente o circuito de Wah.',
    chassis: { bg: '#581c87', border: '#7e22ce', text: '#faf5ff', accent: '#c084fc', led: '#a855f7' },
    knobs: [
      { id: 'fuzz', label: 'FUZZ GAIN', min: 0, max: 10, default: 7, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 6, unit: '' },
      { id: 'pedal', label: 'WAH POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_fuzzwah'
  },
  {
    id: 'lfo_filter',
    name: 'LFO Filter',
    category: 'Filter',
    gearRef: 'AmpliTube Tempo-Synced LFO Filter',
    description: 'Filtro modulado por oscilador LFO sincronizado ao andamento da música.',
    chassis: { bg: '#134e4a', border: '#115e59', text: '#f0fdfa', accent: '#2dd4bf', led: '#14b8a6' },
    knobs: [
      { id: 'rate', label: 'LFO SPEED', min: 0.1, max: 10, default: 2, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 70, unit: '%' },
      { id: 'res', label: 'RESONANCE', min: 1, max: 10, default: 6, unit: '' }
    ],
    dspType: 'filter_lfo'
  },
  {
    id: 'may_wah',
    name: 'May Wah',
    category: 'Filter',
    gearRef: 'Brian May Custom Resonant Foxx Wah',
    description: 'O circuito modificado de Wah usado por Brian May nos solos épicos do Queen.',
    chassis: { bg: '#831843', border: '#9d174d', text: '#fff1f2', accent: '#fb7185', led: '#f43f5e' },
    knobs: [
      { id: 'pedal', label: 'WAH POS', min: 0, max: 100, default: 50, unit: '%' },
      { id: 'q', label: 'Q PEAK', min: 1, max: 10, default: 8, unit: '' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'nutron_iii',
    name: 'Nu-Tron III',
    category: 'Filter',
    gearRef: 'Musitronics Mu-Tron III Envelope Filter',
    description: 'O filtro de envelope mais lendário dos anos 70 (o som funk de Stevie Wonder e Bootsy Collins).',
    chassis: { bg: '#1c1917', border: '#eab308', text: '#fef08a', accent: '#eab308', led: '#ef4444' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 6, unit: '' },
      { id: 'peak', label: 'PEAK', min: 0, max: 10, default: 7, unit: '' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['LP', 'BP', 'HP'], default: 'BP' },
      { id: 'range', label: 'RANGE', options: ['LOW', 'HIGH'], default: 'HIGH' }
    ],
    dspType: 'filter_envelope'
  },
  {
    id: 'rezo',
    name: 'Rezo',
    category: 'Filter',
    gearRef: 'AmpliTube Extreme Resonant Synthesizer Filter',
    description: 'Filtro passa-faixa extremo de sintetizador com auto-oscilação agressiva.',
    chassis: { bg: '#0369a1', border: '#0284c7', text: '#f0f9ff', accent: '#38bdf8', led: '#7dd3fc' },
    knobs: [
      { id: 'cutoff', label: 'CUTOFF', min: 100, max: 8000, default: 1800, unit: 'Hz' },
      { id: 'res', label: 'RESONANCE', min: 1, max: 20, default: 12, unit: '' },
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'filter_resonant'
  },
  {
    id: 'satch_wah',
    name: 'Satch Wah',
    category: 'Filter',
    gearRef: 'Vox Big Bad Wah (Joe Satriani)',
    description: 'O pedal de Wah com indutores duplos (UK vintage e US modern) e botão de Drive de Satriani.',
    chassis: { bg: '#991b1b', border: '#b91c1c', text: '#fef2f2', accent: '#fca5a5', led: '#f59e0b' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 4, unit: '' },
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    switches: [
      { id: 'inductor', label: 'INDUCTOR', options: ['UK', 'US'], default: 'UK' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'star_gate',
    name: 'Star Gate',
    category: 'Filter',
    gearRef: 'AmpliTube Studio Hyper-Tight Gate',
    description: 'Gate de estúdio ultrarrápido projetado para riffs de djent, metal moderno e cortes percussivos.',
    chassis: { bg: '#0f172a', border: '#1e293b', text: '#f8fafc', accent: '#a855f7', led: '#c084fc' },
    knobs: [
      { id: 'threshold', label: 'THRESHOLD', min: -70, max: -10, default: -32, unit: 'dB' },
      { id: 'hold', label: 'HOLD', min: 1, max: 50, default: 10, unit: 'ms' },
      { id: 'decay', label: 'DECAY', min: 5, max: 100, default: 20, unit: 'ms' }
    ],
    dspType: 'dynamics_gate'
  },
  {
    id: 'step_filter',
    name: 'Step Filter',
    category: 'Filter',
    gearRef: 'Boss PH-3 / SL-20 Step Sequenced Filter',
    description: 'Filtro arpegiado em 8 passos rítmicos que cria padrões pulsantes automáticos.',
    chassis: { bg: '#854d0e', border: '#a16207', text: '#fefce8', accent: '#facc15', led: '#eab308' },
    knobs: [
      { id: 'tempo', label: 'STEP TEMPO', min: 60, max: 200, default: 120, unit: 'bpm' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 80, unit: '%' },
      { id: 'res', label: 'RESONANCE', min: 1, max: 10, default: 6, unit: '' }
    ],
    dspType: 'filter_step'
  },
  {
    id: 'wah_gcb95',
    name: 'Wah',
    category: 'Filter',
    gearRef: 'Dunlop Cry Baby GCB95',
    description: 'O pedal de Wah mais vendido de todos os tempos com o clássico indutor vermelho.',
    chassis: { bg: '#18181b', border: '#27272a', text: '#ffffff', accent: '#e4e4e7', led: '#ef4444' },
    knobs: [
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'wah_10',
    name: 'Wah 10',
    category: 'Filter',
    gearRef: 'Ibanez WH10 V1/V2 Wah',
    description: 'O pedal de Wah lendário de John Frusciante no Red Hot Chili Peppers com botão de Depth e chave Guitar/Bass.',
    chassis: { bg: '#52525b', border: '#71717a', text: '#fafafa', accent: '#22c55e', led: '#4ade80' },
    knobs: [
      { id: 'depth', label: 'DEPTH', min: 0, max: 10, default: 8, unit: '' },
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    switches: [
      { id: 'range', label: 'RANGE', options: ['GUITAR', 'BASS'], default: 'GUITAR' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'wah_46',
    name: 'Wah 46',
    category: 'Filter',
    gearRef: 'Vox V846 Clyde McCoy 1968',
    description: 'O clássico vintage italiano dos anos 60 com som aveludado e orgânico.',
    chassis: { bg: '#262626', border: '#525252', text: '#f5f5f5', accent: '#fbbf24', led: '#d97706' },
    knobs: [
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'wah_47',
    name: 'Wah 47',
    category: 'Filter',
    gearRef: 'Vox V847 Italian Halo Inductor',
    description: 'O famoso Wah de 1967 com agudos brilhantes e médios pronunciados.',
    chassis: { bg: '#171717', border: '#404040', text: '#ffffff', accent: '#e5e5e5', led: '#dc2626' },
    knobs: [
      { id: 'pedal', label: 'PEDAL POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_wah'
  },
  {
    id: 'wahdist',
    name: 'WahDist',
    category: 'Filter',
    gearRef: 'AmpliTube Integrated Wah + High Gain Distortion',
    description: 'Combinação potente de filtro Wah dinâmico com estágio de distorção de alto ganho integrado.',
    chassis: { bg: '#7f1d1d', border: '#991b1b', text: '#fee2e2', accent: '#f87171', led: '#ef4444' },
    knobs: [
      { id: 'dist', label: 'DISTORTION', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'pedal', label: 'WAH POS', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_fuzzwah'
  },
  {
    id: 'power_wah_fuzz',
    name: 'Power Wah Fuzz',
    category: 'Filter',
    gearRef: 'Morley Power Wah Fuzz (Cliff Burton)',
    description: 'O colossal pedal cromado óptico de Fuzz + Wah imortalizado por Cliff Burton no Metallica em "Anesthesia (Pulling Teeth)".',
    chassis: { bg: '#334155', border: '#64748b', text: '#f8fafc', accent: '#38bdf8', led: '#ef4444' },
    knobs: [
      { id: 'fuzz', label: 'FUZZ INTENSITY', min: 0, max: 10, default: 8, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'pedal', label: 'TREADLE WAH', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'filter_fuzzwah'
  },

  // =========================================================================
  // 6. FUZZ (7 PEDAIS)
  // =========================================================================
  {
    id: 'class_fuzz',
    name: 'Class Fuzz',
    category: 'Fuzz',
    gearRef: 'Colorsound 1-Knob / Tone Bender Fuzz',
    description: 'Fuzz britânico rasgado dos anos 60 com apenas um botão de controle e atitude vintage pura.',
    chassis: { bg: '#ea580c', border: '#c2410c', text: '#ffffff', accent: '#fde047', led: '#ef4444' },
    knobs: [
      { id: 'fuzz', label: 'FUZZ', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'fuzz_vintage'
  },
  {
    id: 'fuzz_age',
    name: 'Fuzz Age',
    category: 'Fuzz',
    gearRef: 'Dallas Fuzz Face (NKT275 Germanium)',
    description: 'O clássico Fuzz Face de Germânio: aveludado, orgânico e que limpa perfeitamente no volume da guitarra (Jimi Hendrix / Gilmour).',
    chassis: { bg: '#b91c1c', border: '#7f1d1d', text: '#ffffff', accent: '#fca5a5', led: '#ef4444' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 8, unit: '' },
      { id: 'fuzz', label: 'FUZZ', min: 0, max: 10, default: 9, unit: '' }
    ],
    dspType: 'fuzz_germanium'
  },
  {
    id: 'fuzz_age_2',
    name: 'Fuzz Age 2',
    category: 'Fuzz',
    gearRef: 'Dallas Fuzz Face (BC108 Silicon)',
    description: 'O Fuzz Face de Silício: mais cortante, brilhante, agressivo e com ganho extra (Hendrix em Woodstock).',
    chassis: { bg: '#0284c7', border: '#0369a1', text: '#ffffff', accent: '#7dd3fc', led: '#38bdf8' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' },
      { id: 'fuzz', label: 'FUZZ', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'fuzz_silicon'
  },
  {
    id: 'fuzzone',
    name: 'FuzzOne',
    category: 'Fuzz',
    gearRef: 'Maestro FZ-1 Fuzz-Tone 1965',
    description: 'O primeiro pedal de distorção/fuzz comercial da história: o timbre buzzy de "(I Can\'t Get No) Satisfaction" dos Rolling Stones.',
    chassis: { bg: '#ca8a04', border: '#a16207', text: '#451a03', accent: '#78350f', led: '#ef4444' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' },
      { id: 'attack', label: 'ATTACK', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'fuzz_vintage'
  },
  {
    id: 'octa_v',
    name: 'Octa-V',
    category: 'Fuzz',
    gearRef: 'Roger Mayer Octavia (Jimi Hendrix)',
    description: 'O oitavador analógico com fuzz desenvolvido sob medida por Roger Mayer para Hendrix em "Purple Haze".',
    chassis: { bg: '#1c1917', border: '#78716c', text: '#f5f5f4', accent: '#38bdf8', led: '#38bdf8' },
    knobs: [
      { id: 'drive', label: 'DRIVE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'intensity', label: 'OCTAVE INTENSITY', min: 0, max: 10, default: 8, unit: '' }
    ],
    dspType: 'fuzz_octave'
  },
  {
    id: 'rightfuzz',
    name: 'RightFuzz',
    category: 'Fuzz',
    gearRef: "Fulltone '70 / Roger Mayer Axis Fuzz",
    description: 'Fuzz encorpado com controle fino de médios e resposta dinâmica para solos épicos.',
    chassis: { bg: '#1e3a8a', border: '#1e40af', text: '#eff6ff', accent: '#60a5fa', led: '#93c5fd' },
    knobs: [
      { id: 'fuzz', label: 'FUZZ', min: 0, max: 10, default: 8, unit: '' },
      { id: 'mids', label: 'MIDS', min: 0, max: 10, default: 6, unit: '' },
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' }
    ],
    dspType: 'fuzz_silicon'
  },
  {
    id: 'xs_fuzz',
    name: 'XS Fuzz',
    category: 'Fuzz',
    gearRef: 'Roger Mayer Voodoo Axe Extreme Fuzz',
    description: 'Fuzz moderno de alto ganho com sustentação extrema e textura rasgada tipo velcro.',
    chassis: { bg: '#701a75', border: '#86198f', text: '#fdf4ff', accent: '#f472b6', led: '#f43f5e' },
    knobs: [
      { id: 'gain', label: 'GAIN', min: 0, max: 10, default: 9, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'fuzz_vintage'
  },

  // =========================================================================
  // 7. MODULATION (22 PEDAIS)
  // =========================================================================
  {
    id: 'analog_chorus',
    name: 'Analog Chorus',
    category: 'Modulation',
    gearRef: 'Boss CE-2 Analog Chorus',
    description: 'O clássico pedal azul-bebê com circuito analógico BBD para ondas suaves e chorus cremoso.',
    chassis: { bg: '#38bdf8', border: '#0284c7', text: '#082f49', accent: '#0369a1', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.2, max: 8, default: 2.5, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 65, unit: '%' }
    ],
    dspType: 'mod_chorus'
  },
  {
    id: 'analog_flanger',
    name: 'Analog Flanger',
    category: 'Modulation',
    gearRef: 'MXR M-117R Flanger',
    description: 'Flanger analógico poderoso com sweep dramático de turbina a jato e regeneração intensa.',
    chassis: { bg: '#475569', border: '#64748b', text: '#f8fafc', accent: '#38bdf8', led: '#ef4444' },
    knobs: [
      { id: 'manual', label: 'MANUAL', min: 0, max: 10, default: 5, unit: '' },
      { id: 'width', label: 'WIDTH', min: 0, max: 100, default: 75, unit: '%' },
      { id: 'speed', label: 'SPEED', min: 0.1, max: 8, default: 1.5, unit: 'Hz' },
      { id: 'regen', label: 'REGEN', min: 0, max: 100, default: 60, unit: '%' }
    ],
    dspType: 'mod_flanger'
  },
  {
    id: 'chorus_std',
    name: 'Chorus',
    category: 'Modulation',
    gearRef: 'AmpliTube Digital Stereo Chorus',
    description: 'Chorus estéreo límpido e brilhante com controles de velocidade, profundidade e nível.',
    chassis: { bg: '#0369a1', border: '#0284c7', text: '#f0f9ff', accent: '#38bdf8', led: '#38bdf8' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.1, max: 10, default: 3, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'level', label: 'LEVEL', min: 0, max: 100, default: 70, unit: '%' }
    ],
    dspType: 'mod_chorus'
  },
  {
    id: 'chorus_1',
    name: 'Chorus-1',
    category: 'Modulation',
    gearRef: 'Boss CE-1 Chorus Ensemble 1976',
    description: 'O primeiro pedal de Chorus da história: timbre rico, pré-amplificador quente e chave Chorus/Vibrato.',
    chassis: { bg: '#334155', border: '#64748b', text: '#f8fafc', accent: '#f59e0b', led: '#10b981' },
    knobs: [
      { id: 'level', label: 'PREAMP GAIN', min: 0, max: 10, default: 6, unit: '' },
      { id: 'depth', label: 'CHORUS DEPTH', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'rate', label: 'VIBRATO RATE', min: 0.5, max: 12, default: 4, unit: 'Hz' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['CHORUS', 'VIBRATO'], default: 'CHORUS' }
    ],
    dspType: 'mod_ce1'
  },
  {
    id: 'electric_flanger',
    name: 'Electric Flanger',
    category: 'Modulation',
    gearRef: 'Electro-Harmonix Deluxe Electric Mistress',
    description: 'O flanger etéreo e metálico que marcou os solos de David Gilmour no Pink Floyd e Andy Summers no The Police.',
    chassis: { bg: '#e2e8f0', border: '#cbd5e1', text: '#0f172a', accent: '#2563eb', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.1, max: 6, default: 1.2, unit: 'Hz' },
      { id: 'range', label: 'RANGE', min: 0, max: 100, default: 70, unit: '%' },
      { id: 'color', label: 'COLOR', min: 0, max: 100, default: 55, unit: '%' }
    ],
    switches: [
      { id: 'filterMatrix', label: 'MATRIX', options: ['OFF', 'ON'], default: 'OFF' }
    ],
    dspType: 'mod_flanger'
  },
  {
    id: 'flanger_std',
    name: 'Flanger',
    category: 'Modulation',
    gearRef: 'AmpliTube Classic Flanger',
    description: 'Flanger versátil com varreduras harmônicas e espessamento de som.',
    chassis: { bg: '#4338ca', border: '#3730a3', text: '#e0e7ff', accent: '#818cf8', led: '#a5b4fc' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 8, default: 2, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 65, unit: '%' },
      { id: 'feedback', label: 'FEEDBACK', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'mod_flanger'
  },
  {
    id: 'flanger_doubler',
    name: 'Flanger Doubler',
    category: 'Modulation',
    gearRef: 'MXR / ADA Flanger Doubler Studio Unit',
    description: 'Efeito de estúdio para espessamento de voz de guitarra e chorus espacial.',
    chassis: { bg: '#1e1b4b', border: '#312e81', text: '#e0e7ff', accent: '#c084fc', led: '#38bdf8' },
    knobs: [
      { id: 'delay', label: 'DELAY TIME', min: 1, max: 40, default: 15, unit: 'ms' },
      { id: 'width', label: 'SWEEP WIDTH', min: 0, max: 100, default: 60, unit: '%' },
      { id: 'speed', label: 'SPEED', min: 0.1, max: 8, default: 1.5, unit: 'Hz' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'mod_flanger'
  },
  {
    id: 'fox_phaser',
    name: 'FOX Phaser',
    category: 'Modulation',
    gearRef: 'Foxx Foot Phaser 1970s',
    description: 'Phaser vintage encorpado dos anos 70 usado por Brian May no Queen.',
    chassis: { bg: '#831843', border: '#9d174d', text: '#fff1f2', accent: '#fb7185', led: '#f43f5e' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 10, default: 2.2, unit: 'Hz' },
      { id: 'intensity', label: 'INTENSITY', min: 0, max: 100, default: 70, unit: '%' }
    ],
    dspType: 'mod_phaser'
  },
  {
    id: 'metal_flanger',
    name: 'Metal Flanger',
    category: 'Modulation',
    gearRef: 'AmpliTube High-Regen Metal Flanger',
    description: 'Flanger de alta ressonância projetado para cortar na mixagem em solos de alto ganho.',
    chassis: { bg: '#09090b', border: '#27272a', text: '#f43f5e', accent: '#e11d48', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.1, max: 10, default: 2.5, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 80, unit: '%' },
      { id: 'regen', label: 'RESONANCE', min: 0, max: 100, default: 75, unit: '%' }
    ],
    dspType: 'mod_flanger'
  },
  {
    id: 'nirvana',
    name: 'Nirvana',
    category: 'Modulation',
    gearRef: 'Electro-Harmonix Small Clone Analog Chorus',
    description: 'O clássico chorus aquoso e profundo de Kurt Cobain no Nirvana em "Come As You Are".',
    chassis: { bg: '#475569', border: '#64748b', text: '#f8fafc', accent: '#38bdf8', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.2, max: 8, default: 2.2, unit: 'Hz' }
    ],
    switches: [
      { id: 'depth', label: 'DEPTH', options: ['SUBTLE', 'DEEP'], default: 'DEEP' }
    ],
    dspType: 'mod_chorus'
  },
  {
    id: 'opto_tremolo',
    name: 'Opto Tremolo',
    category: 'Modulation',
    gearRef: 'Fender Blackface Optical Tremolo',
    description: 'O autêntico trêmolo óptico a fotocélula dos amplificadores Fender dos anos 60.',
    chassis: { bg: '#1c1917', border: '#44403c', text: '#fafaf9', accent: '#f59e0b', led: '#ef4444' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 1, max: 15, default: 5, unit: 'Hz' },
      { id: 'intensity', label: 'INTENSITY', min: 0, max: 100, default: 65, unit: '%' }
    ],
    dspType: 'mod_tremolo'
  },
  {
    id: 'phaser_std',
    name: 'Phaser',
    category: 'Modulation',
    gearRef: 'AmpliTube 4-Stage Analog Phaser',
    description: 'Phaser clássico de 4 estágios com varredura suave e equilibrada.',
    chassis: { bg: '#ea580c', border: '#c2410c', text: '#ffffff', accent: '#fde047', led: '#ef4444' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 8, default: 1.8, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 70, unit: '%' }
    ],
    dspType: 'mod_phaser'
  },
  {
    id: 'phaze_nine',
    name: 'Phaze Nine',
    category: 'Modulation',
    gearRef: 'MXR Phase 90',
    description: 'O clássico laranjinha de um knob que definiu o som de Eddie Van Halen em "Eruption" e David Gilmour.',
    chassis: { bg: '#f97316', border: '#ea580c', text: '#1c1917', accent: '#000', led: '#ef4444' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 8, default: 2.2, unit: 'Hz' }
    ],
    dspType: 'mod_phaser'
  },
  {
    id: 'phazer10',
    name: 'Phazer10',
    category: 'Modulation',
    gearRef: 'MXR Phase 100',
    description: 'Phaser encorpado com seletor rotativo de 4 curvas de intensidade e formas de onda.',
    chassis: { bg: '#c2410c', border: '#9a3412', text: '#ffffff', accent: '#fed7aa', led: '#ef4444' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 10, default: 2.5, unit: 'Hz' }
    ],
    switches: [
      { id: 'intensity', label: 'INTENSITY', options: ['1', '2', '3', '4'], default: '3' }
    ],
    dspType: 'mod_phaser'
  },
  {
    id: 'seek_trem',
    name: 'Seek Trem',
    category: 'Modulation',
    gearRef: 'Z.Vex Seek Trem 8-Stage Sequencer',
    description: 'Trêmolo rítmico sequenciado em 8 passos tipo sintetizador.',
    chassis: { bg: '#047857', border: '#065f46', text: '#f0fdf4', accent: '#4ade80', led: '#22c55e' },
    knobs: [
      { id: 'tempo', label: 'TEMPO', min: 60, max: 240, default: 120, unit: 'bpm' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 80, unit: '%' }
    ],
    dspType: 'mod_tremolo'
  },
  {
    id: 'seek_wah',
    name: 'Seek Wah',
    category: 'Modulation',
    gearRef: 'Z.Vex Seek Wah 8-Step Sequencer',
    description: 'Filtro passa-faixa arpegiado em 8 passos sincronizados ao andamento.',
    chassis: { bg: '#1d4ed8', border: '#1e40af', text: '#eff6ff', accent: '#60a5fa', led: '#38bdf8' },
    knobs: [
      { id: 'tempo', label: 'TEMPO', min: 60, max: 240, default: 120, unit: 'bpm' },
      { id: 'res', label: 'RESONANCE', min: 1, max: 10, default: 7, unit: '' }
    ],
    dspType: 'filter_step'
  },
  {
    id: 'shape_shifter',
    name: 'Shape Shifter',
    category: 'Modulation',
    gearRef: 'Seymour Duncan Shape Shifter Tap Tremolo',
    description: 'Trêmolo com transição suave de onda senoidal para corte quadrado rígido (stutter) com tap tempo.',
    chassis: { bg: '#78350f', border: '#92400e', text: '#fef3c7', accent: '#fbbf24', led: '#f59e0b' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.5, max: 15, default: 4, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 75, unit: '%' },
      { id: 'shape', label: 'WAVE SHAPE', min: 0, max: 10, default: 5, unit: '' }
    ],
    dspType: 'mod_tremolo'
  },
  {
    id: 'small_phazer',
    name: 'Small Phazer',
    category: 'Modulation',
    gearRef: 'Electro-Harmonix Small Stone',
    description: 'O lendário phaser analógico com a famosa chave Color para varreduras psicodélicas profundas.',
    chassis: { bg: '#334155', border: '#475569', text: '#f8fafc', accent: '#ef4444', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.1, max: 8, default: 1.8, unit: 'Hz' }
    ],
    switches: [
      { id: 'color', label: 'COLOR', options: ['OFF', 'ON'], default: 'ON' }
    ],
    dspType: 'mod_phaser'
  },
  {
    id: 'tremolo_tr2',
    name: 'Tremolo',
    category: 'Modulation',
    gearRef: 'Boss TR-2 Tremolo',
    description: 'O clássico pedal verde de trêmolo com controle de forma de onda (Wave: Triangular a Quadrada).',
    chassis: { bg: '#15803d', border: '#166534', text: '#f0fdf4', accent: '#bbf7d0', led: '#ef4444' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 1, max: 15, default: 5, unit: 'Hz' },
      { id: 'wave', label: 'WAVE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 60, unit: '%' }
    ],
    dspType: 'mod_tremolo'
  },
  {
    id: 'uni_v',
    name: 'Uni-V',
    category: 'Modulation',
    gearRef: 'Shin-ei / Univox Uni-Vibe 1968',
    description: 'O mítico efeito de 4 estágios com fotocélulas e lâmpada incandescente (Jimi Hendrix em Woodstock e Robin Trower).',
    chassis: { bg: '#713f12', border: '#854d0e', text: '#fef9c3', accent: '#eab308', led: '#facc15' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' },
      { id: 'intensity', label: 'INTENSITY', min: 0, max: 100, default: 75, unit: '%' },
      { id: 'speed', label: 'SPEED', min: 0.5, max: 8, default: 2.8, unit: 'Hz' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['CHORUS', 'VIBRATO'], default: 'CHORUS' }
    ],
    dspType: 'mod_univibe'
  },
  {
    id: 'x_chorus',
    name: 'X-Chorus',
    category: 'Modulation',
    gearRef: 'IK Multimedia X-GEAR X-CHORUS',
    description: 'Pedal DSP com algoritmos de Chorus de altíssima definição estéreo.',
    chassis: { bg: '#0369a1', border: '#0284c7', text: '#f0f9ff', accent: '#38bdf8', led: '#7dd3fc' },
    knobs: [
      { id: 'rate', label: 'RATE', min: 0.1, max: 10, default: 2.5, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 65, unit: '%' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'mod_chorus'
  },
  {
    id: 'x_vibe',
    name: 'X-VIBE',
    category: 'Modulation',
    gearRef: 'IK Multimedia X-GEAR X-VIBE DSP Pedal',
    description: 'O carro-chefe da modulação com 16 algoritmos de estúdio (Chorus, Flanger, Phaser, Tremolo, Rotary, Vibrato, Uni-Vibe).',
    chassis: { bg: '#581c87', border: '#6b21a8', text: '#faf5ff', accent: '#c084fc', led: '#a855f7' },
    knobs: [
      { id: 'speed', label: 'SPEED', min: 0.1, max: 12, default: 3, unit: 'Hz' },
      { id: 'depth', label: 'DEPTH', min: 0, max: 100, default: 70, unit: '%' },
      { id: 'filter', label: 'FILTER', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    switches: [
      { id: 'model', label: 'ALGO', options: ['CHORUS', 'PHASER', 'ROTARY', 'TREMOLO'], default: 'CHORUS' }
    ],
    dspType: 'mod_xvibe'
  },

  // =========================================================================
  // 8. PITCH & HARMONY (7 PEDAIS)
  // =========================================================================
  {
    id: 'blender',
    name: 'Blender',
    category: 'Pitch',
    gearRef: 'Fender Blender Custom Fuzz / Octave (1968)',
    description: 'Fuzz agressivo com oitava superior e botão Blend para misturar sinal limpo e saturado.',
    chassis: { bg: '#a8a29e', border: '#78716c', text: '#1c1917', accent: '#dc2626', led: '#ef4444' },
    knobs: [
      { id: 'volume', label: 'VOLUME', min: 0, max: 10, default: 7, unit: '' },
      { id: 'sustain', label: 'SUSTAIN', min: 0, max: 10, default: 8, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 5, unit: '' },
      { id: 'blend', label: 'BLEND', min: 0, max: 100, default: 60, unit: '%' }
    ],
    switches: [
      { id: 'boost', label: 'TONE BOOST', options: ['OFF', 'ON'], default: 'ON' }
    ],
    dspType: 'fuzz_octave'
  },
  {
    id: 'harmonator',
    name: 'Harmonator',
    category: 'Pitch',
    gearRef: 'Eventide / Intelligent Diatonic Harmonizer',
    description: 'Harmonizador diatônico inteligente que adiciona segundas, terças, quintas ou oitavas no tom da música.',
    chassis: { bg: '#b45309', border: '#92400e', text: '#fffbeb', accent: '#f59e0b', led: '#fde047' },
    knobs: [
      { id: 'key', label: 'KEY (A-G)', min: 0, max: 11, default: 9, unit: 'note' },
      { id: 'interval', label: 'INTERVAL', min: -12, max: 12, default: 4, unit: 'semi' },
      { id: 'mix', label: 'HARMONY MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'pitch_harmonizer'
  },
  {
    id: 'octav',
    name: 'Octav',
    category: 'Pitch',
    gearRef: 'Boss OC-2 Octave',
    description: 'O clássico pedal marrom que adiciona 1 e 2 oitavas abaixo com calor analógico.',
    chassis: { bg: '#5c3a21', border: '#78472a', text: '#ffedd5', accent: '#ea580c', led: '#ef4444' },
    knobs: [
      { id: 'direct', label: 'DIRECT LEVEL', min: 0, max: 10, default: 8, unit: '' },
      { id: 'oct1', label: 'OCT 1', min: 0, max: 10, default: 6, unit: '' },
      { id: 'oct2', label: 'OCT 2', min: 0, max: 10, default: 3, unit: '' }
    ],
    dspType: 'pitch_octav'
  },
  {
    id: 'pitch_shifter',
    name: 'Pitch Shifter',
    category: 'Pitch',
    gearRef: 'Boss PS-5 / PS-6 Super Shifter',
    description: 'Transpositor contínuo de afinação em tempo real de -12 a +12 semitons.',
    chassis: { bg: '#c2410c', border: '#9a3412', text: '#ffffff', accent: '#fed7aa', led: '#ef4444' },
    knobs: [
      { id: 'pitch', label: 'PITCH SHIFT', min: -12, max: 12, default: 0, unit: 'semi' },
      { id: 'balance', label: 'BALANCE', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'pitch_shifter'
  },
  {
    id: 'satch_octave',
    name: 'Satch Octave',
    category: 'Pitch',
    gearRef: 'Vox Time Machine / Satch Dual Octave',
    description: 'Oitavador com modulação e ganho expressivo de Joe Satriani.',
    chassis: { bg: '#78716c', border: '#57534e', text: '#fafaf9', accent: '#f59e0b', led: '#10b981' },
    knobs: [
      { id: 'octave', label: 'OCTAVE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 50, unit: '%' }
    ],
    dspType: 'pitch_octav'
  },
  {
    id: 'svx_oct',
    name: 'SVX-OCT',
    category: 'Pitch',
    gearRef: 'Ampeg SVX Analog Sub-Octaver',
    description: 'Sub-oitavador encorpado para linhas pesadas e timbres gordos de contrabaixo e guitarra.',
    chassis: { bg: '#1f2937', border: '#374151', text: '#f3f4f6', accent: '#60a5fa', led: '#3b82f6' },
    knobs: [
      { id: 'direct', label: 'DIRECT', min: 0, max: 10, default: 7, unit: '' },
      { id: 'sub', label: 'SUB OCTAVE', min: 0, max: 10, default: 6, unit: '' }
    ],
    dspType: 'pitch_octav'
  },
  {
    id: 'wharmonator',
    name: 'Wharmonator',
    category: 'Pitch',
    gearRef: 'DigiTech Whammy 4 / 5 Pitch Bender',
    description: 'O lendário pedal vermelho com pedal de expressão: saltos de 2 oitavas, dive bombs e harmonizações (Tom Morello, Dimebag, Jack White).',
    chassis: { bg: '#991b1b', border: '#7f1d1d', text: '#fee2e2', accent: '#ef4444', led: '#ef4444' },
    knobs: [
      { id: 'pedal', label: 'WHAMMY TREADLE', min: 0, max: 100, default: 0, unit: '%' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['+2 OCT UP', '+1 OCT UP', '-1 OCT DOWN', '-2 DIVE BOMB'], default: '+2 OCT UP' }
    ],
    dspType: 'pitch_whammy'
  },

  // =========================================================================
  // 9. REVERB (2 PEDAIS)
  // =========================================================================
  {
    id: 'reverb_63',
    name: "'63 Reverb",
    category: 'Reverb',
    gearRef: "Fender '63 Reverb Tank (Boss FRV-1)",
    description: 'O autêntico tanque valvulado de reverb de mola da Fender: o clássico som estalado ("drip") do Surf Rock e Blues.',
    chassis: { bg: '#5c3a21', border: '#78472a', text: '#fef3c7', accent: '#d97706', led: '#f59e0b' },
    knobs: [
      { id: 'dwell', label: 'DWELL', min: 0, max: 10, default: 7, unit: '' },
      { id: 'tone', label: 'TONE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 55, unit: '%' }
    ],
    dspType: 'reverb_spring'
  },
  {
    id: 'x_space',
    name: 'X-SPACE',
    category: 'Reverb',
    gearRef: 'IK Multimedia X-GEAR X-SPACE Reverb Pedal',
    description: 'Pedal DSP com 16 algoritmos de estúdio de alta definição (Shimmer, Hall, Plate, Spring, Room, Swell).',
    chassis: { bg: '#064e3b', border: '#065f46', text: '#ecfdf5', accent: '#34d399', led: '#10b981' },
    knobs: [
      { id: 'time', label: 'DECAY TIME', min: 0.5, max: 10, default: 3.5, unit: 's' },
      { id: 'predelay', label: 'PRE-DELAY', min: 0, max: 200, default: 30, unit: 'ms' },
      { id: 'color', label: 'DAMP / COLOR', min: 0, max: 10, default: 5, unit: '' },
      { id: 'mix', label: 'MIX', min: 0, max: 100, default: 45, unit: '%' }
    ],
    switches: [
      { id: 'algo', label: 'ALGO', options: ['SHIMMER', 'HALL', 'PLATE', 'SPRING'], default: 'HALL' }
    ],
    dspType: 'reverb_xspace'
  },

  // =========================================================================
  // 10. OTHER / UTILITÁRIOS ESPECIAIS (6 PEDAIS)
  // =========================================================================
  {
    id: 'acoustic_sim',
    name: 'Acoustic Sim',
    category: 'Other',
    gearRef: 'Boss AC-2 / AC-3 Acoustic Simulator',
    description: 'Transforma o som do captador da guitarra elétrica no corpo e ressonância de um violão acústico.',
    chassis: { bg: '#854d0e', border: '#a16207', text: '#fefce8', accent: '#facc15', led: '#eab308' },
    knobs: [
      { id: 'body', label: 'BODY RESONANCE', min: 0, max: 10, default: 7, unit: '' },
      { id: 'top', label: 'TOP BRILLIANCE', min: 0, max: 10, default: 6, unit: '' },
      { id: 'level', label: 'LEVEL', min: 0, max: 10, default: 7, unit: '' }
    ],
    switches: [
      { id: 'mode', label: 'MODE', options: ['STANDARD', 'JUMBO', 'PIEZO'], default: 'STANDARD' }
    ],
    dspType: 'other_acousticsim'
  },
  {
    id: 'fender_volume',
    name: 'Fender Volume',
    category: 'Other',
    gearRef: 'Fender Vintage Passive Volume Pedal',
    description: 'Pedal de volume com curva suave para dinâmicas e swells expressivos.',
    chassis: { bg: '#1c1917', border: '#44403c', text: '#fafaf9', accent: '#e5e5e5', led: '#10b981' },
    knobs: [
      { id: 'pedal', label: 'VOLUME', min: 0, max: 100, default: 100, unit: '%' },
      { id: 'minVol', label: 'MIN VOL', min: 0, max: 50, default: 0, unit: '%' }
    ],
    dspType: 'other_volume'
  },
  {
    id: 'step_slicer',
    name: 'Step Slicer',
    category: 'Other',
    gearRef: 'Boss SL-20 Slicer',
    description: 'Fatiador rítmico que transforma acordes sustentados em pulsos percussivos sincronizados ao tempo.',
    chassis: { bg: '#111827', border: '#374151', text: '#f97316', accent: '#ea580c', led: '#f97316' },
    knobs: [
      { id: 'tempo', label: 'TEMPO', min: 60, max: 240, default: 120, unit: 'bpm' },
      { id: 'attack', label: 'ATTACK', min: 0, max: 10, default: 7, unit: '' },
      { id: 'mix', label: 'SLICE MIX', min: 0, max: 100, default: 80, unit: '%' }
    ],
    dspType: 'other_slicer'
  },
  {
    id: 'svx_volume',
    name: 'SVX Volume',
    category: 'Other',
    gearRef: 'Ampeg SVX Studio Volume Pedal',
    description: 'Pedal de controle de ganho e volume da linha Ampeg SVX.',
    chassis: { bg: '#18181b', border: '#27272a', text: '#f4f4f5', accent: '#3b82f6', led: '#60a5fa' },
    knobs: [
      { id: 'pedal', label: 'LEVEL', min: 0, max: 100, default: 100, unit: '%' }
    ],
    dspType: 'other_volume'
  },
  {
    id: 'swell',
    name: 'Swell',
    category: 'Other',
    gearRef: 'Boss SG-1 Slow Gear / Guyatone SV-2',
    description: 'Remove o ataque da palhetada criando o efeito suave de violino, violoncelo e sintetizador ambiente.',
    chassis: { bg: '#334155', border: '#475569', text: '#f8fafc', accent: '#c084fc', led: '#a855f7' },
    knobs: [
      { id: 'sens', label: 'SENSITIVITY', min: 0, max: 10, default: 6, unit: '' },
      { id: 'attack', label: 'ATTACK TIME', min: 50, max: 1200, default: 450, unit: 'ms' }
    ],
    dspType: 'other_swell'
  },
  {
    id: 'volume_std',
    name: 'Volume',
    category: 'Other',
    gearRef: 'AmpliTube Standard Studio Volume Pedal',
    description: 'Pedal de volume com controle linear e corte suave.',
    chassis: { bg: '#262626', border: '#404040', text: '#ffffff', accent: '#d4d4d4', led: '#10b981' },
    knobs: [
      { id: 'pedal', label: 'VOLUME', min: 0, max: 100, default: 100, unit: '%' }
    ],
    dspType: 'other_volume'
  }
];

// Preset Padrão (Clean)
export const ARTIST_PRESETS = [
  {
    id: 'padrao',
    name: 'Padrão (Som Limpo)',
    artist: 'FretFlow',
    description: 'Som limpo e cristalino direto no amplificador Fender Twin Reverb, sem pedais na cadeia.',
    pedalIds: [],
    ampId: '65_twin_reverb'
  }
];

export { AMPLITUBE_AMPS, AMP_CATEGORIES } from './amplitubeAmps.js';


