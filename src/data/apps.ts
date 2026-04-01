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
  what?: string;
  /** ToolId this app maps to inside FlowLab — web-based lab tools only */
  labToolId?: string;
}

export const APPS: Record<string, App> = {
  'flow-profile': {
    id: 'flow-profile',
    name: 'Flow Profile',
    tagline: 'Know where flow is blocked.',
    summary: 'Your consciousness alignment map across the 12 Flow Keys',
    description: 'A diagnostic across 12 conditions that determine whether flow is accessible. Your Flow Profile shows which keys are bottlenecks right now — and the specific cascade that will unlock access. Everything else in FlowLab is calibrated to what your profile reveals.',
    fullDescription: `The Flow Profile is a diagnostic across 12 Flow Keys organized into four pillars: SELF, SPACE, STORY, and SPIRIT.

Each key names a condition that must be met for flow to be accessible. The profile surfaces which of these conditions are restricting access right now — and in what order to address them.

The output isn't a score. It's a map: here's where the signal is breaking down, here's the cascade that will clear it.`,
    icon: '/assets/LOGOS/FOURFLOW - MAIN LOGO.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/me?tool=profile',
    labToolId: 'profile',
    features: [
      { title: '12 Flow Keys', description: 'Assessed across all four pillars — SELF, SPACE, STORY, SPIRIT.' },
      { title: 'Bottleneck Identification', description: 'See exactly which conditions are restricting access right now.' },
      { title: 'Cascade Logic', description: 'Get the specific sequence that will unlock flow for your current state.' },
      { title: 'Living Document', description: 'Your profile updates as you practice and your state shifts over time.' },
    ],
    gradient: 'from-[#7A4DA4] to-[#5B84B1]',
    accentColor: '#7A4DA4',
    relatedPillars: ['self', 'space', 'story', 'spirit'],
    inDevelopment: false,
    what: 'A diagnostic across the 12 Flow Keys — maps which conditions are bottlenecks and the order to address them.',
  },
  'flowcompendium': {
    id: 'flowcompendium',
    name: 'FlowCompendium',
    tagline: 'Browse 191 flow protocols.',
    summary: 'The full library of flow techniques, concepts, and mechanics',
    description: 'Every technique, concept, and quality in the FourFlow framework — organized, searchable, and linkable to your profile. 62 quality mechanics, 85 actionable techniques, 44 scientific concepts. The Compendium is the reference layer behind everything else.',
    fullDescription: `The complete FourFlow knowledge base — 191 cards across three types:

**Qualities** (62) — the named conditions that compose each Flow Key. Each one has a Restore, Maintain, and Concentrate mode.

**Techniques** (85) — atomic, numbered protocols. Concrete enough to follow without reading the source. Each technique activates a specific quality.

**Concepts** (44) — the science and philosophy behind why each quality matters. Challenge-Skill Ratio, Window of Tolerance, Transient Hypofrontality, and more.

Use spaced repetition to build fluency, or browse the Signal Grid to see your mastery at a glance.`,
    icon: '/assets/LOGOS/OPEN MIND.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/me?tool=compendium',
    labToolId: 'compendium',
    features: [
      { title: 'Signal Grid', description: 'Visual map of all 191 cards with mastery dots and enrichment intensity.' },
      { title: 'Spaced Repetition', description: 'SM-2 algorithm surfaces the right cards at the right time.' },
      { title: 'Three Card Types', description: 'Qualities, Techniques, and Concepts — each with a distinct role.' },
      { title: 'Pillar Filtering', description: 'Browse by SELF, SPACE, STORY, or SPIRIT to target specific areas.' },
    ],
    gradient: 'from-[#5B84B1] to-[#4E8C73]',
    accentColor: '#5B84B1',
    relatedPillars: ['self', 'space', 'story', 'spirit'],
    inDevelopment: false,
    what: 'The full FourFlow knowledge library — 191 techniques, concepts, and quality mechanics with spaced repetition.',
  },
  'flowbreath': {
    id: 'flowbreath',
    name: 'FlowBreath',
    tagline: 'Shift state — body first.',
    summary: 'Breathwork patterns to transition into focused presence',
    description: 'State change starts in the body. FlowBreath guides you through breathwork patterns that physiologically shift your nervous system — from scattered to settled, from anxious to alert. Use it before a session, during the Struggle Phase, or whenever the signal drops.',
    fullDescription: `The fastest path to a different state is through the breath. FlowBreath provides guided breathwork patterns grounded in physiology:

Box breathing for balanced calm. Physiological sighs for rapid nervous system reset. 4-7-8 for deep parasympathetic activation.

Each pattern is designed for a specific entry point — pre-session, mid-session, or recovery. The body settles first; focus follows.`,
    icon: '/assets/LOGOS/FOCUSED BODY.png',
    screenshots: [],
    platforms: ['web'],
    webUrl: '/me?tool=breathwork',
    labToolId: 'breathwork',
    features: [
      { title: 'Multiple Patterns', description: 'Box breathing, physiological sigh, 4-7-8, and more.' },
      { title: 'Visual Guidance', description: 'Animated breath cues so you can follow without reading.' },
      { title: 'Session Integration', description: 'Accessible directly inside FlowZone during the Struggle Phase.' },
      { title: 'State Targeting', description: 'Choose by desired state: calm, alert, or reset.' },
    ],
    gradient: 'from-[#FF6F61] to-[#7A4DA4]',
    accentColor: '#FF6F61',
    relatedPillars: ['self'],
    inDevelopment: false,
    what: 'Guided breathwork patterns for rapid nervous system state shifts — pre-session, mid-session, or recovery.',
  },
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
    webUrl: '/me?tool=curiosity',
    labToolId: 'curiosity',
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
    gradient: 'from-[#6330A0] to-[#3E6FA3]',
    accentColor: '#6330A0',
    relatedPillars: ['spirit'],
    inDevelopment: false,
    what: 'A guided input tool that visualizes the overlaps between your curiosities.',
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
    webUrl: '/me?tool=flowzone',
    labToolId: 'flowzone',
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
    gradient: 'from-[#E84535] to-[#6330A0]',
    accentColor: '#E84535',
    relatedPillars: ['self', 'space'],
    version: '1.0',
    inDevelopment: false,
    what: 'A browser-based focus timer with session logging, rep counting, and breathwork.',
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
    gradient: 'from-[#4E8C73] to-[#3E6FA3]',
    accentColor: '#4E8C73',
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
    webUrl: '/me?tool=flowread',
    labToolId: 'flowread',
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
    gradient: 'from-[#4E8C73] to-[#3E6FA3]',
    accentColor: '#4E8C73',
    relatedPillars: ['self', 'space'],
    inDevelopment: false,
    what: 'A web-based speed reading trainer — word-chunking and adjustable speed drills to train focus and information velocity.',
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
    gradient: 'from-[#E84535] to-[#3E6FA3]',
    accentColor: '#E84535',
    relatedPillars: ['self'],
    version: '1.0',
    inDevelopment: false,
    what: 'An iOS app for logging bodyweight reps throughout the day with daily targets and streaks.',
  },
};

export const getApp = (id: string): App | undefined => APPS[id];

export const getAllApps = (): App[] => Object.values(APPS);

export const getAppsByPlatform = (platform: 'ios' | 'web'): App[] =>
  Object.values(APPS).filter(app => app.platforms.includes(platform));
