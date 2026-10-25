// Banco de Músicas do Guitar Hero com Cifras e Mapeamento Completo das 6 Cordas da Guitarra

export const GUITAR_HERO_STRINGS = [
  { lane: 0, stringNum: 6, name: 'E', octave: 2, label: '6ª Corda (Mizona)', color: '#ef4444', border: '#f87171' },
  { lane: 1, stringNum: 5, name: 'A', octave: 2, label: '5ª Corda (Lá)', color: '#eab308', border: '#fde047' },
  { lane: 2, stringNum: 4, name: 'D', octave: 3, label: '4ª Corda (Ré)', color: '#0ea5e9', border: '#38bdf8' },
  { lane: 3, stringNum: 3, name: 'G', octave: 3, label: '3ª Corda (Sol)', color: '#f97316', border: '#fb923c' },
  { lane: 4, stringNum: 2, name: 'B', octave: 3, label: '2ª Corda (Si)', color: '#10b981', border: '#34d399' },
  { lane: 5, stringNum: 1, name: 'e', octave: 4, label: '1ª Corda (Mizinha)', color: '#a855f7', border: '#c084fc' }
];

export const GUITAR_HERO_DIFFICULTIES = [
  {
    id: 1,
    key: 'level1',
    name: 'Nível 1: Pulso & Base (25% das Notas)',
    tag: 'Iniciante',
    description: 'Densidade reduzida (1 nota a cada 4): ideal para aprender o ritmo sem se afobar.',
    icon: 'Radio'
  },
  {
    id: 2,
    key: 'level2',
    name: 'Nível 2: Esqueleto do Riff (50% das Notas)',
    tag: 'Intermediário',
    description: 'Corta notas rápidas de passagem e foca nas notas estruturais do riff.',
    icon: 'Flame'
  },
  {
    id: 3,
    key: 'level3',
    name: 'Nível 3: Tablatura 100% Real (Oficial)',
    tag: 'Tablatura Real',
    description: '100% de todas as notas, cordas e casas reais da tablatura da música.',
    icon: 'Sparkles'
  },
  {
    id: 4,
    key: 'level4',
    name: 'Nível 4: Guitar God (Precisão Pro)',
    tag: 'Guitar God',
    description: '100% das notas reais com janela de acerto rigorosa para performance de mestre.',
    icon: 'Zap'
  }
];

