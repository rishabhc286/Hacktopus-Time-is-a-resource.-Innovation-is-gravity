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
  hero: 'Welcome to HACKTOPUS — a 48-hour hackathon by GDG On Campus GLA University. Scroll down to explore tracks, prizes, schedule, and how to register your team.',
  mission: 'About HACKTOPUS: A flagship hackathon bringing 600+ developers, designers & innovators together at GLA University, Mathura for 48 hours of non-stop building.',
  details: 'Event details at a glance — team size (1–4 members), open eligibility, in-person venue at GLA University, Mathura, mentorship, workshops, meals & accommodation included.',
  tracks: 'Choose your track: AI/ML, Web3 & Blockchain, Cybersecurity, Climate & Sustainability, or Open Innovation. Each track has dedicated mentors and prize categories.',
  schedule: 'Key dates — Registrations open now. Hackathon runs October 14–16, 2026 at GLA University, Mathura. Check the timeline below for all important deadlines.',
  organizer: 'Organised by GDG On Campus GLA University — a Google Developer Group running workshops, hackathons, and tech events for students across the region.',
  prizes: 'Total prize pool: ₹80,000+. Includes cash prizes for top 3 teams, plus special awards for Best AI Project, Best UI/UX, and Best Team Spirit.',
  crew: 'Meet the judges, mentors, and organising team who will guide you through the hackathon and evaluate your final submissions.',
  sponsors: 'Interested in sponsoring HACKTOPUS 2026? Partner with us to reach 600+ talented developers and get your brand in front of the next generation of innovators.',
  faq: 'Frequently Asked Questions — find answers about eligibility, team formation, accommodation, judging criteria, submission format, and more.',
  register: 'Ready to join? Fill in your details below to secure your spot. Registration is free. Only 600 seats available — register early to avoid missing out.',
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
      <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 py-2.5 sm:py-3 bg-[#020204]/95 backdrop-blur-sm flex flex-row justify-between items-center gap-2 text-white border-b border-[#E6A640]/10">
        {/* Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#E6A640]/80 flex items-center justify-center font-bold text-xs text-[#E6A640] bg-black/40">🐙</div>
          <span className="text-xs sm:text-sm font-mono tracking-[0.25em] sm:tracking-[0.4em] font-semibold text-white cursor-pointer select-none" onClick={() => handleNavClick('hero')}>
            HACK<span className="text-[#E6A640]">//</span>TOPUS
          </span>
          <span className="hidden md:inline text-[10px] text-white/40 font-mono tracking-widest border-l border-white/20 pl-3 uppercase">
            GDG GLA UNIVERSITY
          </span>
        </div>

        {/* Scrollable nav — hidden on very small screens, visible from sm */}
        <nav className="hidden sm:flex items-center gap-0.5 bg-black/50 p-1 border border-white/10 rounded-xs font-mono text-[9px] overflow-x-auto flex-1 mx-2 md:mx-4" style={{scrollbarWidth:'none'}}>
          {(['hero', 'mission', 'details', 'tracks', 'schedule', 'organizer', 'prizes', 'crew', 'sponsors', 'faq', 'register'] as const).map((sec) => (
            <button
              id={`nav-${sec}`}
              key={sec}
              onClick={() => handleNavClick(sec)}
              className={`px-1.5 py-1 rounded-xs transition-all tracking-wider uppercase pointer-events-auto cursor-pointer shrink-0 ${
                activeSection === sec
                  ? 'bg-white/10 text-[#e6a640] border-b border-[#e6a640] font-bold'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {sec}
            </button>
          ))}
        </nav>

        {/* Right: mute + time */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex flex-col items-end text-[10px] font-mono text-white/60 tracking-wider">
            <span>IST CHRONO LOG</span>
            <span className="text-white font-medium">{timeStr}</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onToggleMute();
            }}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-white/30 rounded-full bg-black/40 text-white/80 hover:text-white transition-all pointer-events-auto cursor-pointer flex items-center gap-1 text-xs font-mono"
            style={{ touchAction: 'manipulation' }}
          >
            {isMuted ? (
              <>
                <VolumeX size={14} className="text-red-400" />
                <span className="hidden sm:inline text-[9px] uppercase text-red-400">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 size={14} className="text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-[9px] uppercase text-emerald-400">ACTIVE</span>
              </>
            )}
          </button>
        </div>
      </header>



      {/* 4. Active Live Stream Log Console (Fixed Bottom panel) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-t from-[#020204]/98 via-[#020204]/80 to-transparent px-3 sm:px-6 pt-6 pb-2 sm:pb-3 border-t border-white/5 text-white font-mono pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-end gap-2">
          {/* Active typed logs — truncated on mobile */}
          <div className="flex-1 flex items-start gap-1.5 sm:gap-2 bg-black/45 p-2 sm:p-3 rounded-xs border border-white/10 backdrop-blur-xs select-none pointer-events-auto min-w-0">
            <Terminal size={12} className="text-[#e6a640] shrink-0 mt-0.5 animate-pulse" />
            <div className="flex flex-col gap-0.5 w-full min-w-0">
              <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-[#e6a640] tracking-widest border-b border-white/10 pb-1">
                <span className="hidden sm:inline">SECTOR TELEMETRY LOG</span>
                <span className="sm:hidden">TELEMETRY</span>
                <span className="truncate ml-2 text-white/40">{SECTION_COORDINATES[activeSection]}</span>
              </div>
              <p className="text-[9px] sm:text-[10px] leading-relaxed text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis sm:whitespace-normal sm:break-words min-h-[18px] sm:min-h-[36px]">
                {typedLog}
                <span className="inline-block w-1 h-2.5 sm:w-1.5 sm:h-3 bg-white/70 animate-pulse ml-0.5" />
              </p>
            </div>
          </div>

          {/* Speedometer — desktop only */}
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
