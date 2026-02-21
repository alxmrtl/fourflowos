import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { PromptTemplate } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
}

// GET /api/profile/prompts - List all prompt templates
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: prompts, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[prompts] Fetch error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, prompts });
  } catch (error) {
    console.error('[prompts] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile/prompts - Create new prompt template
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, prompt_text, model, max_tokens, is_active } = body;

    // Validation
    if (!name || !prompt_text) {
      return NextResponse.json(
        { success: false, error: 'name and prompt_text are required' },
        { status: 400 }
      );
    }

    if (model && !['claude-sonnet-4-6', 'claude-haiku-4-5-20251001', 'claude-opus-4-6'].includes(model)) {
      return NextResponse.json(
        { success: false, error: 'Invalid model. Must be sonnet, haiku, or opus.' },
        { status: 400 }
      );
    }

    const newPrompt: Partial<PromptTemplate> = {
      name,
      description: description || null,
      prompt_text,
      model: model || 'claude-sonnet-4-6',
      max_tokens: max_tokens || 2000,
      is_active: is_active !== undefined ? is_active : true,
    };

    const { data, error } = await supabase
      .from('prompt_templates')
      .insert([newPrompt])
      .select()
      .single();

    if (error) {
      console.error('[prompts] Create error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, prompt: data });
  } catch (error) {
    console.error('[prompts] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
