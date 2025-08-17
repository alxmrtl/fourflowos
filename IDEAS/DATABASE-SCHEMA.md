# FourFlow Content Database Schema

## WEBAPP COMPATIBILITY UPDATE

**✅ COMPATIBLE**: This schema is designed to work with your existing webapp structure while extending functionality.

### Existing Webapp Structure Analysis
Your current webapp uses:
- TypeScript interfaces: `ContentItem`, `Key`, `Dimension`
- Hardcoded content in `/src/data/content.ts`
- File-based content filtering functions
- Key pages that display learn/practice content tabs

### Enhanced Schema (Compatible Extension)

### Primary Content Table: `fourflow_content`

```sql
CREATE TABLE fourflow_content (
  -- Core fields (matches existing ContentItem interface)
  id VARCHAR(100) PRIMARY KEY, -- matches existing string IDs like 'tuned-emotions-learn-1'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL, -- matches existing ContentItem.description
  content TEXT NOT NULL, -- matches existing ContentItem.content (markdown)
  
  -- Framework fields (matches existing structure)  
  type ENUM('learn', 'practice') NOT NULL, -- matches existing ContentItem.type
  dimension ENUM('self', 'space', 'story', 'spirit') NOT NULL, -- matches DimensionType
  key_id VARCHAR(100) NOT NULL, -- matches KeyType (e.g., 'tuned-emotions', 'open-mind')
  tags TEXT[], -- matches existing ContentItem.tags array
  
  -- Extended fields for content repository
  short_title VARCHAR(100), -- For navigation/display
  slug VARCHAR(255) UNIQUE, -- URL-friendly identifier (auto-generated from id)
  excerpt TEXT, -- Brief summary for previews
  
  -- Enhanced metadata
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
  estimated_duration INTEGER, -- in minutes
  read_time INTEGER, -- estimated reading time in minutes
  materials_needed TEXT[], -- Array of required materials (for practices)
  scientific_backing BOOLEAN DEFAULT false,
  
  -- Content relationships & enhancement
  prerequisite_content TEXT[], -- array of content IDs
  related_content TEXT[], -- array of related content IDs
  flow_triggers TEXT[], -- array of flow trigger types
  target_outcomes TEXT[], -- expected outcomes/benefits
  
  -- Repository management
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_date TIMESTAMP,
  status ENUM('draft', 'review', 'published', 'archived') DEFAULT 'published',
  
  -- Pinned content functionality
  is_pinned BOOLEAN DEFAULT false, -- Pin to top of key page
  pinned_type ENUM('learn', 'practice', 'both') NULL, -- Which tab(s) to pin in
  pin_order INTEGER DEFAULT 0, -- Order for multiple pinned items
  
  -- SEO & Discovery
  meta_description TEXT,
  keywords TEXT[], -- searchable keywords
  
  -- Indexes for performance
  INDEX idx_type (type),
  INDEX idx_dimension (dimension),
  INDEX idx_key_id (key_id),
  INDEX idx_dimension_key (dimension, key_id),
  INDEX idx_status (status),
  INDEX idx_pinned (is_pinned, pinned_type, pin_order),
  FULLTEXT INDEX ft_content (title, description, keywords)
);
```

### Tags Table: `content_tags`

```sql
CREATE TABLE content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name VARCHAR(50) UNIQUE NOT NULL,
  tag_category ENUM('method', 'outcome', 'theme', 'skill') NOT NULL,
  description TEXT,
  color_hex VARCHAR(7), -- for UI display
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Content-Tags Relationship: `content_tag_relations`

```sql
CREATE TABLE content_tag_relations (
  content_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  CONSTRAINT fk_content FOREIGN KEY (content_id) REFERENCES fourflow_content(id) ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES content_tags(id) ON DELETE CASCADE
);
```

### User Progress Tracking: `user_content_progress`

```sql
CREATE TABLE user_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed', 'bookmarked') DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  time_spent INTEGER DEFAULT 0, -- minutes spent on content
  notes TEXT, -- user's personal notes
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  started_date TIMESTAMP,
  completed_date TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, content_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_content_progress FOREIGN KEY (content_id) REFERENCES fourflow_content(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_content_rating (content_id, rating)
);
```

### Scientific References: `content_references`

```sql
CREATE TABLE content_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  reference_type ENUM('study', 'book', 'article', 'website') NOT NULL,
  title VARCHAR(255) NOT NULL,
  authors TEXT,
  publication_year INTEGER,
  journal_name VARCHAR(255),
  doi VARCHAR(255),
  url TEXT,
  summary TEXT,
  credibility_score INTEGER CHECK (credibility_score >= 1 AND credibility_score <= 5),
  
  CONSTRAINT fk_content_ref FOREIGN KEY (content_id) REFERENCES fourflow_content(id) ON DELETE CASCADE,
  INDEX idx_content_references (content_id)
);
```

## Metadata Standards

### Required Fields for All Content
- `title` (max 255 characters)
- `short_title` (max 100 characters, for navigation)
- `content_type` (LEARN or PRACTICE)
- `dimension` (SELF, SPACE, SPIRIT, STORY)
- `dimension_key` (specific key within dimension)
- `difficulty` (Beginner, Intermediate, Advanced)
- `content_markdown` (full content)

### Content Type Specific Fields

#### LEARN Content
- `read_time` (estimated minutes)
- `scientific_backing` (boolean)
- `excerpt` (summary for previews)
- At least 2 entries in `content_references`

#### PRACTICE Content
- `estimated_duration` (practice completion time)
- `materials_needed` (JSON array)
- `target_outcomes` (array of expected benefits)
- `prerequisite_content` (if applicable)

### Tag Categories
1. **Method Tags**: meditation, visualization, journaling, physical_exercise
2. **Outcome Tags**: focus, clarity, energy, confidence, creativity
3. **Theme Tags**: productivity, relationships, leadership, wellness
4. **Skill Tags**: attention, emotional_regulation, decision_making

## API Endpoints for Content Management

### Content Creation Workflow
```
POST /api/content/create
PUT /api/content/{id}/update
GET /api/content/{id}/preview
POST /api/content/{id}/publish
DELETE /api/content/{id}
```

### Content Discovery
```
GET /api/content/search?q={query}&dimension={dimension}&difficulty={level}
GET /api/content/dimension/{dimension}
GET /api/content/recommendations/{user_id}
GET /api/content/trending
```

### User Progress
```
POST /api/user/{user_id}/content/{content_id}/start
PUT /api/user/{user_id}/content/{content_id}/progress
POST /api/user/{user_id}/content/{content_id}/complete
GET /api/user/{user_id}/progress/dashboard
```

## Data Validation Rules

### Content Quality Gates
1. **Minimum Word Count**: 
   - LEARN: 1,200 words
   - PRACTICE: 800 words

2. **Required Sections**:
   - LEARN: All 8 template sections
   - PRACTICE: All 8 template sections

3. **Scientific Backing**:
   - LEARN content requires ≥2 references
   - References must have credibility_score ≥3

4. **Metadata Completeness**:
   - All required fields populated
   - ≥3 relevant tags assigned
   - Difficulty level appropriate for content complexity

### Content Review Process
1. **Auto-validation**: Structure, word count, required fields
2. **Expert Review**: Scientific accuracy, practical effectiveness
3. **User Testing**: Small group validation before full publish
4. **Quality Metrics**: Track engagement, completion rates, ratings

## Integration with Application

### Content Delivery
- Static markdown files generated from database
- CDN caching for performance
- Progressive loading for long content
- Offline availability for mobile app

### Personalization
- Content recommendations based on user progress
- Adaptive difficulty suggestions
- Personal learning pathway generation
- Community features (sharing, discussions)

### Analytics & Optimization
- Content performance metrics
- User engagement patterns
- A/B testing framework for content variations
- Continuous improvement feedback loops