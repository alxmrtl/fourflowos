#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { insertContent } from '../lib/database';
import { ContentItem } from '../src/types/framework';

/**
 * Content Upload Pipeline
 * Automatically processes content from IDEAS/READY folder and uploads to database
 */

interface ContentMetadata {
  title: string;
  short_title?: string;
  dimension: 'self' | 'space' | 'story' | 'spirit';
  key: string;
  type: 'learn' | 'practice';
  slug?: string;
  excerpt?: string;
  tags: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  read_time?: number;
  estimated_duration?: number;
  scientific_backing?: boolean;
  materials_needed?: string[];
  is_pinned?: boolean;
  pin_order?: number;
  flow_triggers?: string[];
  target_outcomes?: string[];
  related_concepts?: string[];
  prerequisite_content?: string[];
  meta_description?: string;
  keywords?: string[];
  created_date?: string;
}

class ContentUploader {
  private readyFolder: string;

  constructor() {
    // Path to IDEAS/READY folder
    this.readyFolder = path.join(process.cwd(), '..', '..', 'IDEAS', 'READY');
  }

  async uploadContentFromReady(): Promise<void> {
    console.log('🚀 Starting content upload from IDEAS/READY folder...');
    
    try {
      // Check if READY folder exists
      if (!fs.existsSync(this.readyFolder)) {
        console.error(`❌ READY folder not found at: ${this.readyFolder}`);
        return;
      }

      // Get all .md files in READY folder
      const files = fs.readdirSync(this.readyFolder)
        .filter(file => file.endsWith('.md'));

      console.log(`📁 Found ${files.length} markdown files to process`);

      for (const file of files) {
        await this.processContentFile(file);
      }

      console.log('✅ Content upload completed successfully!');

    } catch (error) {
      console.error('❌ Error during content upload:', error);
    }
  }

  private async processContentFile(filename: string): Promise<void> {
    const filePath = path.join(this.readyFolder, filename);
    const content = fs.readFileSync(filePath, 'utf-8');

    console.log(`📄 Processing: ${filename}`);

    // Look for corresponding metadata file
    const metadataFilename = filename.replace('.md', '-metadata.yaml');
    const metadataPath = path.join(this.readyFolder, metadataFilename);

    let metadata: ContentMetadata | null = null;

    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        metadata = yaml.load(metadataContent) as ContentMetadata;
        console.log(`📊 Loaded metadata from: ${metadataFilename}`);
      } catch (error) {
        console.warn(`⚠️ Failed to parse metadata for ${filename}:`, error);
      }
    }

    // Extract metadata from filename if no metadata file
    if (!metadata) {
      metadata = this.extractMetadataFromFilename(filename);
      console.log(`📝 Extracted metadata from filename`);
    }

    // Generate content ID
    const contentId = metadata.slug || this.generateContentId(metadata);

    // Create ContentItem
    const contentItem: Partial<ContentItem> = {
      id: contentId,
      title: metadata.title,
      description: metadata.excerpt || this.extractExcerpt(content),
      content: content,
      tags: metadata.tags || [],
      type: metadata.type,
      dimension: metadata.dimension,
      key: metadata.key as any, // Type assertion needed due to enum
      short_title: metadata.short_title,
      excerpt: metadata.excerpt,
      difficulty: metadata.difficulty,
      estimated_duration: metadata.estimated_duration,
      read_time: metadata.read_time,
      materials_needed: metadata.materials_needed,
      scientific_backing: metadata.scientific_backing,
      flow_triggers: metadata.flow_triggers,
      target_outcomes: metadata.target_outcomes,
      is_pinned: metadata.is_pinned,
      pin_order: metadata.pin_order,
      meta_description: metadata.meta_description,
      keywords: metadata.keywords,
      created_date: metadata.created_date || new Date().toISOString()
    };

    // Upload to database
    try {
      const uploadedId = await insertContent(contentItem);
      console.log(`✅ Uploaded content with ID: ${uploadedId}`);
      
      // Optional: Move processed file to archive
      // this.archiveProcessedFile(filename);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error);
    }
  }

  private extractMetadataFromFilename(filename: string): ContentMetadata {
    // Parse filename pattern: "Title - DIMENSION TYPE.md"
    // Example: "Tuned Emotions - SELF LEARN.md"
    
    const nameWithoutExt = filename.replace('.md', '');
    const parts = nameWithoutExt.split(' - ');
    
    let title = parts[0] || nameWithoutExt;
    let dimension: any = 'self';
    let type: 'learn' | 'practice' = 'learn';
    let key = 'tuned-emotions'; // default

    if (parts.length > 1) {
      const dimType = parts[1].toLowerCase();
      
      if (dimType.includes('self')) dimension = 'self';
      else if (dimType.includes('space')) dimension = 'space';
      else if (dimType.includes('story')) dimension = 'story';
      else if (dimType.includes('spirit')) dimension = 'spirit';
      
      if (dimType.includes('practice')) type = 'practice';
      else if (dimType.includes('learn')) type = 'learn';
    }

    // Infer key from title
    if (title.toLowerCase().includes('tuned emotions')) key = 'tuned-emotions';
    else if (title.toLowerCase().includes('open mind')) key = 'open-mind';
    else if (title.toLowerCase().includes('focused body')) key = 'focused-body';
    // Add more key inference logic as needed

    return {
      title,
      dimension,
      key,
      type,
      tags: [dimension, type]
    };
  }

  private generateContentId(metadata: ContentMetadata): string {
    const cleanTitle = metadata.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    return `${metadata.key}-${cleanTitle}-${metadata.type}`;
  }

  private extractExcerpt(content: string): string {
    // Extract first paragraph after title
    const lines = content.split('\n');
    const contentStart = lines.findIndex(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('*') &&
      !line.startsWith('**')
    );
    
    if (contentStart !== -1) {
      return lines[contentStart].trim().substring(0, 200) + '...';
    }
    
    return 'FourFlow content piece';
  }

  private archiveProcessedFile(filename: string): void {
    const archiveFolder = path.join(this.readyFolder, 'processed');
    if (!fs.existsSync(archiveFolder)) {
      fs.mkdirSync(archiveFolder);
    }
    
    const sourcePath = path.join(this.readyFolder, filename);
    const targetPath = path.join(archiveFolder, filename);
    
    fs.renameSync(sourcePath, targetPath);
    console.log(`📦 Archived: ${filename}`);
  }
}

// CLI execution
async function main() {
  const uploader = new ContentUploader();
  await uploader.uploadContentFromReady();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { ContentUploader };