import { NextRequest, NextResponse } from 'next/server'
import { getContentByDimensionAndKey } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const dimension = searchParams.get('dimension')
  const key = searchParams.get('key')

  if (!dimension || !key) {
    return NextResponse.json({ error: 'Missing dimension or key parameter' }, { status: 400 })
  }

  try {
    const content = await getContentByDimensionAndKey(dimension, key)

    // Sort content: pinned first, then by date
    const sortedContent = content.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      if (a.is_pinned && b.is_pinned) {
        return (a.pin_order || 0) - (b.pin_order || 0)
      }
      const aDate = new Date(a.created_date || '2024-01-01')
      const bDate = new Date(b.created_date || '2024-01-01')
      return bDate.getTime() - aDate.getTime()
    })

    return NextResponse.json({
      success: true,
      content: sortedContent
    })
  } catch (error) {
    console.error('API content by key error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      content: []
    }, { status: 500 })
  }
}
