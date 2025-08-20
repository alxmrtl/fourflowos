import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify the request is from Sanity (optional but recommended)
    const secret = request.nextUrl.searchParams.get('secret')
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate all content-related pages
    revalidateTag('content')
    revalidateTag('sanity-content')
    
    // Log the revalidation for debugging
    console.log('🔄 Revalidated content after Sanity update:', body._type)
    
    return NextResponse.json({ 
      message: 'Content revalidated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Webhook revalidation failed:', error)
    return NextResponse.json(
      { message: 'Error revalidating content' }, 
      { status: 500 }
    )
  }
}