export type DimensionType = 'self' | 'space' | 'story' | 'spirit';

export type KeyType = 
  // Self keys
  | 'tuned-emotions' | 'open-mind' | 'focused-body'
  // Space keys  
  | 'intentional-space' | 'optimized-tools' | 'feedback-systems'
  // Story keys
  | 'generative-story' | 'worthy-mission' | 'empowered-role'
  // Spirit keys
  | 'grounding-values' | 'visualized-vision' | 'ignited-curiosity';

export interface Dimension {
  id: DimensionType;
  name: string;
  color: string;
  description: string;
  icon: string;
  sectionLogo: string;
  keys: Key[];
}

export interface Key {
  id: KeyType;
  name: string;
  dimension: DimensionType;
  description: string;
  icon: string;
  content: {
    learn: ContentItem[];
    practice: ContentItem[];
  };
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  type: 'learn' | 'practice';
  dimension: DimensionType;
  key: KeyType;
  
  // Optional enhanced fields
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
  pin_order?: number;
}

export interface NavigationState {
  currentDimension: DimensionType | null;
  currentKey: KeyType | null;
  isOnFrameworkPage: boolean;
}