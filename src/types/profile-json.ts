import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  insight: string; // 50-60 word personal paragraph, mechanic-informed
}

export interface DimensionData {
  summary: string;
  keys: Partial<Record<KeyType, KeyData>>;
}

export interface OverviewData {
  headline: string;  // one sentence: the most defining truth about how this person flows
  keys: string[];    // 3-5 cross-pillar statements, specific to this person
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
