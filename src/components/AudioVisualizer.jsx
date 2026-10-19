import React, { useRef, useEffect } from 'react';
import { NOTE_NAMES } from '../audio/chordDictionary';
import { globalAudio } from '../audio/audioManager';
import { Activity, BarChart3 } from 'lucide-react';

export default function AudioVisualizer({ 
  timeDomainBuffer, 
  frequencyBuffer, 
  chromagram = new Array(12).fill(0), 
  isAudible = false,
  highlightNotes = []
}) {
  const waveCanvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // High-performance continuous 60 FPS Oscilloscope rendering loop
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Vintage Phosphor Screen Background
      ctx.fillStyle = '#141816';
      ctx.fillRect(0, 0, width, height);

      // Oscilloscope Graticule Grid Lines
      ctx.strokeStyle = '#1d2420';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let y = height / 4; y < height; y += height / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = width / 8; x < width; x += width / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center Reference Line
      ctx.strokeStyle = '#28332d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Read live time domain buffer from globalAudio if available
      const buffer = globalAudio.timeDomainBuffer || timeDomainBuffer;
      const audible = globalAudio.isRunning && isAudible;

      if (!buffer || !audible) {
        // Resting flat trace
        ctx.strokeStyle = '#35433b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        // Active real-time phosphor green wave
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#7fbf4d';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#7fbf4d';

        ctx.beginPath();
        const bufferLength = buffer.length;
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = buffer[i];
          const y = (height / 2) + (v * (height * 0.44));

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [timeDomainBuffer, isAudible]);

  return (
    <div className="bg-oficina-card border border-oficina-border rounded-sm p-4 lg:p-5 shadow-sm space-y-4 select-none font-sans">
      
      {/* Waveform Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-oficina-darkText flex items-center gap-2">
          <Activity className="w-4 h-4 text-oficina-terracotta" />
          <span>Osciloscópio de Sinal Analógico (60 FPS)</span>
        </span>
        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] ${
          isAudible ? 'bg-oficina-oliveLight text-oficina-olive border border-oficina-olive/30' : 'bg-oficina-surface text-oficina-mutedText border border-oficina-border'
        }`}>
          {isAudible ? 'SINAL ATIVO · DSP 44.1kHz' : 'SILÊNCIO'}
        </span>
      </div>

      {/* Live Canvas Screen */}
      <div className="h-20 w-full bg-[#141816] rounded-[2px] overflow-hidden border border-[#2a2f2c] flex items-center justify-center shadow-inner">
        <canvas 
          ref={waveCanvasRef} 
          width={640} 
          height={80} 
          className="w-full h-full block"
        />
      </div>

      {/* 12-Tone Chromagram Spectrum */}
      <div className="space-y-2 pt-1 border-t border-oficina-borderLight">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-oficina-darkText flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-oficina-olive" />
            <span>Espectro Cromático das 12 Notas (Chromagram FFT)</span>
          </span>
          <span className="text-[10px] text-oficina-mutedText font-mono">Energia Harmônica (C → B)</span>
        </div>

        <div className="grid grid-cols-12 gap-1.5 bg-oficina-surface p-2.5 rounded-[2px] border border-oficina-border">
          {NOTE_NAMES.map((noteName, idx) => {
            const rawEnergy = (chromagram && chromagram[idx] !== undefined) ? chromagram[idx] : 0;
            const energy = isAudible ? Math.min(1.0, rawEnergy * 1.25) : 0;
            const barHeight = Math.max(8, Math.round(energy * 100));
            const isHighlighted = highlightNotes.includes(noteName) && isAudible;

            return (
              <div key={noteName} className="flex flex-col items-center gap-1.5">
                <div className="h-16 w-full bg-[#eae6da] rounded-[2px] flex items-end p-0.5 overflow-hidden border border-oficina-border">
                  <div 
                    className={`w-full rounded-[1px] transition-all duration-100 ${
                      isHighlighted 
                        ? 'bg-oficina-terracotta shadow-sm' 
                        : energy > 0.45 
                          ? 'bg-oficina-olive' 
                          : 'bg-[#ccc7ba]'
                    }`}
                    style={{ height: `${isAudible ? barHeight : 6}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono font-bold ${
                  isHighlighted ? 'text-oficina-terracotta font-black' : energy > 0.45 ? 'text-oficina-olive font-black' : 'text-oficina-mutedText'
                }`}>
                  {noteName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
