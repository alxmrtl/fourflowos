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
    // Content is now managed in src/data/content.ts
    this.data = [];
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
        // For non-pinned content, sort by created date (newest first)
        const aDate = new Date(a.created_date || '2024-01-01');
        const bDate = new Date(b.created_date || '2024-01-01');
        return bDate.getTime() - aDate.getTime();
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
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        if (a.is_pinned && b.is_pinned) {
          return (a.pin_order || 0) - (b.pin_order || 0);
        }
        // For non-pinned content, sort by created date (newest first)
        const aDate = new Date(a.created_date || '2024-01-01');
        const bDate = new Date(b.created_date || '2024-01-01');
        return bDate.getTime() - aDate.getTime();
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
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        if (a.is_pinned && b.is_pinned) {
          return (a.pin_order || 0) - (b.pin_order || 0);
        }
        // For non-pinned content, sort by created date (newest first)
        const aDate = new Date(a.created_date || '2024-01-01');
        const bDate = new Date(b.created_date || '2024-01-01');
        return bDate.getTime() - aDate.getTime();
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