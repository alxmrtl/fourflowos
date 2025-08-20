import { createClient } from '@sanity/client'
import { ContentItem } from '@/types/framework'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pz22ntol',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
})

// Helper function to convert Sanity portable text to plain string
function portableTextToPlainText(blocks: any[]): string {
  return blocks
    .map((block: any) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map((child: any) => child.text).join('')
    })
    .join('\n\n')
}

// Transform Sanity document to ContentItem
function transformSanityToContentItem(doc: any): ContentItem {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    content: portableTextToPlainText(doc.content || []),
    tags: doc.tags || [],
    type: doc.type,
    dimension: doc.dimension,
    key: doc.key,
    short_title: doc.shortTitle,
    excerpt: doc.excerpt,
    difficulty: doc.difficulty,
    estimated_duration: doc.estimatedDuration,
    read_time: doc.readTime,
    materials_needed: doc.materialsNeeded,
    scientific_backing: doc.scientificBacking,
    flow_triggers: doc.flowTriggers,
    target_outcomes: doc.targetOutcomes,
    created_date: doc.createdDate,
    meta_description: doc.metaDescription,
    keywords: doc.keywords,
    is_pinned: doc.isPinned,
    pin_order: doc.pinOrder
  }
}

// Fetch all content items
export async function getAllContent(): Promise<ContentItem[]> {
  const query = `*[_type == "contentItem"] | order(pinOrder asc, _createdAt desc)`
  const docs = await client.fetch(query)
  return docs.map(transformSanityToContentItem)
}

// Fetch content by dimension
export async function getContentByDimension(dimension: string): Promise<ContentItem[]> {
  const query = `*[_type == "contentItem" && dimension == $dimension] | order(pinOrder asc, _createdAt desc)`
  const docs = await client.fetch(query, { dimension })
  return docs.map(transformSanityToContentItem)
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
  const query = `*[_type == "contentItem" && dimension == $dimension && key == $key] | order(pinOrder asc, _createdAt desc)`
  const docs = await client.fetch(query, { dimension, key })
  return docs.map(transformSanityToContentItem)
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