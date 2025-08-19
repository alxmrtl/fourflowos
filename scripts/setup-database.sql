-- FourFlow Content Database Schema
-- Compatible with existing webapp structure

CREATE TABLE IF NOT EXISTS fourflow_content (
  -- Core fields (matches existing ContentItem interface)
  id VARCHAR(100) PRIMARY KEY, -- matches existing string IDs like 'tuned-emotions-learn-1'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL, -- matches existing ContentItem.description
  content TEXT NOT NULL, -- matches existing ContentItem.content (markdown)
  
  -- Framework fields (matches existing structure)  
  type ENUM('learn', 'practice') NOT NULL, -- matches existing ContentItem.type
  dimension ENUM('self', 'space', 'story', 'spirit') NOT NULL, -- matches DimensionType
  key_id VARCHAR(100) NOT NULL, -- matches KeyType (e.g., 'tuned-emotions', 'open-mind')
  tags JSON, -- matches existing ContentItem.tags array
  
  -- Extended fields for content repository
  short_title VARCHAR(100), -- For navigation/display
  slug VARCHAR(255) UNIQUE, -- URL-friendly identifier (auto-generated from id)
  excerpt TEXT, -- Brief summary for previews
  
  -- Enhanced metadata
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
  estimated_duration INTEGER, -- in minutes
  read_time INTEGER, -- estimated reading time in minutes
  materials_needed JSON, -- Array of required materials (for practices)
  scientific_backing BOOLEAN DEFAULT false,
  
  -- Content relationships & enhancement
  prerequisite_content JSON, -- array of content IDs
  related_content JSON, -- array of related content IDs
  flow_triggers JSON, -- array of flow trigger types
  target_outcomes JSON, -- expected outcomes/benefits
  
  -- Pinned content functionality
  is_pinned BOOLEAN DEFAULT false, -- Pin to top of key page
  pin_order INTEGER DEFAULT 0, -- Order for multiple pinned items
  
  -- Repository management
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_date TIMESTAMP,
  status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'published',
  
  -- SEO & Discovery
  meta_description TEXT,
  keywords JSON, -- searchable keywords
  
  -- Indexes for performance
  INDEX idx_type (type),
  INDEX idx_dimension (dimension),
  INDEX idx_key_id (key_id),
  INDEX idx_dimension_key (dimension, key_id),
  INDEX idx_status (status),
  INDEX idx_pinned (is_pinned, pin_order),
  FULLTEXT INDEX ft_content (title, description)
);

