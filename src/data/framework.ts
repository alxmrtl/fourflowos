import { Dimension, Key, DimensionType, KeyType } from '@/types/framework';

export const DIMENSIONS: Record<DimensionType, Dimension> = {
  self: {
    id: 'self',
    name: 'SELF',
    color: '#FF6F61',
    description: 'Tuning your inner compass for flow navigation',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
    sectionLogo: '/assets/LOGOS/SELF - Section Logo.png',
    keys: []
  },
  space: {
    id: 'space',
    name: 'SPACE',
    color: '#6BA292',
    description: 'Creating environments that amplify your potential',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
    sectionLogo: '/assets/LOGOS/SPACE - Section Logo.png',
    keys: []
  },
  story: {
    id: 'story',
    name: 'STORY',
    color: '#5B84B1',
    description: 'Crafting narratives that drive meaningful action',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
    sectionLogo: '/assets/LOGOS/STORY - Section Logo.png',
    keys: []
  },
  spirit: {
    id: 'spirit',
    name: 'SPIRIT',
    color: '#7A4DA4',
    description: 'Aligning with your deepest values and vision',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPIRIT - Circle.png',
    sectionLogo: '/assets/LOGOS/SPIRIT - Section Logo.png',
    keys: []
  }
};

export const KEYS: Record<KeyType, Key> = {
  // Self Keys
  'tuned-emotions': {
    id: 'tuned-emotions',
    name: 'Tuned Emotions',
    dimension: 'self',
    description: 'Using emotions as a compass for flow navigation',
    icon: '/assets/LOGOS/TUNED EMOTIONS.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Your emotions are a real-time dashboard showing whether you\'re in flow, approaching it, or drifting away.',
    flowConnection: 'Flow lives in the channel between boredom and anxiety—tuned emotions let you navigate there.',
    withoutThis: 'You\'ll burn out chasing intensity or stall out in apathy, never finding the sweet spot.'
  },
  'open-mind': {
    id: 'open-mind',
    name: 'Open Mind',
    dimension: 'self',
    description: 'Cognitive flexibility and growth mindset',
    icon: '/assets/LOGOS/OPEN MIND.png',
    content: { learn: [], practice: [] },
    coreInsight: 'A cluttered mind is a closed door to flow—mental flexibility creates space for insight and adaptation.',
    flowConnection: 'Flow requires releasing fixed patterns so new solutions can emerge moment-to-moment.',
    withoutThis: 'You\'ll get stuck in loops, miss obvious solutions, and fight reality instead of flowing with it.'
  },
  'focused-body': {
    id: 'focused-body',
    name: 'Focused Body',
    dimension: 'self',
    description: 'Deep embodiment and physical optimization',
    icon: '/assets/LOGOS/FOCUSED BODY.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Your body is your anchor to the present moment—when you\'re in your body, you can\'t be lost in worry or distraction.',
    flowConnection: 'Flow is an embodied state—physical presence pulls you out of mental noise and into direct experience.',
    withoutThis: 'You\'ll overthink, disconnect from intuition, and exhaust yourself in your head while your body goes numb.'
  },
  
  // Space Keys
  'intentional-space': {
    id: 'intentional-space',
    name: 'Intentional Space',
    dimension: 'space',
    description: 'Curated environments that support flow',
    icon: '/assets/LOGOS/INTENTIONAL SPACE.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Your environment is either pulling you toward flow or pushing you away—there is no neutral.',
    flowConnection: 'The right space eliminates friction and decision fatigue, letting you drop into focus automatically.',
    withoutThis: 'You\'ll waste willpower fighting your surroundings instead of using it for the work itself.'
  },
  'optimized-tools': {
    id: 'optimized-tools',
    name: 'Optimized Tools',
    dimension: 'space',
    description: 'Systems and technology that amplify productivity',
    icon: '/assets/LOGOS/OPTIMIZED TOOLS.png',
    content: { learn: [], practice: [] },
    coreInsight: 'The right tools disappear—they extend your capability without demanding your attention.',
    flowConnection: 'Seamless tools remove the gap between intention and action, keeping you in unbroken focus.',
    withoutThis: 'You\'ll stumble over friction, break immersion constantly, and never build momentum.'
  },
  'feedback-systems': {
    id: 'feedback-systems',
    name: 'Feedback Systems',
    dimension: 'space',
    description: 'Loops that enable continuous improvement',
    icon: '/assets/LOGOS/FEEDBACK SYSTEMS.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Flow requires knowing how you\'re doing right now—not tomorrow, not next week.',
    flowConnection: 'Immediate feedback creates the tight action-response loop that flow states require.',
    withoutThis: 'You\'ll work in the dark, lose motivation, and miss the chance to course-correct before it\'s too late.'
  },
  
  // Story Keys
  'generative-story': {
    id: 'generative-story',
    name: 'Generative Story',
    dimension: 'story',
    description: 'Compelling narratives that drive action',
    icon: '/assets/LOGOS/GENERATIVE STORY.png',
    content: { learn: [], practice: [] },
    coreInsight: 'The story you tell about your work determines whether challenges feel like obstacles or adventures.',
    flowConnection: 'A compelling narrative transforms effort into meaning, making struggle feel purposeful rather than pointless.',
    withoutThis: 'Setbacks will drain you instead of fuel you, and difficulty will feel like punishment.'
  },
  'clear-mission': {
    id: 'clear-mission',
    name: 'Clear Mission',
    dimension: 'story',
    description: 'Goal hierarchy from vision to daily action',
    icon: '/assets/LOGOS/CLEAR MISSION.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Clarity creates momentum—when you know exactly what to do next, action becomes effortless.',
    flowConnection: 'A clear mission hierarchy connects today\'s task to your larger vision, making each action feel purposeful.',
    withoutThis: 'You\'ll drift between tasks without direction, unsure if your effort is moving you forward.'
  },
  'empowered-role': {
    id: 'empowered-role',
    name: 'Empowered Role',
    dimension: 'story',
    description: 'Clear identity and meaningful contribution',
    icon: '/assets/LOGOS/EMPOWERED ROLE.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Knowing exactly what you own and why it matters turns scattered effort into directed power.',
    flowConnection: 'A clear role creates autonomy and mastery—two core conditions for flow states.',
    withoutThis: 'You\'ll feel like a cog, uncertain of your contribution, working hard without ownership.'
  },
  
  // Spirit Keys
  'grounding-values': {
    id: 'grounding-values',
    name: 'Grounding Values',
    dimension: 'spirit',
    description: 'Core principles that guide decisions',
    icon: '/assets/LOGOS/GROUNDING VALUES.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Values are decision-making shortcuts—when you know what you stand for, choices become obvious.',
    flowConnection: 'Aligned values eliminate internal conflict, freeing energy for full engagement.',
    withoutThis: 'You\'ll second-guess constantly, feel pulled in multiple directions, and act against yourself.'
  },
  'visualized-vision': {
    id: 'visualized-vision',
    name: 'Visualized Vision',
    dimension: 'spirit',
    description: 'Clear future states that attract success',
    icon: '/assets/LOGOS/VISUALIZED VISION.png',
    content: { learn: [], practice: [] },
    coreInsight: 'A clear vision acts like a magnet—it organizes your attention and reveals relevant opportunities.',
    flowConnection: 'Vision provides direction that makes each action feel like progress, sustaining flow over time.',
    withoutThis: 'You\'ll drift without direction, react to circumstances, and lose the thread of your life.'
  },
  'ignited-curiosity': {
    id: 'ignited-curiosity',
    name: 'Ignited Curiosity',
    dimension: 'spirit',
    description: 'Wonder and exploration that fuel growth',
    icon: '/assets/LOGOS/IGNITED CURIOSITY.png',
    content: { learn: [], practice: [] },
    coreInsight: 'Genuine interest is the most renewable fuel for focus—you can\'t force attention, but you can follow fascination.',
    flowConnection: 'Curiosity transforms work into play, making the exploration itself rewarding.',
    withoutThis: 'Everything becomes obligation, attention becomes effortful, and burnout becomes inevitable.'
  }
};

