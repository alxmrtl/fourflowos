import { createClient } from '@sanity/client'
import { ContentItem, DimensionType, KeyType } from '@/types/framework'

// Token resolution from env only. SECURITY: never hardcode a token here —
// this module is imported by client components, so anything in it ships in
// the browser bundle. Public datasets need no token for reads.
const getToken = () =>
  process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN || undefined

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pz22ntol',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Disable CDN to avoid CORS issues with client-side requests
  apiVersion: '2024-01-01',
  token: getToken()
})


// Transform Sanity document to ContentItem
function transformSanityToContentItem(doc: Record<string, unknown>): ContentItem {
  return {
    id: doc._id as string,
    title: doc.title as string,
    description: doc.description as string,
    content: (doc.content as unknown[]) || [], // Preserve Portable Text blocks
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
    const query = `*[_type == "contentItem" && defined(dimension) && defined(key) && defined(type)] | order(pinOrder asc, _createdAt desc)`
    const docs = await client.fetch(query)

    if (docs.length === 0) {
      console.error('No content items found in Sanity - check your dataset and ensure all items have dimension, key, and type fields')
    }

    return docs.map(transformSanityToContentItem)
  } catch (error: unknown) {
    console.error('Failed to fetch content from Sanity:', error)
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      console.error('Sanity auth error — check SANITY_API_TOKEN in the Vercel dashboard')
    }
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
    // Convert underscores to hyphens for key matching (URL format vs DB format)
    const normalizedKey = key.replace(/_/g, '-')

    const query = `*[_type == "contentItem" && defined(dimension) && defined(key) && dimension == $dimension && key == $normalizedKey] | order(pinOrder asc, _createdAt desc)`
    const docs = await client.fetch(query, { dimension, normalizedKey })
    return docs.map(transformSanityToContentItem)
  } catch (error) {
    console.error(`Failed to fetch content for ${dimension}/${key}:`, error)
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