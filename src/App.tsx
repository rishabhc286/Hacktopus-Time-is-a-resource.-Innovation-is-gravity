import { useEffect, useState, useRef } from 'react';
import { SectionId } from './types';
import { TIMELINE, COMMANDERS, FAQ } from './data';
import HUD from './components/HUD';
import AudioEngine, { playSound } from './components/AudioEngine';
import AudioVisualizer from './components/AudioVisualizer';
import PlanetViewer from './components/PlanetViewer';
import RegistrationPortal from './components/RegistrationPortal';
import LoadingScreen from './components/LoadingScreen';
import brochurePdf from './components/Brochure.pdf';
import crewRishabh   from './components/Crew Photos/Rishabh Chaudhary_.jpg';
import crewSaksham   from './components/Crew Photos/saksham_kushwaha.png';
import crewHarsh     from './components/Crew Photos/Harsh Dixit.jpeg';
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
  Download,
  Linkedin
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
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
                <span className="text-white">0 CRITICAL PILOTS</span>
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
                ABOUT // SECTION 01
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white leading-none">
                ABOUT <span className="text-[#e6a640]">HACKTOPUS</span>
              </h2>
              <div className="h-[2px] w-24 bg-gradient-to-r from-[#e6a640] to-transparent mb-4" />

              <div className="text-slate-300 flex flex-col gap-5 select-text">
                <div className="p-3 px-4 border-l-2 border-[#e6a640] bg-[#e6a640]/5 italic text-white font-medium text-sm leading-relaxed">
                  "Time is a resource. Innovation is gravity. HACKTOPUS is your launchpad."
                </div>

                <p className="text-sm leading-relaxed">
                  HACKTOPUS is a premier 48-hour in-person hackathon organised by GDG On Campus GLA University. It brings together 600+ developers, designers, AI enthusiasts, and startup founders at GLA University, Mathura to build real projects from scratch.
                </p>

                <p className="text-white bg-white/5 p-3 rounded-xs border border-white/5 text-sm leading-relaxed">
                  <span className="text-[#e6a640] font-bold block mb-1 text-xs uppercase tracking-wider">WHY HACKTOPUS?</span>
                  To give students and creators a high-energy environment where they can build without limits — with mentors, workshops, food, accommodation, and prizes all included. No excuses, just building.
                </p>

                <p className="text-[#00FAF5] text-sm leading-relaxed">
                  <span className="text-[#00FAF5] font-bold block text-xs uppercase tracking-wider">YOUR OPPORTUNITY</span>
                  48 hours. A team of up to 4. One problem to solve. Whether you're a first-timer or a veteran hacker, HACKTOPUS is built for you to ship something you're proud of.
                </p>

                <div className="pt-4 border-t border-white/5 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#e6a640] tracking-wider font-bold uppercase">OFFICIAL BROCHURE</span>
                    <span className="text-xs text-white/60">Contains full event details, rules, and tracks (PDF).</span>
                  </div>
                  <a
                    href={brochurePdf}
                    download="HACKTOPUS_2026_Brochure.pdf"
                    onClick={() => playSound('warp')}
                    className="p-2 px-5 bg-white text-black hover:bg-[#e6a640] hover:text-black text-[10px] tracking-wider uppercase font-bold transition-all rounded-none cursor-pointer text-center"
                  >
                    Download Brochure
                  </a>
                </div>
              </div>
            </div>

            {/* Stats and CTAs */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'PARTICIPANTS', val: '600+ Hackers', detail: 'Developers & Designers' },
                  { label: 'DURATION', val: '48 Hours', detail: 'Non-stop building' },
                  { label: 'TRACKS', val: '5 Categories', detail: 'Pick your domain' },
                  { label: 'VENUE', val: 'GLA Mathura', detail: 'In-person event' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-black/45 border border-[#e6a640]/15 rounded-xs hover:border-[#e6a640]/40 transition-all duration-300">
                    <span className="text-[8px] text-white/40 tracking-wider block uppercase">{stat.label}</span>
                    <span className="text-sm font-bold text-[#e6a640] tracking-tight block mt-1 uppercase">{stat.val}</span>
                    <span className="text-[9px] text-white/30 tracking-wider mt-0.5 block uppercase">{stat.detail}</span>
                  </div>
                ))}
              </div>

              {/* Sponsor CTA card */}
              <div className="p-5 border border-[#00ccff]/20 bg-[#00ccff]/5 rounded-none relative overflow-hidden font-mono">
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00ccff]/60" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00ccff]/60" />
                <span className="text-[9px] text-[#00ccff] tracking-widest font-bold block mb-2 uppercase">SPONSORS & PARTNERS</span>
                <p className="text-slate-300 leading-relaxed mb-4 text-sm font-sans normal-case tracking-normal">
                  Want to sponsor HACKTOPUS 2026? Get your brand in front of 600+ developers. Reach out to discuss partnership packages.
                </p>
                <div className="flex gap-3">
                  <a
                    href="mailto:sponsorships@gdgglau.org"
                    className="p-1.5 px-3 bg-[#00ccff]/10 border border-[#00ccff]/40 text-[#00ccff] hover:bg-[#00ccff] hover:text-black text-[9px] font-bold tracking-widest uppercase transition-all"
                  >
                    Sponsor Us
                  </a>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="p-1.5 px-3 border border-white/20 text-white hover:border-[#e6a640] hover:text-[#e6a640] text-[9px] font-bold tracking-widest uppercase transition-all"
                  >
                    Register Now
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
            
            {/* Heading */}
            <div className="text-center flex flex-col items-center gap-3 mb-12 font-mono">
              <span className="text-[10px] tracking-widest text-[#00FF87] font-semibold uppercase font-bold">EVENT DETAILS // SECTION 02</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <Compass size={30} className="text-[#00FF87] animate-pulse" />
                WHAT YOU NEED TO KNOW
              </h2>
              <p className="text-xs text-white/50 max-w-xl uppercase tracking-wider mt-1 select-all">
                Everything about the event — team rules, venue, perks, and what to expect over 48 hours.
              </p>
            </div>

            {/* Bento-grid HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full font-mono text-[10px] leading-relaxed">
              {[
                {
                  label: 'TEAM SIZE',
                  title: '1 – 4 Members',
                  desc: 'You can participate solo or as a team of up to 4. Mixed teams with developers and designers tend to perform best.',
                  color: '#e6a640',
                },
                {
                  label: 'WHO CAN JOIN',
                  title: 'Open to Everyone',
                  desc: 'Students, professionals, designers, and developers from any college or background are welcome. No restrictions.',
                  color: '#00FAF5',
                },
                {
                  label: 'VENUE',
                  title: 'GLA University, Mathura',
                  desc: 'Fully in-person at GLA University, Mathura, UP. Dedicated workspaces, live stages, and all facilities provided.',
                  color: '#FF4B91',
                },
                {
                  label: 'DURATION',
                  title: '48 Hours Straight',
                  desc: 'Starts October 14, 2026 at 12 PM and runs non-stop for 48 hours. Build, iterate, and submit before the clock runs out.',
                  color: '#00FF87',
                },
                {
                  label: 'TRACKS',
                  title: '5 Problem Areas',
                  desc: 'Pick from AI/ML, Web3 & Blockchain, Cybersecurity, Climate & Sustainability, or Open Innovation. Details in the Tracks section.',
                  color: '#C17DFF',
                },
                {
                  label: 'NETWORKING',
                  title: 'Meet Industry Leaders',
                  desc: 'Connect with startup founders, VCs, senior engineers, and community leaders who will be present throughout the event.',
                  color: '#ffffff',
                },
                {
                  label: 'WORKSHOPS',
                  title: 'Live Tech Sessions',
                  desc: 'Hands-on workshops on AI tools, APIs, Web3, and more — run by industry experts and sponsors during the event.',
                  color: '#00ccff',
                },
                {
                  label: 'MENTORSHIP',
                  title: 'On-Demand Mentors',
                  desc: 'Experienced mentors from industry and academia will be available throughout the hackathon to help unblock your team.',
                  color: '#FFaa22',
                },
                {
                  label: 'ACCOMMODATION',
                  title: 'Stay & Meals Provided',
                  desc: 'GLA University provides accommodation and meals for all participants — so you can focus entirely on building.',
                  color: '#10B981',
                },
                {
                  label: 'CERTIFICATE',
                  title: 'Official GDG Certificate',
                  desc: 'Every participant who completes the hackathon gets an official participation certificate from GDG On Campus GLA University.',
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
                    <p className="text-xs text-slate-300 leading-relaxed font-sans tracking-normal normal-case">
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

            {/* Interactive Planet Viewer */}
            <PlanetViewer />

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
              <span className="text-[10px] tracking-widest text-emerald-400 font-semibold uppercase">SCHEDULE // SECTION 04</span>
              <h2 className="text-3xl md:text-chart-2 font-bold tracking-tight text-white uppercase flex items-center gap-2">
                <Calendar size={26} className="text-emerald-400" />
                EVENT SCHEDULE & TIMELINE
              </h2>
              <p className="text-xs text-white/50 max-w-md uppercase mt-1 select-all">
                Key dates and deadlines for HACKTOPUS 2026. All times are in Indian Standard Time (IST).
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
                    {/* Time indicator column — fixed width so center always aligns */}
                    <div className="flex items-center gap-3 shrink-0 w-44 sm:w-52">
                      <span 
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${isCurrent ? 'bg-[#e6a640] animate-ping' : isPast ? 'bg-slate-600' : 'bg-cyan-400'}`} 
                      />
                      <div className="flex flex-col min-w-0">
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
                  <span className="text-[9px] text-[#00FAF5] tracking-[0.3em] font-bold block uppercase font-mono">PREMIUM PROFILE</span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-snug">
                    GDG On Campus <span className="text-cyan-400 font-bold">GLA University</span>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    GDG On Campus GLA University is a premier, community-powered hub built purely for creators, engineers, and future-minded technologists. We establish raw pipelines of innovation, offering student explorers Direct Access to Google’s modern software stacks, high-performance training camps, and local-impact project briefs.
                  </p>
                  <p className="text-sm text-[#00FF87] leading-relaxed">
                    We specialize in breaking down standard pedagogical barriers. By hosting HACKTOPUS, our crew aims to gather and empower 600+ engineers, creators, and model-tinkerers in a secure, non-zero-sum collaborative dock where ideas transition from vacuum prototypes to high-velocity deployed realities.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6 text-slate-400 lowercase text-[8px] tracking-widest text-right font-mono">
                  propelling the next orbits of intellect // gdg-gla-launchpad
                </div>
              </div>

              {/* Impact Card */}
              <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                <div className="p-5 border border-[#e6a640]/15 bg-[#e6a640]/5 rounded-none flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] text-[#e6a640] tracking-widest font-bold uppercase block mb-2 font-mono">COMMUNITY CONVERGENCE FORCE</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Impact Coordinates</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      With over 5,000+ local hackers engaged continuously through workshops, labs, and deep-space buildathons, our mission control represents one of the most active technology and research communities in regional sectors.
                    </p>
                  </div>
                  <span className="text-[8px] text-white/30 tracking-widest select-all border-t border-white/5 pt-3 mt-4 font-mono">
                    COORDINATES SENSING: ACTIVE
                  </span>
                </div>

                <div className="p-5 border border-emerald-500/15 bg-emerald-500/5 rounded-none flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] text-emerald-400 tracking-widest font-bold uppercase block mb-2 font-mono">MISSION MOTIVE</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Why We Host HACKTOPUS</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Ordinary curriculum limits dilate the horizon of tech creation. We host this 48-hour continuous workspace sandbox to provide an elite docking bridge for thinkers across designing, database systems, AI nodes, and startups to collide, forge unbreakable bonds, and secure actual prototypes.
                    </p>
                  </div>
                  <span className="text-[8px] text-white/30 tracking-widest select-all border-t border-white/5 pt-3 mt-4 font-mono">
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

            {/* Section Label */}
            <div className="text-center flex flex-col items-center gap-3 mb-10 font-mono">
              <span className="text-[10px] tracking-widest text-[#e6a640] font-bold uppercase">PRIZES // SECTION 06</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <Award size={30} className="text-[#e6a640] animate-bounce animate-duration-2000" />
                Prize Pool
              </h2>
            </div>

            {/* ── TOTAL POOL BANNER ── */}
            <div className="w-full mb-10 relative overflow-hidden border border-[#e6a640]/30 bg-gradient-to-r from-[#e6a640]/10 via-[#e6a640]/5 to-transparent p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e6a640] via-[#e6a640]/40 to-transparent" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#e6a640]/50" />
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#e6a640]/70 uppercase mb-1">Total Prize Pool</span>
                <span className="text-5xl md:text-7xl font-black text-[#e6a640] tracking-tight leading-none">₹80,000<span className="text-3xl md:text-5xl text-[#e6a640]/60">+</span></span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 font-mono text-[10px]">
                {[
                  { n: '3', label: 'Cash Prizes' },
                  { n: '3', label: 'Special Awards' },
                  { n: '600+', label: 'Participants' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 px-4 border-l border-white/10">
                    <span className="text-2xl font-black text-white">{s.n}</span>
                    <span className="text-white/40 uppercase tracking-widest">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PODIUM — TOP 3 ── */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono items-end">

              {/* 2nd Place */}
              <div className="relative border border-[#00FAF5]/25 bg-gradient-to-b from-[#00FAF5]/8 to-black/50 p-5 md:p-6 flex flex-col gap-3 md:mt-8 group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00FAF5]/60 to-transparent" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00FAF5]/50" />
                <span className="text-[8px] tracking-[0.3em] text-[#00FAF5]/70 font-bold uppercase font-mono">2nd Place</span>
                <span className="text-4xl md:text-5xl font-black text-[#00FAF5] leading-none tracking-tight">₹25,000</span>
                <div className="h-[1px] w-full bg-[#00FAF5]/15" />
                <div>
                  <h4 className="text-xs font-black text-white tracking-widest uppercase mb-1 group-hover:text-[#00FAF5] transition-colors">Runner-Up</h4>
                  <p className="text-[9px] text-slate-400 uppercase leading-relaxed">Cash prize + developer kits & goodies</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FAF5]" />
                  <span className="text-[8px] text-[#00FAF5]/60 uppercase tracking-widest">Overall 2nd</span>
                </div>
              </div>

              {/* 1st Place — tallest / most prominent */}
              <div className="relative border border-[#e6a640]/40 bg-gradient-to-b from-[#e6a640]/12 to-black/50 p-5 md:p-8 flex flex-col gap-3 group hover:-translate-y-1 transition-all duration-300 shadow-[0_0_40px_rgba(230,166,64,0.15)]">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#e6a640] to-[#e6a640]/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#e6a640]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#e6a640]" />
                <div className="flex items-center justify-between">
                  <span className="text-[8px] tracking-[0.3em] text-[#e6a640]/80 font-bold uppercase font-mono">🏆 1st Place</span>
                  <Sparkles size={14} className="text-[#e6a640] animate-pulse" />
                </div>
                <span className="text-5xl md:text-6xl font-black text-[#e6a640] leading-none tracking-tight">₹35,000</span>
                <div className="h-[1px] w-full bg-[#e6a640]/20" />
                <div>
                  <h4 className="text-sm font-black text-white tracking-widest uppercase mb-1 group-hover:text-[#e6a640] transition-colors">Grand Champion</h4>
                  <p className="text-[9px] text-slate-300 uppercase leading-relaxed">Cash prize + platinum pass + exclusive sponsor goodies</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e6a640] animate-ping" />
                  <span className="text-[8px] text-[#e6a640]/70 uppercase tracking-widest">Overall Winner</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="relative border border-[#FF4B91]/25 bg-gradient-to-b from-[#FF4B91]/8 to-black/50 p-5 md:p-6 flex flex-col gap-3 md:mt-12 group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF4B91]/60 to-transparent" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#FF4B91]/50" />
                <span className="text-[8px] tracking-[0.3em] text-[#FF4B91]/70 font-bold uppercase font-mono">3rd Place</span>
                <span className="text-4xl md:text-5xl font-black text-[#FF4B91] leading-none tracking-tight">₹20,000</span>
                <div className="h-[1px] w-full bg-[#FF4B91]/15" />
                <div>
                  <h4 className="text-xs font-black text-white tracking-widest uppercase mb-1 group-hover:text-[#FF4B91] transition-colors">2nd Runner-Up</h4>
                  <p className="text-[9px] text-slate-400 uppercase leading-relaxed">Cash prize + technical gear & swag</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF4B91]" />
                  <span className="text-[8px] text-[#FF4B91]/60 uppercase tracking-widest">Overall 3rd</span>
                </div>
              </div>
            </div>

            {/* ── SPECIAL AWARDS ── */}
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4 font-mono">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase">Special Awards</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                {[
                  {
                    emoji: '🤖',
                    title: 'Best AI / Innovation',
                    prize: 'Plaque + Cloud Credits',
                    desc: 'Best use of AI, ML, or cutting-edge APIs in a project.',
                    color: '#C17DFF',
                  },
                  {
                    emoji: '🎨',
                    title: 'Best UI / UX Design',
                    prize: 'Plaque + Design Toolkit',
                    desc: 'Cleanest, most polished, and user-friendly interface.',
                    color: '#00FF87',
                  },
                  {
                    emoji: '🤝',
                    title: 'Best Team Spirit',
                    prize: 'Medals + Sponsor Goodies',
                    desc: 'Team that best demonstrated collaboration, grit, and positivity.',
                    color: '#FFaa22',
                  },
                ].map((award, i) => (
                  <div
                    key={i}
                    className="p-4 border bg-black/40 hover:bg-black/60 transition-all duration-300 flex items-start gap-3 group"
                    style={{ borderColor: `${award.color}25` }}
                  >
                    <span className="text-2xl shrink-0">{award.emoji}</span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[8px] tracking-widest font-bold uppercase" style={{ color: award.color }}>{award.prize}</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:transition-colors">{award.title}</h4>
                      <p className="text-[9px] text-slate-400 uppercase leading-relaxed">{award.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ================= COMMANDERS/CREW SECTION ================= */}
        {(() => {
          // Map avatarSeed → imported photo (add more here as photos are uploaded)
          const crewPhotos: Record<string, string> = {
            rishabh: crewRishabh,
            saksham: crewSaksham,
            harsh:   crewHarsh,
          };
          return (
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

                {/* Profile grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full font-mono text-[10px]">
                  {COMMANDERS.map((cmd, i) => {
                    const photo = crewPhotos[cmd.avatarSeed];
                    return (
                      <div
                        key={i}
                        className="p-4 bg-black/45 border border-white/10 rounded-xs hover:border-[#e6a640]/40 hover:bg-black/60 transition-all flex flex-col justify-between group h-full relative"
                      >
                        <div className="flex flex-col gap-3.5">

                          {/* Avatar — real photo or animated placeholder */}
                          <div className="h-56 w-full bg-slate-900/60 border border-white/10 rounded-xs relative overflow-hidden group-hover:border-[#e6a640]/40 transition-all select-none">
                            {photo ? (
                              <img
                                src={photo}
                                alt={cmd.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Atom size={28} className="text-slate-500/40 group-hover:text-[#e6a640]/30 transition-all group-hover:rotate-45 duration-1000" />
                              </div>
                            )}

                            {/* Thin bottom strip only — keeps faces fully visible */}
                            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />

                            {/* Scan line */}
                            <div className="absolute inset-x-0 h-[1.5px] bg-[#e6a640]/20 top-0 animate-scanline" />

                            {/* Sector tag */}
                            <div className="absolute bottom-2 left-2 text-[8px] text-[#e6a640] font-bold uppercase tracking-widest drop-shadow-lg">
                              {cmd.sector}
                            </div>

                            {/* LinkedIn icon — top right, appears on hover */}
                            {cmd.linkedin && (
                              <a
                                href={cmd.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-2 right-2 h-7 w-7 rounded-sm bg-[#0A66C2] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#0077B5] shadow-lg"
                                title={`${cmd.name} on LinkedIn`}
                              >
                                <Linkedin size={13} className="text-white" fill="white" />
                              </a>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-white/40 block uppercase">{cmd.agency}</span>
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase group-hover:text-[#e6a640] transition-all">
                              {cmd.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <h5 className="text-[9px] text-cyan-400 font-semibold tracking-wider uppercase">
                                {cmd.role}
                              </h5>
                              {cmd.linkedin && (
                                <a
                                  href={cmd.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-[8px] text-[#0A66C2] hover:text-[#0077B5] font-bold uppercase tracking-widest transition-colors"
                                  title="LinkedIn Profile"
                                >
                                  <Linkedin size={11} fill="currentColor" />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                            </div>
                          </div>

                          <p className="text-[9px] text-slate-400 leading-relaxed uppercase border-t border-white/5 pt-3">
                            {cmd.bio}
                          </p>
                        </div>

                        <div className="text-[8px] text-white/20 uppercase tracking-widest border-t border-white/5 pt-3 mt-4 text-right">
                          APPROVED COMMANDER PASS
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>
          );
        })()}


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
                  <p className="text-slate-300 leading-relaxed mb-4 text-sm font-sans normal-case tracking-normal">
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
                      <p className="text-xs text-slate-300 leading-relaxed font-sans tracking-normal normal-case">{item.desc}</p>
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

            {/* ── CONTACT COMMAND BLOCK ── */}
            <div className="w-full mt-16 pt-10 border-t border-white/10 font-mono">
              <div className="text-center mb-8">
                <span className="text-[9px] text-[#00FAF5] tracking-[0.35em] font-bold uppercase">CONTACT COMMAND // OPEN CHANNEL</span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-2">Have Questions? Ping Us.</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 max-w-xs mx-auto leading-relaxed">
                  Reach out directly to our mission ops team for any queries, sponsorships, or collaborations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Email channels */}
                <div className="p-6 bg-black/50 border border-[#e6a640]/20 relative overflow-hidden group hover:border-[#e6a640]/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#e6a640]/50" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#e6a640]/50" />
                  <span className="text-[8px] text-[#e6a640] tracking-[0.3em] font-bold uppercase block mb-4">📡 COMMUNICATIONS MAIL</span>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">General Inquiries</span>
                      <a
                        href="mailto:contact@gdgglau.org"
                        className="text-[11px] text-white hover:text-[#e6a640] transition-colors font-semibold select-all lowercase tracking-wide"
                      >
                        contact@gdgglau.org
                      </a>
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">Support</span>
                      <a
                        href="mailto:support@gdgglau.org"
                        className="text-[11px] text-white hover:text-[#e6a640] transition-colors font-semibold select-all lowercase tracking-wide"
                      >
                        support@gdgglau.org
                      </a>
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">Partnerships</span>
                      <a
                        href="mailto:partnerships@gdgglau.org"
                        className="text-[11px] text-white hover:text-[#e6a640] transition-colors font-semibold select-all lowercase tracking-wide"
                      >
                        partnerships@gdgglau.org
                      </a>
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">Sponsorships</span>
                      <a
                        href="mailto:sponsorships@gdgglau.org"
                        className="text-[11px] text-white hover:text-[#e6a640] transition-colors font-semibold select-all lowercase tracking-wide"
                      >
                        sponsorships@gdgglau.org
                      </a>
                    </div>
                    <div className="h-[1px] w-full bg-white/5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">Organizer</span>
                      <a
                        href="mailto:organizer@gdgglau.org"
                        className="text-[11px] text-white hover:text-[#e6a640] transition-colors font-semibold select-all lowercase tracking-wide"
                      >
                        organizer@gdgglau.org
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social channels */}
                <div className="p-6 bg-black/50 border border-[#00FAF5]/20 relative overflow-hidden group hover:border-[#00FAF5]/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00FAF5]/50" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00FAF5]/50" />
                  <span className="text-[8px] text-[#00FAF5] tracking-[0.3em] font-bold uppercase block mb-4">🔗 SOCIAL SIGNAL LINKS</span>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://www.instagram.com/gdgglau/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 border border-white/10 bg-white/[0.02] hover:border-pink-500 hover:text-pink-400 hover:bg-pink-500/5 transition-all text-center uppercase text-[9px] font-semibold text-slate-300 flex flex-col items-center gap-1"
                    >
                      <span className="text-base">📸</span>
                      Instagram
                    </a>
                    <a
                      href="https://www.linkedin.com/company/gdg-glau/posts/?feedView=all"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 border border-white/10 bg-white/[0.02] hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all text-center uppercase text-[9px] font-semibold text-slate-300 flex flex-col items-center gap-1"
                    >
                      <span className="text-base">💼</span>
                      LinkedIn
                    </a>
                    <a
                      href="https://x.com/GdgGlau"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 border border-white/10 bg-white/[0.02] hover:border-sky-400 hover:text-sky-400 hover:bg-sky-400/5 transition-all text-center uppercase text-[9px] font-semibold text-slate-300 flex flex-col items-center gap-1"
                    >
                      <span className="text-base">🐦</span>
                      X / Twitter
                    </a>
                    <a
                      href="https://discord.gg/2r3MaCPHn"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 border border-blue-500/20 bg-blue-500/5 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all text-center uppercase text-[9px] font-semibold text-slate-300 flex flex-col items-center gap-1"
                    >
                      <span className="text-base">🎮</span>
                      Discord
                    </a>
                  </div>
                </div>
              </div>

              {/* Physical location strip */}
              <div className="p-4 bg-white/[0.02] border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[9px] uppercase tracking-widest">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#00FF87] font-bold">📍 PHYSICAL LANDING SECTOR</span>
                  <span className="text-slate-300 font-semibold">GLA University Campus, NH-2, Mathura, Uttar Pradesh — India</span>
                </div>
                <span className="text-white/20 text-[8px]">COORDINATES: 27.2417° N, 77.4977° E</span>
              </div>
            </div>

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
                  href="https://www.linkedin.com/company/gdg-glau/posts/?feedView=all" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all text-center uppercase font-semibold"
                >
                  // LINKEDIN COMMS
                </a>
                <a 
                  href="https://www.instagram.com/gdgglau/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/5 transition-all text-center uppercase font-semibold"
                >
                  // INSTAGRAM CORDS
                </a>
                <a 
                  href="https://x.com/GdgGlau" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 border border-white/5 bg-white/[0.01] hover:border-sky-400 hover:text-sky-400 hover:bg-sky-400/5 transition-all text-center uppercase font-semibold"
                >
                  // X TWITTER SIGNAL
                </a>
                <a 
                  href="https://discord.gg/2r3MaCPHn" 
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
                  <span className="text-white/40 block">GENERAL INQUIRIES</span>
                  <a href="mailto:contact@gdgglau.org" className="text-white hover:text-[#e6a640] select-all font-semibold lowercase">
                    contact@gdgglau.org
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block">SUPPORT</span>
                  <a href="mailto:support@gdgglau.org" className="text-white hover:text-[#e6a640] select-all font-semibold lowercase">
                    support@gdgglau.org
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block">SPONSORSHIPS</span>
                  <a href="mailto:sponsorships@gdgglau.org" className="text-white hover:text-[#e6a640] select-all font-semibold lowercase">
                    sponsorships@gdgglau.org
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block">ORGANIZER</span>
                  <a href="mailto:organizer@gdgglau.org" className="text-white hover:text-[#e6a640] select-all font-semibold lowercase">
                    organizer@gdgglau.org
                  </a>
                </div>
                <div>
                  <span className="text-white/40 block">PHYSICAL LANDING SECTOR</span>
                  <span className="text-white font-semibold">
                    GLA University Campus Outpost, NH-2, Mathura, UP, India
                  </span>
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
