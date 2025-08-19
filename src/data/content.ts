import { ContentItem } from "@/types/framework";

export const CONTENT_REPOSITORY: ContentItem[] = [
  {
    id: "tuned-emotions-essential",
    title: "Tuned Emotions", 
    description: "Using emotional signals as precision instruments for flow navigation and optimal performance",
    content: `## Essential Function

Tuned emotions transform emotional responses from disruptive forces into sophisticated navigation instruments.

## Flow Impact

Neurobiological research demonstrates that emotions regulate cognitive load through the anterior cingulate cortex and insula, which monitor challenge-skill balance. When emotional arousal matches task demands, the brain achieves optimal activation patterns characteristic of flow states.

## In Action

Pre-task Calibration: Scan current emotional state before beginning focused work.
Real-time Monitoring: Maintain peripheral awareness of emotional shifts during work.
Course Correction: When anxiety emerges, break tasks into smaller components.

## Observable Patterns

When Present: Emotional states provide clear directional guidance
When Absent: Emotions feel disruptive or disconnected from performance

## Strengthening Protocol

Emotion-Task Mapping: Track which emotional states correlate with peak performance.
Micro-Calibration Practice: Implement 30-second emotional check-ins every 20 minutes.

## Related Flow Keys
Related Flow Keys connect to other flow elements.`,
    tags: ["emotions", "flow-navigation", "neuroscience"],
    type: "learn",
    dimension: "self", 
    key: "tuned-emotions",
    is_pinned: true,
    pin_order: 1,
    created_date: "2024-12-19",
    read_time: 2,
    difficulty: "Beginner"
  }
];

export function getContentById(id: string): ContentItem | null {
  return CONTENT_REPOSITORY.find(item => item.id === id) || null;
}

export function getContentByDimension(dimension: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.dimension === dimension);
}

export function getContentByKey(key: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.key === key);
}

export function getPinnedContent(): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.is_pinned).sort((a, b) => (a.pin_order || 0) - (b.pin_order || 0));
}

export function getContentByType(type: "learn" | "practice"): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.type === type);
}

export function getContentByDimensionAndKey(dimension: string, key: string): ContentItem[] {
  return CONTENT_REPOSITORY.filter(item => item.dimension === dimension && item.key === key);
}
