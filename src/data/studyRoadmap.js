// Trilha Pedagógica Guiada de Estudos com Metas Práticas e Exercícios Interativos

export const STUDY_PHASES = [
  {
    id: 'phase1',
    phaseNumber: 1,
    title: 'Fase 1: Fundamentos & Independência dos Dedos',
    subtitle: 'Postura, digitação 1-2-3-4 e primeiros acordes abertos',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    steps: [
      {
        id: 'step_01',
        number: 1,
        title: 'Afinação Precisa & Posição da Mão',
        lessonRef: 'Aula 27',
        category: 'tuner',
        description: 'Aprenda a afinar as 6 cordas (E, A, D, G, B, e) e posicione o polegar no centro das costas do braço.',
        goal: 'Afine as 6 cordas da guitarra com precisão de agulha no centro (0 cents).',
        toolType: 'tuner',
        preset: { tuning: 'standard' }
      },
      {
        id: 'step_02',
        number: 2,
        title: 'Digitação Cromática 1-2-3-4 & Palhetada Alternada',
        lessonRef: 'Aulas 18 e 19',
        category: 'dexterity',
        description: 'Desenvolva força, independência dos 4 dedos e sincronia com a palheta alternada (baixo/cima).',
        goal: 'Complete 4 ciclos perfeitos do padrão 1-2-3-4 a 60 BPM sem trastejar.',
        toolType: 'speed_trainer',
        preset: { pattern: '1-2-3-4', bpm: 60, targetBpm: 80, autoAccelerate: true }
      },
      {
        id: 'step_03',
        number: 3,
        title: 'Primeiros Acordes Abertos (Em, Am, C, G, D)',
        lessonRef: 'Aulas 04, 06 e 07',
        category: 'chords',
        description: 'Monte os acordes maiores e menores mais usados da música com dedos arqueados.',
        goal: 'Obtenha "Acorde Perfeito" nos acordes Em, Am, C, G e D no Treinador.',
        toolType: 'chord_trainer',
        preset: { chords: ['Em', 'Am', 'C', 'G', 'D'] }
      }
    ]
  },
  {
    id: 'phase2',
    phaseNumber: 2,
    title: 'Fase 2: Ritmo, Levadas & Troca no Compasso',
    subtitle: 'Batidas com setas, contratempo e notas percussivas',
    color: 'from-sky-500 to-indigo-600',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    steps: [
      {
        id: 'step_04',
        number: 4,
        title: 'Levada Pop/Rock com Setas ⬇️ ⬆️',
        lessonRef: 'Aulas 08 e 09',
        category: 'rhythm',
        description: 'Domine a levada padrão de 4 tempos (⬇️ ⬇️ ⬆️ ⬆️ ⬇️ ⬆️) mantendo o braço relaxado como um pêndulo.',
        goal: 'Mantenha a levada no clique do metrônomo por 8 compassos a 75 BPM.',
        toolType: 'strumming_trainer',
        preset: { grooveId: 'pop_rock_basic', bpm: 75 }
      },
      {
        id: 'step_05',
        number: 5,
        title: 'Ritmo com Contratempo & Síncope',
        lessonRef: 'Aulas 10 e 11',
        category: 'rhythm',
        description: 'Aprenda a atacar as cordas no "E" dos tempos (1 E 2 E 3 E 4 E) dando balanço ao som.',
        goal: 'Acerte os ataques de contratempo no tempo da bateria.',
        toolType: 'strumming_trainer',
        preset: { grooveId: 'offbeat_syncopated', bpm: 80 }
      },
      {
        id: 'step_06',
        number: 6,
        title: 'Notas Percussivas & Abafamento (Ghost Notes)',
        lessonRef: 'Aulas 12, 13 e 14',
        category: 'rhythm',
        description: 'Corte o som com a lateral da mão direita (som de "tchak") sem perder o andamento.',
        goal: 'Execute o golpe percussivo no 2º e 4º tempo da levada.',
        toolType: 'strumming_trainer',
        preset: { grooveId: 'percussive_groove', bpm: 85 }
      }
    ]
  },
  {
    id: 'phase3',
    phaseNumber: 3,
    title: 'Fase 3: O Som do Rock (Power Chords & Velocidade)',
    subtitle: 'Bicordes pesados, abafamento com a ponte e digitação avançada',
    color: 'from-purple-500 to-rose-600',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    steps: [
      {
        id: 'step_07',
        number: 7,
        title: 'Power Chords de Rock (E5, G5, A5, D5, C5)',
        lessonRef: 'Aula 28',
        category: 'rock',
        description: 'Toque os bicordes de duas cordas com distorção que são a base de 90% do Rock e Metal.',
        goal: 'Troque com agilidade entre E5, G5, A5, D5 e C5 no tempo da batida.',
        toolType: 'power_chord_trainer',
        preset: { chords: ['E5', 'G5', 'A5', 'D5', 'C5'] }
      },
      {
        id: 'step_08',
        number: 8,
        title: 'Técnica de Palm Muting (Abafamento na Ponte)',
        lessonRef: 'Aula 29',
        category: 'rock',
        description: 'Apoie suavemente a lateral da mão direita sobre as cordas perto da ponte para criar o som encorpado e abafado.',
        goal: 'Toque palhetadas contínuas em Palm Muting mantendo o som percussivo.',
        toolType: 'power_chord_trainer',
        preset: { mode: 'palmMute', bpm: 100 }
      },
      {
        id: 'step_09',
        number: 9,
        title: 'Coordenação Avançada no Braço (Padrão 1-3-2-4)',
        lessonRef: 'Aula 20',
        category: 'dexterity',
        description: 'Quebre a sequência linear e treine saltos de dedos para destravar a velocidade solo.',
        goal: 'Atinja 90 BPM com o acelerador no padrão 1-3-2-4.',
        toolType: 'speed_trainer',
        preset: { pattern: '1-3-2-4', bpm: 70, targetBpm: 95, autoAccelerate: true }
      }
    ]
  },
  {
    id: 'phase4',
    phaseNumber: 4,
    title: 'Fase 4: Harmonia Completa & O Desafio da Pestana',
    subtitle: 'Acordes com 7ª, pestana de Fá/Si menor e sustenidos/bemóis',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    steps: [
      {
        id: 'step_10',
        number: 10,
        title: 'Acordes com Sétima (A7, D7, E7, C7, G7)',
        lessonRef: 'Aulas 15 e 16',
        category: 'chords',
        description: 'Adicione a 7ª menor aos acordes para criar a atmosfera do Blues, Rock Clássico e MPB.',
        goal: 'Pratique a sonoridade dos acordes com 7ª e faça trocas no metrônomo.',
        toolType: 'chord_trainer',
        preset: { chords: ['A7', 'D7', 'E7', 'C7', 'G7'] }
      },
      {
        id: 'step_11',
        number: 11,
        title: 'Domínio da Pestana de Fá (F) e Si Menor (Bm)',
        lessonRef: 'Aula 05',
        category: 'barre',
        description: 'Vença o maior obstáculo dos iniciantes: use o dedo 1 esticado de lado e o polegar centralizado.',
        goal: 'Passe no teste de clareza das 6 cordas na pestana sem nenhuma corda muda.',
        toolType: 'barre_trainer',
        preset: { chords: ['F', 'Bm', 'F#m'] }
      },
      {
        id: 'step_12',
        number: 12,
        title: 'Acordes Sustenidos e Bemóis pelo Braço',
        lessonRef: 'Aulas 21 e 22',
        category: 'barre',
        description: 'Desloque os formatos de pestana pelas casas do braço para formar qualquer acorde.',
        goal: 'Identifique e monte F#m, G#, C#m e Bb com precisão.',
        toolType: 'barre_trainer',
        preset: { chords: ['F#', 'G#', 'C#m', 'Bb'] }
      }
    ]
  },
  {
    id: 'phase5',
    phaseNumber: 5,
    title: 'Fase 5: Técnicas de Expressão, Solos & Repertório',
    subtitle: 'Hammer-on, pull-off e músicas completas no ritmo',
    color: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    steps: [
      {
        id: 'step_13',
        number: 13,
        title: 'Ligados: Hammer-On & Pull-Off',
        lessonRef: 'Aula 26',
        category: 'legato',
        description: 'Tire som com a força dos dedos da mão esquerda (marteladas e puxadas) sem palhetar a 2ª nota.',
        goal: 'Execute ligados ascendentes e descendentes com sustentação clara.',
        toolType: 'legato_trainer',
        preset: { strings: [1, 2, 3] }
      },
      {
        id: 'step_14',
        number: 14,
        title: 'Desafio Final de Repertório no Guitar Hero 6 Cordas',
        lessonRef: 'Aulas 23 a 25, 30 e Hino',
        category: 'hero',
        description: 'Aplique todas as técnicas aprendidas tocando músicas reais sincronizadas no compasso.',
        goal: 'Atinja no mínimo Rank A (85%+ de precisão) no Guitar Hero Arcade.',
        toolType: 'hero',
        preset: { difficulty: 3 }
      }
    ]
  }
];

