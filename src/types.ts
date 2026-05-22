export type SectionId = 'hero' | 'mission' | 'details' | 'tracks' | 'schedule' | 'organizer' | 'prizes' | 'crew' | 'sponsors' | 'faq' | 'register';

export interface PlanetTrack {
  id: string;
  name: string;
  designation: string;
  distance: string;
  timeDilation: string;
  themeColor: string;
  bgColor: string;
  description: string;
  objectives: string[];
  rewards: string;
  tagline: string;
  problemStatements: string[];
  techIcons: string[];
}

export interface TimelineEvent {
  time: string;
  title: string;
  stage: string;
  description: string;
  status: 'past' | 'current' | 'future';
}

export interface Commander {
  name: string;
  role: string;
  agency: string;
  bio: string;
  sector: string;
  avatarSeed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ManifestEntry {
  handle: string;
  email: string;
  role: 'Pilot' | 'Engineer' | 'Navigator' | 'Scientist';
  track: string;
  skills: string[];
  encryptionKey: string;
  registeredAt: string;
}
