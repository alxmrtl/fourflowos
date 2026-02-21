import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { PromptTemplate } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key');
  return key === process.env.PROFILE_ADMIN_KEY;
}

// PATCH /api/profile/prompts/[id] - Update prompt template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, description, prompt_text, model, max_tokens, is_active } = body;

    // Build update object with only provided fields
    const updates: Partial<PromptTemplate> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (prompt_text !== undefined) updates.prompt_text = prompt_text;
    if (model !== undefined) {
      if (!['claude-sonnet-4-5-20250929', 'claude-haiku-4-5-20251001', 'claude-opus-4-6'].includes(model)) {
        return NextResponse.json(
          { success: false, error: 'Invalid model. Must be sonnet, haiku, or opus.' },
          { status: 400 }
        );
      }
      updates.model = model;
    }
    if (max_tokens !== undefined) updates.max_tokens = max_tokens;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('prompt_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[prompts] Update error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Prompt not found' }, { status: 404 });
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

// DELETE /api/profile/prompts/[id] - Delete prompt template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if any assessments are using this prompt
    const { count } = await supabase
      .from('assessments')
      .select('id', { count: 'exact', head: true })
      .eq('prompt_template_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete: ${count} assessment(s) are using this prompt. Set is_active=false instead.`,
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('prompt_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[prompts] Delete error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[prompts] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
