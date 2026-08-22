export interface LocalBusiness {
  id: string;
  name: string;
  googleMapsUrl: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  rating: number;
  reviewsCount: number;
  category: string;
  city: string;
  status: 'Business Found' | 'Pending' | 'Called' | 'Emailed';
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  skills: string[];
  appliedStatus: 'Not Applied' | 'Pitch Emailed' | 'Voice Screened' | 'Interview Scheduled';
}

export interface VoiceAgent {
  id: string;
  name: string;
  type: 'Single Prompt' | 'Multi-branch';
  lastUpdated: string;
  totalCalls: number;
  roleObjective: string;
  firstMessage: string;
  model: string;
  primaryLanguage: string;
  secondaryLanguage?: string;
  voice: string;
  avatarColor: string;
}

export const INITIAL_LOCAL_BUSINESSES: LocalBusiness[] = [
  {
    id: '1',
    name: 'Oyo 7373 The Nirvana Retreat',
    googleMapsUrl: 'https://www.google.com/maps/place/Oyo+7373+The+Nirvana+Retreat',
    description: 'Casual rooms & cottages with mountain views, plus an open-air dining terrace.',
    website: 'https://www.oyorooms.com',
    phone: '+91 124 620 1184',
    address: 'Village nasogi near DPS school, Manali, Himachal Pradesh 175131',
    rating: 3.9,
    reviewsCount: 142,
    category: 'Hotel / Resort',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '2',
    name: 'Aurelion Villa, Manali',
    googleMapsUrl: 'https://www.google.com/maps/place/Aurelion+Villa',
    description: 'Luxury mountain villa with panoramic Himalayan views and personal butler service.',
    website: 'https://www.aurelionvilla.com',
    phone: '+91 98050 47905',
    address: 'Hadimba Temple Road, Upper Nasogi, Manali, HP 175131',
    rating: 5.0,
    reviewsCount: 89,
    category: 'Luxury Villa',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '3',
    name: "Himachal Valley's Manor Resort",
    googleMapsUrl: 'https://www.google.com/maps/place/Himachal+Valley+Manor',
    description: 'Refined rustic suites featuring cedar woodwork, apple orchard walks, and heated flooring.',
    website: 'http://www.himachalvalleymanor.com',
    phone: '+91 72660 50000',
    address: 'Nasogi Road, Near DPS School, Manali, Himachal Pradesh',
    rating: 4.0,
    reviewsCount: 210,
    category: 'Resort',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '4',
    name: 'The Manali Lodge',
    googleMapsUrl: 'https://www.google.com/maps/place/The+Manali+Lodge',
    description: 'Upscale boutique chalets offering private balconies, spa facilities, and guided treks.',
    website: 'https://www.themanalilodge.com',
    phone: '+91 99997 47620',
    address: 'DPS School Road, near Manali Central, Himachal Pradesh',
    rating: 4.3,
    reviewsCount: 315,
    category: 'Boutique Lodge',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '5',
    name: 'Hotel Cherry Manali',
    googleMapsUrl: 'https://www.google.com/maps/place/Hotel+Cherry+Manali',
    description: 'Cozy boutique hotel nestled in pine forests near historic temples.',
    website: 'https://hotelcherrymanali.com',
    phone: '+91 99582 67395',
    address: 'Hadimba Temple Rd, Upper Circuit House, Manali',
    rating: 4.9,
    reviewsCount: 520,
    category: 'Hotel',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '6',
    name: 'Urban Monk Stays & Coworking',
    googleMapsUrl: 'https://www.google.com/maps/place/Urban+Monk+Stays',
    description: 'High-speed fiber coliving hostel for remote engineers, digital nomads, and creators.',
    website: 'http://airbnb.co.in/h/urbanmonk',
    phone: '+91 76963 92500',
    address: 'Next to Hotel Xanadu by Aleo Bridge, Manali, HP',
    rating: 4.8,
    reviewsCount: 290,
    category: 'Coliving & Hostel',
    city: 'Manali, India',
    status: 'Business Found'
  },
  {
    id: '7',
    name: 'The Pinaki Luxury Stays',
    googleMapsUrl: 'https://www.google.com/maps/place/The+Pinaki',
    description: 'Chic wooden cottages surrounded by pine woods with organic farm-to-table café.',
    website: 'https://thepinakihotels.com',
    phone: '+91 98162 22254',
    address: '65MW+6H7, Aleo, Manali, Himachal Pradesh',
    rating: 4.9,
    reviewsCount: 175,
    category: 'Resort',
    city: 'Manali, India',
    status: 'Business Found'
  }
];

