import { ContentItem } from '@/types/framework';

// Database configuration (for future use)
// const DATABASE_CONFIG = {
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '3306'),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'fourflow_content'
// };

// Mock database implementation for development
// Replace with actual database connection (MySQL, PostgreSQL, etc.)
class MockDatabase {
  private static instance: MockDatabase;
  private data: ContentItem[] = [];

  private constructor() {
    // Initialize with current hardcoded content
    this.initializeData();
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private initializeData() {
    // This will be replaced with actual database queries
    // For now, we'll use the existing content structure
    this.data = [
      {
        id: 'tuned-emotions-definitive-learn',
        title: 'Tuned Emotions: The Definitive Guide to Emotional Flow Navigation',
        description: 'Master the art of using emotions as a sophisticated navigation system for optimal performance and sustained flow states',
        content: `# Tuned Emotions: The Definitive Guide to Emotional Flow Navigation

## Hook & Opening Context

Have you ever noticed how some days your work flows effortlessly—every action seamlessly connecting to the next—while other days, the exact same tasks feel frustrating, overwhelming, or mind-numbingly dull? You might find yourself oscillating between anxious rushing and restless boredom, never quite hitting that sweet spot of engaged focus.

Here's what most people don't realize: these emotional fluctuations aren't random disruptions to your productivity—they're precise navigation signals guiding you toward your optimal performance zone. Your emotions are constantly broadcasting real-time information about whether you're moving toward or away from flow state, but most of us have never learned to decode these signals.

The difference between peak performers and everyone else isn't emotional suppression or forced positivity. It's emotional tuning—the ability to read, interpret, and respond to your emotional guidance system with the precision of a skilled navigator reading weather patterns. When you master this skill, emotions transform from obstacles into allies, becoming the very compass that guides you into sustained flow states.

## Core Concept: Emotions as Flow Navigation

**Tuned Emotions** represent the practice of using your emotional landscape as a real-time guidance system for optimal performance. Rather than viewing emotions as problems to solve or barriers to overcome, tuned emotions treats them as sophisticated information—your internal GPS continuously recalibrating to keep you in the flow channel.

At its core, this concept recognizes that **emotions are data, not dictators**. They provide critical feedback about the relationship between your current challenge level and skill capacity, signaling when you need to adjust either the difficulty of your task or your approach to it.

**The Flow Channel Connection**: Mihaly Csikszentmihalyi's research identifies the narrow band where challenge and skill are optimally matched—approximately 4% outside your comfort zone. Your emotions are the early warning system that alerts you when you're drifting too far into anxiety (challenge too high) or boredom (challenge too low). Tuned emotions is the practice of reading these signals with precision and responding with skillful adjustments.

## The Four-Stage Emotional Flow Navigation System

### Stage 1: Emotional Awareness and Recognition (2 minutes)

**The Emotional Weather Check**: Begin any focused work session with a brief emotional scan.

1. **Physical Scan**: Notice where you feel tension, ease, energy, or depletion in your body
2. **Emotional Labeling**: Name the primary emotion present without judgment (frustrated, excited, anxious, calm)
3. **Intensity Gauge**: Rate the emotional intensity from 1-10
4. **Message Inquiry**: Ask, "What is this emotion trying to tell me about my current challenge-skill balance?"

### Stage 2: Challenge-Skill Calibration (3 minutes)

**The 4% Rule in Practice**: Use emotional feedback to adjust your challenge-skill ratio toward the optimal zone.

**If Experiencing Anxiety/Overwhelm** (challenge too high):
- **Reduce Scope**: Break the task into smaller, manageable components
- **Increase Resources**: Gather additional tools, information, or support
- **Lower Stakes**: Reframe the activity as practice rather than performance

**If Experiencing Boredom/Restlessness** (challenge too low):
- **Add Complexity**: Introduce constraints, deadlines, or quality standards
- **Gamify**: Create competition, tracking, or reward systems
- **Expand Scope**: Connect the task to larger objectives

### Stage 3: Emotional Alchemy and Reframing (2 minutes)

**Transform Disruptive Emotions into Flow Catalysts**:

**Anxiety → Excitement**: 
- Acknowledge: "I notice high arousal in my system"
- Reframe: "This energy means something important is happening"
- Anchor: Repeat "I am excited about this challenge" while feeling the physical sensation

**Frustration → Curiosity**: 
- Recognize: "I'm hitting resistance"
- Reframe: "This resistance points to an edge I can explore"
- Engage: Approach the obstacle as an interesting puzzle to solve

### Stage 4: Sustaining Emotional Flow (Ongoing)

**Real-Time Emotional Monitoring**: Throughout your work session, maintain peripheral awareness of your emotional state:

- **Micro Check-ins**: Every 15-20 minutes, briefly notice your emotional frequency
- **Course Correction**: Adjust challenge, environment, or approach based on emotional feedback
- **Flow Amplification**: When you notice positive emotional flow, consciously appreciate and anchor the state

## Integration: Building Your Emotional Flow Practice

### 24-Hour Integration Action Steps

1. **Morning Emotional Intention**: Set an emotional intention for your most important task of the day
2. **Midday Emotional Check**: Practice one complete cycle of the four-stage navigation system
3. **Evening Emotional Review**: Reflect on how emotional awareness influenced your performance and satisfaction

The ultimate goal is not emotional perfection but emotional partnership—a collaborative relationship with your internal guidance system that consistently points you toward your highest engagement, deepest satisfaction, and most authentic expression.`,
        tags: ['emotions', 'flow-navigation', 'challenge-skills-balance', 'emotional-intelligence', 'neuroscience', 'self-awareness', 'definitive'],
        type: 'learn' as const,
        dimension: 'self' as const,
        key: 'tuned-emotions' as const,
        // Extended fields for pinned content
        is_pinned: true,
        pin_order: 1,
        difficulty: 'Beginner' as const,
        read_time: 12,
        scientific_backing: true
      }
    ];
  }

  async query(sql: string, params?: unknown[]): Promise<ContentItem[]> {
    // Mock implementation - replace with actual database query
    console.log('Mock DB Query:', sql, params);
    return this.data;
  }

  async getContentRepository(): Promise<ContentItem[]> {
    return this.data.sort((a, b) => {
      // Sort pinned content first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      if (a.is_pinned && b.is_pinned) {
        return (a.pin_order || 0) - (b.pin_order || 0);
      }
      return 0;
    });
  }

