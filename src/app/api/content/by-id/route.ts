import { NextRequest, NextResponse } from 'next/server'
import { getContentById, getContentByDimension } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  try {
    const content = await getContentById(id)

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Also get related articles from the same dimension
    const dimensionContent = await getContentByDimension(content.dimension)
    const relatedArticles = dimensionContent
      .filter(item => item.id !== content.id)
      .slice(0, 3)

    return NextResponse.json({
      success: true,
      content,
      relatedArticles
    })
  } catch (error) {
    console.error('API content by ID error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
