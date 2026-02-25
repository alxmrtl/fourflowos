import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  bullets?: string[];   // v2: 4-item array (Essence / Pattern / Tension / Direction)
  insight?: string;     // v1: legacy prose
  invitation?: string;  // v1: legacy prose
}

export interface DimensionData {
  summary: string;
  keys: Partial<Record<KeyType, KeyData>>;
}

export interface FlowProfileJSON {
  schema_version: '1.0' | '2.0';
  archetype: {
    name: string;
    tagline: string;
    framing: string;
  };
  dimensions: Record<DimensionType, DimensionData>;
}