-- Insert the definitive Tuned Emotions content
INSERT INTO fourflow_content (
  id,
  title,
  description,
  content,
  type,
  dimension,
  key_id,
  tags,
  short_title,
  slug,
  excerpt,
  difficulty,
  read_time,
  estimated_duration,
  scientific_backing,
  flow_triggers,
  target_outcomes,
  is_pinned,
  -- pinned_type removed with LEARN/PRACTICE merge,
  pin_order,
  meta_description,
  keywords
) VALUES (
  'tuned-emotions-definitive-learn',
  'Tuned Emotions: The Definitive Guide to Emotional Flow Navigation',
  'Master the art of using emotions as a sophisticated navigation system for optimal performance and sustained flow states',
  '# Tuned Emotions: The Definitive Guide to Emotional Flow Navigation

## Hook & Opening Context

Have you ever noticed how some days your work flows effortlessly—every action seamlessly connecting to the next—while other days, the exact same tasks feel frustrating, overwhelming, or mind-numbingly dull? You might find yourself oscillating between anxious rushing and restless boredom, never quite hitting that sweet spot of engaged focus.

Here''s what most people don''t realize: these emotional fluctuations aren''t random disruptions to your productivity—they''re precise navigation signals guiding you toward your optimal performance zone. Your emotions are constantly broadcasting real-time information about whether you''re moving toward or away from flow state, but most of us have never learned to decode these signals.

The difference between peak performers and everyone else isn''t emotional suppression or forced positivity. It''s emotional tuning—the ability to read, interpret, and respond to your emotional guidance system with the precision of a skilled navigator reading weather patterns. When you master this skill, emotions transform from obstacles into allies, becoming the very compass that guides you into sustained flow states.

## Core Concept: Emotions as Flow Navigation

**Tuned Emotions** represent the practice of using your emotional landscape as a real-time guidance system for optimal performance. Rather than viewing emotions as problems to solve or barriers to overcome, tuned emotions treats them as sophisticated information—your internal GPS continuously recalibrating to keep you in the flow channel.

At its core, this concept recognizes that **emotions are data, not dictators**. They provide critical feedback about the relationship between your current challenge level and skill capacity, signaling when you need to adjust either the difficulty of your task or your approach to it.

**The Flow Channel Connection**: Mihaly Csikszentmihalyi''s research identifies the narrow band where challenge and skill are optimally matched—approximately 4% outside your comfort zone. Your emotions are the early warning system that alerts you when you''re drifting too far into anxiety (challenge too high) or boredom (challenge too low). Tuned emotions is the practice of reading these signals with precision and responding with skillful adjustments.

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
- Recognize: "I''m hitting resistance"
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

The ultimate goal is not emotional perfection but emotional partnership—a collaborative relationship with your internal guidance system that consistently points you toward your highest engagement, deepest satisfaction, and most authentic expression.',
  'learn',
  'self',
  'tuned-emotions',
  JSON_ARRAY('emotions', 'flow-navigation', 'challenge-skills-balance', 'emotional-intelligence', 'neuroscience', 'self-awareness', 'definitive'),
  'Tuned Emotions: Definitive Guide',
  'tuned-emotions-definitive-guide-learn',
  'Master the art of using emotions as a sophisticated navigation system for optimal performance and sustained flow states',
  'Beginner',
  12,
  12,
  true,
  JSON_ARRAY('challenge-skills-balance', 'emotional-regulation', 'present-moment-awareness', 'intrinsic-motivation'),
  JSON_ARRAY('Accurate emotional recognition and labeling', 'Ability to read challenge-skill balance through emotions', 'Skill in transforming disruptive emotions into flow catalysts', 'Real-time emotional flow monitoring', 'Enhanced access to sustained flow states'),
  true,
  'learn',
  1,
  'Learn to use emotions as a sophisticated navigation system for flow states. Master the definitive guide to emotional flow navigation in the FourFlow framework.',
  JSON_ARRAY('tuned emotions', 'emotional flow navigation', 'challenge skills balance', 'flow state emotions', 'emotional intelligence', 'performance optimization', 'Csikszentmihalyi', 'transient hypofrontality', 'emotional granularity', 'FourFlow SELF')
);

-- Create content_tags table for future use
CREATE TABLE IF NOT EXISTS content_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(50) UNIQUE NOT NULL,
  tag_category ENUM('method', 'outcome', 'theme', 'skill') NOT NULL,
  description TEXT,
  color_hex VARCHAR(7), -- for UI display
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some basic tags
INSERT INTO content_tags (tag_name, tag_category, description, color_hex) VALUES
('emotions', 'theme', 'Content related to emotional intelligence and regulation', '#FF6B6B'),
('flow-navigation', 'method', 'Techniques for using signals to guide flow state access', '#4ECDC4'),
('challenge-skills-balance', 'method', 'Strategies for optimal difficulty calibration', '#45B7D1'),
('emotional-intelligence', 'skill', 'Ability to recognize and work with emotional information', '#96CEB4'),
('neuroscience', 'theme', 'Scientific research on brain function and optimization', '#FFEAA7'),
('self-awareness', 'skill', 'Capacity for recognizing internal states and patterns', '#DDA0DD'),
('definitive', 'category', 'Comprehensive foundational content for each key', '#FFD93D');