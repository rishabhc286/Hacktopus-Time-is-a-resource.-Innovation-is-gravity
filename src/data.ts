import { PlanetTrack, TimelineEvent, Commander, FAQItem } from './types';

export const TRACKS: PlanetTrack[] = [
  {
    id: 'ai-ml',
    name: 'AETHER-01',
    designation: 'AI/ML Track',
    distance: '1.24 L-YEARS FROM ACCRETION DISK',
    timeDilation: '1 HOUR HERE = 7 EARTH YEARS',
    themeColor: '#C17DFF',
    bgColor: 'rgba(193, 125, 255, 0.08)',
    tagline: 'Intelligence beyond human limits.',
    description: 'Build systems that learn, adapt, and evolve. From autonomous agents to generative AI, this mission track challenges innovators to create technologies that redefine how humans interact with machines. Whether it’s computer vision, LLMs, healthcare AI, recommendation systems, or futuristic assistants — this sector is dedicated to the next era of intelligence.',
    problemStatements: [
      'AI assistants',
      'Healthcare diagnostics',
      'Smart education',
      'Generative AI tools',
      'AI for accessibility',
      'Autonomous workflows'
    ],
    objectives: [
      'Build localized edge intelligence modules using Google Gemini AI models.',
      'Construct generative code assistants for heavy space operations.',
      'Design smart diagnostics pipelines for real-world challenge arenas.'
    ],
    rewards: 'GRAND AI TROPHY + HIGH-END GPU HARDWARE DECK + PREMIUM API BOUNTY',
    techIcons: ['Brain', 'Cpu', 'Sparkles', 'Network']
  },
  {
    id: 'web3',
    name: 'NEXUS-CHAIN',
    designation: 'Web3 Track',
    distance: '3.02 L-YEARS FROM ACCRETION DISK',
    timeDilation: '1 HOUR HERE = 2.3 EARTH YEARS',
    themeColor: '#e6a640',
    bgColor: 'rgba(230, 166, 64, 0.08)',
    tagline: 'Decentralize the future.',
    description: 'Enter a trustless digital frontier where ownership, identity, and finance are redefined. Build decentralized applications, DAOs, DeFi systems, NFT ecosystems, or next-generation blockchain infrastructure designed for transparency, security, and freedom.',
    problemStatements: [
      'Decentralized finance',
      'DAO governance',
      'Smart contracts',
      'Digital identity',
      'Token ecosystems',
      'Blockchain for social good'
    ],
    objectives: [
      'Architect smart contract governance templates with gas optimization.',
      'Formulate decentralized identity portals for interstellar communication.',
      'Establish transparent digital token pipelines for social impact.'
    ],
    rewards: 'ELITE WEB3 COIN ALLOCATION + TRUSTLESS LEDGER SHIELD + HARDWARE WALLETS',
    techIcons: ['Layers', 'Coins', 'Key', 'Compass']
  },
  {
    id: 'cybersecurity',
    name: 'VOID-X',
    designation: 'Cybersecurity Track',
    distance: '4.56 L-YEARS FROM ACCRETION DISK',
    timeDilation: '1 HOUR HERE = 1.0 EARTH YEAR',
    themeColor: '#FF4B91',
    bgColor: 'rgba(255, 75, 145, 0.08)',
    tagline: 'Defend the digital universe.',
    description: 'As technology evolves, so do threats. This track focuses on building secure systems capable of protecting data, infrastructure, and human trust in an increasingly connected world. Innovate in ethical hacking, privacy, authentication, threat detection, and cyber defense technologies.',
    problemStatements: [
      'Threat detection systems',
      'Secure authentication',
      'Privacy tools',
      'Anti-phishing systems',
      'Cyber awareness platforms',
      'Network defense'
    ],
    objectives: [
      'Build proactive cyber threat pattern classifiers based on telemetry stream leaks.',
      'Construct zero-trust tokenless multi-factor security frameworks.',
      'Harden network relay interfaces against hostile infiltration attempts.'
    ],
    rewards: 'BLACK HORIZON CYBER SHIELD + ENCRYPTED HARDWARE DECK + SEC BOUNTY',
    techIcons: ['Shield', 'Lock', 'Activity', 'Terminal']
  },
  {
    id: 'sustainability',
    name: 'TERRA-NOVA',
    designation: 'Sustainability Track',
    distance: '5.12 L-YEARS FROM ACCRETION DISK',
    timeDilation: '1 HOUR HERE = 12 EARTH YEARS',
    themeColor: '#00FF87',
    bgColor: 'rgba(0, 255, 135, 0.08)',
    tagline: 'Engineer a survivable tomorrow.',
    description: 'Technology should not only advance humanity — it should preserve it. Build impactful solutions for climate change, clean energy, agriculture, waste management, smart cities, and sustainable living to create a future where innovation and nature coexist.',
    problemStatements: [
      'Smart energy systems',
      'Climate tech',
      'Waste reduction',
      'Sustainable agriculture',
      'Green mobility',
      'Water conservation'
    ],
    objectives: [
      'Engineer solar allocation algorithms to optimize extreme environment agriculture.',
      'Design water purity tracking sensors for zero-pollution waste control cycles.',
      'Formulate eco-friendly community logistics networks with modular routing.'
    ],
    rewards: 'GREEN NEBULA CHAMPION EMBLEM + SUSTAINABLE FLIGHT WORKSTATIONS',
    techIcons: ['Globe', 'Leaf', 'Wind', 'Droplet']
  },
  {
    id: 'open-innovation',
    name: 'INFINITY CORE',
    designation: 'Open Innovation Track',
    distance: '0.01 L-YEARS FROM THE CORE',
    timeDilation: 'TIME IS A FREELY NAVIGABLE DIMENSION',
    themeColor: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.08)',
    tagline: 'No limits. No boundaries.',
    description: 'Some ideas cannot be confined to categories. This open track is for bold thinkers solving real-world problems through creativity, experimentation, and disruptive innovation. If your idea doesn’t fit into a predefined sector, this is your gateway to build without restrictions.',
    problemStatements: [
      'Social impact',
      'Productivity tools',
      'Education tech',
      'Creator economy',
      'Future internet concepts',
      'Experimental technology'
    ],
    objectives: [
      'Conceptualize and prototype disruptive systems resolving custom bottlenecks.',
      'Experiment with creative interactive layouts bridging human & software spheres.',
      'Deploy self-authoritative telemetry tools optimizing creator workflows.'
    ],
    rewards: 'TESSERACT MASTER BOUNTY + EXPERIMENTAL HARDWARE KIT + SPECIALIST PLATES',
    techIcons: ['Sparkles', 'GitBranch', 'Terminal', 'Maximize']
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    time: 'PHASE 01 — UPCOMING',
    title: 'CREDENTIAL DECRYPTION: REGISTRATION STARTING',
    stage: 'COMMAND DOCK RECRUITMENT',
    description: 'Launch codes are active. Global hackers sign up and prepare their development gear for the ultimate orbital trajectory.',
    status: 'future'
  },
  {
    time: 'PHASE 02 — UPCOMING',
    title: 'CREW SYNCHRONIZATION: TEAM FORMATION',
    stage: 'COMMUNICATION SYNERGY DOCK',
    description: 'Crews unite, align specialized tracks, configure code portals, and synchronize neural networks before starting ignition.',
    status: 'future'
  },
  {
    time: 'PHASE 03 — OCT 14 (12:00 PM)',
    title: 'SINGULARITY IGNITION: OPENING CEREMONY',
    stage: 'MISSION START CONTROLLERS',
    description: 'Chief Commanders and local coordinators deliver direct launch mandates and critical developer orbital guides.',
    status: 'future'
  },
  {
    time: 'PHASE 04 — OCT 14 TO OCT 16',
    title: 'CONTINUOUS ACCELERATION: 48 HOUR BUILD PHASE',
    stage: 'ZERO-GRAVITY PROTOTYPING',
    description: 'The countdown fires. 600+ elite engineers block external world signals and construct high-performance telemetry codebases.',
    status: 'future'
  },
  {
    time: 'PHASE 05 — OCT 15 (04:00 PM)',
    title: 'ORBITAL ADJUSTMENT: MENTOR CONNECT',
    stage: 'WARP PATH RECALIBRATION',
    description: 'Industry experts and tech commanders join the cockpit to inspect fuel flow, debug code, and optimize model performance.',
    status: 'future'
  },
  {
    time: 'PHASE 06 — OCT 16 (09:00 AM)',
    title: 'COGNITIVE ASSESSMENT: PROTOTYPE ROUND',
    stage: 'TACTICAL RADAR PRESENTATION',
    description: 'Brave hackers display their active terminal views, operational databases, and Gemini AI agent pipelines.',
    status: 'future'
  },
  {
    time: 'PHASE 07 — OCT 16 (10:30 AM)',
    title: 'GRAVITATIONAL AUDIT: FINAL JUDGING',
    stage: 'EVALUATION CORRIDOR MATRIX',
    description: 'Specialists check the code depth, mechanical efficiency, system viability, and final cockpit HUD graphics.',
    status: 'future'
  },
  {
    time: 'PHASE 08 — OCT 16 (12:00 PM)',
    title: 'TOUCHDOWN PROTOCOL: CLOSING CEREMONY',
    stage: 'MISSION CONCLUSION',
    description: 'Priceless cargo items, the legendary ₹80,000+ cache, and prestigious credentials are handed to the victor squads.',
    status: 'future'
  }
];

