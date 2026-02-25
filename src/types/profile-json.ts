import type { KeyType, DimensionType } from './framework';

export interface KeyData {
  insight: string;
  invitation: string;
}

export interface DimensionData {
  summary: string;
  keys: Partial<Record<KeyType, KeyData>>;
}

export interface FlowProfileJSON {
  schema_version: '1.0';
  archetype: {
    name: string;
    tagline: string;
    framing: string;
  };
  dimensions: Record<DimensionType, DimensionData>;
}
