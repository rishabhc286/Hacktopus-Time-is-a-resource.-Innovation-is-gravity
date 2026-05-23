import { useEffect, useState, useRef } from 'react';
import { SectionId } from './types';
import { TIMELINE, COMMANDERS, FAQ } from './data';
import ThreeCanvas from './components/ThreeCanvas';
import HUD from './components/HUD';
import AudioEngine, { playSound } from './components/AudioEngine';
import AudioVisualizer from './components/AudioVisualizer';
import PlanetViewer from './components/PlanetViewer';
import RegistrationPortal from './components/RegistrationPortal';
import LoadingScreen from './components/LoadingScreen';
import brochurePdf from './components/Brochure.pdf';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Orbit, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Radio, 
  Sparkles, 
  Atom, 
  Compass, 
  Cpu, 
  Globe, 
  Database,
  Calendar,
  Layers,
  Award,
  Download
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePlanetIdx, setActivePlanetIdx] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [countdownText, setCountdownText] = useState('CALCULATING TRAJECTORY...');
  const [registrationCount, setRegistrationCount] = useState(148);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPacketDownloadSuccess, setShowPacketDownloadSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mute prompt alert overlay shown on first load (standard browser requirement)
  const [showMutePrompt, setShowMutePrompt] = useState(true);

  // Countdown to October 14, 2026 at 12:00 PM IST (UTC+05:30 → 06:30:00Z)
  useEffect(() => {
    const targetDate = new Date('2026-10-14T06:30:00Z').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdownText('LAUNCH PROTOCOL ENGAGED');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (num: number) => String(num).padStart(2, '0');
      setCountdownText(`T-MINUS ${days} DAYS ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Set initial registered status check
  useEffect(() => {
    try {
      if (localStorage.getItem('crewManifest')) {
        setIsRegistered(true);
        setRegistrationCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Core Scroll tracking logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
      setScrollProgress(progress);

      // Evaluate active section based on scroll offset geometry
      const sections: SectionId[] = ['hero', 'mission', 'details', 'tracks', 'schedule', 'organizer', 'prizes', 'crew', 'sponsors', 'faq', 'register'];
      let currentActive: SectionId = 'hero';
      let minDistance = Infinity;

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Proximity checkpoint relative to viewport midpoint
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < minDistance) {
            minDistance = distance;
            currentActive = id;
          }
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculations
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (id: SectionId) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    setShowMutePrompt(false);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setRegistrationCount((prev) => prev + 1);
  };

  return (
    <>
      {/* Loading screen — renders above everything, self-dismisses */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <motion.main
        className="relative min-h-screen text-slate-100 bg-[#020204] overflow-x-hidden font-sans select-none antialiased"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >

      {/* 3D WebGL Background Scene — only mount after loading to prevent flash */}
      {!isLoading && <ThreeCanvas scrollProgress={scrollProgress} activePlanetIdx={activePlanetIdx} />}

      {/* Decorative dot matrix mesh from Artistic Flair */}
      <div className="absolute inset-0 opacity-[0.14] pointer-events-none z-0 artistic-dot-matrix" />

      {/* Ambient center backlights of Artistic Flair */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] bg-[#E6A640]/5 pointer-events-none z-0" />

      {/* Procedural Hum and Sound FX Synthesizer */}
      <AudioEngine isMuted={isMuted} onToggleMute={handleToggleMute} />

      {/* Fixed right-side audio frequency visualizer */}
      <AudioVisualizer isMuted={isMuted} />

      {/* Absolute Cockpit HUD Overlay */}
      <HUD 
        activeSection={activeSection} 
        scrollProgress={scrollProgress} 
        onNavigate={navigateToSection}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 1. Introductory Telemetry Mute Notification Card */}
      <AnimatePresence>
        {showMutePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-16 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xs z-50 bg-[#020204]/95 p-4 border border-amber-500/40 rounded-xs glass-terminal font-mono"
          >
            <div className="flex items-start gap-3">
              <Radio className="text-amber-500 shrink-0 mt-0.5 animate-pulse" size={16} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-amber-500 tracking-widest font-bold">INCOMING ATMOSPHERIC HUM</span>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Enable the spaceship cockpit ambient hum &amp; procedural telemetry click synthesizer.
                </p>
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => {
                      playSound('warp');
                      setIsMuted(false);
                      setShowMutePrompt(false);
                    }}
                    className="p-1.5 px-4 bg-white text-black text-[9px] hover:bg-emerald-400 hover:text-black transition-all font-semibold rounded-xs uppercase cursor-pointer border-none flex-1 sm:flex-none"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Activate Hum
                  </button>
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowMutePrompt(false);
                    }}
                    className="p-1.5 px-4 border border-white/20 text-slate-400 hover:text-white transition-all text-[9px] rounded-xs uppercase cursor-pointer flex-1 sm:flex-none"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Mute Hum
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Page Content - Absolute Layout Overlay providing real height */}
      <div 
        className="relative z-10 flex flex-col items-center w-full"
        style={{ contentVisibility: 'auto' }}
      >
           {/* ================= HERO SECTION ================= */}
        <section
          id="hero"
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 pt-16 sm:pt-20 pb-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-4xl text-center flex flex-col items-center font-mono w-full">
            {/* Mission Tagline */}
            <div className="p-1.5 px-3 border border-[#e6a640]/30 rounded-full bg-black/45 flex items-center gap-2 mb-5 text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/80 select-all animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e6a640] animate-ping animate-duration-1000" />
              <span className="truncate">LAUNCH GRID ACTIVE // GDG ON CAMPUS GLA UNIVERSITY</span>
            </div>

            {/* Giant display title */}
            <div className="w-full text-left mb-4 max-w-xl self-start select-all">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-[-0.05em] text-white flex flex-col leading-[0.85] italic">
                <span>HACK</span>
                <span className="text-[#e6a640] flex items-center gap-3 sm:gap-4">
                  TOPUS
                  <span className="h-[2px] sm:h-1 bg-[#e6a640] flex-1 opacity-70" />
                </span>
              </h1>
            </div>

            {/* Slogan */}
            <div className="w-full text-left max-w-xl mb-3 self-start">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#e6a640]/90 block">
                “Time is a resource. Innovation is gravity.”
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] text-slate-300 uppercase leading-relaxed max-w-2xl mb-6 sm:mb-8 text-left w-full">
              An immersive 48-hour in-person futuristic mission for developers, designers, AI builders, and creators.
            </p>

            {/* Countdown */}
            <div className="p-4 px-4 sm:px-6 border border-[#e6a640]/25 bg-black/60 rounded-xs glass-terminal mb-8 sm:mb-10 w-full max-w-lg select-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#e6a640]/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#e6a640]/40" />
              <div className="flex justify-between items-center border-b border-[#e6a640]/10 pb-2 mb-2 text-[8px] sm:text-[9px] text-[#e6a640]/65 tracking-widest">
                <span className="hidden sm:inline">WORMHOLE COUNTDOWN TIMER</span>
                <span className="sm:hidden">COUNTDOWN</span>
                <span>STATUS: STABLE</span>
              </div>
              <span className="text-sm sm:text-lg font-bold tracking-[0.1em] sm:tracking-[0.15em] text-[#e6a640] block">
                {countdownText}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-start w-full">
              <button
                id="secure-crew-entry"
                onClick={() => handleNavClick('register')}
                className="p-3.5 px-8 w-full sm:w-auto border border-[#e6a640] bg-[#e6a640]/5 text-[#e6a640] text-xs font-bold uppercase tracking-widest transition-all rounded-none hover:bg-[#e6a640] hover:text-black cursor-pointer shadow-[0_0_15px_rgba(230,166,64,0.1)] hover:shadow-[0_0_25px_rgba(230,166,64,0.3)] duration-300"
                style={{ touchAction: 'manipulation' }}
              >
                {isRegistered ? 'View Boarding Pass' : 'Secure Crew Entry'}
              </button>
              <button
                onClick={() => handleNavClick('mission')}
                className="p-3.5 px-8 w-full sm:w-auto border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest transition-all rounded-none hover:bg-[#e6a640]/5 hover:border-[#e6a640]/50 hover:text-[#e6a640] cursor-pointer"
                style={{ touchAction: 'manipulation' }}
              >
                Mission Briefing
              </button>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 w-full mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5 text-[8px] sm:text-[9px] text-white/44 tracking-widest uppercase text-left leading-relaxed select-all">
              <div>
                <span className="text-white/20 block">GRID SENSORS</span>
                <span className="text-emerald-400 font-semibold">● ONLINE</span>
              </div>
              <div>
                <span className="text-white/20 block">COGNITIVE CORE</span>
                <span className="text-white">0 CRITICAL</span>
              </div>
              <div>
                <span className="text-white/20 block">EXPECTED BUILDERS</span>
                <span className="text-[#e6a640] font-semibold">600+ HACKERS</span>
              </div>
              <div>
                <span className="text-white/20 block">LAUNCH STATION</span>
                <span className="text-cyan-400">GLA [IN-PERSON]</span>
              </div>
            </div>
          </div>
        </section>


        {/* ================= ABOUT / MISSION SECTION ================= */}
        <section 
          id="mission" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20 bg-gradient-to-b from-transparent via-[#020204]/80 to-transparent"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 font-mono items-center">
            
            {/* Text description column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4">
              <div className="text-[#e6a640] text-[10px] tracking-widest uppercase font-bold">
                MISSION BRIEFING / ABOUT // SECTION 01
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white leading-none">
                ABOUT the <span className="text-[#e6a640]">HACKTOPUS</span> EXPEDITION
              </h2>
              <div className="h-[2px] w-24 bg-gradient-to-r from-[#e6a640] to-transparent mb-4" />
              
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed uppercase flex flex-col gap-5 select-text">
                {/* Vision Statement */}
                <div className="p-3 px-4 border-l-2 border-[#e6a640] bg-[#e6a640]/5 italic text-white font-medium">
                  “We look up at the stars and wonder about our place, but when we look at code, we construct the futures of tomorrow. HACKTOPUS is a calling.”
                </div>

                {/* Mission paragraph */}
                <p>
                  HACKTOPUS is a premier 48-hour continuous physical hackathon engineered by GDG On Campus GLA University. Our mission gathers over 600+ elite programmers, creative designers, neural models specialists, and startup founders under one physical roof to expand the gravity centers of technology.
                </p>

                {/* Why HACKTOPUS exists */}
                <p className="text-white bg-white/5 p-3 rounded-xs border border-white/5">
                  <span className="text-[#e6a640] font-bold block mb-1">WHY HACKTOPUS EXISTS</span>
                  To shatter conventional developer constraints and provide a sandbox of frictionless creation. When stellar minds collide near the accretion center of raw technology, ordinary boundaries collapse and innovative leaps are born.
                </p>

                {/* Cinematic mission briefing paragraph */}
                <p className="text-[#00FAF5] leading-relaxed">
                  <span className="text-[#00FAF5] font-bold block">COMMAND BRIEFING TRANSMISSION</span>
                  Attention, crew: You are boarding the Endurance outpost. Time spent idle dilates your opportunity. Build, design, ship before you are swept into the cosmic void. Time is your primary resource, and coding is your trajectory.
                </p>

                {/* Community-driven and Brochure Download section */}
                <div className="pt-4 border-t border-white/5 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#e6a640] tracking-wider font-bold">FLIGHT SPECS ACQUISITION</span>
                    <span className="text-[9px] text-white/50 lowercase">Contains technical specifications and sector rules (PDF).</span>
                  </div>
                  <a 
                    href={brochurePdf}
                    download="HACKTOPUS_2026_Brochure.pdf"
                    onClick={() => playSound('warp')}
                    className="p-2 px-5 bg-white text-black hover:bg-[#e6a640] hover:text-black text-[10px] tracking-wider uppercase font-bold transition-all rounded-none cursor-pointer text-center"
                  >
                    Acquire Flight Brochure
                  </a>
                </div>
              </div>
            </div>

            {/* Dynamic statistics and CTAs */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'EVALUATED PILOTS', val: '600+ CREWMEMBERS', detail: 'Developers & Designers' },
                  { label: 'GRAVITY DRIFT', val: '48 HOURS CONTINUOUS', detail: 'Continuous Engine Burn' },
                  { label: 'THE SINGULARITY FORCE', val: '5 PLANET ARCHS', detail: 'Holographic track zones' },
                  { label: 'COMMAND LAUNCHPAD', val: 'GLA mathura', detail: 'In-Person Habitat Docks' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-black/45 border border-[#e6a640]/15 rounded-xs hover:border-[#e6a640]/40 transition-all duration-300">
                    <span className="text-[8px] text-white/40 tracking-wider block uppercase">{stat.label}</span>
                    <span className="text-sm font-bold text-[#e6a640] tracking-tight block mt-1 uppercase">{stat.val}</span>
                    <span className="text-[9px] text-white/30 tracking-wider mt-0.5 block uppercase">{stat.detail}</span>
                  </div>
                ))}
              </div>

              {/* Sponsor and Participant CTA card */}
              <div className="p-5 border border-[#00ccff]/20 bg-[#00ccff]/5 rounded-none relative overflow-hidden font-mono text-[10px]">
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00ccff]/60" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00ccff]/60" />
                
                <span className="text-[9px] text-[#00ccff] tracking-widest font-bold block mb-2">PARTNERSHIP & FLIGHT ENLISTMENT</span>
                <p className="text-slate-300 leading-relaxed uppercase mb-4">
                  External commercial stewards and organizations may reserve telemetry display space and sponsor specific computational prize challenges.
                </p>
                <div className="flex gap-3">
                  <a 
                    href="mailto:chaudharyrishabh008@gmail.com"
                    className="p-1.5 px-3 bg-[#00ccff]/10 border border-[#00ccff]/40 text-[#00ccff] hover:bg-[#00ccff] hover:text-black text-[9px] font-bold tracking-widest uppercase transition-all"
                  >
                    Sponsor Secure Comms Link
                  </a>
                  <button 
                    onClick={() => handleNavClick('register')}
                    className="p-1.5 px-3 border border-white/20 text-white hover:border-[#e6a640] hover:text-[#e6a640] text-[9px] font-bold tracking-widest uppercase transition-all"
                  >
                    Enlist as Pilot
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= KEY DETAILS HUD SECTION ================= */}
        <section 
          id="details" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-6xl w-full flex flex-col items-center">
            
            {/* Heading info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-[#00FF87] font-semibold uppercase font-bold">INSTRUMENT CONSOLE // SECTION 02</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <Compass size={30} className="text-[#00FF87] animate-pulse" />
                MISSION PARAMETERS (HUD)
              </h2>
              <p className="text-xs text-white/50 max-w-xl uppercase tracking-wider mt-1 select-all">
                Telemetry diagnostic specifications for boarding squads. Verify system limits and flight rules before wormhole transition check.
              </p>
            </div>

            {/* Bento-grid HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full font-mono text-[10px] leading-relaxed">
              {[
                {
                  label: 'SECURE TEAM SIZE',
                  title: '1 - 4 Builders Squad',
                  desc: 'Solo pilots are authorized, but forming highly synchronized multi-disciplinary squads combining developers + designers achieves peak flight stability.',
                  color: '#e6a640',
                },
                {
                  label: 'TRAJECTORY ELIGIBILITY',
                  title: 'Open to All Creators',
                  desc: 'Clearance is extended globally to all programmers, structural UI/UX designers, cognitive AI specialists, student explorers, and startup pioneers.',
                  color: '#00FAF5',
                },
                {
                  label: 'COMMAND VENUE',
                  title: 'GLA University Outpost',
                  desc: 'Mathura Campus Command Dock. Experience high-rigidity physical desks, live review panels, immersive star-stages, and fully staffed mission facilities.',
                  color: '#FF4B91',
                },
                {
                  label: 'MISSION DURATION',
                  title: '48 Hours Ignition',
                  desc: 'An intense continuous burning phase without time dilation offsets. Eat, build, code, iterate, and submit your telemetry deliverables before T-Zero.',
                  color: '#00FF87',
                },
                {
                  label: 'DECIDED TRACKS',
                  title: '5 Planet Arenas',
                  desc: 'Choose to deploy code cargo on Planet AETHER-01 (AI), NEXUS-CHAIN (WEB3 Track), VOID-X (CyberSecurity), TERRA-NOVA (Climate Sustainability), or enter the creative dimensions of The INFINITY CORE.',
                  color: '#C17DFF',
                },
                {
                  label: 'ORBITAL NETWORKING',
                  title: 'Stellar Comms & Datalinks',
                  desc: 'Maintain interactive channels with local technology startup founders, VC scouts, system leads, and community engineers pacing the console floors.',
                  color: '#ffffff',
                },
                {
                  label: 'TECHNICAL WORKSHOPS',
                  title: 'Flight-Deck API Briefings',
                  desc: 'Gain real-time edge capabilities. Attend developer flybys detailing Gemini SDK usage, zero-knowledge mechanics, and edge deployment platforms.',
                  color: '#00ccff',
                },
                {
                  label: 'CONTINUOUS MENTORSHIP',
                  title: 'Ground Command Orbiters',
                  desc: 'Experienced flight operators, startup developers, and academic commanders pace the coordinates continuously to troubleshoot compiler blockades.',
                  color: '#FFaa22',
                },
                {
                  label: 'SLEEP ZONE CAPSULES',
                  title: 'Hyper-Sleep Accommodation',
                  desc: 'GLA University provides safe, physically isolated rest chambers, sleep pods, and steady nutritional payload intervals to keep crew processors from overheating.',
                  color: '#10B981',
                },
                {
                  label: 'MISSION CLEARANCE CREDENTIALS',
                  title: 'Certified GDG Transmission Log',
                  desc: 'Every single crew member who survives the 48-hour gravity burn obtains an official, validated GDG On Campus GLA University Certificate of deep-tech expedition.',
                  color: '#EC4899',
                },
              ].map((param, idx) => (
                <div 
                  key={idx}
                  className={`p-5 bg-black/45 border hover:bg-black/60 transition-all duration-300 relative group flex flex-col justify-between ${idx === 8 || idx === 9 ? 'md:col-span-1 lg:col-span-1' : ''}`}
                  style={{ borderColor: `${param.color}20` }}
                >
                  {/* Decorative bracket graphics */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: param.color }} />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: param.color }} />

                  <div>
                    <span 
                      className="text-[8px] tracking-[0.25em] font-bold block mb-2"
                      style={{ color: param.color }}
                    >
                      {param.label}
                    </span>
                    <h4 className="text-sm font-black text-white tracking-widest uppercase mb-2 group-hover:text-white transition-colors">
                      {param.title}
                    </h4>
                    <p className="text-[9.5px] text-slate-400 uppercase leading-relaxed font-mono">
                      {param.desc}
                    </p>
                  </div>

                  <span className="text-[8px] text-white/20 block text-right mt-4 select-none">
                    PARAM_LOG_{idx + 10} // VERIFIED
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= PLANETS/TRACKS SECTION ================= */}
        <section 
          id="tracks" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-7xl w-full flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3.5 mb-14 font-mono">
              <span className="text-[10px] tracking-widest text-[#C17DFF] font-black uppercase">// DEPLOYMENT TARGETS // SECTION 03</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase flex items-center justify-center gap-3">
                <Globe size={28} className="text-[#C17DFF] animate-pulse" />
                MISSION TRACKS
              </h2>
              <div className="h-[2px] w-24 bg-gradient-to-r from-[#C17DFF] to-transparent mb-1" />
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl uppercase leading-relaxed font-semibold tracking-wider select-all">
                Every innovation begins with a destination. Choose your sector. Build beyond limits.
              </p>
            </div>

            {/* Interactive Planet Viewer (Triggers Camera warp in ThreeCanvas) */}
            <PlanetViewer activePlanetIdx={activePlanetIdx} onSelectPlanet={setActivePlanetIdx} />

            {/* Section Ending Line */}
            <div className="text-center mt-12 font-mono">
              <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4" />
              <p className="text-xs md:text-sm tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white/60 font-black uppercase">
                Five sectors. One mission. Infinite possibilities.
              </p>
            </div>

          </div>
        </section>


        {/* ================= SCHEDULE INDEX SECTION ================= */}
        <section 
          id="schedule" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-4xl w-full flex flex-col items-center">
            
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-emerald-400 font-semibold uppercase">TEMPORAL PROTOCOLS // SECTION 04</span>
              <h2 className="text-3xl md:text-chart-2 font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <Calendar size={26} className="text-emerald-400" />
                TIME DILATION CHRONOLOGY
              </h2>
              <p className="text-xs text-white/50 max-w-md uppercase mt-1 select-all">
                Warning: Time dialation is extreme. Standard milestones run sequentially on Earth synchronized times.
              </p>
            </div>

            {/* Structured chronometer listing */}
            <div className="grid gap-5 w-full font-mono text-[11px] leading-relaxed">
              {TIMELINE.map((evt, idx) => {
                const isPast = evt.status === 'past';
                const isCurrent = evt.status === 'current';
                return (
                  <div 
                    key={idx}
                    className={`p-4 md:p-5 border rounded-xs transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isCurrent 
                        ? 'bg-[#e6a640]/5 border-[#e6a640]/50 shadow-[0_0_12px_rgba(230,166,64,0.1)]' 
                        : isPast 
                          ? 'bg-[#020204]/40 border-white/5 opacity-50' 
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Time indicator column */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span 
                        className={`h-2.5 w-2.5 rounded-full ${isCurrent ? 'bg-[#e6a640] animate-ping' : isPast ? 'bg-slate-600' : 'bg-cyan-400'}`} 
                      />
                      <div className="flex flex-col">
                        <span className={`font-bold tracking-widest text-xs ${isCurrent ? 'text-[#e6a640]' : 'text-white'}`}>{evt.time}</span>
                        <span className="text-[9px] text-white/40 tracking-wider uppercase mt-0.5">{evt.stage}</span>
                      </div>
                    </div>

                    {/* Middle title details */}
                    <div className="flex-1 md:border-l md:border-white/10 md:pl-5">
                      <h4 className="font-bold tracking-widest uppercase text-white mb-1">
                        {evt.title}
                      </h4>
                      <p className="text-[10px] text-slate-300 leading-normal uppercase">
                        {evt.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 self-end md:self-auto text-[8px] tracking-widest uppercase">
                      {isCurrent ? (
                        <span className="bg-[#e6a640]/10 border border-[#e6a640]/30 text-[#e6a640] px-2.5 py-1 rounded-sm animate-pulse font-bold">ACTIVE FLUX</span>
                      ) : isPast ? (
                        <span className="bg-slate-500/10 border border-slate-500/20 text-slate-400 px-2.5 py-1 rounded-sm">COMPLETED</span>
                      ) : (
                        <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-sm">UPCOMING</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= ORGANIZER SECTION ================= */}
        <section 
          id="organizer" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20 bg-[#020204]/60"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-5xl w-full flex flex-col items-center font-mono">
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12">
              <span className="text-[10px] tracking-widest text-[#00FAF5] font-semibold uppercase font-bold">ORGANIZING COMMAND // SECTION 05</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                <Orbit size={28} className="text-[#00FAF5] animate-spin animate-duration-10000" />
                THE LAUNCH COMMAND CORE
              </h2>
              <div className="h-[2px] w-24 bg-gradient-to-r from-[#00FAF5] to-transparent mb-2" />
              <p className="text-xs text-white/50 max-w-xl uppercase tracking-wider select-all text-center">
                GDG On Campus GLA University is the elite local launch cell authorizing hyper-focused developer expeditions, signal-captures, and system testing.
              </p>
            </div>

            {/* Content Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch animate-fade-in">
              {/* Introduction Card */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-black/60 border border-cyan-500/20 rounded-xs relative flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400" />

                <div className="flex flex-col gap-4">
                  <span className="text-[9px] text-[#00FAF5] tracking-[0.3em] font-bold block uppercase">PREMIUM PROFILE</span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-snug">
                    GDG On Campus <span className="text-cyan-400 font-bold">GLA University</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed uppercase">
                    GDG On Campus GLA University is a premier, community-powered hub built purely for creators, engineers, and future-minded technologists. We establish raw pipelines of innovation, offering student explorers Direct Access to Google’s modern software stacks, high-performance training camps, and local-impact project briefs.
                  </p>
                  <p className="text-[11px] text-[#00FF87] leading-relaxed uppercase">
                    We specialize in breaking down standard pedagogical barriers. By hosting HACKTOPUS, our crew aims to gather and empower 600+ engineers, creators, and model-tinkerers in a secure, non-zero-sum collaborative dock where ideas transition from vacuum prototypes to high-velocity deployed realities.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6 text-slate-400 lowercase text-[8px] tracking-widest text-right">
                  propelling the next orbits of intellect // gdg-gla-launchpad
                </div>
              </div>

              {/* Impact Card */}
              <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                <div className="p-5 border border-[#e6a640]/15 bg-[#e6a640]/5 rounded-none flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] text-[#e6a640] tracking-widest font-bold uppercase block mb-2 font-mono">COMMUNITY CONVERGENCE FORCE</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Impact Coordinates</h4>
                    <p className="text-[10px] text-slate-400 uppercase leading-normal">
                      With over 5,000+ local hackers engaged continuously through workshops, labs, and deep-space buildathons, our mission control represents one of the most active technology and research communities in regional sectors.
                    </p>
                  </div>
                  <span className="text-[8px] text-white/30 tracking-widest select-all border-t border-white/5 pt-3 mt-4">
                    COORDINATES SENSING: ACTIVE
                  </span>
                </div>

                <div className="p-5 border border-emerald-500/15 bg-emerald-500/5 rounded-none flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] text-emerald-400 tracking-widest font-bold uppercase block mb-2 font-mono">MISSION MOTIVE</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Why We Host HACKTOPUS</h4>
                    <p className="text-[10px] text-slate-400 uppercase leading-normal">
                      Ordinary curriculum limits dilate the horizon of tech creation. We host this 48-hour continuous workspace sandbox to provide an elite docking bridge for thinkers across designing, database systems, AI nodes, and startups to collide, forge unbreakable bonds, and secure actual prototypes.
                    </p>
                  </div>
                  <span className="text-[8px] text-white/30 tracking-widest select-all border-t border-white/5 pt-3 mt-4">
                    MOTIVE: ELEVATE AND ACCELERATE
                  </span>
                </div>
              </div>
            </div>

            {/* Small cinematic tactical quote */}
            <p className="text-[8px] text-white/40 font-bold uppercase tracking-[0.4em] mt-10 text-center leading-normal">
              “PROPELLING THE NEXT ORBITS OF INTELLECT // EXCELLENCE THROUGH COLLABORATION”
            </p>
          </div>
        </section>


        {/* ================= PRIZE POOL SECTION ================= */}
        <section 
          id="prizes" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-6xl w-full flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-[#e6a640] font-semibold uppercase font-bold">MISSION REWARDS // SECTION 06</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <Award size={30} className="text-[#e6a640] animate-bounce animate-duration-2000" />
                LEGENDARY BOUNTY POOL (₹80,000+)
              </h2>
              <p className="text-xs text-white/50 max-w-xl uppercase tracking-wider mt-1 select-all">
                Mission Command has authorized the release of high-value cargo bounties and certified developer credentials. Decrypt your compilers and construct elite telemetry applications to lock down these coordinate files.
              </p>
              <div className="italic text-[10px] text-[#00FAF5] tracking-widest uppercase mt-2 font-semibold">
                “Time is a resource. Innovation is gravity. Your code is the ultimate escape trajectory.”
              </div>
            </div>

            {/* Prizes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full font-mono text-[11px] leading-relaxed">
              {[
                {
                  title: 'THE HYPERION MASTER (1ST PLACE)',
                  amount: '₹35,000 CASH BOUNTY + SYSTEM PLATINUM PASS',
                  desc: 'Overall Top-scoring interstellar crew who built the most innovative, secure, and visually commanding system. Demands raw code craftsmanship and flawless telemetry integration.',
                  badge: 'GRAND CHAMPION BOUNTY',
                  color: '#e6a640',
                },
                {
                  title: 'THE MANN OUTPOST RUNNER-UP (2ND PLACE)',
                  amount: '₹25,000 CASH BOUNTY + DEVELOPER KITS',
                  desc: 'The second flight command crew showing exceptional performance, technical depth, clean terminal execution, and robust modular database layouts.',
                  badge: 'ELITE SECOND FLIGHT',
                  color: '#00FAF5',
                },
                {
                  title: 'THE EDMUNDS EXPLORER (3RD PLACE)',
                  amount: '₹20,000 CASH BOUNTY + TECHNICAL GEAR',
                  desc: 'Given to the third stellar command crew demonstrating outstanding prototype viability, structured source layers, and a highly polished presentation deck.',
                  badge: 'DISTINGUISHED THIRD RUNNER',
                  color: '#FF4B91',
                },
                {
                  title: 'BEST DIGITAL INNOVATION AWARD',
                  amount: 'SPECIALIST PLAQUE + HIGH-VALUE CLOUD OFFSETS',
                  desc: 'Awarded to the squad whose system features local edge algorithmic intelligence, next-gen Gemini AI integrations, or complex vector filtering.',
                  badge: 'NEURAL ACCRETION INTEL',
                  color: '#C17DFF',
                },
                {
                  title: 'BEST VISUAL UX/HUD DESIGN AWARD',
                  amount: 'COCKPIT HUD SPECIALIST PLATINUM DECK',
                  desc: 'Honors the crew presenting high-contrast typographic grids, clean visual feedback mechanisms, micro-interactions, responsive frameworks, and absolute layout beauty.',
                  badge: 'COSMIC INTERFACE MASTER',
                  color: '#00FF87',
                },
                {
                  title: 'BEST SQUAD TEAM SPIRIT AWARD',
                  amount: 'CREW ALTRUISM MEDALS + SPONSOR REWARDS',
                  desc: 'Celebrates the squad displaying legendary cooperation, selfless volunteer rescue coordination, absolute grit, and an inspiring collaborative story of builders.',
                  badge: 'CONVERGENCE SPIRIT BEACON',
                  color: '#ffffff',
                },
              ].map((prize, idx) => (
                <div 
                  key={idx}
                  className="p-5 md:p-6 bg-black/45 border hover:bg-black/60 hover:-translate-y-1 transition-all duration-300 rounded-none flex flex-col justify-between group relative overflow-hidden"
                  style={{ borderColor: `${prize.color}2F` }}
                >
                  {/* Decorative corner rules */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: prize.color }} />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: prize.color }} />

                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span 
                        className="text-[8px] tracking-widest font-bold px-2 py-0.5 border"
                        style={{ color: prize.color, borderColor: `${prize.color}3F`, backgroundColor: `${prize.color}05` }}
                      >
                        {prize.badge}
                      </span>
                      <Sparkles size={11} style={{ color: prize.color }} className="animate-pulse" />
                    </div>

                    {/* Title */}
                    <h4 className="font-black text-sm tracking-wider uppercase text-white mb-1 group-hover:text-[#e6a640] transition-colors">
                      {prize.title}
                    </h4>

                    {/* Amount */}
                    <span 
                      className="text-white font-bold text-xs tracking-wide block mt-1.5 mb-3"
                      style={{ color: prize.color }}
                    >
                      {prize.amount}
                    </span>

                    {/* Desc */}
                    <p className="text-[10px] text-slate-400 uppercase leading-normal">
                      {prize.desc}
                    </p>
                  </div>

                  <div className="text-[8px] text-white/20 uppercase tracking-widest border-t border-white/5 pt-3 mt-6 text-right">
                    APPROVED CRATE RELEASE
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ================= COMMANDERS/CREW SECTION ================= */}
        <section 
          id="crew" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-6xl w-full flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-[#e6a640] font-semibold uppercase font-bold">CREW ROSTER // SECTION 07</span>
              <h2 className="text-3xl md:text-chart-2 font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <Award size={26} className="text-[#e6a640]" />
                EXPEDITION LEADERSHIP
              </h2>
              <p className="text-xs text-white/50 max-w-md uppercase mt-1 select-all">
                The core crew on the Endurance guiding the missions and reviewing final submitted telemetry models.
              </p>
            </div>

            {/* Judges profile grid block */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full font-mono text-[10px]">
              {COMMANDERS.map((cmd, i) => (
                <div 
                  key={i} 
                  className="p-4 bg-black/45 border border-white/10 rounded-xs hover:border-[#e6a640]/40 hover:bg-black/60 transition-all flex flex-col justify-between group h-full relative"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Character wireframe layout avatar placeholder */}
                    <div className="h-28 w-full bg-slate-900/60 border border-white/10 rounded-xs flex items-center justify-center relative overflow-hidden group-hover:border-[#e6a640]/30 transition-all select-none">
                      <Atom size={28} className="text-slate-500/40 group-hover:text-[#e6a640]/30 transition-all group-hover:rotate-45 duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Technical visual scan line */}
                      <div className="absolute inset-x-0 h-[1.5px] bg-[#e6a640]/20 top-0 animate-scanline" />

                      <div className="absolute bottom-2 left-2 text-[8px] text-[#e6a640]/70 font-bold uppercase tracking-widest">
                        {cmd.sector}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-white/40 block uppercase">{cmd.agency}</span>
                      <h4 className="text-xs font-bold text-white tracking-widest uppercase group-hover:text-[#e6a640] transition-all">
                        {cmd.name}
                      </h4>
                      <h5 className="text-[9px] text-cyan-400 font-semibold tracking-wider uppercase">
                        {cmd.role}
                      </h5>
                    </div>

                    <p className="text-[9px] text-slate-400 leading-relaxed uppercase border-t border-white/5 pt-3">
                      {cmd.bio}
                    </p>
                  </div>

                  <div className="text-[8px] text-white/20 uppercase tracking-widest border-t border-white/5 pt-3 mt-4 text-right">
                    APPROVED COMMANDER PASS
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* ================= SPONSORS SECTION ================= */}
        <section 
          id="sponsors" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-6xl w-full flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-[#00ccff] font-semibold uppercase font-bold">SYSTEM SHIELDERS // SECTION 08</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <Layers size={28} className="text-[#00ccff]" />
                COSMIC PARTNERS & SYNERGY
              </h2>
              <p className="text-xs text-white/50 max-w-xl uppercase tracking-wider mt-1 select-all">
                The forces backing our telemetry research. Brands partnering with HACKTOPUS to fire up the next generation of innovators.
              </p>
            </div>

            {/* Premium Pitch & Benefit Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full font-mono text-[11px] items-stretch mb-12">
              <div className="lg:col-span-6 p-6 md:p-8 bg-[#00ccff]/5 border border-[#00ccff]/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00ccff]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00ccff]" />

                <div className="flex flex-col gap-4">
                  <span className="text-[9px] text-[#00ccff] tracking-[0.3em] font-bold block uppercase">PARTNER CODES</span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-snug">
                    WHY BRANDS CHOOSE TO PARTNER WITH <span className="text-[#00ccff]">HACKTOPUS</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed uppercase">
                    HACKTOPUS is not a standard corporate event. It is an immersive 48-hour space-themed hackathon specifically customized to synthesize future-defining technology, bringing together 600+ of the brightest developers, startup architects, and neural system designers under one physical roof.
                  </p>

                  {/* Sponsorship Packet Download Button */}
                  <div className="pt-3 flex flex-col gap-2.5 items-start">
                    <button 
                      onClick={() => {
                        playSound('warp');
                        setShowPacketDownloadSuccess(true);
                        // Simulate pro-grade download of coordinate packet text file
                        const element = document.createElement("a");
                        const file = new Blob([`HACKTOPUS 2026 - OFFICIAL SPONSORSHIP DOSSIER AND PROTOCOLS\n=======================================================\nGDG On Campus GLA University Space-themed Hackathon\n\nDate: Oct 14 - Oct 16, 2026\nLocation: GLA University, Mathura, UP, India\nReach: 5000+ local engineers, 600+ physical attendees.\n\nThank you for choosing to secure coordinates with us!\nTransmission complete.`], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = "HACKTOPUS_SPONSORSHIP_DOSSIER_2026.txt";
                        document.body.appendChild(element);
                        element.click();
                        setTimeout(() => setShowPacketDownloadSuccess(false), 4500);
                      }}
                      className="inline-flex items-center gap-2.5 px-4.5 py-3.5 bg-[#00ccff]/10 hover:bg-[#00ccff]/25 border border-[#00ccff]/30 hover:border-[#00ccff]/60 text-white hover:text-[#00ccff] text-[10px] uppercase font-bold tracking-widest transition-all duration-300 rounded-none cursor-pointer"
                    >
                      <Download size={13} className="animate-pulse text-[#00ccff]" />
                      DOWNLOAD SPONSOR PACKET
                    </button>
                    
                    {showPacketDownloadSuccess && (
                      <div className="text-[9px] text-[#00FF87] tracking-wider uppercase font-semibold flex items-center gap-1.5 animate-pulse mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87]" />
                        DOSSIER RETRIEVED // DOWNLOAD DISPATCHED SUCCESSFULLY
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4 text-slate-400 uppercase text-[9px] tracking-widest leading-relaxed">
                  TRANSIT ENGINE CO-OPERATIVE • October 2026 GLA Campus
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'TALENT ENLISTMENT',
                    desc: 'Direct channels to 600+ high-velocity builders of the next generation of innovators who thrive under intense deadlines.',
                    metric: '600+ VERIFIED TARGETS',
                  },
                  {
                    title: 'HUD INTEGRATION',
                    desc: 'Elevate brand affinity. Integrate your platform APIs directly inside developer cockpit terminals.',
                    metric: 'PEAK TRANSMISSION VISIBILITY',
                  },
                  {
                    title: 'PAYLOAD CHALLENGES',
                    desc: 'Erect sponsor boundaries & coordinate awards. Watch developers stress-test your stack under extreme dilation pressure.',
                    metric: 'SANDBOX TESTING ENVIRONMENT',
                  },
                  {
                    title: 'COVETED SYNERGIES',
                    desc: 'Associate with GDG On Campus GLA University, leading the charge on modern academic research and dev community propulsion.',
                    metric: 'GLA UNIVERSITY COMMAND DOCK',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-[#00ccff]/40 transition-all duration-300">
                    <div>
                      <span className="text-[8px] text-[#00ccff] tracking-widest block uppercase mb-1">{item.metric}</span>
                      <h4 className="font-bold text-white tracking-widest uppercase mb-1.5">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal uppercase">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </section>


        {/* ================= TESSERACT/FAQ SECTION ================= */}
        <section 
          id="faq" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-3xl w-full flex flex-col items-center font-mono">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-12">
              <span className="text-[10px] tracking-widest text-[#e6a640] font-semibold uppercase font-bold">SUPPORT CONSOLE // SECTION 09</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                <HelpCircle size={26} className="text-[#e6a640]" />
                TESSERACT ARCHIVES (FAQs)
              </h2>
              <p className="text-xs text-white/50 max-w-md uppercase mt-1 select-all">
                Access spatial records to resolve common crew paradox issues. Click on vectors below to unpack data.
              </p>
            </div>

            {/* Accordion systems FAQs */}
            <div className="grid gap-3.5 w-full text-[11px] leading-relaxed">
              {FAQ.map((item) => {
                const isOpen = expandedFaqId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="border border-white/10 rounded-xs bg-black/45 hover:border-white/20 transition-all overflow-hidden"
                  >
                    <button
                      id={`faq-${item.id}`}
                      onClick={() => {
                        playSound('click');
                        setExpandedFaqId(isOpen ? null : item.id);
                      }}
                      className="w-full p-4 flex justify-between items-center text-left text-xs text-white transition-all uppercase tracking-wider font-semibold hover:bg-white/[0.02] cursor-pointer outline-none select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-[#e6a640] p-0.5 px-1.5 bg-[#e6a640]/5 border border-[#e6a640]/20 rounded-xs">{item.category}</span>
                        <span>{item.question}</span>
                      </div>
                      {isOpen ? <ChevronUp size={14} className="text-white/60 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-ans-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeInOut' }}
                        >
                          <div className="p-4 pt-1 border-t border-white/5 text-[10px] text-slate-300 leading-relaxed uppercase bg-white/[0.01]">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* ================= REGISTER REGISTRATION SECTION ================= */}
        <section 
          id="register" 
          className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 py-20"
          style={{ contentVisibility: 'auto' }}
        >
          <div className="max-w-4xl w-full flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center flex flex-col items-center gap-3 mb-10 font-mono">
              <span className="text-[10px] tracking-widest text-[#e6a640] font-semibold uppercase font-bold">BOARDING MANIFEST // SECTION 10</span>
              <h2 className="text-3xl md:text-chart-2 font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <Terminal size={26} className="text-[#e6a640] animate-pulse" />
                INITIATE LAUNCH CODES: CREW ENLISTMENT
              </h2>
              <p className="text-xs text-white/50 max-w-sm uppercase mt-1 select-all text-center">
                Submit your terminal credentials and declare your specialist telemetry parameters to secure your boarding pass.
              </p>
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] rounded-xs uppercase tracking-wider font-semibold max-w-md mt-4 animate-pulse leading-normal text-center select-all">
                WARNING: Manifest coordinates are limited on this continuous in-person orbital. Only 600 select spaces exist. Delay means total absorption into the cosmic void.
              </div>
            </div>

            {/* Registration Terminal Component */}
            <RegistrationPortal onSuccess={handleRegistrationSuccess} />

          </div>
        </section>

        {/* ================= FOOTER TRANSMISSION SECTION ================= */}
        <footer 
          className="w-full bg-[#020204]/95 border-t border-white/10 py-16 px-6 md:px-12 mt-20 relative font-mono text-[10px]"
          style={{ contentVisibility: 'auto' }}
        >
          {/* Subtle decorative scan overlay */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e6a640]/40 to-transparent" />

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Left Narrative Column */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full border border-[#e6a640] flex items-center justify-center font-bold text-[10px] text-[#e6a640] bg-[#e6a640]/5 animate-pulse">🐙</div>
                <span className="text-sm font-bold tracking-[0.4em] uppercase text-white font-mono">
                  HACK<span className="text-[#e6a640]">//</span>TOPUS
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed uppercase text-[9px] font-mono">
                “We look up at the stars and wonder about our place, but when we look at code, we construct the futures of tomorrow.” Never cease exploring. Time is your primary fuel. Innovation is your only gravity.
              </p>
              
              <div className="mt-4 p-3 bg-white/[0.02] border border-white/10 rounded-xs">
                <span className="text-[8px] text-[#e6a640] tracking-widest font-bold block uppercase mb-1 font-mono">FINAL TRANSMISSION BROADCAST</span>
                <p className="text-white/60 text-[8.5px] leading-normal uppercase font-mono">
                  ACTIVE DATA LINK STATUS: EXCELLENT // SECTOR BEACON ROUTED THROUGH GLA DOCKS. COGNITIVE RECONNAISSANCE SIGNALS OPERATIONAL. TERMINAL ACCESS STANDBY.
                </p>
              </div>
            </div>

            {/* Mid Coordinates Channels Column */}
            <div className="md:col-span-4 flex flex-col gap-3.5">
              <span className="text-[#00FAF5] text-[9px] tracking-widest font-bold uppercase block font-mono">SECURE CHANNEL LINKS</span>
              
              <div className="grid grid-cols-2 gap-2.5 text-[9px] text-slate-300 font-mono">
                <a 
                  href="https://linkedin.com/#placeholder_gdg_gla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all text-center uppercase font-semibold"
                >
                  // LINKEDIN COMMS
                </a>
                <a 
                  href="https://instagram.com/#placeholder_gdg_gla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/5 transition-all text-center uppercase font-semibold"
                >
                  // INSTAGRAM CORDS
                </a>
                <a 
                  href="https://twitter.com/#placeholder_gdg_gla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-sky-400 hover:text-sky-400 hover:bg-sky-400/5 transition-all text-center uppercase font-semibold"
                >
                  // X TWITTER SIGNAL
                </a>
                <a 
                  href="https://discord.gg/#placeholder_gdg_gla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-blue-500/20 bg-blue-500/5 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all text-center uppercase font-semibold"
                >
                  // DISCORD NETWORK
                </a>
              </div>

              <div className="text-[8px] text-slate-500 uppercase tracking-widest leading-relaxed mt-2 font-mono">
                Clicking external links redirects your cockpit HUD back to Earth grid proxies. Use caution.
              </div>
            </div>

            {/* Right Ground Command Columns */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-emerald-400 text-[9px] tracking-widest font-bold uppercase block font-mono">GROUND COMMAND HQ</span>
              
              <div className="flex flex-col gap-2 text-slate-400 uppercase text-[9px] leading-relaxed font-mono">
                <div>
                  <span className="text-white/40 block">COMMUNICATIONS MAIL</span>
                  <a href="mailto:chaudharyrishabh008@gmail.com" className="text-white hover:text-[#e6a640] select-all font-semibold lowercase">
                    chaudharyrishabh008@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block">PHYSICAL LANDING SECTOR</span>
                  <span className="text-white font-semibold">
                    GLA University Campus Outpost, NH-2, Mathura, UP, India
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">COMM LEAD PHONE SENSOR</span>
                  <span className="text-white font-mono font-semibold">+91-999-999-9999 [PROXY]</span>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright, closing transmitting message and small tactical telemetry */}
          <div className="max-w-6xl mx-auto border-t border-white/5 pt-10 mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[8px] uppercase tracking-widest font-mono">
            <div>
              © 2026 GDG ON CAMPUS GLA UNIVERSITY. ALL RIGHTS RESERVED. SECURED VIA CENTRAL COGNITIVE FIREWALLS.
            </div>
            <div className="flex items-center gap-1.5 text-[#e6a640] font-bold animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e6a640]" />
              <span>TRANSMISSION TERMINATED... LONG LIVE THE BUILDERS.</span>
            </div>
          </div>
        </footer>

      </div>
      </motion.main>
    </>
  );

  function handleNavClick(section: SectionId) {
    navigateToSection(section);
  }
}
