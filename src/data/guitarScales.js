// Banco de Dados Completo de Escalas, Modos Gregos e Shapes de Guitarra

export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const INTERVAL_LABELS = {
  0: { short: 'T', name: 'Tônica / Fundamental', color: '#ef4444' }, // Red (Root)
  1: { short: 'b2', name: 'Segunda Menor', color: '#f97316' },
  2: { short: '2ª', name: 'Segunda Maior', color: '#fb923c' },
  3: { short: 'b3', name: 'Terça Menor', color: '#eab308' },
  4: { short: '3M', name: 'Terça Maior', color: '#facc15' },
  5: { short: '4ª', name: 'Quarta Justa', color: '#10b981' },
  6: { short: 'b5', name: 'Quinta Diminuta / Blue Note', color: '#38bdf8' }, // Blue Note
  7: { short: '5ª', name: 'Quinta Justa', color: '#0ea5e9' },
  8: { short: 'b6', name: 'Sexta Menor', color: '#8b5cf6' },
  9: { short: '6M', name: 'Sexta Maior', color: '#a855f7' },
  10: { short: 'b7', name: 'Sétima Menor', color: '#ec4899' },
  11: { short: '7M', name: 'Sétima Maior', color: '#f43f5e' }
};

export const GUITAR_SCALES = [
  // 1. PENTATÔNICAS
  {
    id: 'pentatonic_minor',
    name: 'Pentatônica Menor',
    category: 'Pentatônicas',
    intervals: [0, 3, 5, 7, 10], // T, b3, 4, 5, b7
    description: 'A escala mais importante e tocada no Rock, Blues e Heavy Metal. Sem notas de tensão.',
    icon: '⚡',
    mood: 'Bluesy, Agressivo e Marcante',
    artists: 'Slash, Jimmy Page, Angus Young, Zakk Wylde'
  },
  {
    id: 'pentatonic_major',
    name: 'Pentatônica Maior',
    category: 'Pentatônicas',
    intervals: [0, 2, 4, 7, 9], // T, 2, 3M, 5, 6M
    description: 'Sonoridade brilhante, melódica e alegre típica do Country, Southern Rock e Pop.',
    icon: '☀️',
    mood: 'Alegre, Solar e Cantável',
    artists: 'B.B. King, Eric Clapton, Duane Allman'
  },

  // 2. ESCALAS BLUES
  {
    id: 'blues_minor',
    name: 'Escala Blues Menor (com Blue Note b5)',
    category: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10], // T, b3, 4, b5 (Blue Note), 5, b7
    blueNoteInterval: 6,
    description: 'A Pentatônica Menor enriquecida com a misteriosa e expressiva "Blue Note" (b5).',
    icon: '🎷',
    mood: 'Expressivo, Sentimental e Clássico',
    artists: 'Stevie Ray Vaughan, Jimi Hendrix, Gary Moore'
  },
  {
    id: 'blues_major',
    name: 'Escala Blues Maior',
    category: 'Blues',
    intervals: [0, 2, 3, 4, 7, 9], // T, 2, b3, 3M, 5, 6
    blueNoteInterval: 3,
    description: 'Combina a terça menor como nota de passagem cromática para a terça maior.',
    icon: '🎺',
    mood: 'Swing, Country Blues e R&B',
    artists: 'B.B. King, Chuck Berry, John Mayer'
  },

  // 3. OS 7 MODOS GREGOS
  {
    id: 'mode_ionian',
    name: 'Modo Jônio (Escala Maior Natural)',
    category: 'Modos Gregos',
    intervals: [0, 2, 4, 5, 7, 9, 11], // 1 2 3 4 5 6 7
    description: '1º Modo: A base de toda a harmonia ocidental. Sonoridade pura, resoluta e triunfante.',
    icon: '🏛️',
    mood: 'Harmônico, Brilhante e Estável',
    artists: 'Joe Satriani, John Petrucci, Brian May'
  },
  {
    id: 'mode_dorian',
    name: 'Modo Dórico (O Som de Santana / Funk Rock)',
    category: 'Modos Gregos',
    intervals: [0, 2, 3, 5, 7, 9, 10], // T, 2, b3, 4, 5, 6M, b7 (Nota Característica: 6M)
    characteristicInterval: 9,
    description: '2º Modo: Menor com 6ª Maior. O som sofisticado de Carlos Santana e Pink Floyd.',
    icon: '🌶️',
    mood: 'Menor Sofisticado, Latino e Espacial',
    artists: 'Carlos Santana (Oye Como Va), David Gilmour (Breathe)'
  },
  {
    id: 'mode_phrygian',
    name: 'Modo Frígio (Flamenco & Metal Pesado)',
    category: 'Modos Gregos',
    intervals: [0, 1, 3, 5, 7, 8, 10], // T, b2, b3, 4, 5, b6, b7 (Nota Característica: b2)
    characteristicInterval: 1,
    description: '3º Modo: Menor com 2ª menor (b2). Muito usado em Metal, Thrash e música espanhola.',
    icon: '⚔️',
    mood: 'Tenebroso, Épico, Exótico e Pesado',
    artists: 'Metallica (Wherever I May Roam), Iron Maiden, Marty Friedman'
  },
  {
    id: 'mode_lydian',
    name: 'Modo Lídio (O Som Mágico de Steve Vai)',
    category: 'Modos Gregos',
    intervals: [0, 2, 4, 6, 7, 9, 11], // T, 2, 3, #4, 5, 6, 7 (Nota Característica: #4/b5)
    characteristicInterval: 6,
    description: '4º Modo: Maior com 4ª aumentada (#4). Sonoridade cinematográfica, espacial e mágica.',
    icon: '🌌',
    mood: 'Misterioso, Flutuante e Futurista',
    artists: 'Steve Vai, Joe Satriani (Flying in a Blue Dream), John Williams'
  },
  {
    id: 'mode_mixolydian',
    name: 'Modo Mixolídio (Rock Clássico & Southern)',
    category: 'Modos Gregos',
    intervals: [0, 2, 4, 5, 7, 9, 10], // T, 2, 3, 4, 5, 6, b7 (Nota Característica: b7)
    characteristicInterval: 10,
    description: '5º Modo: Maior com 7ª menor (b7). O som do Southern Rock, AC/DC e Blues Rock.',
    icon: '🤠',
    mood: 'Groovy, Blues-Rock e Dinâmico',
    artists: 'AC/DC, Lynyrd Skynyrd, Guns N Roses (Sweet Child)'
  },
  {
    id: 'mode_aeolian',
    name: 'Modo Eólio (Escala Menor Natural)',
    category: 'Modos Gregos',
    intervals: [0, 2, 3, 5, 7, 8, 10], // T, 2, b3, 4, 5, b6, b7
    description: '6º Modo: A escala menor padrão. Triste, emotiva e presente em baladas de rock.',
    icon: '🌧️',
    mood: 'Melancólico, Profundo e Dramático',
    artists: 'Gary Moore, Randy Rhoads, Kirk Hammett'
  },
  {
    id: 'mode_locrian',
    name: 'Modo Lócrio (Tenso & Diminuto)',
    category: 'Modos Gregos',
    intervals: [0, 1, 3, 5, 6, 8, 10], // T, b2, b3, 4, b5, b6, b7
    description: '7º Modo: Escala com tríade diminuta (b5). Máxima tensão e instabilidade harmônica.',
    icon: '🌪️',
    mood: 'Muito Instável, Dissonante e Tenso',
    artists: 'Slayer, Kirk Hammett, Yngwie Malmsteen'
  },

  // 4. MENORES ESPECIAIS
  {
    id: 'harmonic_minor',
    name: 'Menor Harmônica (Neoclássico / Yngwie)',
    category: 'Menores Especiais',
    intervals: [0, 2, 3, 5, 7, 8, 11], // T, 2, b3, 4, 5, b6, 7M
    description: 'A 7ª Maior cria o intervalo de 1 tom e meio dramático do Heavy Metal Neoclássico.',
    icon: '👑',
    mood: 'Neoclássico, Dramático e Barroco',
    artists: 'Yngwie Malmsteen, Ritchie Blackmore, Paul Gilbert'
  },
  {
    id: 'melodic_minor',
    name: 'Menor Melódica (Jazz / Fusion)',
    category: 'Menores Especiais',
    intervals: [0, 2, 3, 5, 7, 9, 11], // T, 2, b3, 4, 5, 6M, 7M
    description: 'Menor com 6ª Maior e 7ª Maior. Muito usada no Jazz, Fusion e solos modernos.',
    icon: '🍷',
    mood: 'Sofisticado, Fluido e Contemporâneo',
    artists: 'Al Di Meola, Allan Holdsworth, Guthrie Govan'
  }
];

