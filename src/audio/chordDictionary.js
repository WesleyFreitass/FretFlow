// 12 Semitones mapped to note names
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_NAMES_PT = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

// Standard guitar string frequencies (E2, A2, D3, G3, B3, E4)
export const GUITAR_STRINGS = [
  { index: 6, name: 'E2', note: 'E', octave: 2, freq: 82.41, label: '6ª Mi (Grave)' },
  { index: 5, name: 'A2', note: 'A', octave: 2, freq: 110.00, label: '5ª Lá' },
  { index: 4, name: 'D3', note: 'D', octave: 3, freq: 146.83, label: '4ª Ré' },
  { index: 3, name: 'G3', note: 'G', octave: 3, freq: 196.00, label: '3ª Sol' },
  { index: 2, name: 'B3', note: 'B', octave: 3, freq: 246.94, label: '2ª Si' },
  { index: 1, name: 'E4', note: 'E', octave: 4, freq: 329.63, label: '1ª Mi (Aguda)' },
];

/**
 * Standard chord templates for Chromagram matching.
 * Pitch classes: 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
 * frets: [E6, A5, D4, G3, B2, E1] - number or -1 for muted (x)
 * fingers: [E6, A5, D4, G3, B2, E1] - finger number 1=index, 2=middle, 3=ring, 4=pinky, 0=open, -1=muted
 */
