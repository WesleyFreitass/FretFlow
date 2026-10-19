import React, { useState } from 'react';
import { SAMPLE_SONGS } from '../data/sampleSongs';
import { 
  Music, 
  Search, 
  Plus, 
  Play, 
  Flame, 
  CheckCircle2, 
  Video, 
  Star 
} from 'lucide-react';

export default function SongCatalogTab({
  selectedSong,
  onSelectSong,
  onAddCustomSong
}) {
  const [filterDifficulty, setFilterDifficulty] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const parseYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleImportUrl = () => {
    const videoId = parseYouTubeId(customUrl);
    if (!videoId) return;

    const newSong = {
      id: `custom-${Date.now()}`,
      title: "Música Personalizada do YouTube",
      artist: "Link do Usuário",
      youtubeId: videoId,
      bpm: 80,
      difficulty: "Personalizado",
      genre: "YouTube",
      description: "Música importada via link do YouTube",
      chordsUsed: ['C', 'G', 'Am', 'F'],
      events: [
        { time: 2.0, chord: 'C', duration: 4.0 },
        { time: 6.0, chord: 'G', duration: 4.0 },
        { time: 10.0, chord: 'Am', duration: 4.0 },
        { time: 14.0, chord: 'F', duration: 4.0 },
        { time: 18.0, chord: 'C', duration: 4.0 },
        { time: 22.0, chord: 'G', duration: 4.0 },
        { time: 26.0, chord: 'Am', duration: 4.0 },
        { time: 30.0, chord: 'F', duration: 4.0 }
      ],
      soloNotes: [
        { time: 2.0, string: 1, fret: 3, note: 'G', duration: 1.0, technique: 'normal' },
        { time: 4.0, string: 2, fret: 1, note: 'C', duration: 1.0, technique: 'normal' },
        { time: 6.0, string: 1, fret: 3, note: 'G', duration: 1.0, technique: 'normal' },
        { time: 8.0, string: 3, fret: 2, note: 'A', duration: 1.0, technique: 'normal' }
      ]
    };

    onSelectSong(newSong);
    setCustomUrl('');
  };

  const filteredSongs = SAMPLE_SONGS.filter(s => {
    const matchDiff = filterDifficulty === 'Todos' || s.difficulty === filterDifficulty;
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDiff && matchSearch;
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar select-none">
      
      {/* Top Banner: Search, Filter & YouTube Importer */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-sky-400" />
              <span>Biblioteca de Músicas & Solos</span>
            </h2>
            <p className="text-xs text-slate-400">Escolha uma música clássica ou importe qualquer vídeo do YouTube</p>
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center gap-1.5 bg-[#090d16] p-1.5 rounded-xl border border-slate-800">
            {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterDifficulty === diff
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & YouTube Link Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título ou banda..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Video className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cole o link do YouTube (ex: https://youtube.com/...)"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              onClick={handleImportUrl}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Importar
            </button>
          </div>
        </div>
      </div>

      {/* Song Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSongs.map(song => {
          const isSelected = selectedSong?.id === song.id;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className={`bg-[#111827] border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-200 group hover:scale-[1.02] ${
                isSelected
                  ? 'border-sky-500 shadow-sky-500/20 ring-1 ring-sky-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    song.difficulty === 'Avançado'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : song.difficulty === 'Intermediário'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {song.difficulty}
                  </span>

                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {song.bpm} BPM
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-sky-300 transition">
                  {song.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{song.artist} • {song.genre}</p>

                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                  {song.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                  {song.soloNotes ? '🎸 Solo & Cifras 3D' : '🎼 Cifras Sincronizadas'}
                </div>

                <button
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'bg-slate-800 group-hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSelected ? 'Tocando' : 'Carregar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
