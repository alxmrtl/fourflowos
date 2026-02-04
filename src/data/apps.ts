import { DimensionType } from '@/types/framework';

export interface App {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  fullDescription: string;
  icon: string;
  screenshots: string[];
  platforms: ('ios' | 'web')[];
  appStoreUrl?: string;
  webUrl?: string;
  features: {
    title: string;
    description: string;
  }[];
  gradient: string;
  accentColor: string;
  relatedPillars: DimensionType[];
  version?: string;
  releaseDate?: string;
  inDevelopment: boolean;
}

export const APPS: Record<string, App> = {
  'curiosity-explorer': {
    id: 'curiosity-explorer',
    name: 'Curiosity Explorer',
    tagline: 'Discover Where Your Flow Lives',
    summary: 'Map your curiosities to find where flow lives',
    description: 'Curiosity is free focus. When something genuinely fascinates you, concentration comes naturally—and that\'s where flow starts. This tool helps you find your curiosity stacks: the intersections between your interests that reveal where your flow lives.',
    fullDescription: `A guided braindump tool that helps you articulate what genuinely fascinates you—then visualizes the unexpected intersections between those curiosities.

The result is a map of your unique intersection points—where multiple curiosities overlap. These convergence zones are where flow states naturally emerge.

Use it to set your vision, choose projects, or simply understand yourself better.`,
    icon: '/assets/LOGOS/IGNITED CURIOSITY.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/tools/curiosity-explorer',
    features: [
      {
        title: 'Guided Braindump',
        description: 'Structured prompts help you surface curiosities you didn\'t know you had.',
      },
      {
        title: 'Intersection Mapping',
        description: 'Visualize where your curiosities overlap to find your unique flow zones.',
      },
      {
        title: 'Floating Pool',
        description: 'Watch your curiosities float and connect in an interactive visualization.',
      },
      {
        title: 'Connection Lines',
        description: 'See the threads between your interests that reveal deeper patterns.',
      },
    ],
    gradient: 'from-[#7A4DA4] to-[#5B84B1]',
    accentColor: '#7A4DA4',
    relatedPillars: ['spirit'],
    inDevelopment: false,
  },
  flowzone: {
    id: 'flowzone',
    name: 'FlowZone',
    tagline: 'Your Flow-State Workspace',
    summary: 'Build concentration strength through Focus Reps',
    description: 'Everything you need to get stuff done, in one place. Set your intention, start a pomodoro timer, tune your nervous system with breathwork and binaural beats, then track Focus Reps to build the meta-skill of staying on task over time.',
    fullDescription: `FlowZone is a focus training system built into the FourFlowOS website. It uses Focus Reps—pressing a button each time you choose focus over distraction—to make concentration visible and measurable.

The Struggle Phase (the first 25% of any session) gets ambient encouragement to help you push through. Integrated breathwork patterns help you transition into focused presence.

Goal linking connects sessions to your broader purpose, and statistics track your focus trends over time.`,
    icon: '/assets/apps/flowzone-icon.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/tools/flowzone',
    features: [
      {
        title: 'Focus Reps',
        description: 'Track every moment you choose focus over distraction, building your concentration muscle over time.',
      },
      {
        title: 'Struggle Phase Support',
        description: 'Ambient encouragement during the hardest part of any session—the first 25%.',
      },
      {
        title: 'Breathwork Integration',
        description: 'Multiple breathing patterns to help you transition into focused states.',
      },
      {
        title: 'Goal Linking',
        description: 'Connect your focus sessions to meaningful goals and track progress.',
      },
      {
        title: 'Daily Container',
        description: 'Plan your focus blocks for the day and see your progress at a glance.',
      },
      {
        title: 'Statistics & Insights',
        description: 'Track your focus trends, rep counts, and session history over time.',
      },
    ],
    gradient: 'from-[#FF6F61] to-[#7A4DA4]',
    accentColor: '#FF6F61',
    relatedPillars: ['self', 'space'],
    version: '1.0',
    inDevelopment: false,
  },
  flowhabits: {
    id: 'flowhabits',
    name: 'FlowHabits',
    tagline: 'Build Flow-Aligned Habits',
    summary: 'Balance your habits across all four pillars',
    description: 'Standard habit trackers treat every habit the same. FlowHabits organizes yours by Self, Space, Story, and Spirit—so you can see which dimensions of your life are thriving and which need attention. Gentle streaks, no guilt.',
    fullDescription: `Build habits organized by the four pillars—SELF, SPACE, STORY, SPIRIT—with visual balance indicators showing which dimensions need attention.

Tracks streaks and completion rates with gentle accountability. Miss a day? It helps you get back on track without guilt. All data stays on-device.`,
    icon: '/assets/apps/flowhabits-icon.png',
    screenshots: [],
    platforms: ['ios'],
    appStoreUrl: '#',
    features: [
      {
        title: 'Four Pillars Organization',
        description: 'Categorize habits by SELF, SPACE, STORY, and SPIRIT for balanced growth.',
      },
      {
        title: 'Streak Tracking',
        description: 'Build momentum with streak counts and personal best records.',
      },
      {
        title: 'Balance Indicators',
        description: 'Visual feedback showing which life dimensions need more attention.',
      },
      {
        title: 'Gentle Accountability',
        description: 'Supportive reminders without guilt or shame for missed days.',
      },
      {
        title: 'Simple Interface',
        description: 'Minimalist design that makes tracking habits frictionless.',
      },
      {
        title: 'Local Privacy',
        description: 'All data stays on your device—no accounts, no cloud sync.',
      },
    ],
    gradient: 'from-[#6BA292] to-[#5B84B1]',
    accentColor: '#6BA292',
    relatedPillars: ['self', 'story'],
    version: '1.0',
    inDevelopment: true,
  },
  flowread: {
    id: 'flowread',
    name: 'FlowRead',
    tagline: 'Read Faster, Absorb More',
    summary: 'Train reading speed with flow-inducing drills',
    description: 'Slow reading kills momentum. FlowRead uses RSVP and word chunking to train your eyes to take in more, faster—until reading itself becomes a flow state. Progressive speed adapts as you improve.',
    fullDescription: `RSVP (Rapid Serial Visual Presentation) and word chunking exercises train you to read faster while maintaining comprehension. Progressive speed training gradually increases your pace as your capacity grows.

Regular practice helps you enter a reading flow state where words process effortlessly.`,
    icon: '/assets/apps/flowread-icon.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/tools/flowread',
    features: [
      {
        title: 'RSVP Training',
        description: 'Rapid Serial Visual Presentation to eliminate subvocalization.',
      },
      {
        title: 'Word Chunking',
        description: 'Expand your visual span to take in more words at once.',
      },
      {
        title: 'Progressive Speed',
        description: 'Gradually increase pace as your reading capacity grows.',
      },
      {
        title: 'Reading Flow',
        description: 'Techniques designed to help you enter a reading flow state.',
      },
      {
        title: 'Custom Content',
        description: 'Practice with your own text or use built-in materials.',
      },
      {
        title: 'Progress Tracking',
        description: 'Monitor your WPM improvements over time.',
      },
    ],
    gradient: 'from-[#6BA292] to-[#5B84B1]',
    accentColor: '#6BA292',
    relatedPillars: ['self', 'space'],
    inDevelopment: false,
  },
  flowrep: {
    id: 'flowrep',
    name: 'FlowRep',
    tagline: 'Movement Reps, All Day',
    summary: 'Accumulate exercise reps throughout your day',
    description: 'You don\'t need a gym session to stay active. FlowRep lets you log push-ups, squats, and pull-ups throughout the day with a single tap. Set daily targets, track streaks, build the body dimension of Self.',
    fullDescription: `Accumulate exercise reps throughout the day rather than formal workout sessions. Set daily targets, log with a single tap, and track streaks of consecutive days hitting your goals.

Minimalist by design—built for consistent movement habits without traditional workout app complexity.`,
    icon: '/assets/apps/flowrep-icon.png',
    screenshots: [],
    platforms: ['ios'],
    appStoreUrl: '#',
    features: [
      {
        title: 'Daily Rep Tracking',
        description: 'Log reps throughout the day with a single tap for each exercise.',
      },
      {
        title: 'Daily Targets',
        description: 'Set achievable daily goals for each exercise to build consistency.',
      },
      {
        title: 'Streak Tracking',
        description: 'Track consecutive days of hitting your targets to stay motivated.',
      },
      {
        title: 'Custom Exercises',
        description: 'Add your own exercises beyond the built-in presets.',
      },
      {
        title: 'History View',
        description: 'Review your progress over time with daily logs and statistics.',
      },
      {
        title: 'Minimalist Design',
        description: 'Clean interface that stays out of the way so you can focus on movement.',
      },
    ],
    gradient: 'from-[#FF6F61] to-[#5B84B1]',
    accentColor: '#FF6F61',
    relatedPillars: ['self'],
    version: '1.0',
    inDevelopment: true,
  },
};

export const getApp = (id: string): App | undefined => APPS[id];

export const getAllApps = (): App[] => Object.values(APPS);

export const getAppsByPlatform = (platform: 'ios' | 'web'): App[] =>
  Object.values(APPS).filter(app => app.platforms.includes(platform));
