/**
 * Automatic YouTube Video Finder for FretFlow
 * Resolves YouTube video IDs automatically without requiring user manual input.
 */

// Popular cached mappings for instant response
const KNOWN_YOUTUBE_IDS = {
  'guns n\' roses - sweet child o\' mine': '1w7OgIMMRc4',
  'guns n\' roses - knockin\' on heaven\'s door': 'f8OHybVhQwc',
  'nirvana - come as you are': 'vabnZ9-ex7o',
  'deep purple - smoke on the water': 'zUwEIt9ez7M',
  'metallica - nothing else matters': 'tAGnKpE4NCI',
  'ac/dc - back in black': 'pAgnJDJN4VA',
  'the white stripes - seven nation army': '0J2QdDbelmY',
  'iron maiden - the trooper': 't24ij5kI2cg',
  'pink floyd - comfortably numb': '7f3EGjRxxNI',
  'nirvana - smells like teen spirit': 'JyGNABrosb8',
  'radiohead - creep': 'XFkzRNyygfk',
  'black sabbath - paranoid': 'BOTIIw76qiE',
  'red hot chili peppers - californication': 'YlUKcNNmywk',
  'led zeppelin - stairway to heaven': 'xbhCPt6PZIU'
};

/**
 * Automatically finds a YouTube video ID for any given song title and artist
 * @param {string} title
 * @param {string} artist
 * @returns {Promise<string|null>}
 */
export async function autoFindYouTubeId(title, artist) {
  if (!title) return null;

  const cleanKey = `${artist || ''} - ${title}`.toLowerCase();
  for (const [key, id] of Object.entries(KNOWN_YOUTUBE_IDS)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      return id;
    }
  }

  // 1. Try local backend proxy
  try {
    const q = encodeURIComponent(`${artist || ''} ${title} official audio`);
    const res = await fetch(`/api/youtube-search?q=${q}`);
    if (res.ok) {
      const data = await res.json();
      if (data.videoId) return data.videoId;
    }
  } catch (_) {}

  // 2. Try Piped public API
  const PIPED_SERVERS = [
    'https://api.piped.private.coffee',
    'https://piped-api.lunar.icu',
    'https://pipedapi.kavin.rocks'
  ];
  for (const host of PIPED_SERVERS) {
    try {
      const q = encodeURIComponent(`${artist || ''} ${title} official`);
      const res = await fetch(`${host}/search?q=${q}&filter=all`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const first = data.items?.find(i => i.type === 'stream' || (i.url && i.url.includes('watch?v=')));
        if (first?.url) {
          const match = first.url.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
          if (match) return match[1];
        }
      }
    } catch (_) {}
  }

  return null;
}
