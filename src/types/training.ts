export type Pillar = 'self' | 'space' | 'story' | 'spirit';
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;
export type CardType = 'mechanic' | 'quality' | 'technique' | 'concept';
export type CardPhase = 'study' | 'recall';

export interface Mechanic {
  id: string;
  title: string;
  pillar: Pillar;
  flow_key: string;
  keywords: string[];
  definition: string;
  content_md: string;
  recall_md: string | null;
  enrichment_score: number;
  techniques_count: number;
  related_mechanics: string[];
  card_type: CardType;
  parent_mechanic_id: string | null;
  content_hash: string | null;
  updated_at: string;
}

export interface MechanicReview {
  id: string;
  user_id: string;
  mechanic_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  last_quality: number | null;
  phase: CardPhase;
  created_at: string;
}

export interface QueueItem {
  mechanic: Mechanic;
  review: MechanicReview | null;
  is_new: boolean;
  content_updated: boolean;
  /** Linked technique/concept cards for study mode */
  children?: Mechanic[];
}

export interface QueueStats {
  due_count: number;
  new_count: number;
  total_introduced: number;
  total_mechanics: number;
}

export interface QueueResponse {
  queue: QueueItem[];
  stats: QueueStats;
}

export interface ReviewUpdate {
  mechanic_id: string;
  quality: Quality;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  phase?: CardPhase;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  cards_reviewed: number;
  cards_studied: number;
  cards_correct: number;
  cards_missed: number;
  session_type: string;
  pillar_focus: string | null;
  key_focus: string | null;
}

export interface MasteryStats {
  total: number;
  unseen: number;
  learning: number;
  young: number;
  mature: number;
  studying: number;
  by_pillar: Record<Pillar, { total: number; introduced: number; mature: number }>;
  mechanics: Array<{
    id: string;
    title: string;
    pillar: Pillar;
    flow_key: string;
    mastery_level: 'unseen' | 'learning' | 'young' | 'mature';
    repetitions: number;
    interval_days: number;
    next_review_at: string | null;
    enrichment_score: number;
    definition: string;
    keywords: string[];
    card_type: CardType;
    parent_mechanic_id: string | null;
    techniques_count: number;
  }>;
}

/** SM-2 mastery classification */
export function getMasteryLevel(
  review: Pick<MechanicReview, 'repetitions' | 'interval_days'> | null
): 'unseen' | 'learning' | 'young' | 'mature' {
  if (!review) return 'unseen';
  if (review.repetitions < 3 || review.interval_days <= 6) return 'learning';
  if (review.interval_days <= 21) return 'young';
  return 'mature';
}
