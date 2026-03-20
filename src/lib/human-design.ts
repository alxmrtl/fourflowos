/**
 * Human Design calculation for Flow Profile deep signature data.
 * Wraps natalengine + geo-tz. Returns a formatted HD_SIGNATURE_DATA string block.
 * No external API calls — all computation is local.
 */

/** Minimal types for natalengine HD output */
interface HDType {
  name: string;
  strategy: string;
  notSelf: string;
  signature: string;
}

interface HDAuthority {
  name: string;
  description: string;
}

interface HDProfile {
  numbers: string;
  name: string;
  theme: string;
}

interface HDCenter {
  name: string;
  theme: string;
}

interface HDIncarnationCross {
  name: string;
  gates?: number[];
  theme?: string;
}

interface HDResult {
  type: HDType;
  authority: HDAuthority;
  profile: HDProfile;
  definition: string;
  incarnationCross: HDIncarnationCross | null;
  centers: {
    defined: HDCenter[];
    undefined: HDCenter[];
    definedNames: string[];
    undefinedNames: string[];
  };
}

/**
 * Resolve UTC offset for a given timezone and date (handles DST).
 * Returns an integer (e.g. -5, +9, 0).
 */
function getUtcOffset(tzName: string, birthDate: string): number {
  try {
    const date = new Date(`${birthDate}T12:00:00`);
    const fmt = new Intl.DateTimeFormat('en', {
      timeZone: tzName,
      timeZoneName: 'shortOffset',
      year: 'numeric',
    } as Intl.DateTimeFormatOptions);
    const parts = fmt.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0';
    // tzPart examples: 'GMT-5', 'GMT+9', 'GMT'
    const match = tzPart.match(/GMT([+-]\d+(?:\.\d+)?)?/);
    if (!match) return 0;
    return match[1] ? parseFloat(match[1]) : 0;
  } catch {
    return 0;
  }
}

/**
 * Parse a birth_time string (HH:MM or H:MM) into a decimal hour.
 * Returns 12 (noon) as a safe default if parsing fails.
 */
function parseTimeToDecimalHour(birthTime: string): number {
  const match = birthTime.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 12;
  return parseInt(match[1], 10) + parseInt(match[2], 10) / 60;
}

/**
 * Calculate Human Design and return a prompt-ready string block.
 * Returns null if birth time is unknown or inputs are missing.
 */
export async function buildHumanDesignSignature(
  birthDate: string | null | undefined,
  birthTime: string | null | undefined,
  birthTimeKnown: boolean | null | undefined,
  birthLat: number | null | undefined,
  birthLng: number | null | undefined
): Promise<string | null> {
  if (!birthTimeKnown || !birthDate || !birthTime || birthLat == null || birthLng == null) {
    return null;
  }

  try {
    const [{ find }, hdModule] = await Promise.all([
      import('geo-tz') as Promise<{ find: (lat: number, lng: number) => string[] }>,
      // natalengine ships as pure ESM with no TypeScript declarations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      import('natalengine/humandesign') as Promise<any>,
    ]);
    const calculateHumanDesign = hdModule.calculateHumanDesign as (
      date: string,
      hour: number,
      tz: number
    ) => HDResult;

    const tzNames = find(birthLat, birthLng);
    const tzName = tzNames[0] ?? 'UTC';
    const utcOffset = getUtcOffset(tzName, birthDate);
    const birthHour = parseTimeToDecimalHour(birthTime);

    const hd = calculateHumanDesign(birthDate, birthHour, utcOffset);

    const definedNames = hd.centers.definedNames.map((c) => capitalize(c)).join(', ') || 'None';
    const undefinedNames = hd.centers.undefinedNames.map((c) => capitalize(c)).join(', ') || 'None';

    const crossLine = hd.incarnationCross
      ? `${hd.incarnationCross.name}${hd.incarnationCross.gates?.length ? ` (Gates ${hd.incarnationCross.gates.join(', ')})` : ''}${hd.incarnationCross.theme ? ` — ${hd.incarnationCross.theme}` : ''}`
      : 'Unknown';

    const lines = [
      '### Human Design Signature',
      `Type: ${hd.type.name}`,
      `Strategy: ${hd.type.strategy}`,
      `Authority: ${hd.authority.name} — ${hd.authority.description}`,
      `Profile: ${hd.profile.numbers} (${hd.profile.name}) — ${hd.profile.theme}`,
      `Definition: ${hd.definition}`,
      `Incarnation Cross: ${crossLine}`,
      `Defined Centers: ${definedNames}`,
      `Undefined Centers: ${undefinedNames}`,
      '',
      'Distill these signals into the profile\'s archetype layer and flow key observations.',
      'Do not mention Human Design, gates, channels, centers, or HD vocabulary.',
      'Surface only the human insight: how this person is wired to operate, where energy is consistent, where it is not.',
    ];

    return lines.join('\n');
  } catch (err) {
    console.error('[human-design] Calculation failed:', err);
    return null;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
