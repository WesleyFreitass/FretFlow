import React from 'react';
import { GUITAR_STRINGS, NOTE_NAMES } from '../audio/chordDictionary';

const FINGER_COLORS = {
  1: 'bg-oficina-terracotta text-white border-2 border-[#fffefa]',
  2: 'bg-oficina-amberDark text-white border-2 border-[#fffefa]',
  3: 'bg-oficina-petrol text-white border-2 border-[#fffefa]',
  4: 'bg-[#7a6682] text-white border-2 border-[#fffefa]'
};

// Open string base MIDI / Pitch classes for 6 strings (E2=4, A2=9, D3=2, G3=7, B3=11, E4=4)
const STRING_ROOT_PCS = [4, 9, 2, 7, 11, 4];

export default function Fretboard({ 
  chord = null, 
  customFrets = null,
  singleNote = null, 
  highlightScalePcs = null,
  interactive = false,
  onFretClick = null,
  onOpenStringClick = null,
  fretCount = null,
  className = '',
  embedded = false
}) {
  // String rows: 1st (high E) to 6th (low E) with realistic gauge thicknesses and plain/wound type
  const stringRows = [
    { stringIndex: 1, name: '1ª e', note: 'E4', fretIndex: 5, rootPc: 4, thick: 1.2, isWound: false },
    { stringIndex: 2, name: '2ª B', note: 'B3', fretIndex: 4, rootPc: 11, thick: 1.5, isWound: false },
    { stringIndex: 3, name: '3ª G', note: 'G3', fretIndex: 3, rootPc: 7, thick: 1.8, isWound: false },
    { stringIndex: 4, name: '4ª D', note: 'D3', fretIndex: 2, rootPc: 2, thick: 2.2, isWound: true },
    { stringIndex: 5, name: '5ª A', note: 'A2', fretIndex: 1, rootPc: 9, thick: 2.8, isWound: true },
    { stringIndex: 6, name: '6ª E', note: 'E2', fretIndex: 0, rootPc: 4, thick: 3.4, isWound: true },
  ];

  const activeFrets = customFrets || (chord ? chord.frets : null);

  // Dynamic Intelligent Fret Window:
  // Default to 5 frets for open & common barre chords (C, D, E, G, A, Em, Am, F, Bm, Gm).
  // Automatically expands if a chord reaches higher frets (e.g. D5 reaching fret 7, or if fretCount is specified).
  const maxFretUsed = activeFrets ? Math.max(...activeFrets.filter(f => f > 0), 0) : 0;
  const displayedFretCount = fretCount !== null && fretCount !== undefined
    ? fretCount 
    : Math.max(5, Math.min(12, maxFretUsed));

  const gridTemplate = `52px repeat(${displayedFretCount}, 1fr)`;

  return (
    <div className={embedded ? `space-y-2 font-sans w-full overflow-hidden ${className}` : `bg-oficina-card border border-oficina-border rounded-sm p-3.5 lg:p-4 shadow-sm space-y-2.5 font-sans w-full overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-extrabold text-oficina-darkText uppercase tracking-wider">
            Posição dos Dedos no Braço
          </h3>
          {interactive && (
            <p className="text-[10px] text-oficina-bodyText font-mono">
              Clique nas casas ou na letra da corda (Nut) para alternar Solta/Ignorada
            </p>
          )}
        </div>

        {activeFrets && (
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-oficina-olive font-bold">
              <span className="w-2 h-2 rounded-full bg-oficina-olive" /> Cordas Soltas (○)
            </span>
            <span className="flex items-center gap-1.5 text-oficina-terracotta font-bold">
              <span className="w-2 h-2 rounded-full bg-oficina-terracotta" /> Ignoradas (✕)
            </span>
          </div>
        )}
      </div>

      {/* Brazilian Rosewood Wooden Fretboard Container */}
      <div className="fretboard-wood-rosewood border-2 border-[#120804] rounded-[4px] p-2.5 shadow-xl w-full overflow-x-auto custom-scrollbar transition-all duration-300">
        
        {/* Nut & Fret Numbers Header Ribbon */}
        <div 
          className="grid text-center font-mono text-[9px] font-bold text-[#e6d8c3] pb-1.5 border-b border-black/40"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="text-[#ffdfba] font-extrabold uppercase tracking-wider">Nut</div>
          {Array.from({ length: displayedFretCount }).map((_, i) => (
            <div key={i + 1} className="font-bold">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Fretboard Surface with Inlay Dots and Strings */}
        <div className="relative pt-2">
          
          {/* Fret Marker Inlay Dots Layer */}
          <div 
            className="absolute inset-0 pointer-events-none grid"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div /> {/* Nut slot */}
            {Array.from({ length: displayedFretCount }).map((_, idx) => {
              const fretNum = idx + 1;
              const hasSingleDot = [3, 5, 7, 9].includes(fretNum);
              const hasDoubleDot = fretNum === 12;

              if (hasSingleDot) {
                return (
                  <div key={fretNum} className="flex items-center justify-center h-full">
                    <div className="w-3.5 h-3.5 rounded-full inlay-pearl" />
                  </div>
                );
              }
              if (hasDoubleDot) {
                return (
                  <div key={fretNum} className="flex flex-col justify-around items-center py-2 h-full">
                    <div className="w-2.5 h-2.5 rounded-full inlay-pearl" />
                    <div className="w-2.5 h-2.5 rounded-full inlay-pearl" />
                  </div>
                );
              }
              return <div key={fretNum} />;
            })}
          </div>

          {/* 6 Guitar Strings */}
          <div className="space-y-3 relative z-10">
            {stringRows.map((strRow) => {
              const fretPosForChord = activeFrets ? activeFrets[strRow.fretIndex] : null;
              const fingerForChord = chord?.fingers ? chord.fingers[strRow.fretIndex] : null;

              const isMuted = fretPosForChord === -1;
              const isOpen = fretPosForChord === 0;
              const stringClass = strRow.isWound ? 'string-wound' : 'string-plain';

              return (
                <div 
                  key={strRow.stringIndex} 
                  className="grid items-center relative h-5"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  
                  {/* Left String Label & Nut Indicator / Interactive Toggle */}
                  <div 
                    onClick={() => {
                      if (interactive && onOpenStringClick) {
                        onOpenStringClick(strRow.fretIndex);
                      }
                    }}
                    className={`flex items-center justify-between pr-2 font-mono text-[10px] font-bold text-[#f5efe3] ${interactive ? 'cursor-pointer hover:bg-white/10 rounded-xs' : ''}`}
                    title={interactive ? 'Clique para alternar: Solta (○), Ignorada (✕) ou Casa' : ''}
                  >
                    <span>{strRow.name}</span>
                    {activeFrets && (
                      <span className="w-4 h-4 flex items-center justify-center">
                        {isMuted ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#3d1a16] text-[#ff8f75] border border-[#ff8f75]/40 flex items-center justify-center text-[9px] font-black">✕</span>
                        ) : isOpen ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#1e331c] text-[#8be37b] border border-[#8be37b]/40 flex items-center justify-center text-[9px] font-bold">○</span>
                        ) : null}
                      </span>
                    )}
                  </div>

                  {/* Frets for this string */}
                  {Array.from({ length: displayedFretCount }).map((_, fIdx) => {
                    const fretNum = fIdx + 1;
                    const isFrettedByChord = fretPosForChord === fretNum;
                    const thisFretPc = (strRow.rootPc + fretNum) % 12;
                    const noteName = NOTE_NAMES[thisFretPc];

                    const isSingleNoteHere = singleNote && singleNote.noteName === noteName;
                    const isScaleNote = highlightScalePcs && highlightScalePcs.includes(thisFretPc);
                    const fingerColorClass = FINGER_COLORS[fingerForChord] || 'bg-oficina-terracotta text-white border-2 border-white';

                    return (
                      <div 
                        key={fretNum} 
                        onClick={() => {
                          if (interactive && onFretClick) {
                            onFretClick(strRow.fretIndex, fretNum);
                          }
                        }}
                        className={`fret-wire-nickel h-full flex items-center justify-center relative ${
                          interactive ? 'cursor-pointer hover:bg-white/10 transition' : ''
                        }`}
                      >
                        {/* Metal String Line (Plain or Wound texture) */}
                        <div 
                          className={`${stringClass} absolute inset-x-0 shadow-sm pointer-events-none ${isMuted ? 'opacity-35' : ''}`}
                          style={{ height: `${strRow.thick}px` }}
                        />

                        {/* Finger Placement Marker (for Chord) */}
                        {isFrettedByChord && (
                          <div className={`relative z-20 w-6 h-6 rounded-full font-bold font-mono text-xs text-white flex items-center justify-center shadow-lg border-2 border-white ${fingerColorClass}`}>
                            {fingerForChord > 0 ? fingerForChord : noteName}
                          </div>
                        )}

                        {/* Scale Note Highlight Overlay (when previewing compatible scales) */}
                        {!isFrettedByChord && isScaleNote && (
                          <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500 text-white font-bold font-mono text-[9px] flex items-center justify-center shadow-xs border border-white/60">
                            {noteName}
                          </div>
                        )}

                        {/* Single note highlight when playing solos */}
                        {!chord && !customFrets && isSingleNoteHere && (
                          <div className="relative z-20 w-5 h-5 rounded-full bg-oficina-olive text-white font-bold font-mono text-[9px] flex items-center justify-center shadow-md border-2 border-white">
                            {singleNote.noteName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
