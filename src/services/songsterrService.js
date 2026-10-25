/**
 * Songsterr Tab Integration Service for FretFlow
 * Searches Songsterr's catalog, downloads tracks, and converts them into AlphaTex for AlphaTab.
 */

const CLOUDFRONT_HOSTS = ['dqsljvtekg760', 'd34shlm8p2ums2', 'd3cqchs6g3b5ew'];

// Standard note durations supported by AlphaTab
const ALLOWED_DURATIONS = [1, 2, 4, 8, 16, 32, 64];

function getValidDuration(d) {
  let closest = ALLOWED_DURATIONS[0];
  let minDiff = Math.abs(d - closest);
  for (const a of ALLOWED_DURATIONS) {
    const diff = Math.abs(d - a);
    if (diff < minDiff) {
      minDiff = diff;
      closest = a;
    }
  }
  return closest;
}

/**
 * Searches Songsterr for songs matching query
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchSongsterr(query) {
  if (!query || !query.trim()) return [];
  const q = encodeURIComponent(query.trim());

  // Try proxied endpoint first (works both in Vite dev and Nginx VPS)
  try {
    const res = await fetch(`/api/songsterr/songs?pattern=${q}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}

  // Fallback to direct Songsterr API
  try {
    const res = await fetch(`https://www.songsterr.com/api/songs?pattern=${q}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Erro ao buscar no Songsterr:', err);
  }

  return [];
}

/**
 * Fetches song metadata from Songsterr
 * @param {number|string} songId
 */
export async function fetchSongMeta(songId) {
  try {
    const res = await fetch(`/api/songsterr/meta/${songId}`);
    if (res.ok) return await res.json();
  } catch (_) {}

  try {
    const res = await fetch(`https://www.songsterr.com/api/meta/${songId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Erro ao carregar meta do Songsterr:', err);
  }

  throw new Error(`Não foi possível obter metadados da música #${songId}`);
}

/**
 * Fetches track note data from Songsterr CloudFront CDN
 * @param {number|string} songId
 * @param {number|string} revisionId
 * @param {string} image
 * @param {number} partIndex
 */
export async function fetchTrackPart(songId, revisionId, image, partIndex) {
  for (const host of CLOUDFRONT_HOSTS) {
    try {
      const url = `https://${host}.cloudfront.net/${songId}/${revisionId}/${image}/${partIndex}.json`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }
  throw new Error(`Não foi possível baixar os dados da faixa ${partIndex} do CDN.`);
}

/**
 * Converts Songsterr note JSON schema into AlphaTex format
 * @param {object} meta
 * @param {object} part
 * @returns {string} AlphaTex notation
 */
export function convertSongsterrToAlphaTex(meta, part) {
  const cleanTitle = (meta.title || 'Música').replace(/["\\]/g, ' ');
  const cleanArtist = (meta.artist || '').replace(/["\\]/g, ' ');

  let tex = `\\title "${cleanTitle}"\n`;
  if (cleanArtist) tex += `\\artist "${cleanArtist}"\n`;

  let tempo = 120;
  if (meta && typeof meta.tempo === 'number' && meta.tempo > 0) {
    tempo = Math.round(meta.tempo);
  } else if (part.tempo && typeof part.tempo === 'number' && part.tempo > 0) {
    tempo = Math.round(part.tempo);
  } else if (Array.isArray(part.automations)) {
    const t = part.automations.find(a => a.tempo);
    if (t && t.tempo) tempo = Math.round(t.tempo);
  }
  tex += `\\tempo ${tempo}\n`;
  tex += `.\n`;

  let currentDuration = null;
  let currentSignature = null;

  for (let m = 0; m < (part.measures || []).length; m++) {
    const measure = part.measures[m];

    // Handle time signature changes
    if (measure.signature && measure.signature.length === 2) {
      const sigKey = `${measure.signature[0]}/${measure.signature[1]}`;
      if (sigKey !== currentSignature) {
        currentSignature = sigKey;
        tex += `\\ts ${measure.signature[0]} ${measure.signature[1]} `;
      }
    }

    const voice = measure.voices?.[0];
    if (!voice || !voice.beats || voice.beats.length === 0) {
      tex += `r:1 | `;
      continue;
    }

    for (const beat of voice.beats) {
      let rawDur = (beat.duration && beat.duration[1]) ? beat.duration[1] : 4;
      let dur = getValidDuration(rawDur);

      let durPrefix = '';
      if (dur !== currentDuration) {
        durPrefix = `:${dur} `;
        currentDuration = dur;
      }

      if (!beat.notes || beat.notes.length === 0 || beat.rest) {
        tex += `${durPrefix}r `;
      } else if (beat.notes.length === 1) {
        const n = beat.notes[0];
        // Songsterr string: 0 = high E, 1 = B, 2 = G, 3 = D, 4 = A, 5 = low E
        // AlphaTex string: 1 = high E, 2 = B, 3 = G, 4 = D, 5 = A, 6 = low E
        const strNum = (n.string ?? 0) + 1;
        tex += `${durPrefix}${n.fret}.${strNum} `;
      } else {
        const chordNotes = beat.notes.map(n => `${n.fret}.${(n.string ?? 0) + 1}`).join(' ');
        tex += `${durPrefix}(${chordNotes}) `;
      }
    }

    tex += `| `;
    if ((m + 1) % 4 === 0) tex += `\n`;
  }

  return tex;
}

/**
 * Loads a full song track from Songsterr and prepares it for AlphaTab
 * @param {number|string} songId
 * @param {number} [targetTrackIndex]
 * @returns {Promise<{ alphaTex: string, title: string, artist: string, tempo: number, trackName: string, songId: number }>}
 */
export async function loadSongsterrTab(songId, targetTrackIndex = null) {
  const meta = await fetchSongMeta(songId);

  let trackIdx = targetTrackIndex;
  if (trackIdx === null || trackIdx === undefined) {
    trackIdx = meta.popularTrackGuitar ?? meta.defaultTrack ?? 0;
  }

  const trackMeta = meta.tracks?.[trackIdx] || meta.tracks?.[0] || {};
  const trackName = trackMeta.name || trackMeta.instrument || 'Guitar';

  const part = await fetchTrackPart(songId, meta.revisionId, meta.image, trackIdx);
  const alphaTex = convertSongsterrToAlphaTex(meta, part);

  return {
    alphaTex,
    title: meta.title || 'Música Songsterr',
    artist: meta.artist || '',
    tempo: meta.tempo || 120,
    trackName,
    songId: meta.songId,
    tracks: meta.tracks || []
  };
}
