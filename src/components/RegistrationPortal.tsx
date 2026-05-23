import { playSound } from './AudioEngine';
import {
  Terminal,
  FileCheck,
  ExternalLink,
  Rocket,
  ArrowRight,
  Lock,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION — PASTE YOUR DEVFOLIO LINK BELOW WHEN READY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Devfolio hackathon registration link.
 * Leave as empty string ('') to show the "COMING SOON" locked state.
 * Example: 'https://hacktopus2026.devfolio.co'
 */
const DEVFOLIO_URL = '';

// ═══════════════════════════════════════════════════════════════════════════════

interface RegistrationPortalProps {
  onSuccess: () => void;
}

export default function RegistrationPortal({ onSuccess: _ }: RegistrationPortalProps) {
  const handleLaunch = () => {
    if (!DEVFOLIO_URL) return;
    playSound('warp');
    window.open(DEVFOLIO_URL, '_blank', 'noreferrer');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/65 border border-white/10 relative overflow-hidden font-mono text-white">

      {/* Status badge */}
      <div className="absolute top-0 right-0 px-3 py-1 text-[8px] bg-[#e6a640]/10 border-b border-l border-[#e6a640]/25 text-[#e6a640] tracking-widest uppercase">
        PORT SIGNAL STATUS: STANDBY
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="border-b border-white/10 pb-5">
          <span className="text-[8px] tracking-widest text-[#e6a640] uppercase font-bold block mb-1">
            COGNITIVE CLEARANCE GATEWAY
          </span>
          <h3 className="text-lg md:text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
            <Terminal size={18} className="text-[#e6a640] animate-pulse" />
            BOARDING PREDECK BRIEFING
          </h3>
        </div>

        {/* Phase explainer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
          <div className="p-4 bg-[#e6a640]/5 border border-[#e6a640]/25 flex flex-col gap-2 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#e6a640]/50" />
            <span className="text-[#e6a640] font-black tracking-widest text-[9px] uppercase flex items-center gap-1.5">
              <FileCheck size={11} /> STEP 1 — REGISTER ON DEVFOLIO
            </span>
            <p className="text-slate-300 leading-relaxed uppercase text-[9px]">
              Click <strong className="text-white">BEGIN REGISTRATION</strong> below to head to our official Devfolio page. Create your team and submit your project idea to lock your slot.
            </p>
            <span className="text-[8px] text-[#e6a640]/50 uppercase tracking-wider mt-1">
              OFFICIAL HACKATHON PLATFORM
            </span>
          </div>

          <div className="p-4 bg-[#C17DFF]/5 border border-[#C17DFF]/20 flex flex-col gap-2 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#C17DFF]/50" />
            <span className="text-[#C17DFF] font-black tracking-widest text-[9px] uppercase flex items-center gap-1.5">
              <ExternalLink size={11} /> STEP 2 — ARRIVE ON EVENT DAY
            </span>
            <p className="text-slate-300 leading-relaxed uppercase text-[9px]">
              Once registered, come to GLA University on Oct 14. Show your Devfolio confirmation at check-in to receive your boarding pass and access wristband.
            </p>
            <span className="text-[8px] text-[#C17DFF]/40 uppercase tracking-wider mt-1">
              GLA UNIVERSITY — OCT 14–16, 2026
            </span>
          </div>
        </div>

        {/* Eligibility / perks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[9px] uppercase leading-normal">
          {[
            { color: '#00FAF5', label: '01 // TEAM SIZE',        text: 'Solo or squads of up to 4. All members must be students.' },
            { color: '#00FF87', label: '02 // FREE FOOD',         text: 'Meals, caffeine, and midnight snacks are fully covered.' },
            { color: '#C17DFF', label: '03 // ACCOMMODATION',     text: '48-hour continuous build. Sleep pods available on campus.' },
            { color: '#FF4B91', label: '04 // PRIZE POOL',        text: '₹80,000+ in prizes across tracks and special awards.' },
          ].map((c, i) => (
            <div key={i} className="p-3 bg-white/[0.02] border border-white/5 flex flex-col gap-1">
              <span className="font-bold tracking-wider" style={{ color: c.color }}>{c.label}</span>
              <p className="text-slate-400">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Warning banner */}
        <div className="p-4 bg-rose-500/5 border border-rose-500/20 text-[9px] text-slate-300 uppercase leading-relaxed">
          <span className="text-rose-400 font-bold block mb-1">⚠ WARNING:</span>
          Only 600 seats available. Registration is first-come, first-served. Completing Devfolio registration is mandatory to participate. Don't delay — slots fill fast.
        </div>

        {/* LAUNCH BUTTON */}
        {DEVFOLIO_URL ? (
          <button
            id="begin-registration-btn"
            onClick={handleLaunch}
            className="w-full p-4 bg-white hover:bg-[#e6a640] text-black font-black uppercase tracking-widest text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 border-none group"
          >
            <Rocket size={15} />
            BEGIN REGISTRATION — PHASE 1
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        ) : (
          <div
            id="registration-coming-soon"
            className="w-full p-4 bg-white/[0.04] border border-white/10 text-white/30 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 cursor-not-allowed select-none"
          >
            <Lock size={15} />
            REGISTRATION OPENING SOON — STAND BY
            <span className="text-[8px] border border-white/10 px-1.5 py-0.5 text-white/20 tracking-wider">LOCKED</span>
          </div>
        )}

        {/* Fine print */}
        <p className="text-[8px] text-white/20 uppercase tracking-wider leading-normal text-center border-t border-white/5 pt-4">
          BY REGISTERING, YOU CONFIRM THAT ALL SUBMITTED WORK WILL BE ORIGINAL AND BUILT DURING THE 48-HOUR HACKATHON WINDOW // GDG ON CAMPUS GLA UNIVERSITY
        </p>

      </div>
    </div>
  );
}
