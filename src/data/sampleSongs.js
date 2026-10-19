/**
 * Curated list of songs with synchronized timestamps and chord progressions
 * for interactive real-time play-along.
 */
export const SAMPLE_SONGS = [
  {
    id: 'knockin-on-heavens-door',
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan / Guns N' Roses",
    youtubeId: "f8OHybVhQwc", // Bob Dylan / Guns
    bpm: 70,
    difficulty: "Iniciante",
    genre: "Rock / Folk",
    description: "Um dos maiores clássicos para iniciantes, usando os acordes G, D, Am e C.",
    chordsUsed: ['G', 'D', 'Am', 'C'],
    events: [
      { time: 2.0, chord: 'G', duration: 3.5 },
      { time: 5.5, chord: 'D', duration: 3.5 },
      { time: 9.0, chord: 'Am', duration: 7.0 },
      { time: 16.0, chord: 'G', duration: 3.5 },
      { time: 19.5, chord: 'D', duration: 3.5 },
      { time: 23.0, chord: 'C', duration: 7.0 },
      { time: 30.0, chord: 'G', duration: 3.5 },
      { time: 33.5, chord: 'D', duration: 3.5 },
      { time: 37.0, chord: 'Am', duration: 7.0 },
      { time: 44.0, chord: 'G', duration: 3.5 },
      { time: 47.5, chord: 'D', duration: 3.5 },
      { time: 51.0, chord: 'C', duration: 7.0 },
      { time: 58.0, chord: 'G', duration: 3.5 },
      { time: 61.5, chord: 'D', duration: 3.5 },
      { time: 65.0, chord: 'Am', duration: 7.0 },
    ]
  },
  {
    id: 'zombie-cranberries',
    title: "Zombie",
    artist: "The Cranberries",
    youtubeId: "6Ux6SlOE9Qk",
    bpm: 84,
    difficulty: "Iniciante",
    genre: "Grunge / Rock Alternativo",
    description: "A clássica sequência de 4 acordes (Em - C - G - D) perfeita para treino de palhetada e ritmo.",
    chordsUsed: ['Em', 'C', 'G', 'D'],
    events: [
      { time: 1.0, chord: 'Em', duration: 5.7 },
      { time: 6.7, chord: 'C', duration: 5.7 },
      { time: 12.4, chord: 'G', duration: 5.7 },
      { time: 18.1, chord: 'D', duration: 5.7 },
      { time: 23.8, chord: 'Em', duration: 5.7 },
      { time: 29.5, chord: 'C', duration: 5.7 },
      { time: 35.2, chord: 'G', duration: 5.7 },
      { time: 40.9, chord: 'D', duration: 5.7 },
      { time: 46.6, chord: 'Em', duration: 5.7 },
      { time: 52.3, chord: 'C', duration: 5.7 },
      { time: 58.0, chord: 'G', duration: 5.7 },
      { time: 63.7, chord: 'D', duration: 5.7 }
    ]
  },
  {
    id: 'stand-by-me',
    title: "Stand By Me",
    artist: "Ben E. King",
    youtubeId: "hwZNL7QVJjE",
    bpm: 118,
    difficulty: "Iniciante",
    genre: "Soul / Classic",
    description: "A clássica progressão dos anos 50 (I - vi - IV - V): C -> Am -> F -> G.",
    chordsUsed: ['C', 'Am', 'F', 'G'],
    events: [
      { time: 0.5, chord: 'C', duration: 8.0 },
      { time: 8.5, chord: 'Am', duration: 8.0 },
      { time: 16.5, chord: 'F', duration: 4.0 },
      { time: 20.5, chord: 'G', duration: 4.0 },
      { time: 24.5, chord: 'C', duration: 8.0 },
      { time: 32.5, chord: 'C', duration: 8.0 },
      { time: 40.5, chord: 'Am', duration: 8.0 },
      { time: 48.5, chord: 'F', duration: 4.0 },
      { time: 52.5, chord: 'G', duration: 4.0 },
      { time: 56.5, chord: 'C', duration: 8.0 }
    ]
  },
  {
    id: 'nirvana-smells-like',
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    youtubeId: "hTWKbfoikeg",
    bpm: 117,
    difficulty: "Intermediário",
    genre: "Grunge / Rock",
    description: "Treino de Power Chords na pressão: E5, A5, G5, C5 com a energia do grunge.",
    chordsUsed: ['E5', 'A5', 'G5', 'C5'],
    events: [
      { time: 0.0, chord: 'E5', duration: 2.0 },
      { time: 2.0, chord: 'A5', duration: 2.0 },
      { time: 4.0, chord: 'G5', duration: 2.0 },
      { time: 6.0, chord: 'C5', duration: 2.0 },
      { time: 8.0, chord: 'E5', duration: 2.0 },
      { time: 10.0, chord: 'A5', duration: 2.0 },
      { time: 12.0, chord: 'G5', duration: 2.0 },
      { time: 14.0, chord: 'C5', duration: 2.0 },
      { time: 16.0, chord: 'E5', duration: 2.0 },
      { time: 18.0, chord: 'A5', duration: 2.0 },
      { time: 20.0, chord: 'G5', duration: 2.0 },
      { time: 22.0, chord: 'C5', duration: 2.0 }
    ]
  }
];

export const SAMPLE_PROGRESSIONS = [
  {
    id: 'pop-classic',
    name: 'Pop / Rock Clássico',
    chords: ['C', 'G', 'Am', 'F'],
    description: 'A progressão mais famosa do pop/rock ocidental (I - V - vi - IV).'
  },
  {
    id: 'ballad-minor',
    name: 'Balada Emocional',
    chords: ['Em', 'C', 'G', 'D'],
    description: 'Zombie, With or Without You, Despacito e dezenas de sucessos.'
  },
  {
    id: 'stand-by-me',
    name: 'Anos 50 / Soul (Stand By Me)',
    chords: ['C', 'Am', 'F', 'G'],
    description: 'A clássica cadência I - vi - IV - V dos anos dourados do rock e soul.'
  },
  {
    id: 'duo-pestana',
    name: 'Treino de Pestana (Dó ↔ Fá)',
    chords: ['C', 'F'],
    description: 'A transição mais difícil para iniciantes: alternância rápida entre C e F.'
  },
  {
    id: 'duo-bm',
    name: 'Transição Si Menor (Em ↔ Bm)',
    chords: ['Em', 'Bm'],
    description: 'Domínio da pestana na 5ª corda em Si menor alternando com Mi menor.'
  },
  {
    id: 'blues-12-bar',
    name: 'Blues & Rock n Roll',
    chords: ['A7', 'D7', 'E7'],
    description: 'Sequência tradicional de blues com acordes dominantes de sétima.'
  },
  {
    id: 'rock-power',
    name: 'Power Chords Rock',
    chords: ['E5', 'G5', 'A5', 'C5'],
    description: 'Fundamentos de guitarra pesada, punk e hard rock.'
  }
];
