import { useState } from 'react';
import { TRACKS } from '../data';
import { playSound } from './AudioEngine';
import { 
  ArrowRight, 
  Globe, 
  Shield, 
  Zap, 
  Sparkles, 
  Orbit,
  Brain,
  Cpu,
  Network,
  Layers,
  Coins,
  Key,
  Compass,
  Lock,
  Activity,
  Terminal,
  Leaf,
  Wind,
  Droplet,
  GitBranch,
  Maximize,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

// Selected Planet Control and Interactive Simulation Deck Component
interface PlanetControlDeckProps {
  activePlanetIdx: number;
  onSelectPlanet: (index: number | null) => void;
}

function PlanetControlDeck({ activePlanetIdx, onSelectPlanet }: PlanetControlDeckProps) {
  const track = TRACKS[activePlanetIdx];
  const [activeTab, setActiveTab] = useState<'objectives' | 'prompt-forge' | 'environment'>('objectives');
  
  // Track checkmarks list locally
  const [checkedObjectives, setCheckedObjectives] = useState<Record<string, boolean>>({});
  
  // Custom prompt forge template states
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Scan status and metrics generator state
  const [isScanning, setIsScanning] = useState(false);
  const [scanMetrics, setScanMetrics] = useState({
    temperature: `${Math.floor(Math.random() * 240 - 120)}°C`,
    gravity: `${(Math.random() * 4 + 0.3).toFixed(2)} G`,
    quantumOffset: `${(Math.random() * 92 + 8).toFixed(1)}%`,
    stellarWind: `${Math.floor(Math.random() * 400 + 40)} km/s`,
    pingLatency: `${Math.floor(Math.random() * 800 + 120)} ms`,
  });

  // Handle Scan Run
  const handleRunScan = () => {
    playSound('sonar');
    setIsScanning(true);
    setTimeout(() => {
      setScanMetrics({
        temperature: `${Math.floor(Math.random() * 240 - 100)}°C`,
         gravity: `${(Math.random() * 6 + 0.2).toFixed(2)} G`,
        quantumOffset: `${(Math.random() * 80 + 20).toFixed(1)}%`,
        stellarWind: `${Math.floor(Math.random() * 600 + 30)} km/s`,
        pingLatency: `${Math.floor(Math.random() * 500 + 90)} ms`,
      });
      setIsScanning(false);
      playSound('telemetry');
    }, 1200);
  };

  // Build the copyable Gemini template prompt
  const activePrompt = track.problemStatements[selectedPromptIdx] || track.problemStatements[0];
  const formattedPrompt = `// SYSTEM INTERFACE TARGET // PROMPT ENCAPSULE: ${track.name}
// DESIGN SECTOR: ${track.designation} (${track.tagline})
// CURRENT MISSION OBJECTIVE: ${track.objectives[0] || 'Build innovative architectures'}

Act as a lead software commander deploying on sector ${track.name}. I need to solve:
"${activePrompt}"

Please output a production-ready solution emphasizing:
1. Low latency pipelines suited for severe orbital gravity delays (${track.timeDilation})
2. Offline compatibility hooks using client-side localStorage state persistence
3. Full integration with standard Google Gemini models

Format output in sleek, readable Markdown format.`;

  const handleCopyPrompt = () => {
    playSound('click');
    navigator.clipboard.writeText(formattedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleObjective = (key: string) => {
    playSound('click');
    setCheckedObjectives(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalObjectives = track.objectives.length;
  const completedObjectivesCount = track.objectives.filter((_, i) => checkedObjectives[`${track.id}-${i}`]).length;
  const isAllCompleted = completedObjectivesCount === totalObjectives;

  return (
    <div 
      className="w-full max-w-7xl mt-12 bg-[#020205]/95 p-6 md:p-8 border-2 rounded-none relative overflow-hidden backdrop-blur-md animate-fade-in text-left flex flex-col gap-6"
      style={{ 
        borderColor: track.themeColor,
        boxShadow: `0 0 45px ${track.themeColor}22`
      }}
    >
      {/* Background Tech Wire Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Top Header line with dynamic status indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 relative z-10 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span 
              className="text-[9px] tracking-widest px-2 py-0.5 uppercase font-black text-black block" 
              style={{ backgroundColor: track.themeColor }}
            >
              ACTIVE ORBIT LOCK
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              // TELEMETRY RECONNAISSANCE DECK
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-widest flex items-center gap-2.5">
            <span className="animate-pulse" style={{ color: track.themeColor }}>■</span>
            PLANET {track.name} <span className="opacity-40">/</span> {track.designation}
          </h2>
        </div>

        {/* Action Controls for Reset/Mute */}
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => {
              playSound('warp');
              const element = document.getElementById('register');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 sm:flex-none px-5 py-3 hover:opacity-90 text-black text-[10px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2"
            style={{ backgroundColor: track.themeColor }}
          >
            <span>JOIN MISSION CREW</span>
            <ArrowRight size={11} />
          </button>
          <button 
            onClick={() => {
              playSound('click');
              onSelectPlanet(null);
            }}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-350 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-none"
          >
            DISCONNECT TELEMETRY
          </button>
        </div>
      </div>

      {/* Grid of details: Distance, Dilation, Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-5 relative z-10">
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xs flex flex-col justify-between">
          <span className="text-[8px] text-white/40 tracking-wider font-bold">RELATIVE SPACE DISTANCE</span>
          <span className="text-[11px] font-bold text-slate-200 mt-1 uppercase tracking-wider">{track.distance}</span>
        </div>
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xs flex flex-col justify-between">
          <span className="text-[8px] text-white/45 tracking-wider font-bold">TIME DILATION CHRONO EXPONENT</span>
          <span className="text-[11px] font-bold mt-1 uppercase tracking-wider" style={{ color: track.themeColor }}>{track.timeDilation}</span>
        </div>
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xs flex flex-col justify-between">
          <span className="text-[8px] text-white/40 tracking-wider font-bold">ALLOCATED SECURED PRIZE CACHE</span>
          <span className="text-[11px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">{track.rewards}</span>
        </div>
      </div>

      {/* Main Interactive Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 flex-1">
        
        {/* Left Side Navigation Tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-4">
          <button
            onClick={() => { playSound('click'); setActiveTab('objectives'); }}
            className={`w-full text-left px-4 py-3.5 text-[9.5px] font-black uppercase tracking-widest transition-all rounded-none border-l-2 flex items-center justify-between ${
              activeTab === 'objectives' 
                ? 'bg-white/5 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
            style={{ borderLeftColor: activeTab === 'objectives' ? track.themeColor : 'transparent' }}
          >
            <span>I. TARGET OBJECTIVES</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-xs ${isAllCompleted ? 'bg-emerald-400/20 text-emerald-400 font-bold' : 'bg-white/10 text-white/40'}`}>
              {completedObjectivesCount}/{totalObjectives}
            </span>
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('prompt-forge'); }}
            className={`w-full text-left px-4 py-3.5 text-[9.5px] font-black uppercase tracking-widest transition-all rounded-none border-l-2 flex items-center justify-between ${
              activeTab === 'prompt-forge' 
                ? 'bg-white/5 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
            style={{ borderLeftColor: activeTab === 'prompt-forge' ? track.themeColor : 'transparent' }}
          >
            <span>II. GEMINI PROMPT FORGE</span>
            <Sparkles size={11} className={activeTab === 'prompt-forge' ? 'text-purple-400' : 'text-slate-500'} />
          </button>

          <button
            onClick={() => { playSound('click'); setActiveTab('environment'); }}
            className={`w-full text-left px-4 py-3.5 text-[9.5px] font-black uppercase tracking-widest transition-all rounded-none border-l-2 flex items-center justify-between ${
              activeTab === 'environment' 
                ? 'bg-white/5 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
            style={{ borderLeftColor: activeTab === 'environment' ? track.themeColor : 'transparent' }}
          >
            <span>III. ATMOSPHERE SIMULATOR</span>
            <Activity size={11} className={isScanning ? 'animate-spin' : ''} style={{ color: isScanning ? track.themeColor : 'inherit' }} />
          </button>
        </div>

        {/* Right Side Content Pane */}
        <div className="lg:col-span-9 flex flex-col justify-between min-h-[280px]">
          
          {/* TAB 1: TARGET CONFIG OBJECTIVES */}
          {activeTab === 'objectives' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">PLANETARY CHECKPOINTS & MISSION GOALS</h3>
                <p className="text-[10px] text-slate-400 uppercase leading-relaxed">
                  Toggle target orbit milestones. Pre-flight alignment improves landing accuracy.
                </p>
              </div>

              <div className="grid gap-3 mt-1">
                {track.objectives.map((obj, i) => {
                  const objectiveKey = `${track.id}-${i}`;
                  const isChecked = !!checkedObjectives[objectiveKey];
                  return (
                    <div 
                      key={i}
                      onClick={() => toggleObjective(objectiveKey)}
                      className="group/item flex items-start gap-3.5 p-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer relative"
                    >
                      <div className="flex items-center justify-center mt-0.5 shrink-0">
                        <div 
                          className="h-4 w-4 border flex items-center justify-center transition-all rounded-xs"
                          style={{
                            borderColor: isChecked ? track.themeColor : 'rgba(255,255,255,0.2)',
                            backgroundColor: isChecked ? `${track.themeColor}30` : 'transparent'
                          }}
                        >
                          {isChecked && <Check size={11} style={{ color: track.themeColor }} />}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 font-bold block">OBJECTIVE 0{i+1}</span>
                        <p className={`text-[10.5px] uppercase tracking-wide leading-relaxed mt-0.5 ${isChecked ? 'text-slate-450 line-through' : 'text-slate-200 group-hover/item:text-white'}`}>
                          {obj}
                        </p>
                      </div>

                      <span className="absolute right-3 top-3.5 text-[8.5px] font-bold text-white/5 group-hover/item:text-white/20">
                        GOAL_SECTOR_0{i+1}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status footer for Checklist */}
              <div className="mt-2.5 p-3.5 bg-white/[0.01] border border-dashed border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left">
                  <span className="text-[8.5px] text-slate-400 font-bold block uppercase tracking-wider">LAUNCH ELIGIBILITY DECODER</span>
                  <p className="text-[10px] font-black uppercase mt-0.5 tracking-widest" style={{ color: isAllCompleted ? '#00FF87' : track.themeColor }}>
                    {isAllCompleted 
                      ? '✓ ALL TARGET MATRIX SYSTEM MILESTONES SECURED' 
                      : '⚠ MILESTONE VERIFICATION CHECK IN PROGRESS'
                    }
                  </p>
                </div>
                {isAllCompleted ? (
                  <span className="text-[9px] px-2 py-1.5 bg-emerald-400/20 text-emerald-400 font-black tracking-widest border border-emerald-400/30 animate-pulse">
                    STATUS: PILOT AUTHORIZED
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-1.5 bg-white/5 text-slate-400 font-semibold tracking-widest border border-white/10">
                    PROGRESS: {completedObjectivesCount}/{totalObjectives} SECURED
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI PROMPT FORGE */}
          {activeTab === 'prompt-forge' && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">INTELLIGENT SECTOR DEVELOPMENT DECK</h3>
                <p className="text-[10px] text-slate-400 uppercase leading-relaxed font-semibold">
                  Forge AI prompt parameters calibrated to execute optimized code models in this orbit.
                </p>
              </div>

              {/* Problem selector grid */}
              <div className="flex flex-wrap gap-2">
                {track.problemStatements.map((ps, i) => (
                  <button
                    key={i}
                    onClick={() => { playSound('click'); setSelectedPromptIdx(i); }}
                    className={`px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-wider border rounded-none transition-all ${
                      selectedPromptIdx === i 
                        ? 'text-white border-white bg-white/10' 
                        : 'text-slate-450 border-white/10 bg-white/[0.01] hover:border-white/20'
                    }`}
                  >
                    🚀 {ps}
                  </button>
                ))}
              </div>

              {/* Prompt box */}
              <div className="relative border border-white/10 bg-[#04040a] p-4 font-mono rounded-none">
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-200 rounded-none cursor-pointer"
                  >
                    {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    <span>{copied ? 'COPIED!' : 'COPY PROMPT'}</span>
                  </button>
                </div>
                
                <span className="text-[7.5px] font-bold text-white/30 tracking-widest uppercase block mb-2">
                  TARGET TEMPLATE // MARKDOWN OUTPUT FORMAT
                </span>
                
                <pre className="text-[9px] md:text-[9.5px] leading-relaxed text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-48 pr-12 font-mono scrollbar-thin select-all">
                  {formattedPrompt}
                </pre>
              </div>

              {copied && (
                <div className="p-3 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[9px] font-black tracking-widest uppercase text-center animate-pulse">
                  ✓ TARGET PROMPT PACKET LOADED TO TERMINAL CLIPBOARD. READY TO INPUT IN YOUR AI MODEL DOCK.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEATHER & GRAVITY ENVIRONMENT SIMULATION */}
          {activeTab === 'environment' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">QUANTUM ENVIRONMENT TELEMETRY</h3>
                  <p className="text-[10px] text-slate-400 uppercase leading-relaxed">
                    Live telemetry stream simulated from local planetary probe array sensors.
                  </p>
                </div>

                <button
                  onClick={handleRunScan}
                  disabled={isScanning}
                  className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-[9.5px] font-black uppercase tracking-widest transition-all rounded-none cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw size={11} className={isScanning ? 'animate-spin' : ''} />
                  <span>{isScanning ? 'QUERYING SATELLITE...' : 'RUN RECONNAISSANCE SCAN'}</span>
                </button>
              </div>

              {/* Telemetry output box representation */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-1.5">
                <div className="bg-[#030307] border border-white/5 p-3 flex flex-col justify-between">
                  <span className="text-[7.5px] text-slate-500 font-bold tracking-wider">GRAVITY COEFFICIENT</span>
                  <span className="text-[13px] font-black text-slate-200 mt-1 uppercase transition-all duration-300">
                    {isScanning ? 'SCANNING...' : scanMetrics.gravity}
                  </span>
                </div>
                <div className="bg-[#030307] border border-white/5 p-3 flex flex-col justify-between">
                  <span className="text-[7.5px] text-slate-500 font-bold tracking-wider">ATMOSPHERE TEMP</span>
                  <span className="text-[13px] font-black text-slate-200 mt-1 uppercase transition-all duration-300">
                    {isScanning ? 'SCANNING...' : scanMetrics.temperature}
                  </span>
                </div>
                <div className="bg-[#030307] border border-white/5 p-3 flex flex-col justify-between">
                  <span className="text-[7.5px] text-slate-500 font-bold tracking-wider">SIGNAL LINK DURATION</span>
                  <span className="text-[13px] font-black text-slate-200 mt-1 uppercase transition-all duration-300">
                    {isScanning ? 'SCANNING...' : scanMetrics.quantumOffset}
                  </span>
                </div>
                <div className="bg-[#030307] border border-white/5 p-3 flex flex-col justify-between">
                  <span className="text-[7.5px] text-slate-500 font-bold tracking-wider">STELLAR SOLAR WINDS</span>
                  <span className="text-[13px] font-black text-slate-200 mt-1 uppercase transition-all duration-300">
                    {isScanning ? 'SCANNING...' : scanMetrics.stellarWind}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-[#030307] border border-white/5 p-3 flex flex-col justify-between">
                  <span className="text-[7.5px] text-slate-500 font-bold tracking-wider">COGNITIVE LATENCY PING</span>
                  <span className="text-[13px] font-black text-orange-400 mt-1 uppercase transition-all duration-300">
                    {isScanning ? 'SCANNING...' : scanMetrics.pingLatency}
                  </span>
                </div>
              </div>

              {/* Progress and status message terminal mock logs */}
              <div className="bg-[#010103] border border-white/10 p-4 font-mono text-[9px] text-[#00FAF5] rounded-none opacity-85">
                <p className="text-white/40 mb-1 tracking-widest font-bold">SYSTEM DECK FEED LOGS // ONLINE</p>
                <div className="flex flex-col gap-1">
                  <p>{isScanning ? '↳ [CMD] PIPELINE TRANSMISSION SEQUENCE LAUNCHED...' : `↳ [CMD] SENSORS IDLE AT ORBIT DECK CONFIG...`}</p>
                  <p>{isScanning ? '↳ [SAT] CONNECTING TRANS-ATMOSPHERIC FREQUENCY RELAYS...' : `↳ [SAT] CORRESPONDENCE LINK STABILIZED AT LATENCY ${scanMetrics.pingLatency}`}</p>
                  <p className="opacity-60">{isScanning ? '↳ [DATA] DECRYPTION PACKETS IN BOUND...' : '↳ [DATA] ALL TARGET CLASSIFICATIONS FULLY INGESTED // COMPATIBLE.'}</p>
                </div>
              </div>

            </div>
          )}

          {/* Core Description footer */}
          <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 text-[9.5px] text-slate-400 uppercase leading-relaxed">
            <div className="flex-1 max-w-2xl">
              <span className="text-[7.5px] text-white/35 font-bold tracking-widest block uppercase">EXPERIMENT ORBITAL DESCRIPTION DETAILED</span>
              <p className="mt-0.5 leading-normal">{track.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: track.themeColor }} />
              <span className="text-[8px] font-bold text-white/50 tracking-wider">HACKTOPUS MISSION DECK SECURED</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


// Interactive Planet Graphic Helper with layered CSS animations
const PlanetGraphic = ({ color, isActive, tagline }: { color: string; isActive: boolean; tagline: string }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center my-2 select-none pointer-events-none">
      {/* Background radial volumetric glow */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-15 group-hover:opacity-40 transition-opacity duration-700"
        style={{ backgroundColor: color }}
      />
      
      {/* Outer Orbit tracker path */}
      <svg 
        className="absolute w-full h-full animate-spin text-white/5 group-hover:text-white/20 transition-colors"
        style={{ animationDuration: '24s', color: `${color}22` }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.75" fill="none" strokeDasharray="6, 10" />
        <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1, 4" />
      </svg>

      {/* Retrograde intermediate orbit */}
      <svg 
        className="absolute w-[80%] h-[80%] animate-spin text-white/10 group-hover:text-white/30 transition-colors"
        style={{ animationDuration: '10s', animationDirection: 'reverse', color: `${color}44` }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="15, 5, 2, 5" />
      </svg>

      {/* The main planet orb body */}
      <div 
        className="w-16 h-16 rounded-full relative flex items-center justify-center overflow-hidden border transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]"
        style={{ 
          borderColor: isActive ? '#fff' : `${color}88`, 
          boxShadow: isActive ? `0 0 24px ${color}` : `0 0 12px ${color}33`,
          background: `radial-gradient(circle at 35% 35%, ${color}40 0%, #030306 80%)`
        }}
      >
        {/* Synthetic grid lines */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity flex flex-col justify-between py-1.5 font-mono select-none">
          <div className="w-full h-[1px] bg-white/25 border-b border-dashed border-white/5" />
          <div className="w-full h-[1px] bg-white/40" />
          <div className="w-full h-[1px] bg-white/25 border-b border-dashed border-white/5" />
        </div>
        
        {/* Floating pulse point representing the target core lock */}
        <div 
          className="w-2.5 h-2.5 rounded-full bg-white absolute animate-pulse"
          style={{ boxShadow: `0 0 8px #fff` }}
        />

        {/* Dynamic scanning beam horizontal */}
        <div 
          className="absolute inset-x-0 h-[1.5px] bg-white/40 top-1/2 -translate-y-1/2 group-hover:animate-ping"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Holographic floor pedestal beam */}
      <div 
        className="absolute bottom-1 w-16 h-[2.5px] blur-[1px] opacity-25 group-hover:opacity-50 transition-all duration-500"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        }}
      />
    </div>
  );
};

// Render corresponding Tech icon components based on data array string
const renderTechIcon = (iconName: string, themeColor: string) => {
  const props = { size: 12, style: { color: themeColor } };
  switch (iconName) {
    case 'Brain': return <Brain {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Network': return <Network {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Coins': return <Coins {...props} />;
    case 'Key': return <Key {...props} />;
    case 'Compass': return <Compass {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Lock': return <Lock {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Terminal': return <Terminal {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'Leaf': return <Leaf {...props} />;
    case 'Wind': return <Wind {...props} />;
    case 'Droplet': return <Droplet {...props} />;
    case 'GitBranch': return <GitBranch {...props} />;
    case 'Maximize': return <Maximize {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export default function PlanetViewer() {
  const [activePlanetIdx, setActivePlanetIdx] = useState<number | null>(null);

  const handlePlanetSelect = (idx: number) => {
    playSound('warp');
    if (activePlanetIdx === idx) {
      setActivePlanetIdx(null);
    } else {
      setActivePlanetIdx(idx);
    }
  };

  return (
    <div className="w-full text-white font-mono select-none flex flex-col items-center">
      
      {/* 5-Column Holographic Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full items-stretch mb-10">
        {TRACKS.map((track, idx) => {
          const isActive = activePlanetIdx === idx;
          return (
            <div
              key={track.id}
              onClick={() => handlePlanetSelect(idx)}
              className="group cursor-pointer flex flex-col justify-between border bg-black/50 border-white/10 p-6 rounded-none transition-all duration-500 hover:bg-black/85 relative overflow-hidden flex flex-col justify-between align-stretch text-left"
              style={{
                borderColor: isActive ? track.themeColor : undefined,
                boxShadow: isActive ? `0 0 25px ${track.themeColor}1a` : undefined,
              }}
            >
              {/* Dynamic decorative hover glowing border overlay */}
              <div 
                className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 15px ${track.themeColor}00`,
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60 group-hover:to-black/30 transition-all pointer-events-none"
              />

              {/* Holographic targeting scanline lines */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-white transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-white transition-colors" />

              {/* Column Content Header */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Visual Segment designation */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[7.5px] uppercase tracking-widest text-[#00FAF5] font-black">
                    SECTOR // 0{idx + 1}
                  </span>
                </div>

                {/* Animated Holographic Planet */}
                <PlanetGraphic color={track.themeColor} isActive={isActive} tagline={track.tagline} />

                {/* Target Names */}
                <span className="text-[9px] uppercase tracking-[0.2em] font-black mt-2 text-slate-400">
                  {track.name}
                </span>
                
                <h3 
                  className="text-[13px] md:text-[14px] font-black tracking-widest uppercase transition-colors duration-300 mt-1"
                  style={{ color: isActive ? '#fff' : track.themeColor }}
                >
                  {track.designation}
                </h3>

                <p className="text-[10px] italic text-[#00FAF5] opacity-80 mt-1 max-w-[190px] uppercase font-semibold">
                  “{track.tagline}”
                </p>
              </div>

              {/* Dynamic interactive information overlay that glows and fades on hover */}
              <div className="relative z-10 mt-5 border-t border-white/5 pt-4 flex flex-col gap-4.5 flex-1 justify-between">
                
                {/* Full Description: fades in and displays highly visible on hover */}
                <p className="text-[10px] text-slate-300 leading-relaxed uppercase opacity-85 transition-opacity duration-300">
                  {track.description}
                </p>

                {/* Problem Statement List */}
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] text-white/45 tracking-widest font-black uppercase flex items-center gap-1">
                    <Zap size={9} className="text-[#e6a640]" />
                    PROMPT EXAMPLES //
                  </span>
                  <div className="flex flex-col gap-1.5 pl-1.5">
                    {track.problemStatements.map((ps, i) => (
                      <div key={i} className="flex gap-2 items-center text-[9px] text-slate-200">
                        <span className="h-[2px] w-[5px]" style={{ backgroundColor: track.themeColor }} />
                        <span className="uppercase tracking-wider font-semibold">{ps}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech icon strip */}
                <div className="pt-2 flex justify-between items-center border-t border-white/5 mt-auto">
                  <div className="flex gap-1.5">
                    {track.techIcons.map((ti, i) => (
                      <div 
                        key={i} 
                        className="p-1 border border-white/10 bg-white/[0.01] rounded-xs flex items-center justify-center.5"
                        style={{ borderColor: `${track.themeColor}22` }}
                        title={ti}
                      >
                        {renderTechIcon(ti, track.themeColor)}
                      </div>
                    ))}
                  </div>

                  <span className="text-[7.5px] uppercase tracking-wider text-white/30 font-bold font-mono">
                    {isActive ? '[ LOCKED ]' : '[ TARGET LINK ]'}
                  </span>
                </div>

              </div>

              {/* Orbit lock indicator color glow bars */}
              <div 
                className="absolute bottom-0 inset-x-0 h-[2px] opacity-20 group-hover:opacity-100 transition-all duration-300"
                style={{ backgroundColor: track.themeColor }}
              />
            </div>
          );
        })}
      </div>

      {/* Selected Planet Targeting diagnostics box */}
      {activePlanetIdx !== null && (
        <PlanetControlDeck 
          activePlanetIdx={activePlanetIdx} 
          onSelectPlanet={setActivePlanetIdx} 
        />
      )}

    </div>
  );
}
