/**
 * One-shot quality check for the Timeless Map V2 prompt (archetype + true north).
 *
 *   npx tsx --env-file=.env.local scripts/test-timeless-map.ts "Full Name" 1990-06-15 "City"
 */

import Anthropic from '@anthropic-ai/sdk';
import { buildNumerologyProfile } from '../src/lib/numerology';
import { formatNameSignature } from '../src/lib/name-etymology';

const fullName = process.argv[2] ?? 'Alexandre Martel';
const birthDate = process.argv[3] ?? '1990-06-15';
const birthLocation = process.argv[4] ?? 'Montreal, Quebec';

function getSunSignFromDate(birthDate: string): string {
  const date = new Date(birthDate);
  const m = date.getMonth() + 1, d = date.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Aries';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Taurus';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Gemini';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Cancer';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Leo';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Virgo';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Libra';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Scorpio';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'Sagittarius';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Capricorn';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Aquarius';
  return 'Pisces';
}

const numerology = buildNumerologyProfile(fullName, birthDate);
const nameSignature = formatNameSignature(fullName);
const sunSign = getSunSignFromDate(birthDate);

const prompt = `You are writing a Timeless Map — a deep reading of one person from three ancient layers: name etymology, numerology, and natal astrology. This maps what is static in them: the architecture beneath the surface story, the patterns that were there before any job, project, or season.

Your reader is curious and open but not steeped in esoteric traditions. Translate everything into plain language. No jargon, no "Life Path 7 people tend to..." — extract the actual insight and write it as an observation about this specific person.

## SUBJECT DATA

Name: ${fullName}
Birth date: ${birthDate} | ${birthLocation}

## NAME ETYMOLOGY
${nameSignature || `(Name "${fullName}" not found in etymology database — use the sound, structure, and cultural context of the name itself.)`}

## NUMEROLOGY
Life Path ${numerology.lifePath}: ${numerology.lifePathMeaning}
Expression ${numerology.expression}: ${numerology.expressionMeaning}
Soul Urge ${numerology.soulUrge}: ${numerology.soulUrgeMeaning}
Personality ${numerology.personality}: ${numerology.personalityMeaning}
Birthday Number ${numerology.birthdayNumber}: ${numerology.birthdayMeaning}
${numerology.convergenceNote ? `Convergences and tensions: ${numerology.convergenceNote}` : ''}

## NATAL PATTERN
Natal chart not available. Sun sign from birth date: ${sunSign} | Born: ${birthLocation}

## THE ARCHETYPE (write this last, even though it appears first)

Before finalizing, find the one place where all three layers point at the same structure — or where two of them pull against the third. That intersection is the archetype. Crown it with a bespoke 2-4 word title that no other person would receive: specific, earned, slightly surprising, instantly recognizable to the person as theirs. Test it: if the title could fit a thousand people, sharpen it until it fits one.

## TONE RULES
- Write in warm second person — "you", direct and close, like someone who has read the map and is telling you what they see.
- Do not mention numerology, astrology, or etymology as disciplines. Translate into plain observation.
- Direct, slightly literary, warmly precise. Not mystical, not vague, never flattering for its own sake.
- Flowing prose. No bullet points, no headers inside fields.
- Total length across all fields: ~420 words.`;

const MAP_TOOL: Anthropic.Tool = {
  name: 'generate_timeless_map',
  description: 'Output the structured Timeless Map reading as JSON',
  input_schema: {
    type: 'object' as const,
    properties: {
      archetype: { type: 'string', description: 'Bespoke 2-4 word archetype title. BANNED: The Seeker, The Visionary, The Creator, The Explorer, The Builder, The Dreamer, The Leader, The Healer, or any single-word archetype.' },
      epigraph: { type: 'string', description: 'One line, 12 words or fewer.' },
      name_signal: { type: 'string' },
      birth_code: { type: 'string' },
      natal_pattern: { type: 'string' },
      flow_architecture: { type: 'string' },
      true_north: { type: 'string', description: '2-3 sentences: what you are built to protect, and what kind of future image actually pulls you.' },
    },
    required: ['archetype', 'epigraph', 'name_signal', 'birth_code', 'natal_pattern', 'flow_architecture', 'true_north'],
  },
};

async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1100,
    tools: [MAP_TOOL],
    tool_choice: { type: 'tool', name: 'generate_timeless_map' },
    messages: [{ role: 'user', content: prompt }],
  });
  const block = msg.content.find(b => b.type === 'tool_use');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out = (block as any)?.input;
  console.log(`\n✦ ${out.archetype} ✦`);
  console.log(`"${out.epigraph}"\n`);
  for (const k of ['name_signal', 'birth_code', 'natal_pattern', 'flow_architecture', 'true_north']) {
    console.log(`[${k.toUpperCase()}]\n${out[k]}\n`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
