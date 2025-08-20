import { createClient } from '@sanity/client'
import { ContentItem, DimensionType, KeyType } from '@/types/framework'

// Robust token resolution with detailed logging
const getToken = () => {
  const tokens = {
    nextPublic: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    server: process.env.SANITY_API_TOKEN,
    fallback: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
  }

  console.log('🔧 Token resolution:', {
    hasNextPublic: !!tokens.nextPublic,
    hasServer: !!tokens.server,
    nextPublicLength: tokens.nextPublic?.length || 0,
    serverLength: tokens.server?.length || 0,
    willUseFallback: !tokens.nextPublic && !tokens.server
  })

  return tokens.nextPublic || tokens.server || tokens.fallback
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pz22ntol',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production, direct API in development
  apiVersion: '2024-01-01',
  token: getToken()
})

// Helper function to convert Sanity portable text to plain string
function portableTextToPlainText(blocks: unknown[]): string {
  return blocks
    .map((block: unknown) => {
      if (typeof block === 'object' && block !== null && 'children' in block && '_type' in block) {
        const typedBlock = block as { _type: string; children?: { text: string }[] }
        if (typedBlock._type !== 'block' || !typedBlock.children) {
          return ''
        }
        return typedBlock.children.map((child) => child.text).join('')
      }
      return ''
    })
    .join('\n\n')
}

// Transform Sanity document to ContentItem
function transformSanityToContentItem(doc: Record<string, unknown>): ContentItem {
  return {
    id: doc._id as string,
    title: doc.title as string,
    description: doc.description as string,
    content: portableTextToPlainText((doc.content as unknown[]) || []),
    tags: (doc.tags as string[]) || [],
    type: doc.type as 'learn' | 'practice',
    dimension: doc.dimension as DimensionType,
    key: doc.key as KeyType,
    short_title: doc.shortTitle as string | undefined,
    excerpt: doc.excerpt as string | undefined,
    difficulty: doc.difficulty as 'Beginner' | 'Intermediate' | 'Advanced' | undefined,
    estimated_duration: doc.estimatedDuration as number | undefined,
    read_time: doc.readTime as number | undefined,
    materials_needed: doc.materialsNeeded as string[] | undefined,
    scientific_backing: doc.scientificBacking as boolean | undefined,
    flow_triggers: doc.flowTriggers as string[] | undefined,
    target_outcomes: doc.targetOutcomes as string[] | undefined,
    created_date: doc.createdDate as string | undefined,
    meta_description: doc.metaDescription as string | undefined,
    keywords: doc.keywords as string[] | undefined,
    is_pinned: doc.isPinned as boolean | undefined,
    pin_order: doc.pinOrder as number | undefined
  }
}

// Fetch all content items
export async function getAllContent(): Promise<ContentItem[]> {
  try {
    console.log('🔄 Fetching all content from Sanity...')
    const query = `*[_type == "contentItem" && defined(dimension) && defined(key) && defined(type)] | order(pinOrder asc, _createdAt desc)`
    const docs = await client.fetch(query)
    console.log(`✅ Successfully fetched ${docs.length} content items from Sanity`)
    
    if (docs.length === 0) {
      console.warn('⚠️ No content items found in Sanity - check your dataset and ensure all items have dimension, key, and type fields')
    }
    
    const transformedDocs = docs.map(transformSanityToContentItem)
    console.log(`✅ Transformed ${transformedDocs.length} content items`)
    return transformedDocs
  } catch (error: any) {
    console.error('❌ Failed to fetch content from Sanity:', error)
    
    // Enhanced error logging for 401 issues
    if (error?.statusCode === 401) {
      console.error('🚨 AUTHENTICATION ERROR: Token appears invalid or missing')
      console.error('Check environment variables:')
      console.error('- NEXT_PUBLIC_SANITY_API_TOKEN in Vercel dashboard')
      console.error('- SANITY_API_TOKEN in Vercel dashboard')  
      console.error('Current token info:', {
        hasNextPublicToken: !!process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
        hasServerToken: !!process.env.SANITY_API_TOKEN,
        nextPublicLength: process.env.NEXT_PUBLIC_SANITY_API_TOKEN?.length || 0,
        serverLength: process.env.SANITY_API_TOKEN?.length || 0
      })
    }
    
    console.error('Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      useCdn: client.config().useCdn,
      apiVersion: client.config().apiVersion
    })
    return [] // Return empty array instead of crashing
  }
}

// Fetch content by dimension
export async function getContentByDimension(dimension: string): Promise<ContentItem[]> {
  try {
    const query = `*[_type == "contentItem" && defined(dimension) && dimension == $dimension] | order(pinOrder asc, _createdAt desc)`
    const docs = await client.fetch(query, { dimension })
    return docs.map(transformSanityToContentItem)
  } catch (error) {
    console.error(`❌ Failed to fetch content for dimension ${dimension}:`, error)
    return []
  }
}

// Fetch content by key
export async function getContentByKey(key: string): Promise<ContentItem[]> {
  const query = `*[_type == "contentItem" && key == $key] | order(pinOrder asc, _createdAt desc)`
  const docs = await client.fetch(query, { key })
  return docs.map(transformSanityToContentItem)
}

// Fetch content by type
export async function getContentByType(type: 'learn' | 'practice'): Promise<ContentItem[]> {
  const query = `*[_type == "contentItem" && type == $type] | order(pinOrder asc, _createdAt desc)`
  const docs = await client.fetch(query, { type })
  return docs.map(transformSanityToContentItem)
}

// Fetch content by dimension and key
export async function getContentByDimensionAndKey(dimension: string, key: string): Promise<ContentItem[]> {
  try {
    console.log(`🔄 Fetching content for dimension: ${dimension}, key: ${key}`)
    const query = `*[_type == "contentItem" && defined(dimension) && defined(key) && dimension == $dimension && key == $key] | order(pinOrder asc, _createdAt desc)`
    const docs = await client.fetch(query, { dimension, key })
    console.log(`✅ Found ${docs.length} items for ${dimension}/${key}`)
    
    if (docs.length === 0) {
      console.warn(`⚠️ No content found for dimension: ${dimension}, key: ${key}`)
    }
    
    return docs.map(transformSanityToContentItem)
  } catch (error) {
    console.error(`❌ Failed to fetch content for ${dimension}/${key}:`, error)
    return []
  }
}

// Fetch pinned content
export async function getPinnedContent(): Promise<ContentItem[]> {
  const query = `*[_type == "contentItem" && isPinned == true] | order(pinOrder asc)`
  const docs = await client.fetch(query)
  return docs.map(transformSanityToContentItem)
}

// Fetch content by ID
export async function getContentById(id: string): Promise<ContentItem | null> {
  const query = `*[_type == "contentItem" && _id == $id][0]`
  const doc = await client.fetch(query, { id })
  return doc ? transformSanityToContentItem(doc) : null
}