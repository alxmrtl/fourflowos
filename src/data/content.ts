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
  getAllContent,
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