// Populate dimension keys
DIMENSIONS.self.keys = [KEYS['tuned-emotions'], KEYS['open-mind'], KEYS['focused-body']];
DIMENSIONS.space.keys = [KEYS['intentional-space'], KEYS['optimized-tools'], KEYS['feedback-systems']];
DIMENSIONS.story.keys = [KEYS['generative-story'], KEYS['clear-mission'], KEYS['empowered-role']];
DIMENSIONS.spirit.keys = [KEYS['grounding-values'], KEYS['visualized-vision'], KEYS['ignited-curiosity']];

export const MAIN_LOGO = '/assets/LOGOS/FOURFLOW - MAIN LOGO.png';
export const BG_CIRCLE = '/assets/LOGOS/MAIN LOGO - ELEMENTS/BG CIRCLE.png';

// Key Synergy Connections - How the 12 keys interplay across dimensions
export const KEY_SYNERGIES = [
  // Spirit ↔ Story
  { from: 'grounding-values', to: 'empowered-role', question: 'Does your role honor what you stand for?' },
  { from: 'visualized-vision', to: 'clear-mission', question: 'Is your vision broken down into a clear mission?' },
  { from: 'ignited-curiosity', to: 'generative-story', question: 'Is curiosity inspiring your story?' },

  // Story ↔ Self
  { from: 'clear-mission', to: 'tuned-emotions', question: 'Is your mission clarity bringing calm focus?' },
  { from: 'empowered-role', to: 'focused-body', question: 'Does ownership bring your body to attention?' },
  { from: 'generative-story', to: 'open-mind', question: 'Is your story opening your mind to possibilities?' },

  // Self ↔ Space
  { from: 'open-mind', to: 'optimized-tools', question: 'Is your mind supported by the right tools?' },
  { from: 'focused-body', to: 'intentional-space', question: 'Is your space allowing your body to perform?' },
  { from: 'tuned-emotions', to: 'feedback-systems', question: 'Are your emotions responding to progress signals?' },

  // Space ↔ Spirit
  { from: 'feedback-systems', to: 'visualized-vision', question: 'Is feedback sharpening your vision?' },
  { from: 'intentional-space', to: 'grounding-values', question: 'Does your space reflect your values?' },
  { from: 'optimized-tools', to: 'ignited-curiosity', question: 'Are your tools unlocking new curiosities?' },
] as const;