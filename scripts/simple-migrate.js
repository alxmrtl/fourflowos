const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
});

// Convert text to basic portable text
function textToPortableText(text) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    
    if (trimmed.startsWith('## ')) {
      return {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmed.substring(3) }],
        markDefs: []
      };
    } else if (trimmed.startsWith('# ')) {
      return {
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: trimmed.substring(2) }],
        markDefs: []
      };
    } else {
      return {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: trimmed }],
        markDefs: []
      };
    }
  });
}

// Sample content to test the migration
const testContent = {
  _type: 'contentItem',
  _id: 'test-migration',
  title: 'Test Migration Article',
  description: 'A test article to verify Sanity integration works',
  content: textToPortableText(`# Test Article

This is a test article to verify our Sanity setup is working correctly.

## Section 1

This is the first section of our test article.

## Section 2

This is the second section with some more content.`),
  tags: ['test', 'migration'],
  type: 'learn',
  dimension: 'self',
  key: 'tuned-emotions',
  difficulty: 'Beginner',
  readTime: 1,
  isPinned: false,
  pinOrder: 999
};

async function testMigration() {
  console.log('🧪 Testing Sanity connection and migration...');
  
  try {
    // Test connection
    const datasets = await client.datasets.list();
    console.log('✅ Connected to Sanity successfully');
    
    // Create test document
    console.log('📝 Creating test document...');
    await client.createOrReplace(testContent);
    console.log('✅ Test document created successfully!');
    
    // Verify we can read it back
    console.log('🔍 Verifying document can be read...');
    const doc = await client.getDocument('test-migration');
    console.log('✅ Document verified:', doc.title);
    
    console.log('🎉 Migration test successful!');
    console.log('🔧 You can now start Sanity Studio with: npm run sanity:dev');
    console.log('🌐 Or visit: https://fourflowos.sanity.studio');
    
  } catch (error) {
    console.error('❌ Migration test failed:', error);
    process.exit(1);
  }
}

testMigration();