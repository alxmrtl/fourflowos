import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envDebug = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      HAS_SANITY_API_TOKEN: !!process.env.SANITY_API_TOKEN,
      HAS_NEXT_PUBLIC_SANITY_API_TOKEN: !!process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
      SANITY_API_TOKEN_LENGTH: process.env.SANITY_API_TOKEN?.length || 0,
      NEXT_PUBLIC_SANITY_API_TOKEN_LENGTH: process.env.NEXT_PUBLIC_SANITY_API_TOKEN?.length || 0,
      AVAILABLE_ENV_VARS: Object.keys(process.env)
        .filter(key => key.includes('SANITY'))
        .sort()
    }

    return NextResponse.json(envDebug, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to debug environment variables' },
      { status: 500 }
    )
  }
}