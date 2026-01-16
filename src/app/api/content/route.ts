import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/sanity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const content = await getAllContent()
    return NextResponse.json({
      success: true,
      count: content.length,
      content
    })
  } catch (error) {
    console.error('API content fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
      content: []
    }, { status: 500 })
  }
}
