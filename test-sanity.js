const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

async function testSanity() {
  try {
    console.log('Testing Sanity connection...');
    const content = await client.fetch('*[_type == "contentItem"] | order(pinOrder asc)');
    console.log(`✅ Found ${content.length} articles:`);
    content.forEach(item => {
      console.log(`- ${item.title} (${item.dimension})`);
    });
  } catch (error) {
    console.error('❌ Sanity test failed:', error);
  }
}

testSanity();