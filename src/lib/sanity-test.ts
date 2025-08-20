import { createClient } from '@sanity/client'

// Test client with hardcoded values - no environment variables
export const testClient = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
})

// Test function that bypasses all environment variable issues
export async function testSanityConnection(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('🧪 Testing hardcoded Sanity connection...')
    const query = `*[_type == "contentItem" && defined(dimension)] | order(_createdAt desc)[0...3]`
    const docs = await testClient.fetch(query)
    console.log('🧪 Hardcoded test successful:', docs.length, 'items found')
    return { success: true, count: docs.length }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('🧪 Hardcoded test failed:', errorMessage)
    return { success: false, count: 0, error: errorMessage }
  }
}