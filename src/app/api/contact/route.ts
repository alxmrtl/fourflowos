import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get Web3Forms access key from environment
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json(
        { error: 'Contact form is not configured', debug: 'Missing API key' },
        { status: 500 }
      );
    }

    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `FourFlowOS Contact: ${subject}`,
        message,
        from_name: 'FourFlowOS Website',
      })
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send message', debug: result },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred', debug: String(error) },
      { status: 500 }
    );
  }
}