export const STRUMMING_GROOVES = [
  {
    id: 'pop_rock_basic',
    name: 'Pop / Rock Clássico (4/4)',
    bpm: 75,
    description: 'A levada mais usada no mundo: 2 batidas para baixo seguidas de cima-baixo-cima.',
    pattern: [
      { beat: 1.0, type: 'down', label: '⬇️', note: 'Baixo' },
      { beat: 1.5, type: 'rest', label: '—', note: 'Pausa' },
      { beat: 2.0, type: 'down', label: '⬇️', note: 'Baixo' },
      { beat: 2.5, type: 'up', label: '⬆️', note: 'Cima' },
      { beat: 3.0, type: 'rest', label: '—', note: 'Pausa' },
      { beat: 3.5, type: 'up', label: '⬆️', note: 'Cima' },
      { beat: 4.0, type: 'down', label: '⬇️', note: 'Baixo' },
      { beat: 4.5, type: 'up', label: '⬆️', note: 'Cima' }
    ]
  },
  {
    id: 'offbeat_syncopated',
    name: 'Contratempo & Síncope Rock (4/4)',
    bpm: 80,
    description: 'Ataques rápidos nos contratempos criando dinamismo e balanço.',
    pattern: [
      { beat: 1.0, type: 'down', label: '⬇️', note: 'Baixo' },
      { beat: 1.5, type: 'up', label: '⬆️', note: 'Cima' },
      { beat: 2.0, type: 'rest', label: '—', note: 'Pausa' },
      { beat: 2.5, type: 'up', label: '⬆️', note: 'Cima' },
      { beat: 3.0, type: 'down', label: '⬇️', note: 'Baixo' },
      { beat: 3.5, type: 'up', label: '⬆️', note: 'Cima' },
      { beat: 4.0, type: 'rest', label: '—', note: 'Pausa' },
      { beat: 4.5, type: 'up', label: '⬆️', note: 'Cima' }
    ]
  },
  {
    id: 'percussive_groove',
    name: 'Batida com Nota Percussiva / Ghost Note (X)',
    bpm: 85,
    description: 'Golpe seco com a lateral da mão no 2º e 4º tempo imitando a caixa da bateria.',
    pattern: [
      { beat: 1.0, type: 'down', label: '⬇️', note: 'Toca' },
      { beat: 1.5, type: 'up', label: '⬆️', note: 'Toca' },
      { beat: 2.0, type: 'mute', label: '🔇', note: 'Abafa (X)' },
      { beat: 2.5, type: 'up', label: '⬆️', note: 'Toca' },
      { beat: 3.0, type: 'down', label: '⬇️', note: 'Toca' },
      { beat: 3.5, type: 'up', label: '⬆️', note: 'Toca' },
      { beat: 4.0, type: 'mute', label: '🔇', note: 'Abafa (X)' },
      { beat: 4.5, type: 'up', label: '⬆️', note: 'Toca' }
    ]
  }
];
