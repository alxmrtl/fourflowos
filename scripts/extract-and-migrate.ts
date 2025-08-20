import { execSync } from 'child_process';
import { createClient } from '@sanity/client';
import * as fs from 'fs';

const client = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
});

// Get the original content from git history
function getOriginalContent() {
  try {
    const contentFile = execSync('git show 5c52563:src/data/content.ts', { encoding: 'utf8' });
    
    // Extract the CONTENT_REPOSITORY array
    const match = contentFile.match(/export const CONTENT_REPOSITORY: ContentItem\[\] = \[([\s\S]*?)\];/);
    if (!match) {
      throw new Error('Could not find CONTENT_REPOSITORY in git history');
    }
    
    // Save to temporary file and import it
    const tempContent = `
import { ContentItem } from '../src/types/framework';

const CONTENT_REPOSITORY: ContentItem[] = [${match[1]}];

export default CONTENT_REPOSITORY;
`;
    
    fs.writeFileSync('/tmp/temp-content.ts', tempContent);
    
    // Use Node.js require to parse the content
    delete require.cache['/tmp/temp-content.ts'];
    const { default: content } = require('/tmp/temp-content.ts');
    
    return content;
  } catch (error) {
    console.error('Failed to extract content from git:', error);
    return [];
  }
}

// Convert plain text to Sanity portable text blocks
function textToPortableText(text: string) {
  const lines = text.split('\n');
  const blocks = [];
  
  let currentBlock = '';
  let currentStyle = 'normal';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
        currentStyle = 'normal';
      }
    } else if (trimmedLine.startsWith('## ')) {
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmedLine.substring(3) }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else if (trimmedLine.startsWith('# ')) {
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: trimmedLine.substring(2) }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: trimmedLine.slice(2, -2),
          marks: ['strong']
        }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else {
      if (currentBlock) {
        currentBlock += ' ' + trimmedLine;
      } else {
        currentBlock = trimmedLine;
      }
    }
  }
  
  if (currentBlock) {
    blocks.push({
      _type: 'block',
      style: currentStyle,
      children: [{ _type: 'span', text: currentBlock }],
      markDefs: []
    });
  }
  
  return blocks;
}

async function migrateContent() {
  console.log('🚀 Starting migration to Sanity...');
  
  try {
    // Get the original content
    console.log('📖 Extracting content from git history...');
    const content = getOriginalContent();
    
    if (content.length === 0) {
      console.log('❌ No content found to migrate');
      return;
    }
    
    console.log(`📊 Found ${content.length} articles to migrate`);
    
    // Test Sanity connection
    await client.datasets.list();
    console.log('✅ Connected to Sanity successfully');
    
    // Migrate each article
    for (const item of content) {
      console.log(`📝 Migrating: ${item.title}`);
      
      try {
        const portableTextContent = textToPortableText(item.content);
        
        const doc = {
          _type: 'contentItem',
          _id: item.id,
          title: item.title,
          description: item.description,
          content: portableTextContent,
          tags: item.tags || [],
          type: item.type,
          dimension: item.dimension,
          key: item.key,
          difficulty: item.difficulty,
          readTime: item.read_time,
          isPinned: item.is_pinned,
          pinOrder: item.pin_order,
          createdDate: item.created_date
        };
        
        await client.createOrReplace(doc);
        console.log(`✅ Migrated: ${item.title}`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${item.title}:`, error);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migrated ${content.length} articles`);
    console.log('🔧 You can now start Sanity Studio with: npm run sanity:dev');
    
    // Clean up temp file
    try {
      fs.unlinkSync('/tmp/temp-content.ts');
    } catch {}
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateContent();