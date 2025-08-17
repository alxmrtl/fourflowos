# FourFlow Webapp Integration Plan

## Current State Analysis

### Existing Structure ✅
Your webapp currently uses:
- **Data Layer**: `/src/data/content.ts` with hardcoded `CONTENT_REPOSITORY` array
- **Types**: `ContentItem` interface matching database schema perfectly
- **Filtering**: Functions like `getLearnContent()`, `getPracticeContent()`
- **Display**: Key pages with Learn/Practice tabs
- **Navigation**: `/dimension/[dimension]/key/[key]` routing

### Database Compatibility ✅
The new schema is **100% compatible** with existing webapp structure:
- Database field names match TypeScript interface properties
- Enum values match exactly (`'learn'|'practice'`, dimension names)
- Content filtering functions will work unchanged
- No breaking changes to existing components

---

## Phase 1: Database Integration

### 1.1 Update ContentItem Interface (Optional Enhancement)
```typescript
// /src/types/framework.ts - Extended interface
export interface ContentItem {
  // Existing fields (unchanged)
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  type: 'learn' | 'practice';
  dimension: DimensionType;
  key: KeyType;
  
  // Optional new fields for enhanced content
  short_title?: string;
  excerpt?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_duration?: number;
  read_time?: number;
  materials_needed?: string[];
  scientific_backing?: boolean;
  flow_triggers?: string[];
  target_outcomes?: string[];
  created_date?: string;
  meta_description?: string;
  keywords?: string[];
  
  // Pinned content fields
  is_pinned?: boolean;
  pinned_type?: 'learn' | 'practice' | 'both';
  pin_order?: number;
}
```

### 1.2 Database Connection Setup
```typescript
// /src/lib/database.ts - New file
import { ContentItem } from '@/types/framework';

export async function getContentRepository(): Promise<ContentItem[]> {
  // Replace hardcoded array with database query
  const query = `
    SELECT * FROM fourflow_content 
    WHERE status = 'published' 
    ORDER BY created_date DESC
  `;
  
  // Return data in same format as existing CONTENT_REPOSITORY
  return await executeQuery(query);
}

export async function getContentByDimensionAndKey(
  dimension: string, 
  key: string
): Promise<ContentItem[]> {
  const query = `
    SELECT * FROM fourflow_content 
    WHERE dimension = ? AND key_id = ? AND status = 'published'
    ORDER BY 
      is_pinned DESC, 
      pin_order ASC, 
      type, 
      created_date DESC
  `;
  
  return await executeQuery(query, [dimension, key]);
}

export async function getLearnContentWithPinned(
  dimension: string, 
  key: string
): Promise<ContentItem[]> {
  const query = `
    SELECT * FROM fourflow_content 
    WHERE dimension = ? AND key_id = ? AND type = 'learn' AND status = 'published'
    ORDER BY 
      CASE WHEN is_pinned = true AND (pinned_type = 'learn' OR pinned_type = 'both') THEN 0 ELSE 1 END,
      pin_order ASC,
      created_date DESC
  `;
  
  return await executeQuery(query, [dimension, key]);
}

export async function getPracticeContentWithPinned(
  dimension: string, 
  key: string
): Promise<ContentItem[]> {
  const query = `
    SELECT * FROM fourflow_content 
    WHERE dimension = ? AND key_id = ? AND type = 'practice' AND status = 'published'
    ORDER BY 
      CASE WHEN is_pinned = true AND (pinned_type = 'practice' OR pinned_type = 'both') THEN 0 ELSE 1 END,
      pin_order ASC,
      created_date DESC
  `;
  
  return await executeQuery(query, [dimension, key]);
}
```

### 1.3 Update Data Layer (Gradual Migration)
```typescript
// /src/data/content.ts - Updated to use database
import { getContentRepository } from '@/lib/database';

// Option 1: Keep existing functions, change data source
export async function CONTENT_REPOSITORY() {
  return await getContentRepository();
}

// Option 2: Keep hardcoded as fallback, add database toggle
const USE_DATABASE = process.env.USE_DATABASE === 'true';

export const CONTENT_REPOSITORY = USE_DATABASE 
  ? await getContentRepository()
  : [/* existing hardcoded content */];
```

---

## Phase 2: Content Repository Integration

### 2.1 Content Upload System
```typescript
// /src/lib/content-upload.ts - New file
interface ContentUpload {
  markdown_file: string;
  metadata: {
    title: string;
    dimension: DimensionType;
    key: KeyType;
    type: 'learn' | 'practice';
    // ... other metadata
  };
}

export async function uploadContentToDatabase(content: ContentUpload) {
  // Parse markdown file from /IDEAS/READY/
  // Extract metadata
  // Insert into database
  // Update webapp content automatically
}
```

### 2.2 Auto-Update Key Pages
The existing key page component will automatically display new content because:
1. ✅ It already uses `getLearnContent()` and `getPracticeContent()`
2. ✅ These functions filter by dimension and key 
3. ✅ New database content will appear automatically in tabs
4. ✅ No component changes needed

### 2.3 Content Repository Page
```typescript
// /src/app/content/page.tsx - New repository page
export default function ContentRepositoryPage() {
  const [selectedDimension, setSelectedDimension] = useState<DimensionType | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'learn' | 'practice' | 'all'>('all');
  
  const filteredContent = useMemo(() => {
    return CONTENT_REPOSITORY.filter(item => {
      const dimensionMatch = selectedDimension === 'all' || item.dimension === selectedDimension;
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      return dimensionMatch && typeMatch;
    });
  }, [selectedDimension, selectedType]);
  
  return (
    <div>
      {/* Filter controls */}
      {/* Content grid/list */}
      {/* Search functionality */}
    </div>
  );
}
```

---

## Phase 3: Enhanced Features

### 3.1 Content Pages (Individual Content View)
```typescript
// /src/app/content/[id]/page.tsx - Individual content pages
export default function ContentPage({ params }: { params: { id: string } }) {
  const content = await getContentById(params.id);
  
  return (
    <article>
      <header>
        <h1>{content.title}</h1>
        <div>
          <span>{content.dimension}</span>
          <span>{content.key}</span>
          <span>{content.type}</span>
        </div>
      </header>
      
      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content.content) }} />
      
      <footer>
        <div>Tags: {content.tags.join(', ')}</div>
        {content.related_content && (
          <div>Related: {/* Related content links */}</div>
        )}
      </footer>
    </article>
  );
}
```

### 3.2 Update Key Pages with Enhanced Links
```typescript
// Update existing KeyPage.tsx - Lines 174 and 236
// Change from anchor links to proper routes
href={`/content/${item.id}`} // Instead of `#content-${item.id}`
```

### 3.3 Search & Discovery
```typescript
// /src/components/ContentSearch.tsx
export function ContentSearch() {
  return (
    <div>
      <input placeholder="Search content..." />
      <select> {/* Dimension filter */}
      <select> {/* Difficulty filter */}
      <select> {/* Type filter */}
    </div>
  );
}
```

---

## Phase 4: Content Management Pipeline

### 4.1 Automated Content Pipeline
```bash
# /scripts/content-pipeline.sh
#!/bin/bash

# Watch for new content in /IDEAS/READY/
# Parse markdown and metadata
# Upload to database
# Trigger webapp rebuild/refresh
# Update content repository automatically
```

### 4.2 Content Validation
```typescript
// /src/lib/content-validator.ts
export function validateContentFormat(content: any): boolean {
  // Check template compliance
  // Validate metadata completeness
  // Verify required fields
  // Return validation results
}
```

---

## Implementation Roadmap

### Week 1: Database Setup ✅
- [x] Create compatible database schema
- [ ] Set up database connection
- [ ] Create content upload functions

### Week 2: Basic Integration
- [ ] Replace hardcoded content with database queries
- [ ] Test existing key pages with database content
- [ ] Create content upload pipeline

### Week 3: Enhanced Features  
- [ ] Add individual content pages
- [ ] Update key page links to route to content pages
- [ ] Create content repository page

### Week 4: Advanced Features
- [ ] Add search functionality
- [ ] Implement content management interface
- [ ] Set up automated content pipeline

---

## Benefits of This Approach

### ✅ Zero Breaking Changes
- Existing webapp continues working unchanged
- Gradual migration possible
- Fallback to hardcoded content available

### ✅ Enhanced User Experience
- Individual content pages with better SEO
- Search and filtering capabilities
- Related content suggestions
- Progress tracking (future)

### ✅ Content Management
- Standardized content creation workflow
- Database-driven content repository
- Automated content pipeline
- Quality assurance built-in

### ✅ Scalability
- Unlimited content capacity
- Performance optimizations
- Analytics and tracking
- User personalization (future)

---

## Next Steps

1. **Database Schema**: Deploy the compatible database schema
2. **Content Upload**: Implement the content upload pipeline  
3. **Integration**: Connect database to existing webapp functions
4. **Testing**: Verify key pages display database content correctly
5. **Enhancement**: Add individual content pages and repository view

The system is designed for seamless integration with your existing webapp while providing powerful content management capabilities.