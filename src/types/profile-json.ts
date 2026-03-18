import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  personal_key?: string; // 1-2 sentence distilled unlock, personalized to this person's signature
  insight: string; // 50-60 word personal paragraph, mechanic-informed
}

export interface DimensionData {
  summary?: string;  // optional — removed from new profiles, kept for backwards compat
  keys: Partial<Record<KeyType, KeyData>>;
}

export interface FlowProfileJSON {
  schema_version: '3.0';
  archetype: {
    name: string;
    tagline: string;
    framing?: string;
  };
  dimensions: Record<DimensionType, DimensionData>;
}
