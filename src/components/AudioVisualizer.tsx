import { useEffect, useRef } from 'react';
import { getAnalyser } from './AudioEngine';

interface AudioVisualizerProps {
  isMuted: boolean;
}

export default function AudioVisualizer({ isMuted }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match its CSS size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let lastFrameData: Uint8Array | null = null;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      const analyser = getAnalyser();
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // ── If no analyser yet (music not started) or muted, draw idle ghost bars ──
      if (!analyser || isMuted) {
        const BAR_COUNT = 28;
        const gap = 3;
        const barW = (W - gap * (BAR_COUNT - 1)) / BAR_COUNT;

        for (let i = 0; i < BAR_COUNT; i++) {
          // gentle idle sine wave breathing
          const idle = Math.abs(Math.sin((Date.now() / 1800 + i * 0.22))) * 0.12 + 0.02;
          const barH = H * idle;
          const x = i * (barW + gap);
          const y = H - barH;

          const grad = ctx.createLinearGradient(0, y, 0, H);
          grad.addColorStop(0, 'rgba(230,166,64,0.18)');
          grad.addColorStop(1, 'rgba(230,166,64,0.04)');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barW, barH);
        }
        return;
      }

      // ── Live frequency data from analyser ──
      const bufLen = analyser.frequencyBinCount;
      const dataArr = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(dataArr);

      // Smooth with previous frame to avoid jittery bars
      if (!lastFrameData || lastFrameData.length !== bufLen) {
        lastFrameData = new Uint8Array(dataArr);
      } else {
        for (let i = 0; i < bufLen; i++) {
          lastFrameData[i] = lastFrameData[i] * 0.72 + dataArr[i] * 0.28;
        }
      }

      const BAR_COUNT = 28;
      const gap = 3;
      const barW = Math.max(1, (W - gap * (BAR_COUNT - 1)) / BAR_COUNT);

      // Sample the lower 60% of the frequency spectrum (more musical content)
      const usableBins = Math.floor(bufLen * 0.60);
      const step = usableBins / BAR_COUNT;

      const now = Date.now();

      for (let i = 0; i < BAR_COUNT; i++) {
        // Average a small window of bins for each bar
        const binStart = Math.floor(i * step);
        const binEnd = Math.floor((i + 1) * step);
        let sum = 0;
        for (let b = binStart; b < binEnd; b++) {
          sum += lastFrameData[b];
        }
        const avg = sum / Math.max(1, binEnd - binStart);
        const normalized = avg / 255;

        // Minimum height so bars are always visible
        const minFrac = 0.04;
        const barH = H * (minFrac + normalized * (1 - minFrac));
        const x = i * (barW + gap);
        const y = H - barH;

        // Color: gold → cyan at peaks, faint at low energy
        const energy = normalized;
        const r = Math.round(230 - energy * 160);   // 230 → 70
        const g = Math.round(166 - energy * 10);    // 166 → 156
        const b_val = Math.round(64 + energy * 191); // 64 → 255

        // Gradient: bright top → faint base
        const grad = ctx.createLinearGradient(0, y, 0, H);
        grad.addColorStop(0, `rgba(${r},${g},${b_val},${0.85 + energy * 0.15})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b_val},0.35)`);
        grad.addColorStop(1, `rgba(${r},${g},${b_val},0.05)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, barH);

        // Peak dot — glowing cap at the top of each bar
        if (energy > 0.25) {
          const dotOpacity = Math.min(1, energy * 1.4);
          ctx.beginPath();
          ctx.arc(x + barW / 2, y - 2, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b_val},${dotOpacity})`;
          ctx.fill();
        }
      }

      // ── Mirror / reflection at bottom ──
      ctx.save();
      ctx.scale(1, -1);
      ctx.translate(0, -H);
      const reflGrad = ctx.createLinearGradient(0, 0, 0, H * 0.18);
      reflGrad.addColorStop(0, 'rgba(2,2,4,0)');
      reflGrad.addColorStop(1, 'rgba(2,2,4,0.85)');

      for (let i = 0; i < BAR_COUNT; i++) {
        const binStart = Math.floor(i * step);
        const binEnd = Math.floor((i + 1) * step);
        let sum = 0;
        for (let b = binStart; b < binEnd; b++) sum += lastFrameData[b];
        const avg = sum / Math.max(1, binEnd - binStart);
        const normalized = avg / 255;
        const reflH = H * 0.12 * normalized;
        const x = i * (barW + gap);
        ctx.fillStyle = `rgba(230,166,64,${normalized * 0.08})`;
        ctx.fillRect(x, 0, barW, reflH);
      }
      ctx.restore();

      // ── Scanline overlay for CRT feel ──
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let row = 0; row < H; row += 4) {
        ctx.fillRect(0, row, W, 1);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
    };
  }, [isMuted]);

  return (
    <div
      className="fixed right-0 top-0 h-screen z-40 pointer-events-none flex flex-col justify-end"
      style={{ width: '72px' }}
    >
      {/* Label */}
      <div
        className="absolute top-1/2 right-0 flex items-center gap-1.5 font-mono select-none"
        style={{
          transform: 'translateX(50%) translateY(-50%) rotate(90deg)',
          transformOrigin: 'center',
          width: '100px',
          right: '36px',
        }}
      >
        <span
          className="h-1 w-1 rounded-full bg-[#e6a640] animate-pulse shrink-0"
          style={{ animationDuration: '1.4s' }}
        />
        <span className="text-[7px] tracking-[0.3em] text-[#e6a640]/50 uppercase whitespace-nowrap">
          FREQ SPECTRUM
        </span>
      </div>

      {/* Corner bracket decorations */}
      <div className="absolute top-8 right-4 w-3 h-3 border-t border-r border-[#e6a640]/20" />
      <div className="absolute bottom-8 right-4 w-3 h-3 border-b border-r border-[#e6a640]/20" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{
          height: '55vh',
          marginBottom: '10vh',
          opacity: 0.9,
        }}
      />
    </div>
  );
}
