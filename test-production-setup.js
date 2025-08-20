// Test script to verify production environment setup
const https = require('https');

async function testWebhook(siteUrl, secret) {
  const webhookUrl = `${siteUrl}/api/revalidate?secret=${secret}`;
  
  const postData = JSON.stringify({
    _type: 'contentItem',
    _id: 'test-webhook'
  });

  const options = {
    hostname: new URL(siteUrl).hostname,
    path: `/api/revalidate?secret=${secret}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Webhook test result:', res.statusCode, data);
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Webhook test failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🧪 Testing Production Setup...\n');
  
  // You'll need to replace this with your actual Vercel URL
  const SITE_URL = 'https://your-site-url.vercel.app';
  const SECRET = 'fourflow-webhook-secret-2024';
  
  console.log('📍 Site URL:', SITE_URL);
  console.log('🔐 Webhook Secret:', SECRET);
  console.log('\n--- Testing Webhook Endpoint ---');
  
  try {
    await testWebhook(SITE_URL, SECRET);
  } catch (error) {
    console.error('❌ Setup test failed');
  }
}

// Uncomment and update with your actual URL to test
// main();

console.log(`
🚀 PRODUCTION SETUP CHECKLIST:

Environment Variables (Add to Vercel):
✓ NEXT_PUBLIC_SANITY_PROJECT_ID = pz22ntol
✓ NEXT_PUBLIC_SANITY_DATASET = production  
✓ SANITY_API_TOKEN = skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08
✓ SANITY_REVALIDATE_SECRET = fourflow-webhook-secret-2024

Webhook Configuration (Add to Sanity):
✓ URL: https://your-vercel-url.vercel.app/api/revalidate?secret=fourflow-webhook-secret-2024
✓ Method: POST
✓ Triggers: Create, Update, Delete
✓ Dataset: production

Next Steps:
1. Add environment variables to Vercel
2. Get your deployed site URL
3. Configure webhook in Sanity with your actual URL
4. Test by editing an article in Sanity Studio
`);