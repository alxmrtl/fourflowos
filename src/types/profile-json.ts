import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  insight: string; // ~100-word personal paragraph, mechanic-informed
}

export interface DimensionData {
  summary: string;
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
