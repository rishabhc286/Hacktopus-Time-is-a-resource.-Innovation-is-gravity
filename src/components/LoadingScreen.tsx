import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'INITIALIZING MISSION CONTROL SYSTEMS...', delay: 0 },
  { text: 'CALIBRATING WORMHOLE TELEMETRY...', delay: 320 },
  { text: 'LOADING STELLAR NAVIGATION GRID...', delay: 600 },
  { text: 'SYNCHRONIZING CREW MANIFEST DATABASE...', delay: 880 },
  { text: 'ESTABLISHING DEEP-SPACE COMMS LINK...', delay: 1120 },
  { text: 'DEPLOYING HOLOGRAPHIC HUD OVERLAY...', delay: 1360 },
  { text: 'ENGAGING GRAVITY DRIVE SUBSYSTEMS...', delay: 1580 },
  { text: 'ALL SYSTEMS NOMINAL. LAUNCH CLEARANCE GRANTED.', delay: 1820 },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Schedule each boot line
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
    });

    // All lines done → start exit
    const exitDelay = BOOT_LINES[BOOT_LINES.length - 1].delay + 700;
    setTimeout(() => {
      setDone(true);
      setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 800);
      }, 300);
    }, exitDelay);
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020204] overflow-hidden select-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {/* Dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#E6A640 0.8px, transparent 0.8px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* Scanline sweep */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(230,166,64,0.18), transparent)',
                animation: 'scanline 4s linear infinite',
              }}
            />
          </div>

          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] bg-[#E6A640]/5 pointer-events-none" />

          {/* Corner brackets */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 border-[#E6A640]/40 ${cls}`}
            />
          ))}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-4 sm:px-6">

            {/* Logo / title */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center mb-6 sm:mb-10"
            >
              <div className="flex items-center gap-1 mb-2 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e6a640] animate-ping" />
                <span className="text-[8px] sm:text-[9px] tracking-[0.35em] sm:tracking-[0.45em] text-[#e6a640]/70 uppercase">
                  GDG ON CAMPUS GLA UNIVERSITY
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl sm:text-6xl font-black tracking-[-0.04em] italic leading-none"
                style={{
                  background: 'linear-gradient(135deg, #fff 40%, #E6A640 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HACK<span style={{ WebkitTextFillColor: '#E6A640' }}>TOPUS</span>
              </h1>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#E6A640]/40 to-transparent mt-3 sm:mt-4" />
            </motion.div>

            {/* Boot terminal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="w-full bg-black/60 border border-[#E6A640]/20 rounded-none p-3 sm:p-4 mb-4 sm:mb-6 min-h-[140px] sm:min-h-[172px] flex flex-col justify-end relative overflow-hidden"
            >
              {/* Terminal header */}
              <div className="absolute top-0 left-0 right-0 px-3 py-1.5 border-b border-[#E6A640]/10 flex items-center justify-between">
                <span className="text-[8px] text-[#E6A640]/50 tracking-widest uppercase">
                  MISSION BOOT SEQUENCE // SYS-INIT
                </span>
                <div className="flex gap-1.5">
                  {['#FF4B91', '#E6A640', '#00FF87'].map((c, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c, opacity: 0.6 }} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-0.5 mt-6">
                {BOOT_LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {visibleLines.includes(i) && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="text-[9px] tracking-wider"
                          style={{
                            color: i === BOOT_LINES.length - 1
                              ? '#00FF87'
                              : i === visibleLines.length - 1
                              ? '#E6A640'
                              : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {'>'} {line.text}
                          {i === visibleLines.length - 1 && i < BOOT_LINES.length - 1 && (
                            <span className="inline-block w-[6px] h-[10px] bg-[#E6A640] ml-1 align-middle" style={{ animation: 'blink-slow 1.6s infinite' }} />
                          )}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between text-[8px] text-[#E6A640]/50 tracking-widest uppercase">
                <span>SYSTEM LOAD</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-[3px] bg-white/5 rounded-none overflow-hidden">
                <motion.div
                  className="h-full rounded-none"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, #E6A640, #00FF87)',
                    boxShadow: '0 0 10px rgba(230,166,64,0.5)',
                  }}
                />
              </div>
            </div>

            {/* Done badge */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 text-[9px] tracking-[0.4em] text-[#00FF87] uppercase font-bold animate-pulse"
                >
                  ● ENTERING MISSION DECK...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom telemetry strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 text-[7px] text-white/15 tracking-[0.3em] uppercase z-10">
            <span>HACKTOPUS // 2026</span>
            <span>48H GRAVITY BURN</span>
            <span>GLA CAMPUS</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
