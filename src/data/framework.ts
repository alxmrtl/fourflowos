import { Dimension, Key, DimensionType, KeyType } from '@/types/framework';
import { CORAL, SAGE, STEEL, AMETHYST } from '@/styles/brand-colors';

// Audience-specific copy for dimensions
export const DIMENSION_AUDIENCE_COPY: Record<DimensionType, {
  individual: { tagline: string; description: string };
  leader: { tagline: string; description: string };
}> = {
  self: {
    individual: {
      tagline: 'How you feel right now',
      description: 'Tune into what your body, mind, and emotions are telling you. They\'re the compass that points toward flow.',
    },
    leader: {
      tagline: 'How your team feels',
      description: 'Understand the emotional and physical signals your team carries. Then design conditions where they naturally reach their best state.',
    },
  },
  space: {
    individual: {
      tagline: 'Where and how you work',
      description: 'Set up your world so focus happens naturally. The right space, systems, and tools make flow the path of least resistance.',
    },
    leader: {
      tagline: 'Where your team works',
      description: 'Your team\'s environment shapes their performance. Design spaces, systems, and tools where great work happens naturally.',
    },
  },
  story: {
    individual: {
      tagline: 'What you\'re building',
      description: 'Get clear on your mission, own your role, and see how it all connects across time.',
    },
    leader: {
      tagline: 'What your team is building',
      description: 'Build mission clarity and role ownership. Empowered teams generate their own momentum.',
    },
  },
  spirit: {
    individual: {
      tagline: 'Your deepest motivation',
      description: 'Know what you value, where you\'re headed, and what makes you curious. That alignment is where effortless energy lives.',
    },
    leader: {
      tagline: 'What drives your team',
      description: 'Root your team in shared values and real vision. Alignment replaces pressure with intrinsic drive.',
    },
  },
};

// Audience-specific copy for keys
export const KEY_AUDIENCE_COPY: Record<KeyType, {
  individual: { focus: string };
  leader: { focus: string };
}> = {
  // Self Keys
  'tuned-emotions': {
    individual: { focus: 'Use your feelings as signals to stay in the sweet spot between bored and overwhelmed.' },
    leader: { focus: 'Help team members recognize emotional signals and create conditions that keep them in their flow zone.' },
  },
  'open-mind': {
    individual: { focus: 'Clear mental clutter and stay flexible so new ideas can flow naturally.' },
    leader: { focus: 'Foster psychological safety where team members feel free to experiment and share ideas.' },
  },
  'focused-body': {
    individual: { focus: 'Get out of your head and into your body to stop overthinking and stay present.' },
    leader: { focus: 'Design work rhythms that honor physical needs - movement, rest, and embodied breaks.' },
  },
  // Space Keys
  'intentional-space': {
    individual: { focus: 'Set up your environment to automatically put you in focus mode without willpower.' },
    leader: { focus: 'Design physical and digital workspaces that eliminate distractions for your team.' },
  },
  'optimized-tools': {
    individual: { focus: 'Use the right systems and tech to get more done with less effort.' },
    leader: { focus: 'Equip your team with tools that extend their capability without demanding attention.' },
  },
  'feedback-systems': {
    individual: { focus: 'Build quick ways to know if you\'re on track and course-correct fast.' },
    leader: { focus: 'Create tight feedback loops so team members always know how they\'re doing.' },
  },
  // Story Keys
  'generative-story': {
    individual: { focus: 'Create a personal narrative that makes challenges feel like adventure, not problems.' },
    leader: { focus: 'Craft team narratives that transform obstacles into growth opportunities.' },
  },
  'clear-mission': {
    individual: { focus: 'Break your vision into clear goals from years to quarters to days.' },
    leader: { focus: 'Cascade clarity from company vision to team objectives to individual tasks.' },
  },
  'empowered-role': {
    individual: { focus: 'Know what you own and why it matters so you can work with real purpose.' },
    leader: { focus: 'Define roles clearly so each person knows their contribution and has autonomy to own it.' },
  },
  // Spirit Keys
  'grounding-values': {
    individual: { focus: 'Know what you stand for so decisions become obvious and doubt disappears.' },
    leader: { focus: 'Establish team values that guide decisions when you\'re not in the room.' },
  },
  'visualized-vision': {
    individual: { focus: 'See your future clearly so your brain starts noticing the right opportunities.' },
    leader: { focus: 'Paint a compelling picture of where the team is heading that pulls people forward.' },
  },
  'ignited-curiosity': {
    individual: { focus: 'Stay genuinely interested in your work so focus happens without forcing it.' },
    leader: { focus: 'Create space for exploration and learning that keeps engagement high.' },
  },
};

export const DIMENSIONS: Record<DimensionType, Dimension> = {
  self: {
    id: 'self',
    name: 'SELF',
    color: CORAL,
    description: 'Tuning your inner compass for flow navigation',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SELF - Frequencies.png',
    sectionLogo: '/assets/LOGOS/SELF - Section Logo.png',
    keys: []
  },
  space: {
    id: 'space',
    name: 'SPACE',
    color: SAGE,
    description: 'Creating environments that amplify your potential',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/SPACE - Sqaure.png',
    sectionLogo: '/assets/LOGOS/SPACE - Section Logo.png',
    keys: []
  },
  story: {
    id: 'story',
    name: 'STORY',
    color: STEEL,
    description: 'Crafting narratives that drive meaningful action',
    icon: '/assets/LOGOS/MAIN LOGO - ELEMENTS/STORY - Cross.png',
    sectionLogo: '/assets/LOGOS/STORY - Section Logo.png',
    keys: []
  },
  spirit: {
    id: 'spirit',
    name: 'SPIRIT',
    color: AMETHYST,
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
    withoutThis: 'You\'ll burn out chasing intensity or stall out in apathy, never finding the sweet spot.',
    layupStem: 'Your emotional sweet spot for flow is...',
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
    withoutThis: 'You\'ll get stuck in loops, miss obvious solutions, and fight reality instead of flowing with it.',
    layupStem: 'Your mind opens to flow by...',
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
    withoutThis: 'You\'ll overthink, disconnect from intuition, and exhaust yourself in your head while your body goes numb.',
    layupStem: 'Your body enters flow when...',
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
    withoutThis: 'You\'ll waste willpower fighting your surroundings instead of using it for the work itself.',
    layupStem: 'Your space unlocks flow through...',
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
    withoutThis: 'You\'ll stumble over friction, break immersion constantly, and never build momentum.',
    layupStem: 'Your tools serve flow by...',
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
    withoutThis: 'You\'ll work in the dark, lose motivation, and miss the chance to course-correct before it\'s too late.',
    layupStem: 'Your flow stays alive through...',
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
    withoutThis: 'Setbacks will drain you instead of fuel you, and difficulty will feel like punishment.',
    layupStem: 'Your story generates flow when...',
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
    withoutThis: 'You\'ll drift between tasks without direction, unsure if your effort is moving you forward.',
    layupStem: 'Your mission focuses flow on...',
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
    withoutThis: 'You\'ll feel like a cog, uncertain of your contribution, working hard without ownership.',
    layupStem: 'Your role powers flow through...',
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
    withoutThis: 'You\'ll second-guess constantly, feel pulled in multiple directions, and act against yourself.',
    layupStem: 'Your values anchor flow in...',
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
    withoutThis: 'You\'ll drift without direction, react to circumstances, and lose the thread of your life.',
    layupStem: 'Your vision draws flow toward...',
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
    withoutThis: 'Everything becomes obligation, attention becomes effortful, and burnout becomes inevitable.',
    layupStem: 'Your curiosity ignites flow through...',
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