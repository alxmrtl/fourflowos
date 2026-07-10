// ─── Workshop Intake (Flow Map Session — "the Transfer") ────────────────────
// Single source of truth for the /profile/workshop intake: key ids, dial
// values, screen structure (dimension → keys → prompts), and the JSONB shape
// stored in assessments.intake_structured for source === 'workshop'.
//
// Key ids are snake_case, mirroring the workshop-v1 payload spec
// (OFFERS/flow-map-session/web-intake-spec.md). Prompts are verbatim from
// session-design.md — any wording change must land there, on the worksheet,
// and here together.

export const WORKSHOP_KEY_IDS = [
  'tuned_emotions',
  'focused_body',
  'open_mind',
  'intentional_space',
  'optimized_tools',
  'feedback_systems',
  'generative_story',
  'clear_mission',
  'empowered_role',
  'grounding_values',
  'ignited_curiosity',
  'visualized_vision',
] as const;

export type WorkshopKeyId = (typeof WORKSHOP_KEY_IDS)[number];

export const WORKSHOP_DIALS = ['stuck', 'turning', 'open'] as const;
export type WorkshopDial = (typeof WORKSHOP_DIALS)[number];

export interface WorkshopKeyEntry {
  dial: WorkshopDial;
  line?: string;
}

/** The workshop-v1 JSONB payload stored in assessments.intake_structured. */
export interface WorkshopIntakeStructured {
  version: 'workshop-v1';
  cohort: string;
  keys: Record<WorkshopKeyId, WorkshopKeyEntry>;
  carrying_key: WorkshopKeyId;
  stuck_key: WorkshopKeyId;
  cascade_line: string;
  free_text: string;
}

// ─── Screen structure (mirrors the Flow Map worksheet, panel for panel) ──────

export interface WorkshopKeyDef {
  id: WorkshopKeyId;
  name: string;
  /** The sheet's prompt, verbatim — used as the optional line's placeholder. */
  prompt: string;
}

export interface WorkshopDimensionDef {
  id: 'self' | 'space' | 'story' | 'spirit';
  name: 'SELF' | 'SPACE' | 'STORY' | 'SPIRIT';
  subhead: string;
  question: string;
  keys: [WorkshopKeyDef, WorkshopKeyDef, WorkshopKeyDef];
}

export const WORKSHOP_DIMENSIONS: WorkshopDimensionDef[] = [
  {
    id: 'self',
    name: 'SELF',
    subhead: 'Your State',
    question: 'Are you actually available for this work?',
    keys: [
      {
        id: 'tuned_emotions',
        name: 'Tuned Emotions',
        prompt:
          'What emotion has been running the show at work lately — and is it fueling you or draining you?',
      },
      {
        id: 'focused_body',
        name: 'Focused Body',
        prompt:
          'When you’re stuck, what does your body do — move, tense up, reach for the phone?',
      },
      {
        id: 'open_mind',
        name: 'Open Mind',
        prompt:
          'What’s on loan in your head right now — the open loops you’re carrying that belong on paper somewhere?',
      },
    ],
  },
  {
    id: 'space',
    name: 'SPACE',
    subhead: 'Your Setup',
    question: 'Is your environment working for you, or are you working around it?',
    keys: [
      {
        id: 'intentional_space',
        name: 'Intentional Space',
        prompt:
          'Describe where you do your best thinking. Now — is that where you actually spend your hours?',
      },
      {
        id: 'optimized_tools',
        name: 'Optimized Tools',
        prompt:
          'Which tool do you fight with most days? Which one disappears when you’re working?',
      },
      {
        id: 'feedback_systems',
        name: 'Feedback Systems',
        prompt:
          'How do you know your work is working — same week, or same quarter?',
      },
    ],
  },
  {
    id: 'story',
    name: 'STORY',
    subhead: 'Your Arc',
    question: 'Do you know where you’re going, and do you own the journey?',
    keys: [
      {
        id: 'generative_story',
        name: 'Generative Story',
        prompt:
          'The last two years of my work have been the chapter where ______.',
      },
      {
        id: 'clear_mission',
        name: 'Clear Mission',
        prompt:
          'What are you actually building right now — this month, not the dream?',
      },
      {
        id: 'empowered_role',
        name: 'Empowered Role',
        prompt:
          'Did you choose your current role, or end up in it? One thing you’d change if you could?',
      },
    ],
  },
  {
    id: 'spirit',
    name: 'SPIRIT',
    subhead: 'Your Why',
    question: 'Is there something real beneath the arc that makes it worth doing?',
    keys: [
      {
        id: 'grounding_values',
        name: 'Grounding Values',
        prompt: 'What would you never compromise on, even if it cost you?',
      },
      {
        id: 'ignited_curiosity',
        name: 'Ignited Curiosity',
        prompt:
          'What do you lose track of time doing? When did that last happen at work?',
      },
      {
        id: 'visualized_vision',
        name: 'Visualized Vision',
        prompt:
          'Three years out, best version: what does an ordinary Tuesday look like? Can you actually see it?',
      },
    ],
  },
];

/** Flat lookup: key id → { name, dimension }. Used by process formatting + pickers. */
export const WORKSHOP_KEY_LOOKUP: Record<
  WorkshopKeyId,
  { name: string; dimension: WorkshopDimensionDef['id'] }
> = Object.fromEntries(
  WORKSHOP_DIMENSIONS.flatMap((dim) =>
    dim.keys.map((key) => [key.id, { name: key.name, dimension: dim.id }])
  )
) as Record<WorkshopKeyId, { name: string; dimension: WorkshopDimensionDef['id'] }>;

export const WORKSHOP_DIAL_LEGEND: Record<WorkshopDial, string> = {
  stuck: 'it’s costing you',
  turning: 'workable, in motion',
  open: 'it carries you',
};