export const INITIAL_JOB_LISTINGS: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack AI Engineer',
    company: 'NeuralGlow Labs',
    location: 'San Francisco, CA (Remote)',
    salary: '$160,000 - $210,000',
    postedAt: '2 hours ago',
    recruiterName: 'Sarah Jenkins',
    recruiterEmail: 'sarah.jenkins@neuralglow.ai',
    recruiterPhone: '+1 (415) 890-4122',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'LLMs', 'Voice AI'],
    appliedStatus: 'Not Applied'
  },
  {
    id: 'job-2',
    title: 'Founding Growth & GTM Lead',
    company: 'HyperScale Data',
    location: 'New York, NY (Hybrid)',
    salary: '$140,000 - $180,000 + Equity',
    postedAt: '5 hours ago',
    recruiterName: 'David Chen',
    recruiterEmail: 'd.chen@hyperscaledata.io',
    recruiterPhone: '+1 (212) 555-0199',
    skills: ['Cold Outreach', 'Clay Automation', 'Salesforce', 'Apollo', 'Outbound Sales'],
    appliedStatus: 'Not Applied'
  },
  {
    id: 'job-3',
    title: 'Speech & Audio ML Scientist',
    company: 'VocalWave Systems',
    location: 'Bangalore, India (Hybrid)',
    salary: '₹35,00,000 - ₹50,00,000',
    postedAt: '1 day ago',
    recruiterName: 'Vikram Malhotra',
    recruiterEmail: 'vikram.m@vocalwave.in',
    recruiterPhone: '+91 98200 12345',
    skills: ['PyTorch', 'TTS Models', 'Whisper STT', 'FastAPI', 'WebSockets'],
    appliedStatus: 'Not Applied'
  }
];

export const INITIAL_VOICE_AGENTS: VoiceAgent[] = [
  {
    id: 'agent-1',
    name: '(IN) Car Loan EMI Collections - Outbound',
    type: 'Single Prompt',
    lastUpdated: 'August 15th, 2026',
    totalCalls: 142,
    roleObjective: 'You are Neha, a representative from Smallest Bank’s Loan Servicing team. You make a post-due-date outbound call to a customer whose EMI has already missed its mandate hit. Your job is to recover the overdue EMI today by getting the customer to complete payment via SMS link, or surface fine and CIBIL impact.',
    firstMessage: 'नमस्ते, आप कैसे हैं? I am calling regarding your overdue EMI payment.',
    model: 'GPT 4.1 / Gemini Flash',
    primaryLanguage: 'Hindi',
    secondaryLanguage: 'English',
    voice: 'Rhea',
    avatarColor: '#ef4444'
  },
  {
    id: 'agent-2',
    name: 'Local Business Outreach & Demo Booker',
    type: 'Single Prompt',
    lastUpdated: 'August 12th, 2026',
    totalCalls: 89,
    roleObjective: 'You are Alex, an AI Growth Advisor. You call local hotels, restaurants, and clinic managers discovered via Google Maps to introduce automated booking & voice reservation assistants.',
    firstMessage: 'Hi there! I was checking out your business on Google Maps and noticed you have great reviews. Are you currently accepting automated voice bookings for guests?',
    model: 'GPT 4.1',
    primaryLanguage: 'English',
    voice: 'Quinn',
    avatarColor: '#3b82f6'
  },
  {
    id: 'agent-3',
    name: 'Job Recruiter Candidate Screening Bot',
    type: 'Single Prompt',
    lastUpdated: 'August 10th, 2026',
    totalCalls: 64,
    roleObjective: 'You are Maya, an autonomous technical recruiter. You conduct a friendly 5-minute pre-screening call with candidates to verify years of experience in React/Node/AI and salary expectations.',
    firstMessage: 'Hi! Thanks for expressing interest in our Full Stack AI position. Do you have 3 minutes for a quick technical introduction?',
    model: 'Claude 3.7',
    primaryLanguage: 'English',
    voice: 'Ella',
    avatarColor: '#10b981'
  }
];