export const GUITAR_HERO_SONGS = [
  {
    id: 'knockin_on_heavens_door',
    title: "Knockin' On Heaven's Door",
    artist: "Guns N' Roses / Bob Dylan",
    year: '1973',
    genre: 'Classic Rock / Ballad',
    bpm: 70,
    startOffsetSec: 0.5,
    youtubeId: 'f8OHybVhQwc',
    durationSec: 330,
    coverColor: 'from-amber-600 via-orange-700 to-slate-900',
    charts: {
      level1: [
        { time: 1.0, note: 'G', stringNum: 6, lane: 0, fret: 3, text: 'G (6ªc 3)' },
        { time: 4.5, note: 'D', stringNum: 4, lane: 2, fret: 0, text: 'D (4ª Solta)' },
        { time: 8.0, note: 'A', stringNum: 5, lane: 1, fret: 0, text: 'Am (5ª Solta)', isStar: true },
        { time: 15.0, note: 'G', stringNum: 6, lane: 0, fret: 3, text: 'G' },
        { time: 18.5, note: 'D', stringNum: 4, lane: 2, fret: 0, text: 'D' },
        { time: 22.0, note: 'C', stringNum: 5, lane: 1, fret: 3, text: 'C (5ªc 3)', isStar: true }
      ],
      level2: [
        { time: 1.0, chord: 'G5', text: 'G5', isStar: true },
        { time: 4.5, chord: 'D5', text: 'D5' },
        { time: 8.0, chord: 'A5', text: 'A5', isStar: true },
        { time: 15.0, chord: 'G5', text: 'G5' },
        { time: 18.5, chord: 'D5', text: 'D5' },
        { time: 22.0, chord: 'C5', text: 'C5', isStar: true }
      ],
      level3: [
        // Cifra Completa: G -> D -> Am -> G -> D -> C
        { time: 1.0, chord: 'G', text: 'G' },
        { time: 4.5, chord: 'D', text: 'D' },
        { time: 8.0, chord: 'Am', text: 'Am', isStar: true },
        { time: 15.0, chord: 'G', text: 'G' },
        { time: 18.5, chord: 'D', text: 'D' },
        { time: 22.0, chord: 'C', text: 'C', isStar: true }
      ],
      level4: [
        // Solo Melódico
        { time: 1.0, note: 'G', stringNum: 3, lane: 3, fret: 0, text: '0' },
        { time: 2.5, note: 'B', stringNum: 2, lane: 4, fret: 0, text: '0' },
        { time: 4.5, note: 'D', stringNum: 2, lane: 4, fret: 3, text: '3' },
        { time: 6.5, note: 'F#', stringNum: 1, lane: 5, fret: 2, text: '2', isStar: true },
        { time: 8.0, note: 'A', stringNum: 3, lane: 3, fret: 2, text: '2' },
        { time: 11.5, note: 'C', stringNum: 2, lane: 4, fret: 1, text: '1' }
      ]
    }
  },
  {
    id: 'zombie',
    title: 'Zombie',
    artist: 'The Cranberries',
    year: '1994',
    genre: 'Grunge / Alt Rock',
    bpm: 84,
    startOffsetSec: 0.5,
    youtubeId: '6Ejga4kJUts',
    durationSec: 307,
    coverColor: 'from-emerald-600 via-teal-700 to-slate-900',
    charts: {
      level1: [
        { time: 1.0, note: 'E', stringNum: 6, lane: 0, fret: 0, text: 'Em (6ª Solta)' },
        { time: 6.7, note: 'C', stringNum: 5, lane: 1, fret: 3, text: 'C (5ªc 3)' },
        { time: 12.4, note: 'G', stringNum: 6, lane: 0, fret: 3, text: 'G (6ªc 3)' },
        { time: 18.1, note: 'D', stringNum: 4, lane: 2, fret: 0, text: 'D (4ª Solta)', isStar: true }
      ],
      level2: [
        { time: 1.0, chord: 'E5', text: 'E5', isStar: true },
        { time: 6.7, chord: 'C5', text: 'C5' },
        { time: 12.4, chord: 'G5', text: 'G5' },
        { time: 18.1, chord: 'D5', text: 'D5', isStar: true }
      ],
      level3: [
        // Cifra Completa: Em -> C -> G -> D
        { time: 1.0, chord: 'Em', text: 'Em' },
        { time: 6.7, chord: 'C', text: 'C' },
        { time: 12.4, chord: 'G', text: 'G' },
        { time: 18.1, chord: 'D', text: 'D', isStar: true }
      ],
      level4: [
        { time: 1.0, note: 'B', stringNum: 2, lane: 4, fret: 0, text: '0' },
        { time: 3.5, note: 'E', stringNum: 1, lane: 5, fret: 0, text: '0' },
        { time: 6.7, note: 'C', stringNum: 2, lane: 4, fret: 1, text: '1' },
        { time: 12.4, note: 'D', stringNum: 2, lane: 4, fret: 3, text: '3' },
        { time: 18.1, note: 'F#', stringNum: 1, lane: 5, fret: 2, text: '2', isStar: true }
      ]
    }
  },
  {
    id: 'seven_nation_army',
    title: 'Seven Nation Army',
    artist: 'The White Stripes',
    year: '2003',
    genre: 'Garage Rock',
    bpm: 124,
    startOffsetSec: 0.55,
    youtubeId: '0J2QdDbelmY',
    durationSec: 232,
    coverColor: 'from-rose-600 via-red-700 to-slate-900',
    charts: {
      level1: [
        { time: 0.55, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 1.28, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 1.76, note: 'G', stringNum: 6, lane: 0, fret: 3, text: '3' },
        { time: 2.24, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 2.73, note: 'D', stringNum: 5, lane: 1, fret: 5, text: '5' },
        { time: 3.45, note: 'C', stringNum: 5, lane: 1, fret: 3, text: '3', isStar: true },
        { time: 3.94, note: 'B', stringNum: 5, lane: 1, fret: 2, text: '2' },
        // Loop 2
        { time: 4.42, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 5.15, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 5.63, note: 'G', stringNum: 6, lane: 0, fret: 3, text: '3' },
        { time: 6.11, note: 'E', stringNum: 6, lane: 0, fret: 0, text: '0' },
        { time: 6.60, note: 'D', stringNum: 5, lane: 1, fret: 5, text: '5' },
        { time: 7.32, note: 'C', stringNum: 5, lane: 1, fret: 3, text: '3' },
        { time: 7.81, note: 'D', stringNum: 5, lane: 1, fret: 5, text: '5' },
        { time: 8.29, note: 'C', stringNum: 5, lane: 1, fret: 3, text: '3' },
        { time: 8.77, note: 'B', stringNum: 5, lane: 1, fret: 2, text: '2', isStar: true }
      ],
      level2: [
        { time: 0.55, chord: 'E5', text: 'E5', isStar: true },
        { time: 1.76, chord: 'G5', text: 'G5' },
        { time: 2.24, chord: 'E5', text: 'E5' },
        { time: 2.73, chord: 'D5', text: 'D5' },
        { time: 3.45, chord: 'C5', text: 'C5', isStar: true },
        { time: 3.94, chord: 'B5', text: 'B5' }
      ],
      level3: [
        // Cifra Completa: Em -> G -> D -> C -> B7
        { time: 0.55, chord: 'Em', text: 'Em' },
        { time: 1.76, chord: 'G', text: 'G' },
        { time: 2.73, chord: 'D', text: 'D' },
        { time: 3.45, chord: 'C', text: 'C' },
        { time: 3.94, chord: 'B7', text: 'B7' }
      ],
      level4: [
        { time: 0.55, note: 'E', stringNum: 5, lane: 1, fret: 7, text: '7' },
        { time: 1.28, note: 'E', stringNum: 5, lane: 1, fret: 7, text: '7' },
        { time: 1.76, note: 'G', stringNum: 5, lane: 1, fret: 10, text: '10' },
        { time: 2.24, note: 'E', stringNum: 5, lane: 1, fret: 7, text: '7' },
        { time: 2.73, note: 'D', stringNum: 5, lane: 1, fret: 5, text: '5' },
        { time: 3.45, note: 'C', stringNum: 5, lane: 1, fret: 3, text: '3', isStar: true },
        { time: 3.94, note: 'B', stringNum: 5, lane: 1, fret: 2, text: '2' }
      ]
    }
  },
  {
    id: 'smells_like_teen_spirit',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    year: '1991',
    genre: 'Grunge / 90s Rock',
    bpm: 116,
    startOffsetSec: 0.40,
    youtubeId: 'hTWKbfoikeg',
    durationSec: 301,
    coverColor: 'from-cyan-600 via-sky-800 to-slate-900',
    charts: {
      level1: [
        { time: 0.40, note: 'F', stringNum: 6, lane: 0, fret: 1, text: '1' },
        { time: 1.43, note: 'A#', stringNum: 5, lane: 1, fret: 1, text: '1' },
        { time: 2.46, note: 'G#', stringNum: 6, lane: 0, fret: 4, text: '4' },
        { time: 3.50, note: 'C#', stringNum: 5, lane: 1, fret: 4, text: '4' }
      ],
      level2: [
        // Power Chords da Cifra: F5 -> Bb5 -> Ab5 -> Db5
        { time: 0.40, chord: 'F5', text: 'F5', isStar: true },
        { time: 1.43, chord: 'A#5', text: 'Bb5' },
        { time: 2.46, chord: 'G#5', text: 'Ab5' },
        { time: 3.50, chord: 'C#5', text: 'Db5' }
      ],
      level3: [
        // Cifra Completa: F -> Bb -> Ab -> Db
        { time: 0.40, chord: 'F', text: 'F' },
        { time: 1.43, chord: 'A#', text: 'Bb' },
        { time: 2.46, chord: 'G#', text: 'Ab' },
        { time: 3.50, chord: 'C#', text: 'Db' }
      ],
      level4: [
        { time: 0.40, note: 'F', stringNum: 3, lane: 3, fret: 10, text: '10' },
        { time: 1.43, note: 'G#', stringNum: 3, lane: 3, fret: 13, text: '13' },
        { time: 2.46, note: 'G', stringNum: 3, lane: 3, fret: 12, text: '12' },
        { time: 3.50, note: 'F', stringNum: 3, lane: 3, fret: 10, text: '10', isStar: true }
      ]
    }
  }
];
