import React, { useState, useEffect } from 'react';
import { ManifestEntry } from '../types';
import { playSound } from './AudioEngine';
import { ShieldAlert, UserCheck, Terminal, Award, HelpCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface RegistrationPortalProps {
  onSuccess: () => void;
}

const AVAILABLE_SKILLS = [
  'Python-Anomalies',
  'TypeScript-HUD',
  'Rust-Structures',
  'Gravity-Computation',
  'Decentralized-Logistics',
  'Embedded-Telemetry',
  'Astrobiology-Simulation',
  'WebGL-Lensing',
];

export default function RegistrationPortal({ onSuccess }: RegistrationPortalProps) {
  const [manifest, setManifest] = useState<ManifestEntry | null>(null);
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Pilot' | 'Engineer' | 'Navigator' | 'Scientist'>('Pilot');
  const [track, setTrack] = useState('Miller Abyss [ALPHA]');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('crewManifest');
      if (saved) {
        setManifest(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed reading manifest:', e);
    }
  }, []);

  const handleSkillToggle = (skill: string) => {
    playSound('click');
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!handle.trim()) {
      setErrorMessage('COULD NOT RESOLVE AUTH: HACKER HANDLE IS EMPTY.');
      playSound('sonar');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('INVALID FREQUENCY DATA: CORRUPTED PILOT EMAIL PATHWAY.');
      playSound('sonar');
      return;
    }

    setIsSubmitting(true);
    playSound('warp');

    // Artificial gravity-delay
    setTimeout(() => {
      // Deterministic deterministic checksum
      const rawHex = Math.random().toString(16).substring(2, 10).toUpperCase();
      const rawHexPart2 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const ticketId = `EH-${rawHex}-${rawHexPart2}`;

      const newManifest: ManifestEntry = {
        handle: handle.trim().toUpperCase(),
        email: email.trim(),
        role,
        track,
        skills: selectedSkills,
        encryptionKey: ticketId,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      };

      try {
        localStorage.setItem('crewManifest', JSON.stringify(newManifest));
        setManifest(newManifest);
        onSuccess();
      } catch (err) {
        setErrorMessage('LOCAL DISK WRITING FAILURE. PLEASE PERMIT COOKIES.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const handleRevoke = () => {
    playSound('sonar');
    try {
      localStorage.removeItem('crewManifest');
      setManifest(null);
      // Reset form variables
      setHandle('');
      setEmail('');
      setRole('Pilot');
      setSelectedSkills([]);
    } catch (e) {
      console.error(e);
    }
  };

  if (manifest) {
    // Holographic Badge layout
    return (
      <div 
        className="w-full max-w-xl mx-auto bg-black/55 p-6 border-2 border-emerald-500/30 rounded-xs select-none relative overflow-hidden font-mono text-white animate-fade-in"
        style={{ contentVisibility: 'auto' }}
      >
        <div className="absolute top-0 right-0 p-1 px-2.5 bg-emerald-500/10 border-b border-l border-emerald-500/40 text-[8px] text-emerald-400 tracking-widest uppercase animate-pulse flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
          CLEARANCE APPROVED
        </div>

        {/* Heading */}
        <div className="border-b border-white/10 pb-4 mb-4">
          <span className="text-[8px] tracking-widest text-[#e6a640]">SYSTEM SECURITY BOARDING VERIFIED</span>
          <h3 className="text-lg font-bold tracking-widest text-emerald-400 mt-1 uppercase flex items-center gap-1.5">
            <Award size={18} />
            ENDURANCE BOARDING CARD
          </h3>
        </div>

        {/* Boarding Badge Content */}
        <div className="grid grid-cols-2 gap-4 text-[10px] leading-relaxed mb-6">
          <div className="flex flex-col">
            <span className="text-white/40 tracking-wider">HACKER HANDLE</span>
            <span className="text-[#e6a640] font-bold tracking-widest text-xs mt-0.5">{manifest.handle}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40 tracking-wider">SECURE COMMS</span>
            <span className="text-white truncate mt-0.5">{manifest.email}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40 tracking-wider">CLEARANCE STATUS</span>
            <span className="text-emerald-400 font-semibold mt-0.5 uppercase tracking-widest">{manifest.role} OFFICER</span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/40 tracking-wider">TARGET DESTINATION</span>
            <span className="text-cyan-400 font-semibold mt-0.5 uppercase tracking-widest">{manifest.track}</span>
          </div>

          <div className="col-span-2 flex flex-col">
            <span className="text-white/40 tracking-wider">VERIFIED DECODERS SKILLS</span>
            <span className="text-slate-300 mt-1 whitespace-normal text-[9px] break-words">
              {manifest.skills.length > 0 ? manifest.skills.join(' • ') : 'NO INDIVIDUAL DECODER CHIPS SPECIFIED'}
            </span>
          </div>

          <div className="col-span-2 flex flex-col pt-2 border-t border-white/5">
            <span className="text-white/40 tracking-wider">CRYPTOGRAPHIC KEY</span>
            <span className="text-white font-mono tracking-[0.2em] font-bold select-text bg-white/[0.04] p-1 px-2.5 rounded-xs mt-1 text-center select-all border border-white/10">
              {manifest.encryptionKey}
            </span>
          </div>
        </div>

        {/* Boarding ASCII Simulation */}
        <div className="bg-black/85 p-3 rounded-xs text-[7px] text-slate-400/80 leading-tight font-mono border border-white/5 mb-6 overflow-x-auto select-none">
          <p>+-------------------------------------------------------------+</p>
          <p>|  [HACKTOPUS] GDG GLA MISSION SECURE ACCESS BADGE KEYCODE    |</p>
          <p>|  UID: {manifest.encryptionKey}                              |</p>
          <p>|  CHRONO CLOCK LOG STABLE: {manifest.registeredAt}          |</p>
          <p>|                                                             |</p>
          <p>|  .. . ...... ......... ... ........ .......... ..... ....   |</p>
          <p>|  || | |||||| ||||||||| ||| |||||||| |||||||||| ||||| ||||   |</p>
          <p>|  || | |||||| ||||||||| | | |||||||| | | |||||| ||||| ||||   |</p>
          <p>|  |  |  |  |  |  |  |   |   |  |     |   |  |   |     | |    |</p>
          <p>|                                                             |</p>
          <p>|  SINGULARITY GRAVITY WELL OUTLAND SYSTEM ENTRY VALIDATED    |</p>
          <p>+-------------------------------------------------------------+</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center bg-white/[0.02] p-3.5 border border-white/5 rounded-xs">
          <span className="text-[8px] text-white/30 tracking-wider">MANIFEST SYNCE WITH EARTH COMMAND</span>
          <button
            onClick={handleRevoke}
            className="p-2 px-4 text-[9px] text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/5 hover:bg-rose-500/10 transition-all uppercase rounded-xs font-mono cursor-pointer flex items-center gap-1.5"
            style={{ touchAction: 'manipulation' }}
          >
            <RotateCcw size={10} />
            Revoke Access Clearance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-2xl mx-auto bg-black/65 p-6 md:p-8 border border-white/10 rounded-xs text-white font-mono relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-1 px-3.5 text-[8px] bg-[#e6a640]/10 border-b border-l border-[#e6a640]/25 text-[#e6a640] tracking-widest uppercase">
        PORT SIGNAL STATUS: STANDBY
      </div>

      <div className="border-b border-white/10 pb-5 mb-6">
        <span className="text-[8px] tracking-widest text-[#e6a640] uppercase font-bold block mb-1">COGNITIVE CLEARANCE GATEWAY</span>
        <h3 className="text-lg md:text-xl font-black tracking-widest text-white uppercase flex items-center gap-1.5">
          <Terminal size={18} className="text-[#e6a640] animate-pulse" />
          BOARDING PREDECK BRIEFING
        </h3>
      </div>

      <div className="text-[11px] leading-relaxed flex flex-col gap-6 text-slate-300">
        <p className="border-l-2 border-[#e6a640] pl-3.5 py-1 text-[11.5px] text-white uppercase font-semibold">
          BEFORE COMMITTING SECTOR CODES AND ENLISTING ON THE ENDURANCE, DIRECT ALL CREW PILOTS TO INGEST THE FOLLOWING LAUNCH CRITERIA:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] uppercase text-left leading-normal">
          <div className="p-3.5 bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <span className="text-[#00FAF5] font-bold tracking-wider">01 // ESCORTED & INDEPENDENT FLIGHTS (TEAMS)</span>
            <p className="text-slate-400">
              Crews may operate as solo scouts or synchronize within standard squads of up to 4 astronauts. Group formation is critical to prevent code thruster decay.
            </p>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <span className="text-[#00FF87] font-bold tracking-wider">02 // UNLIMITED NUTRITIONAL CARGO (MEALS)</span>
            <p className="text-slate-400">
              No engine can burn on cold fuel. Deep-space fuel supplies, including continuous meals, high-caffeine canisters, and midnight carbohydrates, are repeatedly dispatched directly to crew stations.
            </p>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <span className="text-[#C17DFF] font-bold tracking-wider">03 // GRAVITATIONAL REST PODS (LODGING)</span>
            <p className="text-slate-400">
              This is a rigorous, continuous 48-hour build sandbox. Ground command at GLA University Outpost provides secure physical sleep capsules and hygiene stations.
            </p>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <span className="text-[#FF4B91] font-bold tracking-wider">04 // PRIMARY MISSION TARGET (GOAL)</span>
            <p className="text-slate-400">
              You must architect and run fully modular systems across AI/ML, Decentralized Web3 networks, Threat Cyber Security, or Sustainable Hydro-systems.
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xs text-[10px] text-slate-300 flex flex-col gap-2 uppercase">
          <span className="font-bold text-emerald-400 tracking-wider">STATION WARNING REQUIREMENT:</span>
          <p className="leading-normal">
            To register, astronauts must lock their terminals, declare their specialist capabilities, and obtain a Boarding Authorization Ticket. Completing the boarding process locks you into our 2026 ground database.
          </p>
        </div>

        <p className="text-[8.5px] text-white/40 leading-normal border-t border-white/5 pt-4 uppercase">
          BY TRIGGERING LAUNCH REGISTRATION below, YOUR LOCAL IP COGNITIVE CORRELATION SCANNER SECURES PORT SECTOR CLEARANCE AND INITIATES BOARDING CARD GENERATION AUTOMATICALLY.
        </p>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] leading-relaxed uppercase rounded-xs flex items-start gap-2">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Big On-click Registration Trigger Button */}
        <button
          onClick={() => {
            playSound('warp');
            setIsSubmitting(true);
            setTimeout(() => {
              const rawHex = Math.random().toString(16).substring(2, 10).toUpperCase();
              const rawHexPart2 = Math.random().toString(16).substring(2, 6).toUpperCase();
              const ticketId = `EH-${rawHex}-${rawHexPart2}`;
              const randomHandles = ['NEO_COOPER', 'GRAVITY_SURFER', 'ORBITAL_PILOT', 'COGNITIVE_CREW', 'TESSERACT_ARCH', 'GLA_HACKER'];
              const customHandle = `${randomHandles[Math.floor(Math.random() * randomHandles.length)]}_${Math.floor(10 + Math.random() * 90)}`;
              
              const newManifest: ManifestEntry = {
                handle: customHandle,
                email: 'chaudharyrishabh008@gmail.com',
                role: 'Pilot',
                track: 'Planet Hyperion [AI / ML TRACK]',
                skills: ['Python-Anomalies', 'TypeScript-HUD', 'Gravity-Computation'],
                encryptionKey: ticketId,
                registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
              };

              try {
                localStorage.setItem('crewManifest', JSON.stringify(newManifest));
                setManifest(newManifest);
                onSuccess();
              } catch (err) {
                setErrorMessage('LOCAL STORAGE FAILURE. PLEASE ENABLE COOKIES.');
              } finally {
                setIsSubmitting(false);
              }
            }, 1000);
          }}
          disabled={isSubmitting}
          className="p-4 bg-white hover:bg-[#e6a640] text-black font-black uppercase tracking-widest text-xs transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center gap-3 border-none disabled:bg-white/40 disabled:cursor-wait select-none"
          style={{ touchAction: 'manipulation' }}
        >
          {isSubmitting ? (
            <>
              <Terminal size={15} className="animate-spin text-black" />
              <span>TRANSMITTING COGNITIVE AUTH SIGNALS...</span>
            </>
          ) : (
            <>
              <span>INITIATE EXPEDITION BOARDING RECRUITMENT</span>
              <ArrowRight size={15} className="text-black group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
