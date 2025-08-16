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
    content: { learn: [], practice: [] }
  },
  'open-mind': {
    id: 'open-mind',
    name: 'Open Mind',
    dimension: 'self',
    description: 'Cognitive flexibility and growth mindset',
    icon: '/assets/LOGOS/OPEN MIND.png',
    content: { learn: [], practice: [] }
  },
  'focused-body': {
    id: 'focused-body',
    name: 'Focused Body',
    dimension: 'self',
    description: 'Deep embodiment and physical optimization',
    icon: '/assets/LOGOS/FOCUSED BODY.png',
    content: { learn: [], practice: [] }
  },
  
  // Space Keys
  'intentional-space': {
    id: 'intentional-space',
    name: 'Intentional Space',
    dimension: 'space',
    description: 'Curated environments that support flow',
    icon: '/assets/LOGOS/INTENTIONAL SPACE.png',
    content: { learn: [], practice: [] }
  },
  'optimized-tools': {
    id: 'optimized-tools',
    name: 'Optimized Tools',
    dimension: 'space',
    description: 'Systems and technology that amplify productivity',
    icon: '/assets/LOGOS/OPTIMIZED TOOLS.png',
    content: { learn: [], practice: [] }
  },
  'feedback-systems': {
    id: 'feedback-systems',
    name: 'Feedback Systems',
    dimension: 'space',
    description: 'Loops that enable continuous improvement',
    icon: '/assets/LOGOS/FEEDBACK SYSTEMS.png',
    content: { learn: [], practice: [] }
  },
  
  // Story Keys
  'generative-story': {
    id: 'generative-story',
    name: 'Generative Story',
    dimension: 'story',
    description: 'Compelling narratives that drive action',
    icon: '/assets/LOGOS/GENERATIVE STORY.png',
    content: { learn: [], practice: [] }
  },
  'worthy-mission': {
    id: 'worthy-mission',
    name: 'Worthy Mission',
    dimension: 'story',
    description: 'Purpose-driven goals that inspire engagement',
    icon: '/assets/LOGOS/WORTHY MISSION.png',
    content: { learn: [], practice: [] }
  },
  'empowered-role': {
    id: 'empowered-role',
    name: 'Empowered Role',
    dimension: 'story',
    description: 'Clear identity and meaningful contribution',
    icon: '/assets/LOGOS/EMPOWERED ROLE.png',
    content: { learn: [], practice: [] }
  },
  
  // Spirit Keys
  'grounding-values': {
    id: 'grounding-values',
    name: 'Grounding Values',
    dimension: 'spirit',
    description: 'Core principles that guide decisions',
    icon: '/assets/LOGOS/GROUNDING VALUES.png',
    content: { learn: [], practice: [] }
  },
  'visualized-vision': {
    id: 'visualized-vision',
    name: 'Visualized Vision',
    dimension: 'spirit',
    description: 'Clear future states that attract success',
    icon: '/assets/LOGOS/VISUALIZED VISION.png',
    content: { learn: [], practice: [] }
  },
  'ignited-curiosity': {
    id: 'ignited-curiosity',
    name: 'Ignited Curiosity',
    dimension: 'spirit',
    description: 'Wonder and exploration that fuel growth',
    icon: '/assets/LOGOS/IGNITED CURIOSITY.png',
    content: { learn: [], practice: [] }
  }
};

// Populate dimension keys
DIMENSIONS.self.keys = [KEYS['tuned-emotions'], KEYS['open-mind'], KEYS['focused-body']];
DIMENSIONS.space.keys = [KEYS['intentional-space'], KEYS['optimized-tools'], KEYS['feedback-systems']];
DIMENSIONS.story.keys = [KEYS['generative-story'], KEYS['worthy-mission'], KEYS['empowered-role']];
DIMENSIONS.spirit.keys = [KEYS['grounding-values'], KEYS['visualized-vision'], KEYS['ignited-curiosity']];

export const MAIN_LOGO = '/assets/LOGOS/FOURFLOW - MAIN LOGO.png';
export const BG_CIRCLE = '/assets/LOGOS/MAIN LOGO - ELEMENTS/BG CIRCLE.png';