import { ContentItem } from '@/types/framework';

// This will be populated from the REFERENCES folder content
export const CONTENT_REPOSITORY: ContentItem[] = [
  // SELF - Tuned Emotions
  {
    id: 'tuned-emotions-learn-1',
    title: 'Understanding Emotional Intelligence in Flow',
    description: 'How emotions serve as your internal navigation system for optimal performance',
    content: `Emotions are not obstacles to flow—they are the very compass that guides us toward it. When we learn to tune into our emotional landscape with precision, we unlock a sophisticated guidance system that has been refined through millions of years of evolution.

Flow states emerge naturally when we align our emotional frequency with our current activity. This isn't about suppressing negative emotions or forcing positivity; it's about developing the sensitivity to read the subtle emotional signals that indicate whether we're moving toward or away from our optimal state.

The key is learning to distinguish between emotional reactions (which pull us out of flow) and emotional information (which guides us into flow). When we feel frustrated, it might signal that we need to adjust our approach. When we feel excited, it often indicates we're on the right track.`,
    tags: ['emotions', 'flow-states', 'self-awareness', 'performance'],
    type: 'learn',
    dimension: 'self',
    key: 'tuned-emotions'
  },
  {
    id: 'tuned-emotions-practice-1',
    title: 'The 3-Minute Emotional Check-In',
    description: 'A simple practice to tune into your emotional guidance system',
    content: `**The Practice:**

1. **Pause and Breathe** (30 seconds)
   - Take three deep breaths
   - Notice where you feel tension or ease in your body

2. **Emotional Scan** (90 seconds)
   - What emotion is most present right now?
   - Rate its intensity from 1-10
   - Ask: "What is this emotion trying to tell me?"

3. **Flow Alignment** (60 seconds)
   - Does this emotional state support your current activity?
   - If not, what small adjustment could you make?
   - Set an intention for the next 25 minutes

**When to Practice:**
- Before starting any focused work session
- When you notice resistance or frustration
- During natural transition points in your day

This practice builds emotional granularity—the ability to distinguish between subtle emotional states that either support or hinder flow.`,
    tags: ['practice', 'emotional-awareness', 'flow-preparation', 'mindfulness'],
    type: 'practice',
    dimension: 'self',
    key: 'tuned-emotions'
  },

  // SELF - Open Mind
  {
    id: 'open-mind-learn-1',
    title: 'The Neuroscience of Cognitive Flexibility',
    description: 'How mental rigidity blocks flow and flexibility enables it',
    content: `Cognitive flexibility—the mental ability to switch between different concepts or adapt thinking to new, changing, or unexpected circumstances—is perhaps the most crucial cognitive skill for maintaining flow states.

Neuroscience research shows that flow states are characterized by a temporary downregulation of the prefrontal cortex (transient hypofrontality), which typically houses our inner critic and rigid thinking patterns. This neurological shift allows for more flexible, creative, and intuitive thinking.

However, this flexibility must be cultivated intentionally. Our brains naturally develop cognitive shortcuts (heuristics) and thinking patterns that, while efficient, can become mental prisons. An open mind is one that can:

- Question its own assumptions
- Hold multiple perspectives simultaneously
- Adapt strategies based on real-time feedback
- Embrace uncertainty as information rather than threat

The cultivation of cognitive flexibility is like physical flexibility—it requires consistent practice and gradual expansion of our comfort zone.`,
    tags: ['neuroscience', 'cognitive-flexibility', 'mental-models', 'adaptability'],
    type: 'learn',
    dimension: 'self',
    key: 'open-mind'
  },

  // SPACE - Intentional Space
  {
    id: 'intentional-space-learn-1',
    title: 'Environmental Psychology and Flow States',
    description: 'How your physical environment shapes your mental state and performance',
    content: `Your environment is not neutral—it is actively shaping your thoughts, emotions, and capacity for flow. Environmental psychology research reveals that physical spaces can either amplify or diminish our cognitive resources.

Flow-conducive environments share several key characteristics:

**Minimal Cognitive Load:** Cluttered, noisy, or chaotic environments force your brain to constantly filter distractions, depleting the mental resources needed for deep focus.

**Optimal Arousal:** The environment should match the energy level of your intended activity. High-energy tasks benefit from dynamic environments, while contemplative work requires calm, stable spaces.

**Personal Resonance:** Spaces that reflect your values and aesthetic preferences create a sense of psychological safety and belonging, which is essential for the vulnerability required in flow states.

**Functional Efficiency:** Everything you need should be easily accessible, and everything you don't need should be removed or hidden.

The goal is not to create a perfect space, but to create an intentional one—a space that has been consciously designed to support your specific type of flow work.`,
    tags: ['environment', 'psychology', 'space-design', 'cognitive-load'],
    type: 'learn',
    dimension: 'space',
    key: 'intentional-space'
  },

  // STORY - Generative Story
  {
    id: 'generative-story-learn-1',
    title: 'The Power of Personal Narrative in Flow',
    description: 'How the stories we tell ourselves shape our capacity for optimal performance',
    content: `The stories we tell ourselves about who we are, what we're capable of, and why our work matters have profound effects on our ability to access flow states. These narratives either expand or contract our sense of possibility.

A generative story is one that:

**Emphasizes Growth:** Frames challenges as opportunities for development rather than threats to self-image
**Connects to Purpose:** Links daily actions to larger meaning and contribution
**Acknowledges Agency:** Reinforces your ability to influence outcomes through choices and effort
**Embraces Complexity:** Holds space for both struggle and success as natural parts of the journey

Research in narrative psychology shows that people who construct coherent, empowering stories about their lives show greater resilience, creativity, and life satisfaction. In the context of flow, these stories become the foundation for the kind of intrinsic motivation that sustains deep engagement.

The key insight is that you are both the author and the protagonist of your story. When you consciously craft narratives that support your growth and contribution, you create psychological conditions that make flow more accessible.`,
    tags: ['narrative', 'identity', 'meaning-making', 'psychology'],
    type: 'learn',
    dimension: 'story',
    key: 'generative-story'
  },

  // SPIRIT - Grounding Values
  {
    id: 'grounding-values-learn-1',
    title: 'Values as Flow Activators',
    description: 'How authentic values alignment creates effortless engagement',
    content: `Values are not abstract ideals—they are practical tools for creating flow. When our actions align with our deepest values, we experience a natural form of motivation that requires no willpower to sustain.

True values (as opposed to adopted or inherited values) have several characteristics:

**Energizing:** They generate natural enthusiasm and engagement
**Integrative:** They connect different aspects of your life into a coherent whole
**Directional:** They provide clear criteria for decision-making
**Sustainable:** They can be pursued indefinitely without burnout

Flow researcher Mihaly Csikszentmihalyi found that people who organize their lives around clear values experience more frequent flow states. This is because values provide the intrinsic motivation that is essential for deep engagement.

The challenge is distinguishing between authentic values (what actually energizes you) and constructed values (what you think should energize you). This requires honest self-reflection and often involves releasing values that were imposed by family, culture, or circumstances rather than chosen consciously.

When you operate from grounded values, work becomes a form of self-expression rather than self-denial.`,
    tags: ['values', 'motivation', 'authenticity', 'self-expression'],
    type: 'learn',
    dimension: 'spirit',
    key: 'grounding-values'
  }
];

// Content filtering functions
export function getContentByDimension(dimension: string) {
  return CONTENT_REPOSITORY.filter(item => item.dimension === dimension);
}

export function getContentByKey(key: string) {
  return CONTENT_REPOSITORY.filter(item => item.key === key);
}

export function getContentByType(type: 'learn' | 'practice') {
  return CONTENT_REPOSITORY.filter(item => item.type === type);
}

export function getContentByDimensionAndKey(dimension: string, key: string) {
  return CONTENT_REPOSITORY.filter(item => 
    item.dimension === dimension && item.key === key
  );
}

export function getLearnContent(dimension: string, key: string) {
  return CONTENT_REPOSITORY.filter(item => 
    item.dimension === dimension && 
    item.key === key && 
    item.type === 'learn'
  );
}

export function getPracticeContent(dimension: string, key: string) {
  return CONTENT_REPOSITORY.filter(item => 
    item.dimension === dimension && 
    item.key === key && 
    item.type === 'practice'
  );
}