  async getContentByDimensionAndKey(dimension: string, key: string): Promise<ContentItem[]> {
    return this.data
      .filter(item => item.dimension === dimension && item.key === key)
      .sort((a, b) => {
        // Sort pinned content first
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        if (a.is_pinned && b.is_pinned) {
          return (a.pin_order || 0) - (b.pin_order || 0);
        }
        return 0;
      });
  }

  async getLearnContentWithPinned(dimension: string, key: string): Promise<ContentItem[]> {
    return this.data
      .filter(item => 
        item.dimension === dimension && 
        item.key === key && 
        item.type === 'learn'
      )
      .sort((a, b) => {
        // Pinned content first
        const aPinned = a.is_pinned;
        const bPinned = b.is_pinned;
        
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        if (aPinned && bPinned) {
          return (a.pin_order || 0) - (b.pin_order || 0);
        }
        return 0;
      });
  }

  async getPracticeContentWithPinned(dimension: string, key: string): Promise<ContentItem[]> {
    return this.data
      .filter(item => 
        item.dimension === dimension && 
        item.key === key && 
        item.type === 'practice'
      )
      .sort((a, b) => {
        // Pinned content first
        const aPinned = a.is_pinned;
        const bPinned = b.is_pinned;
        
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        if (aPinned && bPinned) {
          return (a.pin_order || 0) - (b.pin_order || 0);
        }
        return 0;
      });
  }

  async insertContent(content: Partial<ContentItem>): Promise<string> {
    const newContent: ContentItem = {
      id: content.id || `${content.key}-${content.type}-${Date.now()}`,
      title: content.title || '',
      description: content.description || '',
      content: content.content || '',
      tags: content.tags || [],
      type: content.type || 'learn',
      dimension: content.dimension || 'self',
      key: content.key || 'tuned-emotions',
      ...content
    };
    
    this.data.push(newContent);
    return newContent.id;
  }
}

// Export database functions
const db = MockDatabase.getInstance();

export async function getContentRepository(): Promise<ContentItem[]> {
  return await db.getContentRepository();
}

export async function getContentByDimensionAndKey(
  dimension: string, 
  key: string
): Promise<ContentItem[]> {
  return await db.getContentByDimensionAndKey(dimension, key);
}

export async function getLearnContent(dimension: string, key: string): Promise<ContentItem[]> {
  return await db.getLearnContentWithPinned(dimension, key);
}

export async function getPracticeContent(dimension: string, key: string): Promise<ContentItem[]> {
  return await db.getPracticeContentWithPinned(dimension, key);
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const allContent = await db.getContentRepository();
  return allContent.find(item => item.id === id) || null;
}

export async function insertContent(content: Partial<ContentItem>): Promise<string> {
  return await db.insertContent(content);
}

// For development - log database operations
if (process.env.NODE_ENV === 'development') {
  console.log('🗄️ FourFlow Database initialized (Mock Mode)');
}