/**
 * Tab to 3D Guitar Hero Chart Converter
 * STRICTLY GUITAR ONLY: Filters out Bass, Drums, Vocals, Keyboards, etc.
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToNoteName(midi) {
  if (typeof midi !== 'number' || isNaN(midi)) return 'E';
  return NOTE_NAMES[((midi % 12) + 12) % 12];
}

/**
 * Standardizes enharmonic note names (e.g. Db -> C#, Eb -> D#)
 */
export function normalizeNoteName(name) {
  if (!name) return '';
  const clean = name.trim();
  const ENHARMONICS = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
    'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#',
    'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'A': 'A', 'B': 'B'
  };
  return ENHARMONICS[clean] || clean;
}

/**
 * Generates an ultra-simple 6 Open Strings Calibration Chart
 * Ideal for testing microphone accuracy with zero background noise.
 */
export function generateCalibrationChart() {
  const openStrings = [
    { lane: 0, stringNum: 6, note: 'E', midi: 40, fret: 0, text: '6ª Solta (Mi)' },
    { lane: 1, stringNum: 5, note: 'A', midi: 45, fret: 0, text: '5ª Solta (Lá)' },
    { lane: 2, stringNum: 4, note: 'D', midi: 50, fret: 0, text: '4ª Solta (Ré)' },
    { lane: 3, stringNum: 3, note: 'G', midi: 55, fret: 0, text: '3ª Solta (Sol)' },
    { lane: 4, stringNum: 2, note: 'B', midi: 59, fret: 0, text: '2ª Solta (Si)' },
    { lane: 5, stringNum: 1, note: 'E', midi: 64, fret: 0, text: '1ª Solta (Mi)' }
  ];

  const notes = [];
  let t = 2.0; // Start with 2s pre-roll
  const interval = 2.5; // 2.5s between each string palhetada

  for (let round = 0; round < 3; round++) {
    openStrings.forEach((s, idx) => {
      notes.push({
        id: `calib-${round}-${idx}-${t.toFixed(1)}`,
        time: Number(t.toFixed(2)),
        duration: 1.2,
        stringNum: s.stringNum,
        lane: s.lane,
        fret: s.fret,
        note: s.note,
        midi: s.midi,
        text: '0',
        label: s.text,
        measure: round * 6 + idx,
        isStar: idx === 0 || idx === 5
      });
      t += interval;
    });
  }

  return {
    charts: {
      level1: notes,
      level2: notes,
      level3: notes,
      level4: notes
    },
    totalNotes: notes.length,
    durationSec: Math.ceil(t + 2),
    bpm: 60
  };
}

const BANNED_KEYWORDS = [
  'bass', 'baixo', 'drum', 'bateria', 'percussion', 
  'vocal', 'voice', 'voz', 'sax', 'trumpet', 'horn', 'trombone', 'tuba',
  'clarinet', 'clarinete', 'oboe', 'harmonica', 'gaita',
  'piano', 'organ', 'keyboard', 'synth', 'teclado', 'flute', 'flauta',
  'strings', 'cello', 'violin', 'viola', 'violoncelo', 'phone'
];

/**
 * Returns ONLY the guitar tracks from Songsterr metadata
 * @param {object} meta Songsterr song metadata
 * @returns {Array} List of guitar tracks
 */
export function filterGuitarTracks(meta) {
  if (!meta || !Array.isArray(meta.tracks)) return [];

  const tracks = meta.tracks.map((t, idx) => ({ ...t, originalIndex: idx }));

  const GUITAR_KEYWORDS = [
    'guitar', 'gtr', 'violão', 'guitarra', 'lead', 'rhythm', 
    'solo', 'clean', 'distortion', 'overdrive', 'acoustic', 'electric'
  ];

  const guitarTracks = tracks.filter(t => {
    const name = (t.name || '').toLowerCase();
    const inst = (t.instrument || '').toLowerCase();

    // 1. Must NOT match banned instruments
    for (const kw of BANNED_KEYWORDS) {
      if (name.includes(kw) || inst.includes(kw)) {
        return false;
      }
    }

    // 2. String count check (guitar must have 6 or 7 strings)
    if (t.tuning && (t.tuning.length < 6 || t.tuning.length > 7)) {
      return false;
    }

    // 3. Confirm it's definitely a guitar track
    const isGuitarMentioned = GUITAR_KEYWORDS.some(kw => name.includes(kw) || inst.includes(kw));
    return isGuitarMentioned;
  });

  // If no guitar tracks matched strict filter, fallback to non-drum/non-bass tracks
  if (guitarTracks.length === 0) {
    const fallback = tracks.filter(t => {
      const name = (t.name || '').toLowerCase();
      const inst = (t.instrument || '').toLowerCase();
      return !name.includes('bass') && !name.includes('drum') && !inst.includes('bass') && !inst.includes('drum');
    });
    return fallback.length > 0 ? fallback : tracks.slice(0, 1);
  }

  return guitarTracks;
}

