import { ContentItem } from '@/types/framework';
import { 
  getAllContent, 
  getContentByDimension, 
  getContentByKey, 
  getContentByType, 
  getContentByDimensionAndKey, 
  getPinnedContent, 
  getContentById 
} from '@/lib/sanity';

// Export the Sanity functions as the main data interface
export { 
  getAllContent as CONTENT_REPOSITORY,
  getContentByDimension,
  getContentByKey,
  getContentByType,
  getContentByDimensionAndKey,
  getPinnedContent,
  getContentById
};

// For backward compatibility, create a promise-based content repository
// This allows existing components to work without major changes
let _contentCache: ContentItem[] | null = null;

export async function getContentRepository(): Promise<ContentItem[]> {
  if (!_contentCache) {
    _contentCache = await getAllContent();
  }
  return _contentCache;
}

// Legacy synchronous functions for backward compatibility
// Note: These will return empty arrays until content is loaded
export const CONTENT_REPOSITORY_SYNC: ContentItem[] = [];

// Helper functions for content management
export function getContentById(id: string): ContentItem | null {
  return CONTENT_REPOSITORY.find(item => item.id === id) || null;
}

export function getContentByDimension(dimension: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.dimension === dimension);
}

export function getContentByKey(key: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.key === key);
}

export function getPinnedContent(): ContentItem[] {
  return CONTENT_REPOSITORY
    .filter(item => item.is_pinned)
    .sort((a, b) => (a.pin_order || 0) - (b.pin_order || 0));
}

export function getContentByType(type: 'learn' | 'practice'): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.type === type);
}

export function getContentByDimensionAndKey(dimension: string, key: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => 
    item.dimension === dimension && item.key === key
  );
}