export const COMMANDERS: Commander[] = [
  {
    name: 'RISHABH CHAUDHARY',
    role: 'ORGANIZER',
    agency: 'GDG ON CAMPUS GLA UNIVERSITY',
    bio: 'Chief mission architect driving the HACKTOPUS expedition. Specialist in developer relations, AI SDK integrations, and ecosystem expansion across the GDG network.',
    sector: 'COMMAND HQ',
    avatarSeed: 'rishabh'
  },
  {
    name: 'SAKSHAM KUSHWAHA',
    role: 'CO-ORGANIZER',
    agency: 'GDG CORE MISSION CONTROL',
    bio: 'Deputy mission commander coordinating cross-team operations, logistics synchronization, and ensuring every crew module fires on time and on target.',
    sector: 'CO-COMMAND',
    avatarSeed: 'saksham'
  },
  {
    name: 'HARSH DIXIT',
    role: 'GENERAL SECRETARY',
    agency: 'MISSION OPERATIONS OUTPOST',
    bio: 'Oversees administrative pipelines, inter-team communications, and official mission documentation. Keeps the command deck running at peak efficiency.',
    sector: 'OPERATIONS',
    avatarSeed: 'harsh'
  },
  {
    name: 'AYUSHMAN RAI',
    role: 'PR HEAD',
    agency: 'PUBLIC RELATIONS COMMAND',
    bio: 'Manages external communications, media outreach, and stakeholder engagement. Amplifies the HACKTOPUS signal across digital and physical orbits.',
    sector: 'PUBLIC RELATIONS',
    avatarSeed: 'ayushman'
  },
  {
    name: 'DISHA CHAUDHARY',
    role: 'CONTENT HEAD',
    agency: 'CONTENT TRANSMISSION UNIT',
    bio: 'Architects the narrative voice of HACKTOPUS. Crafts high-impact content strategies, editorial pipelines, and storytelling frameworks for the mission.',
    sector: 'CONTENT',
    avatarSeed: 'disha'
  },
  {
    name: 'GAURI CHAUDHARY',
    role: 'CONTENT HEAD',
    agency: 'CONTENT TRANSMISSION UNIT',
    bio: 'Co-leads the content mission with precision and creativity. Drives brand storytelling, copy systems, and multi-channel content deployment strategies.',
    sector: 'CONTENT',
    avatarSeed: 'gauri'
  },
  {
    name: 'PAYAL AGARWAL',
    role: 'DESIGN HEAD',
    agency: 'TACTICAL UI RESEARCH BOARD',
    bio: 'Commands all visual design systems for HACKTOPUS. Enforces high-contrast grids, kinetic motion graphics, and elegant color systems across all outputs.',
    sector: 'DESIGN',
    avatarSeed: 'payal'
  },
  {
    name: 'PRAKHAR BAJPAI',
    role: 'OPERATION HEAD',
    agency: 'GROUND OPERATIONS COMMAND',
    bio: 'Leads on-ground logistics, venue coordination, and real-time execution. Ensures every physical touchpoint of the 48-hour mission runs without friction.',
    sector: 'LOGISTICS',
    avatarSeed: 'prakhar'
  }
];