/**
 * Gets the primary/recommended guitar track for a song (e.g. Lead or Solo)
 * @param {object} meta
 * @param {Array} guitarTracks
 */
export function getPrimaryGuitarTrack(meta, guitarTracks) {
  if (!guitarTracks || guitarTracks.length === 0) return null;

  // 1. If meta.popularTrackGuitar is among guitar tracks, prioritize it
  if (typeof meta?.popularTrackGuitar === 'number') {
    const popular = guitarTracks.find(t => t.originalIndex === meta.popularTrackGuitar);
    if (popular) return popular;
  }

  // 2. Prioritize "Lead" or "Solo"
  const lead = guitarTracks.find(t => {
    const n = (t.name || '').toLowerCase();
    return n.includes('lead') || n.includes('solo');
  });
  if (lead) return lead;

  // 3. Prioritize "Rhythm" or electric/acoustic guitar
  const rhythm = guitarTracks.find(t => {
    const n = (t.name || '').toLowerCase();
    return n.includes('rhythm') || n.includes('acoustic') || n.includes('electric');
  });
  if (rhythm) return rhythm;

  return guitarTracks[0];
}

/**
 * Converts a raw Songsterr guitar part into a 3D Highway Chart
 * @param {object} meta Songsterr song metadata
 * @param {object} part Songsterr track part JSON
 * @param {object} selectedTrack Guitar track object
 * @returns {object} { charts: { level1, level2, level3, level4 }, totalNotes, durationSec, bpm }
 */
export function convertSongsterrPartToChart(meta, part, selectedTrack) {
  const defaultTuning = [64, 59, 55, 50, 45, 40]; // High E (1st) to Low E (6th)
  const tuning = selectedTrack?.tuning || defaultTuning;
  let bpm = meta?.tempo || 120;

  // Map tempo automations by measure
  const tempoMap = {};
  if (part?.automations && Array.isArray(part.automations.tempo)) {
    part.automations.tempo.forEach(a => {
      if (typeof a.measure === 'number' && a.bpm) {
        tempoMap[a.measure] = a.bpm;
      }
    });
  }

  let currentTime = 1.0; // 1s pre-roll for comfortable countdown
  const allNotes = [];

  const measures = part?.measures || [];
  for (let m = 0; m < measures.length; m++) {
    if (tempoMap[m]) {
      bpm = tempoMap[m];
    }
    const measure = measures[m];
    const voice = measure.voices?.[0];
    if (!voice || !Array.isArray(voice.beats)) continue;

    for (const beat of voice.beats) {
      const num = beat.duration?.[0] || 1;
      const den = beat.duration?.[1] || 4;
      let durSec = (60 / bpm) * 4 * (num / den);
      if (beat.dot) durSec *= 1.5;

      if (beat.notes && beat.notes.length > 0 && !beat.rest) {
        beat.notes.forEach((n, nIdx) => {
          if (typeof n.fret === 'number' && typeof n.string === 'number') {
            // String mapping:
            // Songsterr string 0 = High E (1st string), 5 = Low E (6th string)
            // Highway lane: 0 = Low E (6th string, left), 5 = High E (1st string, right)
            const lane = Math.max(0, Math.min(5, 5 - n.string));
            const stringNum = Math.max(1, Math.min(6, 6 - n.string));

            const baseMidi = tuning[n.string] ?? defaultTuning[n.string] ?? 60;
            const midiPitch = baseMidi + n.fret;
            const noteName = midiToNoteName(midiPitch);

            allNotes.push({
              id: `note-${m}-${nIdx}-${currentTime.toFixed(2)}`,
              time: Number(currentTime.toFixed(3)),
              duration: Number(durSec.toFixed(3)),
              stringNum,
              lane,
              fret: n.fret,
              note: noteName,
              midi: midiPitch,
              text: n.fret.toString(),
              measure: m,
              isStar: (allNotes.length % 16 === 0),
              technique: n.bend ? 'bend' : n.slide ? 'slide' : n.hammer ? 'hammer' : 'normal'
            });
          }
        });
      }
      currentTime += durSec;
    }
  }

  // Generate difficulty tiers from the real notes:
  // Level 4 (Guitar God): 100% of the real charted tab notes
  const level4 = allNotes;

  // Level 3 (Tablatura Avançada): All notes
  const level3 = allNotes;

  // Level 2 (Intermediário): Key rhythmic notes (50% density)
  const level2 = allNotes.filter((_, idx) => idx % 2 === 0);

  // Level 1 (Iniciante): Root/pulse notes (25% density)
  const level1 = allNotes.filter((_, idx) => idx % 4 === 0);

  return {
    charts: {
      level1,
      level2,
      level3,
      level4
    },
    totalNotes: allNotes.length,
    durationSec: Math.ceil(currentTime),
    bpm: Math.round(bpm)
  };
}
