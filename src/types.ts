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
  linkedin?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface TeamMate {
  name: string;
  email: string;
  college: string;
}

export interface ManifestEntry {
  // Team Lead
  name: string;
  handle: string;
  email: string;
  phone: string;
  college: string;
  role: 'Pilot' | 'Engineer' | 'Navigator' | 'Scientist';
  track: string;
  // Team
  teamName: string;
  teamSize: number;
  teammates: TeamMate[];
  // System
  encryptionKey: string;
  registeredAt: string;
  devfolioRegistered: boolean;
}
