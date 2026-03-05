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
    name: 'FlowSpark',
    tagline: 'Find where your flow lives.',
    summary: 'Surface your curiosities and map the intersections where flow emerges',
    description: 'Curiosity is the only focus that comes for free. FlowSpark surfaces what genuinely fascinates you, then maps where those interests overlap. The intersections reveal your natural flow zones — the places where deep work feels like play.',
    fullDescription: `A guided braindump that helps you articulate what genuinely fascinates you — then visualizes the unexpected overlaps between those curiosities.

Where multiple interests converge, flow tends to live. These intersection zones are where concentration arrives without effort, where work feels less like discipline and more like pull.

Use FlowSpark to orient your vision, choose projects, or simply understand yourself better.`,
    icon: '/assets/LOGOS/IGNITED CURIOSITY.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/tools/flowspark',
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
    tagline: 'Train your attention. One rep at a time.',
    summary: 'Build concentration strength through Focus Reps',
    description: 'Every moment you choose focus over distraction is a rep. FlowZone makes that invisible act visible — and builds it like a physical skill. Set your intention, start the session, use breathwork to settle in. Count your reps. Come back tomorrow.',
    fullDescription: `FlowZone is a focus training system built into the FourFlowOS website. It uses Focus Reps — pressing a button each time you choose focus over distraction — to make concentration visible and measurable.

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
    tagline: 'Build habits across all four pillars.',
    summary: 'Balance your habits across all four pillars',
    description: 'Standard habit trackers treat every habit the same. FlowHabits organizes yours by SELF, SPACE, STORY, and SPIRIT — so you can see which dimensions of your life need attention. Gentle streaks, no guilt. Coming to iOS.',
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
    tagline: 'Train attentional velocity.',
    summary: 'Train reading speed and attentional focus with flow-inducing drills',
    description: 'Speed reading is the surface. What FlowRead actually trains is attentional velocity — the ability to move through information cleanly, without drift. RSVP drills, word chunking, progressive speed. Ten minutes a day builds a different relationship with your own attention.',
    fullDescription: `RSVP (Rapid Serial Visual Presentation) and word chunking exercises train the same attentional quality that makes flow accessible: the capacity to process information at speed, without drag or distraction.

Progressive speed training gradually increases your pace as your capacity grows. The goal isn't faster reading — it's sharper, more deliberate attention.

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
    tagline: 'Movement, accumulated.',
    summary: 'Accumulate exercise reps throughout your day',
    description: 'The body is part of the signal chain. FlowRep tracks movement throughout the day with a single tap — push-ups, squats, pull-ups, whatever your practice. Set daily targets, build streaks, keep the physical dimension of your focus alive.',
    fullDescription: `Accumulate exercise reps throughout the day rather than formal workout sessions. Set daily targets, log with a single tap, and track streaks of consecutive days hitting your goals.

Minimalist by design—built for consistent movement habits without traditional workout app complexity.`,
    icon: '/assets/apps/flowrep-icon.png',
    screenshots: [],
    platforms: ['ios'],
    appStoreUrl: 'https://apps.apple.com/us/app/flowreps/id6758522892',
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
    inDevelopment: false,
  },
};

export const getApp = (id: string): App | undefined => APPS[id];

export const getAllApps = (): App[] => Object.values(APPS);

export const getAppsByPlatform = (platform: 'ios' | 'web'): App[] =>
  Object.values(APPS).filter(app => app.platforms.includes(platform));