// Guitar Standard Tuning Open String MIDI Notes (E2: 40, A2: 45, D3: 50, G3: 55, B3: 59, E4: 64)
export const OPEN_STRINGS_MIDI = [64, 59, 55, 50, 45, 40]; // 1st to 6th string

/**
 * Calculates the note name, semitone interval and scale status for every fret (0 to 24) on all 6 strings.
 */
export function calculateFretboardNotes(rootNote, scaleIntervals, blueNoteInterval = null) {
  const rootIndex = ROOT_NOTES.indexOf(rootNote);
  const stringsData = [];

  // Strings from 1 (high E) to 6 (low E)
  for (let strIdx = 0; strIdx < 6; strIdx++) {
    const openMidi = OPEN_STRINGS_MIDI[strIdx];
    const frets = [];

    for (let fret = 0; fret <= 24; fret++) {
      const midi = openMidi + fret;
      const noteIndex = (midi - 12) % 12;
      const noteName = ROOT_NOTES[noteIndex];

      // Calculate semitone distance from root
      const semitoneInterval = (noteIndex - rootIndex + 12) % 12;
      const inScale = scaleIntervals.includes(semitoneInterval);
      const isRoot = semitoneInterval === 0;
      const isBlueNote = blueNoteInterval !== null && semitoneInterval === blueNoteInterval;
      const intervalInfo = INTERVAL_LABELS[semitoneInterval];

      frets.push({
        stringIndex: strIdx + 1,
        fret,
        midi,
        noteName,
        semitoneInterval,
        inScale,
        isRoot,
        isBlueNote,
        intervalShort: intervalInfo.short,
        intervalName: intervalInfo.name,
        color: isRoot ? '#ef4444' : isBlueNote ? '#38bdf8' : intervalInfo.color
      });
    }
    stringsData.push(frets);
  }

  return stringsData;
}
