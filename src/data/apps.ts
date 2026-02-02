import { DimensionType } from '@/types/framework';

export interface App {
  id: string;
  name: string;
  tagline: string;
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
  flowzone: {
    id: 'flowzone',
    name: 'FlowZone',
    tagline: 'Enter Your Flow State',
    description: 'A focus timer designed to help you enter and sustain flow states through breathwork, Focus Reps tracking, and ambient encouragement during the Struggle Phase.',
    fullDescription: `FlowZone is more than a timer—it's a focus training system built on the science of flow states.

The app introduces Focus Reps: each time distraction pulls at your attention but you choose to return to focus, you press the button. This makes the invisible work of maintaining focus visible and measurable.

FlowZone recognizes the Struggle Phase—the first 25% of any focus session where starting is hardest. During this phase, the app provides gentle ambient encouragement to help you push through.

Integrated breathwork exercises help you transition from scattered thinking to focused presence. Choose from various patterns like Box Breathing, 4-7-8, or Coherent Breathing to find what works best for you.`,
    icon: '/assets/apps/flowzone-icon.png',
    screenshots: [],
    platforms: ['ios', 'web'],
    appStoreUrl: '#',
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
    inDevelopment: true,
  },
  flowhabits: {
    id: 'flowhabits',
    name: 'FlowHabits',
    tagline: 'Build Flow-Aligned Habits',
    description: 'A habit tracker organized around the Four Pillars—SELF, SPACE, STORY, SPIRIT—helping you build balanced routines that support your flow state.',
    fullDescription: `FlowHabits helps you build habits aligned with the four dimensions of flow: SELF (inner mastery), SPACE (environment design), STORY (direction setting), and SPIRIT (inner drive).

Each habit you create can be assigned to a pillar, helping you maintain balance across all dimensions of life. Visual indicators show you which areas are thriving and which need attention.

The app tracks streaks, completion rates, and provides gentle accountability without guilt. Miss a day? The app helps you understand why and get back on track rather than making you feel bad.

Simple, focused, and designed to help you build the foundational habits that enable flow states.`,
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
    tagline: 'Speed Reading Trainer',
    description: 'Train your reading speed with flow-inducing exercises. RSVP, word chunking, and progressive speed training to expand your reading capacity.',
    fullDescription: `FlowRead uses proven techniques to help you read faster while maintaining comprehension.

The app employs RSVP (Rapid Serial Visual Presentation) to train your eyes and brain to process words faster by eliminating subvocalization and reducing eye movement.

Word chunking exercises help you expand your visual span, taking in more words at once. Progressive speed training gradually increases your pace as your capacity grows.

Regular practice with FlowRead helps you enter a reading flow state where words seem to flow effortlessly into understanding.`,
    icon: '/assets/apps/flowread-icon.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '#',
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
    gradient: 'from-[#5B84B1] to-[#7A4DA4]',
    accentColor: '#5B84B1',
    relatedPillars: ['self', 'story'],
    inDevelopment: true,
  },
  flowrep: {
    id: 'flowrep',
    name: 'FlowRep',
    tagline: 'Daily Exercise Tracker',
    description: 'A minimalist exercise rep tracker that helps you build consistent movement habits. Track push-ups, squats, pull-ups and more with daily targets and streak tracking.',
    fullDescription: `FlowRep is a focused exercise tracker built around the philosophy of accumulating reps throughout the day rather than formal workout sessions.

Set daily targets for exercises like push-ups, squats, chin-ups, and pull-ups. Throughout the day, log your reps with a single tap. The app tracks your progress toward daily goals and celebrates when you hit your targets.

Streak tracking keeps you motivated by showing consecutive days of hitting your targets. The minimalist interface gets out of the way so you can focus on movement.

Built for people who want to build consistent exercise habits without the complexity of traditional workout apps.`,
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
