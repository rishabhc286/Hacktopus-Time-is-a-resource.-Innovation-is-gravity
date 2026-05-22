import { useEffect, useState, useRef } from 'react';
import { SectionId } from '../types';
import { playSound } from './AudioEngine';
import { Volume2, VolumeX, Radio, ShieldAlert, Cpu, Orbit, Compass, UserCheck, Terminal, HelpCircle } from 'lucide-react';

interface HUDProps {
  activeSection: SectionId;
  scrollProgress: number;
  onNavigate: (section: SectionId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const SECTION_COORDINATES: Record<SectionId, string> = {
  hero: '0.00.00 // HACKTOPUS_BASE',
  mission: '1.14.88 // GLA_COGNITIVE_CORE',
  details: '2.04.11 // CRITICAL_DETAILS',
  tracks: '3.08.12 // PLANET_SECTORS',
  schedule: '5.22.65 // CHRONO_DILATION',
  organizer: '6.12.00 // LEADERS_GDG',
  prizes: '7.45.10 // MISSION_BOUNTIES',
  crew: '8.10.11 // ORBIT_COMMANDERS',
  sponsors: '8.50.30 // SYSTEM_SHIELDERS',
  faq: '9.01.40 // ARCHIVE_TESSERACT',
  register: '9.99.99 // BOARDING_MANIFEST',
};

const SECTION_LOGS: Record<SectionId, string> = {
  hero: 'VISUAL ACQUISITION OF HACKTOPUS INTERSTELLAR CORE CONFIRMED. STELLAR ACCRETION FLOW GENTLY INJECTING GOLDEN RAYS. MISSION CODE INITIATION SEQUENCE STANDBY.',
  mission: 'LAUNCH PROTOCOLS REGISTERED // GDG ON CAMPUS GLA UNIVERSITY HACKATHON. 48-HOUR CONTINUOUS WORK ENGINE ACTIVE. 600+ BUILDERS ONBOARD.',
  details: 'PARAMETER RETRIEVAL COMPLETED. SENSING SECTOR CAPACITIES: TEAM LIMITS, VENUE COORDINATES, NETWORK ACCELERATION, TRACK CLASSIFICATIONS EN ROUTE.',
  tracks: 'PLANETARY SECTORS VERIFIED. MULTIPLEXING DOCKS: PLANET HYPERION [AI/ML], MANN [WEB3], EDMUNDS [SECURITY], MILLER [SUSTAINABILITY], TESSERACT [OPEN CREATIVE].',
  schedule: 'CHRONO-SYNCLASTIC SEQUENCE IN SYNC with INDIAN STANDARD TIME. TIMELINE FLOW RUNNING AT PEAK SPEED. VERIFY DEADLINES TO ESCAPE VOID BLOCKOUTS.',
  organizer: 'ORGANIZER TRANSMISSION RE-ESTABLISHED. GDG ON CAMPUS GLA UNIVERSITY COMMAND CORE LOGGED. COGNITIVE RESEARCH AND COMMUNITY EXPEDITION ENGINE ACTIVE.',
  prizes: 'BOUNTY CRATES VERIFIED. ₹80K+ DIRECT INJECTION AND DISCIPLINE AWARD CRATES CONFIRMED. GET READY TO CLAIM THE GRAND REWARDS OUTPOST CORES.',
  crew: 'COMMAND VESSEL LINK ESTABLISHED. SCANNING EXPEDITION LEADERS, STAR-JURY, AND MENTORS FROM THE ENDURANCE RESEARCH DECK.',
  sponsors: 'COSMIC SYSTEM SPONSORS ACTIVE. ENGAGING SYNERGY WITH BRAND SHIELD GENERATORS WHO SPONSOR OUR 48-HOUR DEEP SPACE EXPEDITION.',
  faq: 'TESSERACT HISTORY ARCHIVES FULLY ACCESSIBLE. PARADOX RESOLUTION RUNNING FOR IN-PERSON LODGE PLANS, FOOD fuel REFUEL, AND REWARDS MATRIX.',
  register: 'SECURE PORT OPENED FOR EXTRAORDINARY INTEL EXTRACTIONS. LOG CRITICAL USER KEYPADS TO RECEIVE RE-GENERATED VIRTUAL PASS DECK CODES.',
};

export default function HUD({ activeSection, scrollProgress, onNavigate, isMuted, onToggleMute }: HUDProps) {
  const [typedLog, setTypedLog] = useState('');
  const [timeStr, setTimeStr] = useState('00:00:00 IST');
  const [interactiveLogActive, setInteractiveLogActive] = useState(true);
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);

  // IST Cockpit Clock updates (UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Offset UTC by +5h 30m for Indian Standard Time
      const istOffset = 5.5 * 60 * 60 * 1000;
      const ist = new Date(now.getTime() + istOffset);
      const hh = String(ist.getUTCHours()).padStart(2, '0');
      const mm = String(ist.getUTCMinutes()).padStart(2, '0');
      const ss = String(ist.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry sound typewriter loop
  useEffect(() => {
    const targetText = SECTION_LOGS[activeSection];
    setTypedLog('');
    let idx = 0;

    if (logTimerRef.current) {
      clearInterval(logTimerRef.current);
    }

    // Rapid typewriter feel
    logTimerRef.current = setInterval(() => {
      if (idx < targetText.length) {
        const char = targetText.charAt(idx);
        setTypedLog((prev) => prev + char);
        idx++;

        // Play subtle telemetry static sound occasionally as text is typed
        if (!isMuted && idx % 3 === 0) {
          playSound('telemetry');
        }
      } else {
        if (logTimerRef.current) clearInterval(logTimerRef.current);
      }
    }, 15);

    return () => {
      if (logTimerRef.current) clearInterval(logTimerRef.current);
    };
  }, [activeSection, isMuted]);

  const handleNavClick = (section: SectionId) => {
    playSound('warp');
    onNavigate(section);
  };

  const speedPercentage = Math.round(scrollProgress * 100);

  return (
    <>
      {/* 1. Global Screen Frames (Cockpit UI Lines) */}
      <div className="fixed inset-0 pointer-events-none z-40 select-none">
        {/* Top telemetry boundary */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#E6A640]/10" />
        {/* Grid dots or corner framing brackets */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#E6A640]/30" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#E6A640]/30" />
        <div className="absolute bottom-[80px] left-8 w-12 h-12 border-b-2 border-l-2 border-[#E6A640]/30" />
        <div className="absolute bottom-[80px] right-8 w-12 h-12 border-b-2 border-r-2 border-[#E6A640]/30" />

        {/* HUD scan overlay lines */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-44 border-y border-[#E6A640]/5 bg-gradient-to-b from-transparent via-[#E6A640]/[0.01] to-transparent" />
      </div>

      {/* 2. Top Navigation & System Status HUD Banner */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-gradient-to-b from-[#020204]/90 to-transparent backdrop-blur-xs flex flex-col md:flex-row justify-between items-center gap-4 text-white border-b border-[#E6A640]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E6A640]/80 flex items-center justify-center font-bold text-xs text-[#E6A640] shrink-0 bg-black/40">🐙</div>
          <div className="p-1 px-2 border border-[#E6A640]/30 rounded-xs bg-[#E6A640]/5 flex items-center gap-1.5 animate-pulse">
            <Radio size={14} className="text-[#E6A640]" />
            <span className="text-[10px] font-mono tracking-widest text-[#E6A640]">TRANSMITTING</span>
          </div>
          <span className="text-sm font-mono tracking-[0.4em] font-semibold text-white cursor-pointer select-none" onClick={() => handleNavClick('hero')}>
            HACK<span className="text-[#E6A640]">//</span>TOPUS
          </span>
          <span className="hidden sm:inline text-[10px] text-white/40 font-mono tracking-widest border-l border-white/20 pl-3 uppercase">
            GDG GLA UNIVERSITY
          </span>
        </div>

        {/* Segmented Section Navigation Controls (Tech panel) */}
        <nav className="flex items-center gap-1 bg-black/50 p-1 border border-white/10 rounded-xs font-mono text-[10px] overflow-x-auto max-w-[50vw] sm:max-w-none no-scrollbar">
          {(['hero', 'mission', 'details', 'tracks', 'schedule', 'organizer', 'prizes', 'crew', 'sponsors', 'faq', 'register'] as const).map((sec) => (
            <button
              id={`nav-${sec}`}
              key={sec}
              onClick={() => handleNavClick(sec)}
              className={`px-2 py-1.5 rounded-xs transition-all tracking-wider uppercase flex items-center gap-1 pointer-events-auto cursor-pointer shrink-0 ${
                activeSection === sec
                  ? 'bg-white/10 text-[#e6a640] border-b border-[#e6a640] font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{sec}</span>
            </button>
          ))}
        </nav>

        {/* Chronometer & Signal indicators */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end text-[10px] font-mono text-white/60 tracking-wider">
            <span>IST CHRONO LOG</span>
            <span className="text-white font-medium">{timeStr}</span>
          </div>

          {/* Interactive procedural sound toggle */}
          <button
            onClick={() => {
              playSound('click');
              onToggleMute();
            }}
            className="p-2 border border-white/10 hover:border-white/30 rounded-full bg-black/40 text-white/80 hover:text-white transition-all pointer-events-auto cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            style={{ touchAction: 'manipulation' }}
          >
            {isMuted ? (
              <>
                <VolumeX size={15} className="text-red-400" />
                <span className="text-[9px] uppercase text-red-400">HUM MUTED</span>
              </>
            ) : (
              <>
                <Volume2 size={15} className="text-emerald-400 animate-pulse" />
                <span className="text-[9px] uppercase text-emerald-400">HUM ACTIVE</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 3. Under Construction Warning Overlay (Bottom left corner) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 select-none pointer-events-none font-mono">
        <div className="flex flex-col text-[10px] text-white/50 leading-relaxed">
          <span className="tracking-widest flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            THRUSTERS STABILIZED
          </span>
          <span className="tracking-widest text-[#e6a640]">DIALATION: {activeSection === 'hero' ? '1.00g' : activeSection === 'mission' ? '7.34g' : '5.10g'}</span>
          <span className="text-white/30 text-[9px]">ENGINE GRID SENSOR DETECTED</span>
        </div>
      </div>

      {/* 4. Active Live Stream Log Console (Fixed Bottom panel covering full screen) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-t from-[#020204]/95 via-[#020204]/80 to-transparent p-4 pt-8 md:p-6 border-t border-white/5 transition-all text-white font-mono pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Active typed logs */}
          <div className="flex-1 flex items-start gap-2 max-w-2xl bg-black/45 p-3 rounded-xs border border-white/10 backdrop-blur-xs select-none pointer-events-auto">
            <Terminal size={14} className="text-[#e6a640] shrink-0 mt-0.5 animate-pulse" />
            <div className="flex flex-col gap-1 w-full overflow-hidden">
              <div className="flex justify-between items-center text-[9px] text-[#e6a640] tracking-widest border-b border-white/10 pb-1">
                <span>SECTOR TELEMETRY COMMAND LOG</span>
                <span>SEC ID: {SECTION_COORDINATES[activeSection]}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-300 min-h-[36px] overflow-hidden whitespace-normal break-words">
                {typedLog}
                <span className="inline-block w-1.5 h-3 bg-white/70 animate-pulse ml-0.5" />
              </p>
            </div>
          </div>

          {/* Core coordinate speedometer widgets */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] shrink-0 bg-black/45 p-3 border border-white/10 rounded-xs select-none">
            <div className="flex flex-col">
              <span className="text-white/50 tracking-widest uppercase">ACCELERATION</span>
              <span className="text-[#e6a640] font-semibold text-right">{(speedPercentage * 18.2).toFixed(1)} km/s</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white/50 tracking-widest uppercase">TRAJECTORY</span>
              <span className="text-white font-semibold flex items-center gap-1 justify-end">
                <Compass size={12} className="text-cyan-400" />
                {(360 * scrollProgress).toFixed(1)}°
              </span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col w-20">
              <div className="flex justify-between text-[8px] text-white/50 tracking-widest uppercase">
                <span>DRAFT</span>
                <span className="text-white">{speedPercentage}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-red-500 via-orange-400 to-[#00ccff] h-full transition-all duration-300"
                  style={{ width: `${speedPercentage}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
