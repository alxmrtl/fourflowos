import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  personal_key?: string; // 1-2 sentence distilled unlock, personalized to this person's signature
  insight: string; // 50-60 word personal paragraph, mechanic-informed
}

export interface DimensionData {
  summary: string;
  keys: Partial<Record<KeyType, KeyData>>;
}

export interface OverviewData {
  headline: string;    // one sentence: the most defining truth about how this person flows
  flow?: string[];     // 4 items: behaviors/conditions that generate flow for this person
  friction?: string[]; // 4 items: patterns that block flow for this person
  keys?: string[];     // legacy: 3-5 cross-pillar statements (v3.0)
}

export interface FlowProfileJSON {
  schema_version: '3.0';
  archetype: {
    name: string;
    tagline: string;
    framing?: string;
  };
  overview?: OverviewData;
  dimensions: Record<DimensionType, DimensionData>;
}
