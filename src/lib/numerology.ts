/**
 * Numerology computation for Flow Profile deep signature data.
 * Pythagorean system. No external dependencies.
 */

const PYTHAGOREAN: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
};

const VOWELS = new Set(['a','e','i','o','u']);

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

export function calcLifePath(birthDate: string): number {
  const digits = birthDate.replace(/-/g, '').split('').map(Number);
  return reduce(digits.reduce((a, d) => a + d, 0));
}

export function calcExpression(fullName: string): number {
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('');
  return reduce(letters.reduce((a, l) => a + (PYTHAGOREAN[l] ?? 0), 0));
}

export function calcSoulUrge(fullName: string): number {
  const vowels = fullName.toLowerCase().replace(/[^a-z]/g, '').split('').filter(l => VOWELS.has(l));
  return reduce(vowels.reduce((a, l) => a + (PYTHAGOREAN[l] ?? 0), 0));
}

export function calcPersonality(fullName: string): number {
  const consonants = fullName.toLowerCase().replace(/[^a-z]/g, '').split('').filter(l => !VOWELS.has(l));
  return reduce(consonants.reduce((a, l) => a + (PYTHAGOREAN[l] ?? 0), 0));
}

export function calcBirthdayNumber(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2] ?? '1', 10);
  return reduce(day);
}

// Plain-language meaning maps — no numerology jargon in output
const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: 'pioneer and self-starter; here to lead, initiate, and forge independent paths — most alive when going first',
  2: 'sensitive mediator; here to cooperate, receive, and bridge opposites — most alive in genuine partnership',
  3: 'creative expressive; here to communicate, connect, and bring ideas into form through voice — most alive when creating',
  4: 'master builder; here to construct lasting things through discipline and sustained effort — most alive when building something real',
  5: 'freedom-seeker and experiential learner; here to change, adapt, and teach through lived experience — most alive in motion',
  6: 'responsible nurturer; here to care, harmonize, and carry weight for others — most alive when needed',
  7: 'depth-seeker and truth-investigator; here to go beneath surfaces and find what is actually true — most alive in solitude and inquiry',
  8: 'power-builder; here to develop authority, material mastery, and influence at scale — most alive when executing at the edge of their capacity',
  9: 'universal servant and world-teacher; here to complete cycles, serve broadly, and give what was earned — most alive when contributing to something larger than themselves',
  11: 'visionary channel; here to bridge the intuitive and the material, inspire through insight — most alive when translating what they sense into form others can use',
  22: 'master builder at civilization scale; here to construct systems that serve many — most alive when building something that will outlast them',
  33: 'master teacher; here to heal and uplift through selfless service — most alive when the teaching lands in someone else',
};

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: 'the outer form of their life expresses through leadership, initiative, and original thinking',
  2: 'the outer form of their life expresses through partnership, sensitivity, and diplomacy',
  3: 'the outer form of their life expresses through creativity, communication, and social connection',
  4: 'the outer form of their life expresses through building, organizing, and bringing lasting order',
  5: 'the outer form of their life expresses through freedom, versatility, and engaging multiple domains simultaneously',
  6: 'the outer form of their life expresses through nurturing, responsibility, and creating harmony',
  7: 'the outer form of their life expresses through analysis, wisdom, and penetrating insight',
  8: 'the outer form of their life expresses through authority, material vision, and executive competence',
  9: 'the outer form of their life expresses through broad service, completion, and universal compassion',
  11: 'the outer form of their life expresses through inspiration, visionary thinking, and spiritual sensitivity',
  22: 'the outer form of their life expresses through large-scale building, organization, and practical idealism',
  33: 'the outer form of their life expresses through master teaching and collective healing',
};

const SOUL_URGE_MEANINGS: Record<number, string> = {
  1: 'privately craves independence, self-determination, and the experience of being first',
  2: 'privately craves harmony, partnership, and being truly loved and understood',
  3: 'privately craves creative expression, joy, and the experience of being heard',
  4: 'privately craves order, security, and the deep satisfaction of a thing well-built',
  5: 'privately craves freedom, variety, and the constant novelty of new experience',
  6: 'privately craves domestic harmony, being genuinely needed, and creating beauty',
  7: 'privately craves solitude, deep understanding, and contact with what is spiritually true',
  8: 'privately craves power, recognition, and the experience of material achievement',
  9: 'privately craves to give back, to complete something meaningful, to matter beyond their own life',
  11: 'privately craves to be a vessel for something larger than themselves, to illuminate',
  22: 'privately craves to build something that outlasts their lifetime',
  33: 'privately craves to heal, uplift, and serve without limit or recognition',
};

const PERSONALITY_MEANINGS: Record<number, string> = {
  1: 'others experience them as confident, bold, and independent',
  2: 'others experience them as warm, receptive, and harmonious',
  3: 'others experience them as charming, expressive, and socially alive',
  4: 'others experience them as reliable, grounded, and practically capable',
  5: 'others experience them as dynamic, free-spirited, and adaptable',
  6: 'others experience them as responsible, caring, and trustworthy',
  7: 'others experience them as reserved, deeply thoughtful, and somewhat mysterious',
  8: 'others experience them as authoritative, successful, and capable of executing at scale',
  9: 'others experience them as wise, compassionate, and broadly generous',
  11: 'others experience them as intuitive, inspiring, and idealistic',
  22: 'others experience them as visionary, powerful, and systematically capable',
  33: 'others experience them as deeply compassionate and carrying unusual spiritual weight',
};

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthdayNumber: number;
  lifePathMeaning: string;
  expressionMeaning: string;
  soulUrgeMeaning: string;
  personalityMeaning: string;
  birthdayMeaning: string;
  convergenceNote: string;
}

export function buildNumerologyProfile(fullName: string, birthDate: string): NumerologyProfile {
  const lifePath = calcLifePath(birthDate);
  const expression = calcExpression(fullName);
  const soulUrge = calcSoulUrge(fullName);
  const personality = calcPersonality(fullName);
  const birthdayNumber = calcBirthdayNumber(birthDate);

  // Note convergences and tensions
  const notes: string[] = [];
  if (lifePath === expression) {
    notes.push(`Life Path and Expression are both ${lifePath} — the life's purpose and its outer form are the same. What they are is what they do.`);
  }
  if (lifePath === soulUrge) {
    notes.push(`Life Path and Soul Urge match (${lifePath}) — what they privately want aligns with what they're here to do. Rare internal coherence.`);
  }
  if (Math.abs(lifePath - soulUrge) > 4 && lifePath !== soulUrge) {
    notes.push(`Life Path (${lifePath}) and Soul Urge (${soulUrge}) diverge significantly — there is a gap between what they're here to do and what they privately desire. This tension is often where the most interesting growth lives.`);
  }
  if (personality !== expression && personality !== lifePath) {
    notes.push(`Personality (${personality}) differs from both Life Path and Expression — how others experience them on first contact is different from both their purpose and their deeper nature.`);
  }

  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthdayNumber,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] ?? `Life Path ${lifePath}`,
    expressionMeaning: EXPRESSION_MEANINGS[expression] ?? `Expression ${expression}`,
    soulUrgeMeaning: SOUL_URGE_MEANINGS[soulUrge] ?? `Soul Urge ${soulUrge}`,
    personalityMeaning: PERSONALITY_MEANINGS[personality] ?? `Personality ${personality}`,
    birthdayMeaning: `Born on the ${birthdayNumber}th — ${PERSONALITY_MEANINGS[birthdayNumber] ?? `natural ${birthdayNumber} energy`}`,
    convergenceNote: notes.join(' '),
  };
}
