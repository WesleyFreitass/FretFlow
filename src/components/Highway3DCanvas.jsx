import React, { useRef, useEffect } from 'react';
import { CHORD_DEFINITIONS } from '../audio/chordDictionary';

const STRING_COLORS = [
  '#3b82f6', // String 1 (high e) - Blue
  '#06b6d4', // String 2 (B) - Cyan
  '#10b981', // String 3 (G) - Emerald
  '#eab308', // String 4 (D) - Yellow
  '#f59e0b', // String 5 (A) - Amber
  '#ef4444'  // String 6 (low E) - Red
];

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

export default function Highway3DCanvas({
  selectedSong,
  currentTime = 0,
  gameMode = 'solo', // 'solo' | 'chords'
  evaluatedEvents = {},
  liveFeedback = null,
  detectedPitch = null,
  detectedChord = null,
  isAudible = false,
  onToggleMode
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Trigger spark particles on hit
  useEffect(() => {
    if (liveFeedback && (liveFeedback.type === 'perfect' || liveFeedback.type === 'good')) {
      const color = liveFeedback.type === 'perfect' ? '#10b981' : '#06b6d4';
      for (let i = 0; i < 24; i++) {
        particlesRef.current.push({
          x: (Math.random() - 0.5) * 160,
          y: 0,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 6 - 2,
          radius: Math.random() * 4 + 2,
          color,
          alpha: 1.0,
          life: 30
        });
      }
    }
  }, [liveFeedback]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // 3D Perspective Parameters
      const topY = height * 0.12;
      const bottomY = height * 0.76;
      const horizonWidth = width * 0.28;
      const bottomWidth = width * 0.88;
      const centerX = width * 0.5;

      const topXLeft = centerX - horizonWidth / 2;
      const topXRight = centerX + horizonWidth / 2;
      const botXLeft = centerX - bottomWidth / 2;
      const botXRight = centerX + bottomWidth / 2;

      // Draw Highway 3D Track Background
      const highwayGrad = ctx.createLinearGradient(0, topY, 0, bottomY);
      highwayGrad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
      highwayGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.7)');
      highwayGrad.addColorStop(1, 'rgba(14, 165, 233, 0.15)');

      ctx.beginPath();
      ctx.moveTo(topXLeft, topY);
      ctx.lineTo(topXRight, topY);
      ctx.lineTo(botXRight, bottomY);
      ctx.lineTo(botXLeft, bottomY);
      ctx.closePath();
      ctx.fillStyle = highwayGrad;
      ctx.fill();

      // Track Border Glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Perspective Grid Beams (horizontal beat bars)
      const lookaheadSeconds = 3.5;
      const speed = 1.0;
      const beatInterval = 60 / (selectedSong.bpm || 80);
      const currentBeat = currentTime / beatInterval;
      const firstVisibleBeat = Math.floor(currentBeat);
      const lastVisibleBeat = Math.ceil(currentBeat + lookaheadSeconds / beatInterval);

      for (let b = firstVisibleBeat; b <= lastVisibleBeat; b++) {
        const beatTime = b * beatInterval;
        const delta = beatTime - currentTime;
        if (delta >= 0 && delta <= lookaheadSeconds) {
          const t = 1.0 - (delta / lookaheadSeconds); // 0 at top, 1 at bottom
          // Non-linear perspective curve for authentic 3D depth
          const p = Math.pow(t, 2.2);
          const y = topY + (bottomY - topY) * p;
          const currentW = horizonWidth + (bottomWidth - horizonWidth) * p;
          const xl = centerX - currentW / 2;
          const xr = centerX + currentW / 2;

          ctx.beginPath();
          ctx.moveTo(xl, y);
          ctx.lineTo(xr, y);
          ctx.strokeStyle = b % 4 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = b % 4 === 0 ? 2 : 1;
          ctx.stroke();
        }
      }

      // Draw 6 String Rails
      const numStrings = 6;
      for (let s = 0; s < numStrings; s++) {
        const topRatio = (s + 0.5) / numStrings;
        const botRatio = (s + 0.5) / numStrings;

        const x1 = topXLeft + horizonWidth * topRatio;
        const x2 = botXLeft + bottomWidth * botRatio;

        ctx.beginPath();
        ctx.moveTo(x1, topY);
        ctx.lineTo(x2, bottomY);
        ctx.strokeStyle = `${STRING_COLORS[s]}77`;
        ctx.lineWidth = s >= 3 ? 3 : 2; // Thicker low strings
        ctx.stroke();
      }

      // Render Moving Events: Solo Notes or Chords
      if (gameMode === 'solo' && selectedSong.soloNotes) {
        // Draw Solo 3D Note Gems
        selectedSong.soloNotes.forEach((noteEv, idx) => {
          const delta = noteEv.time - currentTime;
          if (delta >= -0.3 && delta <= lookaheadSeconds) {
            const t = Math.max(0, Math.min(1.0, 1.0 - (delta / lookaheadSeconds)));
            const p = Math.pow(t, 2.2);

            const y = topY + (bottomY - topY) * p;
            const currentW = horizonWidth + (bottomWidth - horizonWidth) * p;
            const currentLeft = centerX - currentW / 2;

            // String index 0 = high e (string 1 in music notation)
            const stringIdx = (noteEv.string - 1);
            const x = currentLeft + currentW * ((stringIdx + 0.5) / 6);
            const color = STRING_COLORS[stringIdx] || '#38bdf8';

            const baseRadius = 8 + p * 16;
            const status = evaluatedEvents[idx]?.status;

            // Sustain Trail
            if (noteEv.duration && noteEv.duration > 0.4) {
              const durDelta = (noteEv.time + noteEv.duration) - currentTime;
              const tEnd = Math.max(0, Math.min(1.0, 1.0 - (durDelta / lookaheadSeconds)));
              const pEnd = Math.pow(tEnd, 2.2);
              const yEnd = topY + (bottomY - topY) * pEnd;

              const trailGrad = ctx.createLinearGradient(0, yEnd, 0, y);
              trailGrad.addColorStop(0, `${color}22`);
              trailGrad.addColorStop(1, `${color}bb`);

              ctx.beginPath();
              ctx.moveTo(x - baseRadius * 0.35, y);
              ctx.lineTo(x + baseRadius * 0.35, y);
              ctx.lineTo(x + baseRadius * 0.2, yEnd);
              ctx.lineTo(x - baseRadius * 0.2, yEnd);
              ctx.closePath();
              ctx.fillStyle = trailGrad;
              ctx.fill();
            }

            // Note Gem
            ctx.save();
            ctx.translate(x, y);

            // Glow
            ctx.shadowColor = color;
            ctx.shadowBlur = 12 * p;

            ctx.beginPath();
            ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
            ctx.fillStyle = status === 'hit' ? '#10b981' : status === 'miss' ? '#ef4444' : color;
            ctx.fill();

            // Gem Ring & Fret Number
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Fret Number Text
            ctx.fillStyle = '#0f172a';
            ctx.font = `bold ${Math.max(9, Math.round(baseRadius * 0.95))}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(noteEv.fret !== undefined ? noteEv.fret : noteEv.note, 0, 1);

            // Technique Badge (Bend / Vibrato)
            if (noteEv.technique === 'bend') {
              ctx.fillStyle = '#fbbf24';
              ctx.font = `bold ${Math.max(8, Math.round(baseRadius * 0.65))}px Inter, sans-serif`;
              ctx.fillText('⤹B', 0, -baseRadius - 4);
            } else if (noteEv.technique === 'vibrato') {
              ctx.fillStyle = '#38bdf8';
              ctx.font = `bold ${Math.max(8, Math.round(baseRadius * 0.65))}px Inter, sans-serif`;
              ctx.fillText('~~~', 0, -baseRadius - 4);
            }

            ctx.restore();
          }
        });
      } else if (selectedSong.events) {
        // Draw 3D Chord Bars (Rhythm Mode)
        selectedSong.events.forEach((chordEv, idx) => {
          const delta = chordEv.time - currentTime;
          if (delta >= -0.3 && delta <= lookaheadSeconds) {
            const t = Math.max(0, Math.min(1.0, 1.0 - (delta / lookaheadSeconds)));
            const p = Math.pow(t, 2.2);

            const y = topY + (bottomY - topY) * p;
            const currentW = horizonWidth + (bottomWidth - horizonWidth) * p;
            const xl = centerX - currentW / 2 + 10;
            const barW = currentW - 20;
            const barH = 12 + p * 24;

            const status = evaluatedEvents[idx]?.status;
            const chordObj = CHORD_DEFINITIONS[chordEv.chord];

            ctx.save();
            // Bar Glow & Color
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10 * p;

            const barGrad = ctx.createLinearGradient(xl, 0, xl + barW, 0);
            if (status === 'hit') {
              barGrad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
              barGrad.addColorStop(1, 'rgba(5, 150, 105, 0.95)');
            } else if (status === 'miss') {
              barGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
              barGrad.addColorStop(1, 'rgba(185, 28, 28, 0.7)');
            } else {
              barGrad.addColorStop(0, 'rgba(14, 165, 233, 0.85)');
              barGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.95)');
              barGrad.addColorStop(1, 'rgba(2, 132, 199, 0.85)');
            }

            ctx.fillStyle = barGrad;
            ctx.beginPath();
            ctx.roundRect(xl, y - barH / 2, barW, barH, 8 * p);
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Chord Name Label
            ctx.fillStyle = '#ffffff';
            ctx.font = `black ${Math.max(11, Math.round(barH * 0.7))}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chordEv.chord, centerX, y);

            ctx.restore();
          }
        });
      }

      // STRIKE ZONE (TARGET HIT LINE)
      ctx.save();
      const strikeGrad = ctx.createLinearGradient(botXLeft, 0, botXRight, 0);
      strikeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
      strikeGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.95)');
      strikeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');

      ctx.beginPath();
      ctx.moveTo(botXLeft - 20, bottomY);
      ctx.lineTo(botXRight + 20, bottomY);
      ctx.strokeStyle = strikeGrad;
      ctx.lineWidth = 6;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Strike Target Ring on each string
      for (let s = 0; s < 6; s++) {
        const x = botXLeft + bottomWidth * ((s + 0.5) / 6);
        ctx.beginPath();
        ctx.arc(x, bottomY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = STRING_COLORS[s];
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(x, bottomY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      ctx.restore();

      // Render Particle Sparks
      if (particlesRef.current.length > 0) {
        ctx.save();
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.2; // Gravity
          pt.alpha -= 0.03;
          pt.life -= 1;

          if (pt.life <= 0 || pt.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(centerX + pt.x, bottomY + pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      }

      // DRAW HORIZONTAL FRETBOARD AT BOTTOM
      const fbTop = bottomY + 16;
      const fbHeight = height - fbTop - 12;
      const fbWidth = width * 0.94;
      const fbLeft = (width - fbWidth) / 2;

      // Wood Fretboard Neck
      const neckGrad = ctx.createLinearGradient(0, fbTop, 0, fbTop + fbHeight);
      neckGrad.addColorStop(0, '#1c1917');
      neckGrad.addColorStop(0.5, '#292524');
      neckGrad.addColorStop(1, '#0c0a09');

      ctx.save();
      ctx.fillStyle = neckGrad;
      ctx.beginPath();
      ctx.roundRect(fbLeft, fbTop, fbWidth, fbHeight, 8);
      ctx.fill();
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Frets (12 frets)
      const numFrets = 12;
      const fretWidth = fbWidth / (numFrets + 1);

      // Nut (Fret 0)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fbLeft + fretWidth * 0.8, fbTop, 4, fbHeight);

      // Fret Wires
      for (let f = 1; f <= numFrets; f++) {
        const fx = fbLeft + (f + 0.8) * fretWidth;
        ctx.fillStyle = '#78716c';
        ctx.fillRect(fx, fbTop, 2, fbHeight);

        // Fret Inlays (3, 5, 7, 9, 12)
        if ([3, 5, 7, 9].includes(f)) {
          ctx.beginPath();
          ctx.arc(fx - fretWidth / 2, fbTop + fbHeight / 2, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        } else if (f === 12) {
          // Double Inlay
          ctx.beginPath();
          ctx.arc(fx - fretWidth / 2, fbTop + fbHeight * 0.3, 3.5, 0, Math.PI * 2);
          ctx.arc(fx - fretWidth / 2, fbTop + fbHeight * 0.7, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.fill();
        }

        // Fret Number Labels
        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(f.toString(), fx - fretWidth / 2, fbTop + fbHeight + 10);
      }

      // Horizontal Strings on Fretboard
      for (let s = 0; s < 6; s++) {
        const sy = fbTop + (fbHeight * (s + 0.5) / 6);
        ctx.beginPath();
        ctx.moveTo(fbLeft, sy);
        ctx.lineTo(fbLeft + fbWidth, sy);
        ctx.strokeStyle = STRING_COLORS[s];
        ctx.lineWidth = s >= 3 ? 2.5 : 1.5;
        ctx.stroke();

        // String Name on Left
        ctx.fillStyle = STRING_COLORS[s];
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(STRING_NAMES[s], fbLeft - 6, sy + 3);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [selectedSong, currentTime, gameMode, evaluatedEvents]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* Mode Switch Pills in Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-[#090d16]/90 backdrop-blur p-1 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={() => onToggleMode('solo')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            gameMode === 'solo'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎸 Modo Solo & Licks (3D)
        </button>
        <button
          onClick={() => onToggleMode('chords')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            gameMode === 'chords'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎼 Modo Cifras & Ritmo
        </button>
      </div>

      {/* 3D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="w-full h-full max-h-[540px] rounded-2xl shadow-2xl border border-slate-800/80 bg-[#060a12]"
      />
    </div>
  );
}