export const FAQ: FAQItem[] = [
  {
    id: 'eligibility',
    question: 'WHO IS AUTHORIZED TO JOIN THE HACKTOPUS EXPEDITION?',
    answer: 'Any ambitious developer, designer, AI builder, startup founder, student, or self-taught creator is welcome to sign up. If you are driven to engineer practical answers to complex problems under gravity constraints, you hold security clearance to participate.',
    category: 'ELIGIBILITY'
  },
  {
    id: 'beginner-participation',
    question: 'CAN A NOVICE DETECTED PILOT CO-OPERATE ON THIS MISSION?',
    answer: 'Absolutely. Space Command has designed specialized beginner trajectories, backed by dedicated flight support guides (technical mentors) orbiting the design docks. This is the optimal environment to fire your booster engines for the first time.',
    category: 'BEGINNERS'
  },
  {
    id: 'team-size',
    question: 'WHAT IS THE AUTHORIZED SQUAD SIZE FOR SECURE CREWS?',
    answer: 'Crews may register as single pilots (solo missions) or assemble cohesive units of up to 4 crewmates. We strongly advise constructing multi-disciplinary crews combining developers and visual UI/UX specialists for maximum gravity impact.',
    category: 'CREW SQUAD'
  },
  {
    id: 'registration',
    question: 'HOW DO I SECURE CLEARANCE (REGISTER) FOR THE HACKATHON?',
    answer: 'Locate the SECURE BOARDING PASS panel at the bottom of the vessel or tap the "Launch Entry" CTAs. Enter your handle, secure email, role preferences, and decode skills. Once transmitted, your physical coordinates are queued for final launch verify.',
    category: 'REGISTRATION'
  },
  {
    id: 'accommodation',
    question: 'ARE HYPER-SLEEP STATIONS (LODGING) PROVIDED ONBOARD?',
    answer: 'Affirmative. HACKTOPUS is a continuous, in-person 48-hour challenge. GLA University’s command outpost provides safe physical sleep pods, rest zones, and comfortable hyper-chambers to ensure developers keep their processors from overheating.',
    category: 'ACCOMMODATION'
  },
  {
    id: 'food',
    question: 'HOW IS NUTRITIONAL FUEL (MEALS & SNACKS) TO BE CO-ORDINATED?',
    answer: 'Our ground logistics crews supply steady nutritional payloads directly to your console docks. Full-cycle meals, high-energy snacks, caffeine canisters, and late-night carbohydrate fuels are completely covered and distributed throughout the 48-hour build.',
    category: 'FUEL SUPPLIES'
  },
  {
    id: 'what-to-bring',
    question: 'WHAT PHYSICAL HARNESS AND EQUIPMENT MUST EACH PILOT CARRY?',
    answer: 'Crew members must carry their personal computing workstations (laptops), electrical extension chords, system chargers, basic toiletries, and warm clothing for deep-space cold snaps. Ground Command provides the desk ports, network rails, and backplanes.',
    category: 'CREW CARGO'
  },
  {
    id: 'submission-rules',
    question: 'HOW ARE CHRONO-TELEMETRY COMPILATIONS AND BUILD ARTIFACTS SUBMITTED?',
    answer: 'All projects must commit their functional source code to their assigned Github/Gitlab repositories before the countdown hits T-Zero. Late code packets will experience infinite time dilation and cannot be processed by the evaluator core.',
    category: 'SUBMIT MECHANISM'
  },
  {
    id: 'judging-criteria',
    question: 'HOW WILL THE ASTRO-JURY EVALUATE THE GRAVITY OF OUR INVENTIONS?',
    answer: 'Submissions are mapped across four cosmic parameters: Technical Complexity (algorithmic depth), UX HUD Craftsmanship (design polish & responsiveness), Creative Innovation (uniqueness), and Viability (practical orbit of solution in real-world scenarios).',
    category: 'ASTRO-JURY'
  },
  {
    id: 'internet-facilities',
    question: 'ARE CORE COMMAND TERMINALS EQUIPPED WITH SECURE DATA LINKS?',
    answer: 'Yes. GLA University Campus implements redundant high-speed wireless networks alongside power-grid fail-safes. Ground nodes ensure your compiler can query cloud databases and neural nodes without latency drops.',
    category: 'DATA LINKS'
  },
  {
    id: 'certificates',
    question: 'DO SURVIVING CREWS SECURE AN APPROVED TRANSMISSION RECORD?',
    answer: 'Affirmative. Every astronaut who completes the 48-hour mission receives a certified GDG On Campus GLA University Certificate of Deep-space Innovation, demonstrating their elite capacity to build under intense pressure.',
    category: 'TRANSMISSIONS'
  },
  {
    id: 'prizes',
    question: 'WHAT BOUNTIES ARE ALLOCATED TO THE CRITICAL ACCRETION CORES?',
    answer: 'Bounty squads dispute a cash pool of ₹80,000+ containing individual track awards (₹35,000 for 1st, ₹25,000 for 2nd, ₹20,000 for 3rd), special discipline plaques (UI/UX, Innovation, Team Spirit), plus cloud credits and sponsor hardcrates.',
    category: 'BOUNTY CRATE'
  }
];
