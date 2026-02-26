// ─── Flow Profile Intake — v2 Schema ───────────────────────────────────────
// Single source of truth for form state, DB storage, and LLM prompt building.

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type StressPattern = 'tightening' | 'collapse' | 'restlessness' | 'numbness';
export type EnvironmentFeel = 'sanctuary' | 'functional' | 'chaotic' | 'unexamined';
export type FeedbackChannel = 'internal' | 'external' | 'data' | 'embodied';
export type NarrativeArc =
  | 'heros-journey'
  | 'return'
  | 'initiation'
  | 'long-becoming'
  | 'fall-and-rise'
  | 'revolution'
  | 'devotion'
  | 'witness';
export type MissionClarity = 'clear' | 'forming' | 'fuzzy' | 'unarticulated';
export type RoleArchitect = 'architect' | 'builder';
export type RolePioneer = 'pioneer' | 'integrator';
export type RoleIndependence = 'independent' | 'collaborative';
export type RoleTeacher = 'teacher' | 'student';

// ─── Full form state (what React holds) ─────────────────────────────────────

export interface IntakeFormData {
  // Step 1 — Personal
  name: string;
  email: string;

  // Step 2 — Signal Origin
  birth_date: string;
  birth_time: string;
  birth_time_known: boolean;
  birth_location: string;
  birth_lat: string;
  birth_lng: string;

  // Step 3 — Opening Frame
  opening_season: Season | '';
  opening_chapter_title: string;
  opening_orientation_word: string;

  // Step 4 — SELF
  // Tuned Emotions
  self_emotions_keywords: string[];
  self_emotions_alive: string;
  self_emotions_hard: string;
  // Focused Body
  self_body_energy: number;        // 0–10
  self_body_story: string;
  self_body_stress: StressPattern | '';
  // Open Mind
  self_mind_clarity: number;       // 0–10
  self_mind_new_idea: string;
  self_mind_drawn_toward: string;

  // Step 5 — SPACE
  // Intentional Space
  space_environment_feel: EnvironmentFeel | '';
  space_environment_story: string;
  space_environment_gap: string;
  // Optimized Tools
  space_tools_keywords: string[];
  space_tools_story: string;
  // Feedback Systems
  space_feedback_channel: FeedbackChannel | '';
  space_feedback_story: string;

  // Step 6 — STORY
  // Generative Story
  story_narrative_last5: string;
  story_narrative_next5: string;
  story_narrative_arc: NarrativeArc | '';
  // Clear Mission
  story_mission_completion: string;
  story_mission_clarity: MissionClarity | '';
  story_mission_distraction: string;
  // Empowered Role
  story_role_pair1: RoleArchitect | '';
  story_role_pair2: RolePioneer | '';
  story_role_pair3: RoleIndependence | '';
  story_role_pair4: RoleTeacher | '';
  story_role_story: string;

  // Step 7 — SPIRIT
  // Grounding Values
  spirit_values_selected: string[];
  spirit_values_in_action: string;
  // Ignited Curiosity
  spirit_curiosity_flow_memory: string;
  spirit_curiosity_intersection: string;
  spirit_curiosity_invisibility: string;
  // Visualized Vision
  spirit_vision_image: string;
  spirit_vision_peak: string;        // peak experience (most alive)
  spirit_vision_legacy: string;

  // Step 8 — Soul Signature
  soul_myth_character: string;
  soul_myth_quality: string;
  soul_fairy_tale_childhood: string;
  soul_fairy_tale_now: string;
  soul_shadow_projection: string;
  soul_nadir_story: string;          // darkest moment
  soul_turning_point: string;        // moment of self-understanding change
  soul_gift: string;
  soul_hidden_self: string;
  soul_word: string;
  soul_closing_stem: string;         // "The thing I most want someone who understands me to know..."
}

export const INITIAL_INTAKE_DATA: IntakeFormData = {
  name: '',
  email: '',
  birth_date: '',
  birth_time: '',
  birth_time_known: false,
  birth_location: '',
  birth_lat: '',
  birth_lng: '',
  opening_season: '',
  opening_chapter_title: '',
  opening_orientation_word: '',
  self_emotions_keywords: [],
  self_emotions_alive: '',
  self_emotions_hard: '',
  self_body_energy: 5,
  self_body_story: '',
  self_body_stress: '',
  self_mind_clarity: 5,
  self_mind_new_idea: '',
  self_mind_drawn_toward: '',
  space_environment_feel: '',
  space_environment_story: '',
  space_environment_gap: '',
  space_tools_keywords: [],
  space_tools_story: '',
  space_feedback_channel: '',
  space_feedback_story: '',
  story_narrative_last5: '',
  story_narrative_next5: '',
  story_narrative_arc: '',
  story_mission_completion: '',
  story_mission_clarity: '',
  story_mission_distraction: '',
  story_role_pair1: '',
  story_role_pair2: '',
  story_role_pair3: '',
  story_role_pair4: '',
  story_role_story: '',
  spirit_values_selected: [],
  spirit_values_in_action: '',
  spirit_curiosity_flow_memory: '',
  spirit_curiosity_intersection: '',
  spirit_curiosity_invisibility: '',
  spirit_vision_image: '',
  spirit_vision_peak: '',
  spirit_vision_legacy: '',
  soul_myth_character: '',
  soul_myth_quality: '',
  soul_fairy_tale_childhood: '',
  soul_fairy_tale_now: '',
  soul_shadow_projection: '',
  soul_nadir_story: '',
  soul_turning_point: '',
  soul_gift: '',
  soul_hidden_self: '',
  soul_word: '',
  soul_closing_stem: '',
};

// ─── DB storage type (what gets saved as intake_structured JSONB) ─────────────
// Same shape, but ensures schema_version is present.

export interface IntakeStructuredV2 extends IntakeFormData {
  schema_version: '2.0';
}

export function toIntakeStructured(data: IntakeFormData): IntakeStructuredV2 {
  return { ...data, schema_version: '2.0' };
}
