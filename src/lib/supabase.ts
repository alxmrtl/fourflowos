import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized server-side Supabase client (uses service role key — never expose to client)
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Convenience alias — lazily delegates to the real client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// Assessment status progression
export const ASSESSMENT_STATUSES = [
  'intake_submitted',
  'lite_generated',
  'processing',
  'session_1_scheduled',
  'session_1_complete',
  'synthesis',
  'session_2_scheduled',
  'delivered',
] as const;

export type AssessmentStatus = typeof ASSESSMENT_STATUSES[number];

export interface Assessment {
  id: string;
  created_at: string;
  updated_at: string;
  status: AssessmentStatus;

  // Personal
  name: string;
  email: string;

  // Birth data
  birth_date: string;
  birth_time: string | null;
  birth_time_known: boolean;
  birth_location: string;
  birth_lat: number | null;
  birth_lng: number | null;

  // Life context
  context_working: string;
  context_stuck: string;
  context_building: string;

  // SELF pillar
  self_energy: string;
  self_emotions: string;
  self_focus: string;

  // SPACE pillar
  space_environment: string;
  space_tools: string;
  space_feedback: string;

  // STORY pillar
  story_narrative: string;
  story_mission: string;
  story_role: string;

  // SPIRIT pillar
  spirit_values: string;
  spirit_curiosity: string;
  spirit_vision: string;

  // AI outputs
  natal_chart_data: Record<string, unknown> | null;
  human_design_data: Record<string, unknown> | null;
  facilitator_briefing: string | null;
  flow_profile_draft: string | null;
  flow_profile_final: string | null;
  flow_profile_json: import('@/types/profile-json').FlowProfileJSON | null;

  // Session tracking
  session_1_notes: string | null;
  session_1_date: string | null;
  session_2_notes: string | null;
  session_2_date: string | null;

  // Delivery
  view_token: string | null;

  // Prompt tracking
  prompt_template_id: string | null;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  prompt_text: string;
  model: string;
  max_tokens: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileGeneration {
  id: string;
  assessment_id: string;
  prompt_template_id: string | null;
  prompt_name: string;
  model: string;
  content: string;
  label: string | null;
  delivered: boolean;
  generated_at: string;
}