export const CHORD_DEFINITIONS = {
  // MAJORS
  'C': {
    name: 'C',
    fullName: 'Dó Maior',
    category: 'Major',
    root: 'C',
    notes: ['C', 'E', 'G'],
    pitchClasses: [0, 4, 7], // C, E, G
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [-1, 3, 2, 0, 1, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'D': {
    name: 'D',
    fullName: 'Ré Maior',
    category: 'Major',
    root: 'D',
    notes: ['D', 'F#', 'A'],
    pitchClasses: [2, 6, 9], // D, F#, A
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [-1, -1, 0, 1, 3, 2],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'E': {
    name: 'E',
    fullName: 'Mi Maior',
    category: 'Major',
    root: 'E',
    notes: ['E', 'G#', 'B'],
    pitchClasses: [4, 8, 11], // E, G#, B
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'F': {
    name: 'F',
    fullName: 'Fá Maior',
    category: 'Major',
    root: 'F',
    notes: ['F', 'A', 'C'],
    pitchClasses: [5, 9, 0], // F, A, C
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 1,
    difficulty: 'Médio (Pestana)'
  },
  'G': {
    name: 'G',
    fullName: 'Sol Maior',
    category: 'Major',
    root: 'G',
    notes: ['G', 'B', 'D'],
    pitchClasses: [7, 11, 2], // G, B, D
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'A': {
    name: 'A',
    fullName: 'Lá Maior',
    category: 'Major',
    root: 'A',
    notes: ['A', 'C#', 'E'],
    pitchClasses: [9, 1, 4], // A, C#, E
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [-1, 0, 1, 2, 3, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'B': {
    name: 'B',
    fullName: 'Si Maior',
    category: 'Major',
    root: 'B',
    notes: ['B', 'D#', 'F#'],
    pitchClasses: [11, 3, 6], // B, D#, F#
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 2,
    difficulty: 'Médio (Pestana)'
  },

  // MINORS
  'Am': {
    name: 'Am',
    fullName: 'Lá Menor',
    category: 'Minor',
    root: 'A',
    notes: ['A', 'C', 'E'],
    pitchClasses: [9, 0, 4], // A, C, E
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [-1, 0, 2, 3, 1, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'Em': {
    name: 'Em',
    fullName: 'Mi Menor',
    category: 'Minor',
    root: 'E',
    notes: ['E', 'G', 'B'],
    pitchClasses: [4, 7, 11], // E, G, B
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
    difficulty: 'Muito Fácil'
  },
  'Dm': {
    name: 'Dm',
    fullName: 'Ré Menor',
    category: 'Minor',
    root: 'D',
    notes: ['D', 'F', 'A'],
    pitchClasses: [2, 5, 9], // D, F, A
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [-1, -1, 0, 2, 3, 1],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'Bm': {
    name: 'Bm',
    fullName: 'Si Menor',
    category: 'Minor',
    root: 'B',
    notes: ['B', 'D', 'F#'],
    pitchClasses: [11, 2, 6], // B, D, F#
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 2,
    difficulty: 'Médio (Pestana)'
  },
  'Fm': {
    name: 'Fm',
    fullName: 'Fá Menor',
    category: 'Minor',
    root: 'F',
    notes: ['F', 'G#', 'C'],
    pitchClasses: [5, 8, 0],
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 1,
    difficulty: 'Médio (Pestana)'
  },
  'Gm': {
    name: 'Gm',
    fullName: 'Sol Menor',
    category: 'Minor',
    root: 'G',
    notes: ['G', 'A#', 'D'],
    pitchClasses: [7, 10, 2],
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 3,
    difficulty: 'Médio (Pestana)'
  },

  // SEVENTHS / DOMINANTS
  'C7': {
    name: 'C7',
    fullName: 'Dó com Sétima',
    category: '7th',
    root: 'C',
    notes: ['C', 'E', 'G', 'A#'],
    pitchClasses: [0, 4, 7, 10],
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [-1, 3, 2, 4, 1, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'D7': {
    name: 'D7',
    fullName: 'Ré com Sétima',
    category: '7th',
    root: 'D',
    notes: ['D', 'F#', 'A', 'C'],
    pitchClasses: [2, 6, 9, 0],
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [-1, -1, 0, 2, 1, 3],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'E7': {
    name: 'E7',
    fullName: 'Mi com Sétima',
    category: '7th',
    root: 'E',
    notes: ['E', 'G#', 'B', 'D'],
    pitchClasses: [4, 8, 11, 2],
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    baseFret: 1,
    difficulty: 'Muito Fácil'
  },
  'G7': {
    name: 'G7',
    fullName: 'Sol com Sétima',
    category: '7th',
    root: 'G',
    notes: ['G', 'B', 'D', 'F'],
    pitchClasses: [7, 11, 2, 5],
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'A7': {
    name: 'A7',
    fullName: 'Lá com Sétima',
    category: '7th',
    root: 'A',
    notes: ['A', 'C#', 'E', 'G'],
    pitchClasses: [9, 1, 4, 7],
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [-1, 0, 2, 0, 3, 0],
    baseFret: 1,
    difficulty: 'Fácil'
  },
  'B7': {
    name: 'B7',
    fullName: 'Si com Sétima',
    category: '7th',
    root: 'B',
    notes: ['B', 'D#', 'F#', 'A'],
    pitchClasses: [11, 3, 6, 9],
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [-1, 2, 1, 3, 0, 4],
    baseFret: 1,
    difficulty: 'Médio'
  },

  // POWER CHORDS (5th)
  'C5': {
    name: 'C5',
    fullName: 'Dó Power Chord',
    category: 'Power Chord',
    root: 'C',
    notes: ['C', 'G'],
    pitchClasses: [0, 7],
    frets: [-1, 3, 5, 5, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 3,
    difficulty: 'Fácil (Rock)'
  },
  'D5': {
    name: 'D5',
    fullName: 'Ré Power Chord',
    category: 'Power Chord',
    root: 'D',
    notes: ['D', 'A'],
    pitchClasses: [2, 9],
    frets: [-1, 5, 7, 7, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 5,
    difficulty: 'Fácil (Rock)'
  },
  'E5': {
    name: 'E5',
    fullName: 'Mi Power Chord',
    category: 'Power Chord',
    root: 'E',
    notes: ['E', 'B'],
    pitchClasses: [4, 11],
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 1, 2, -1, -1, -1],
    baseFret: 1,
    difficulty: 'Muito Fácil'
  },
  'G5': {
    name: 'G5',
    fullName: 'Sol Power Chord',
    category: 'Power Chord',
    root: 'G',
    notes: ['G', 'D'],
    pitchClasses: [7, 2],
    frets: [3, 5, 5, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 3,
    difficulty: 'Fácil (Rock)'
  },
  'A5': {
    name: 'A5',
    fullName: 'Lá Power Chord',
    category: 'Power Chord',
    root: 'A',
    notes: ['A', 'E'],
    pitchClasses: [9, 4],
    frets: [-1, 0, 2, 2, -1, -1],
    fingers: [-1, 0, 1, 2, -1, -1],
    baseFret: 1,
    difficulty: 'Muito Fácil'
  }
};

/**
 * Converts frequency in Hz to MIDI note number and Note details
 */
export function frequencyToNote(frequency) {
  if (!frequency || frequency < 20 || frequency > 5000) return null;
  
  // A4 = 440 Hz = MIDI 69
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  const midi = Math.round(noteNum);
  const cents = Math.round((noteNum - midi) * 100);
  
  const noteIndex = (midi % 12 + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex];
  const noteNamePt = NOTE_NAMES_PT[noteIndex];
  
  // Calculate target standard frequency for this exact MIDI note
  const standardFreq = 440 * Math.pow(2, (midi - 69) / 12);
  
  return {
    frequency,
    standardFreq,
    midi,
    noteIndex,
    noteName,
    noteNamePt,
    octave,
    fullName: `${noteName}${octave}`,
    cents // Deviation from perfect tune (-50 to +50)
  };
}

// Open string base MIDI / Pitch classes for 6 strings (E2=4, A2=9, D3=2, G3=7, B3=11, E4=4)
const STRING_ROOT_PCS = [4, 9, 2, 7, 11, 4];

/**
 * Identifies chord name and characteristics from a 6-string fret array or pitch classes
 * frets: [E6, A5, D4, G3, B2, E1] where -1 = muted/unused, 0..24 = fret number
 */
export function identifyChordFromFrets(frets) {
  if (!Array.isArray(frets) || frets.length < 6) return null;

  const notesInfo = [];
  let bassNote = null;
  let bassPc = null;

  for (let s = 0; s < 6; s++) {
    const fret = frets[s];
    if (fret !== undefined && fret >= 0) {
      const pc = (STRING_ROOT_PCS[s] + fret) % 12;
      const noteName = NOTE_NAMES[pc];
      notesInfo.push({ string: s + 1, fret, pc, noteName });
      if (bassPc === null) {
        bassPc = pc;
        bassNote = noteName;
      }
    }
  }

  if (notesInfo.length === 0) return null;

  const uniquePcs = Array.from(new Set(notesInfo.map(n => n.pc)));
  const uniqueNoteNames = uniquePcs.map(pc => NOTE_NAMES[pc]);

  // If single note
  if (uniquePcs.length === 1) {
    const rootName = NOTE_NAMES[uniquePcs[0]];
    return {
      name: rootName,
      fullName: `Nota ${rootName} (${NOTE_NAMES_PT[uniquePcs[0]]})`,
      quality: 'single_note',
      root: rootName,
      bass: bassNote,
      notes: uniqueNoteNames,
      pitchClasses: uniquePcs,
      intervals: ['1P']
    };
  }

  // Find matching template in CHORD_DEFINITIONS first
  for (const [key, def] of Object.entries(CHORD_DEFINITIONS)) {
    if (def.pitchClasses && def.pitchClasses.length === uniquePcs.length) {
      const allMatch = def.pitchClasses.every(pc => uniquePcs.includes(pc));
      if (allMatch) {
        const isSlash = bassNote && bassNote !== def.root;
        return {
          name: isSlash ? `${def.name}/${bassNote}` : def.name,
          fullName: isSlash ? `${def.fullName} com baixo em ${bassNote}` : def.fullName,
          quality: def.category || 'Major',
          root: def.root,
          bass: bassNote,
          notes: uniqueNoteNames,
          pitchClasses: uniquePcs,
          intervals: def.notes || []
        };
      }
    }
  }

  // Harmonic Pattern Matcher for all extensions and inversions
  const CHORD_FORMULAS = [
    { type: 'Maior', symbol: '', intervals: [0, 4, 7], quality: 'Major' },
    { type: 'Menor', symbol: 'm', intervals: [0, 3, 7], quality: 'Minor' },
    { type: 'Sétima Dominante', symbol: '7', intervals: [0, 4, 7, 10], quality: 'Dominant 7' },
    { type: 'Sétima Maior', symbol: '7M', intervals: [0, 4, 7, 11], quality: 'Major 7' },
    { type: 'Menor com Sétima', symbol: 'm7', intervals: [0, 3, 7, 10], quality: 'Minor 7' },
    { type: 'Menor com Sétima Maior', symbol: 'm(7M)', intervals: [0, 3, 7, 11], quality: 'Minor Major 7' },
    { type: 'Suspenso 4', symbol: 'sus4', intervals: [0, 5, 7], quality: 'Suspended' },
    { type: 'Suspenso 2', symbol: 'sus2', intervals: [0, 2, 7], quality: 'Suspended' },
    { type: 'Adicionado 9', symbol: 'add9', intervals: [0, 4, 7, 2], quality: 'Add 9' },
    { type: 'Menor add9', symbol: 'm(add9)', intervals: [0, 3, 7, 2], quality: 'Minor Add 9' },
    { type: 'Nona Maior', symbol: '7M(9)', intervals: [0, 4, 7, 11, 2], quality: 'Major 9' },
    { type: 'Nona Dominante', symbol: '9', intervals: [0, 4, 7, 10, 2], quality: 'Dominant 9' },
    { type: 'Menor com Nona', symbol: 'm9', intervals: [0, 3, 7, 10, 2], quality: 'Minor 9' },
    { type: 'Sexta', symbol: '6', intervals: [0, 4, 7, 9], quality: 'Major 6' },
    { type: 'Menor com Sexta', symbol: 'm6', intervals: [0, 3, 7, 9], quality: 'Minor 6' },
    { type: 'Meio-Diminuto', symbol: 'm7(b5)', intervals: [0, 3, 6, 10], quality: 'Half-Diminished' },
    { type: 'Diminuto', symbol: 'dim', intervals: [0, 3, 6], quality: 'Diminished' },
    { type: 'Diminuto com 7ª', symbol: 'dim7', intervals: [0, 3, 6, 9], quality: 'Diminished 7' },
    { type: 'Aumentado', symbol: 'aug', intervals: [0, 4, 8], quality: 'Augmented' },
    { type: 'Power Chord', symbol: '5', intervals: [0, 7], quality: 'Power Chord' }
  ];

  // Try candidate roots, preferring the bass note
  const candidates = [bassPc, ...uniquePcs.filter(pc => pc !== bassPc)];
  let bestMatch = null;
  let highestScore = -1;

  for (const candidateRoot of candidates) {
    if (candidateRoot === null) continue;
    const rootName = NOTE_NAMES[candidateRoot];

    // Relative intervals from this candidate root
    const relIntervals = uniquePcs.map(pc => (pc - candidateRoot + 12) % 12);

    for (const formula of CHORD_FORMULAS) {
      const matchedIntervals = formula.intervals.filter(i => relIntervals.includes(i));
      const unmatchedInFormula = formula.intervals.filter(i => !relIntervals.includes(i));
      const extraInChord = relIntervals.filter(i => !formula.intervals.includes(i));

      // Calculate matching score
      if (matchedIntervals.includes(0)) { // Must contain root
        let score = (matchedIntervals.length * 2) - (unmatchedInFormula.length * 0.8) - (extraInChord.length * 1.5);
        if (candidateRoot === bassPc) score += 0.5; // Favor root in bass

        if (score > highestScore && matchedIntervals.length >= Math.min(2, formula.intervals.length)) {
          highestScore = score;
          const isSlash = bassNote && bassNote !== rootName;
          bestMatch = {
            name: isSlash ? `${rootName}${formula.symbol}/${bassNote}` : `${rootName}${formula.symbol}`,
            fullName: `${NOTE_NAMES_PT[candidateRoot]} ${formula.type}${isSlash ? ` (Baixo em ${bassNote})` : ''}`,
            quality: formula.quality,
            root: rootName,
            bass: bassNote,
            notes: uniqueNoteNames,
            pitchClasses: uniquePcs
          };
        }
      }
    }
  }

  if (bestMatch) return bestMatch;

  // Generic fallback if unknown cluster
  const primaryRoot = NOTE_NAMES[bassPc !== null ? bassPc : uniquePcs[0]];
  return {
    name: `${primaryRoot}(Cluster)`,
    fullName: `Harmonia de ${uniqueNoteNames.join('-')}`,
    quality: 'Custom',
    root: primaryRoot,
    bass: bassNote || primaryRoot,
    notes: uniqueNoteNames,
    pitchClasses: uniquePcs
  };
}

/**
 * Returns highly musical compatible scales for improvisation based on chord root & quality
 */
export function getCompatibleScalesForChord(root, quality = 'Major') {
  if (!root) return [];
  const rootIndex = NOTE_NAMES.indexOf(root);
  if (rootIndex === -1) return [];

  const getNotes = (intervals) => intervals.map(i => NOTE_NAMES[(rootIndex + i) % 12]);
  const getPcs = (intervals) => intervals.map(i => (rootIndex + i) % 12);

  const qual = String(quality).toLowerCase();

  if (qual.includes('single') || qual.includes('nota')) {
    return [
      {
        name: `Pentatônica Menor de ${root}`,
        type: 'pentatonic_minor',
        notes: getNotes([0, 3, 5, 7, 10]),
        pitchClasses: getPcs([0, 3, 5, 7, 10]),
        mood: 'Blues / Rock / Solo Clássico',
        desc: `A escala mais usada na guitarra para improvisar sobre a tônica ${root}.`,
        compatibility: '100% — Solo Direto'
      },
      {
        name: `Pentatônica Maior de ${root}`,
        type: 'pentatonic_major',
        notes: getNotes([0, 2, 4, 7, 9]),
        pitchClasses: getPcs([0, 2, 4, 7, 9]),
        mood: 'Melódica & Pop',
        desc: `Sonoridade doce e limpa construída sobre a nota fundamental ${root}.`,
        compatibility: '95% — Melódica'
      },
      {
        name: `Escala Blues (Hexatônica) de ${root}`,
        type: 'blues',
        notes: getNotes([0, 3, 5, 6, 7, 10]),
        pitchClasses: getPcs([0, 3, 5, 6, 7, 10]),
        mood: 'Texas Blues / Pegada Rock',
        desc: `Inclui a famosa Blue Note para fraseados e bends expressivos em ${root}.`,
        compatibility: '92% — Fraseados Blues'
      },
      {
        name: `Escala Maior Natural de ${root}`,
        type: 'major',
        notes: getNotes([0, 2, 4, 5, 7, 9, 11]),
        pitchClasses: getPcs([0, 2, 4, 5, 7, 9, 11]),
        mood: 'Brilhante & Completa',
        desc: `Todas as 7 notas da escala diatônica em ${root}.`,
        compatibility: '90% — Completa'
      }
    ];
  }

  if (qual.includes('minor') || qual.includes('menor') || qual.includes('m7') || qual.includes('m9')) {
    return [
      {
        name: `Pentatônica Menor de ${root}`,
        type: 'pentatonic_minor',
        notes: getNotes([0, 3, 5, 7, 10]),
        pitchClasses: getPcs([0, 3, 5, 7, 10]),
        mood: 'Blues / Rock / Direto',
        desc: 'A escala mais versátil e infalível para solos expressivos sobre acordes menores.',
        compatibility: '100% — Escolha Principal'
      },
      {
        name: `Modo Dórico de ${root}`,
        type: 'dorian',
        notes: getNotes([0, 2, 3, 5, 7, 9, 10]),
        pitchClasses: getPcs([0, 2, 3, 5, 7, 9, 10]),
        mood: 'Funk / Fusion / Santana',
        desc: 'Sonoridade menor sofisticada com 6ª maior (9ª e 13ª naturais). Usada por Carlos Santana e Pink Floyd.',
        compatibility: '95% — Recomendada'
      },
      {
        name: `Escala Blues (Hexatônica) de ${root}`,
        type: 'blues',
        notes: getNotes([0, 3, 5, 6, 7, 10]),
        pitchClasses: getPcs([0, 3, 5, 6, 7, 10]),
        mood: 'Blues Tradicional / Agilidade',
        desc: 'Inclui a famosa Blue Note (5ª diminuta) para bends rasgados e fraseados de tensão/resolução.',
        compatibility: '90% — Ótima para Licks'
      },
      {
        name: `Modo Eólio (Menor Natural) de ${root}`,
        type: 'aeolian',
        notes: getNotes([0, 2, 3, 5, 7, 8, 10]),
        pitchClasses: getPcs([0, 2, 3, 5, 7, 8, 10]),
        mood: 'Melancólico / Hard Rock / Heavy Metal',
        desc: 'Escala menor clássica com 6ª menor, excelente para baladas e temas cinematográficos.',
        compatibility: '88% — Baladas & Metal'
      }
    ];
  }

  if (qual.includes('dominant') || qual.includes('7') || qual.includes('9') || qual.includes('13')) {
    return [
      {
        name: `Modo Mixolídio de ${root}`,
        type: 'mixolydian',
        notes: getNotes([0, 2, 4, 5, 7, 9, 10]),
        pitchClasses: getPcs([0, 2, 4, 5, 7, 9, 10]),
        mood: 'Classic Rock / Blues / Funk',
        desc: 'A escala definitiva para acordes dominantes com 7ª menor e 3ª maior (AC/DC, SRV, Jimi Hendrix).',
        compatibility: '100% — Perfeita'
      },
      {
        name: `Pentatônica Maior de ${root}`,
        type: 'pentatonic_major',
        notes: getNotes([0, 2, 4, 7, 9]),
        pitchClasses: getPcs([0, 2, 4, 7, 9]),
        mood: 'Doce / Country / Blues Maior',
        desc: 'Sonoridade melódica e limpa que valoriza a tônica, terça e quinta do acorde.',
        compatibility: '92% — Muito Expressiva'
      },
      {
        name: `Pentatônica Blues de ${root}`,
        type: 'blues',
        notes: getNotes([0, 3, 5, 6, 7, 10]),
        pitchClasses: getPcs([0, 3, 5, 6, 7, 10]),
        mood: 'Texas Blues / Saturação',
        desc: 'Mistura clássica de blues tocando a pentatônica menor com blue note sobre acorde dominante maior.',
        compatibility: '90% — Tensão Blues'
      }
    ];
  }

  if (qual.includes('diminished') || qual.includes('dim') || qual.includes('m7(b5)')) {
    return [
      {
        name: `Modo Lócrio de ${root}`,
        type: 'locrian',
        notes: getNotes([0, 1, 3, 5, 6, 8, 10]),
        pitchClasses: getPcs([0, 1, 3, 5, 6, 8, 10]),
        mood: 'Tensão / Jazz / ii-V-I Menor',
        desc: 'Escala com tônica, 3ª menor e 5ª diminuta, ideal para preparar cadências harmônicas.',
        compatibility: '95% — Padrão Harmônico'
      },
      {
        name: `Escala Diminuta Tom-Semitom de ${root}`,
        type: 'diminished_hw',
        notes: getNotes([0, 2, 3, 5, 6, 8, 9, 11]),
        pitchClasses: getPcs([0, 2, 3, 5, 6, 8, 9, 11]),
        mood: 'Suspense & Modern Fusion',
        desc: 'Simetria intervalar com múltiplas opções de tensão e resolução sobre acordes diminutos.',
        compatibility: '90% — Avançada'
      }
    ];
  }

  // Major default
  return [
    {
      name: `Pentatônica Maior de ${root}`,
      type: 'pentatonic_major',
      notes: getNotes([0, 2, 4, 7, 9]),
      pitchClasses: getPcs([0, 2, 4, 7, 9]),
      mood: 'Alegre / Consonante / Pop & Rock',
      desc: 'Linhas melódicas sem notas de atrito. Ideal para solos abertos, pop, rock e fingerstyle.',
      compatibility: '100% — Escolha Principal'
    },
    {
      name: `Escala Maior (Modo Jônio) de ${root}`,
      type: 'major',
      notes: getNotes([0, 2, 4, 5, 7, 9, 11]),
      pitchClasses: getPcs([0, 2, 4, 5, 7, 9, 11]),
      mood: 'Brilhante & Completa',
      desc: 'A escala mãe da harmonia ocidental com todas as 7 notas diatônicas.',
      compatibility: '95% — Recomendada'
    },
    {
      name: `Modo Lídio de ${root}`,
      type: 'lydian',
      notes: getNotes([0, 2, 4, 6, 7, 9, 11]),
      pitchClasses: getPcs([0, 2, 4, 6, 7, 9, 11]),
      mood: 'Espacial / Steve Vai / Trilha Sonora',
      desc: 'Apresenta a 4ª aumentada (#4) criando uma sonoridade etérea e moderna sobre acordes 7M.',
      compatibility: '90% — Timbres Espaciais'
    }
  ];
}
