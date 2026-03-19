#!/usr/bin/env node
/**
 * sync-compendium.js
 *
 * Reads all mechanic markdown files from compendium/framework/,
 * parses YAML frontmatter + body, and upserts into the Supabase `mechanics` table.
 *
 * Run from the website directory:
 *   node scripts/sync-compendium.js
 *
 * Or from the parent repo root:
 *   node website/fourflowos-web/scripts/sync-compendium.js
 *
 * Env vars (loaded from website/.env.local automatically):
 *   SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { createClient } = require('@supabase/supabase-js');

// ─── Load env vars ───────────────────────────────────────────────────────────

function loadEnv() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) return;

  // Script at: website/fourflowos-web/scripts/sync-compendium.js
  // Website root: website/fourflowos-web/
  const scriptDir = __dirname;
  const websiteRoot = path.join(scriptDir, '..');

  const candidates = [
    path.join(websiteRoot, '.env.local'),
    path.join(websiteRoot, '.env'),
  ];

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
    console.log(`Loaded env from: ${envPath}`);
    return;
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n❌ Missing env vars. Need SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  console.error('   Set them in environment or in website/fourflowos-web/.env.local\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Paths ───────────────────────────────────────────────────────────────────

// script is in website/fourflowos-web/scripts/
// compendium is at FourFlowOS/compendium/framework/
const COMPENDIUM_PATH = path.join(__dirname, '../../../compendium/framework');

const PILLAR_MAP = {
  SELF: 'self',
  SPACE: 'space',
  STORY: 'story',
  SPIRIT: 'spirit',
};

// ─── Parsing ─────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  let frontmatter = {};
  try {
    frontmatter = yaml.load(match[1]) || {};
  } catch (e) {
    console.warn('  YAML parse warning:', e.message);
  }

  return { frontmatter, body: match[2] };
}

function estimateScore(body) {
  // Count named H3 headings (actual technique entries, not empty lines)
  const h3Count = (body.match(/^### \S/gm) || []).length;

  // Has real book sources: a table row with an actual book slug (not just | [[]] | placeholder)
  const bookSection = body.match(/## Book Sources\n([\s\S]*?)(?=\n##|$)/);
  const hasBookSources = bookSection
    ? /\|\s*\[\[\s*[^\]]{2,}\s*\]\]/.test(bookSection[1])
    : false;

  // Has real "How It Enables Flow" content (not just HTML comment placeholder)
  const flowSection = body.match(/## How It Enables Flow\n\n?([\s\S]*?)(?=\n##|$)/);
  const flowContent = flowSection ? flowSection[1].replace(/<!--[\s\S]*?-->/g, '').trim() : '';
  const hasFlowContent = flowContent.length > 80;

  if (h3Count >= 3 && hasBookSources) return 5;
  if (h3Count >= 1 && hasBookSources) return 4;
  if (h3Count >= 1) return 3;
  if (hasFlowContent) return 2;
  return 1;
}

function extractRelatedMechanics(body) {
  const section = body.match(/## Related Mechanics\n([\s\S]*?)(?=\n##|$)/);
  if (!section) return [];
  const matches = [...section[1].matchAll(/\[\[([^\]]+)\]\]/g)];
  return matches.map(m => m[1]);
}

function countTechniques(body) {
  return (body.match(/^### /gm) || []).length;
}

// ─── Discovery ───────────────────────────────────────────────────────────────

function getMechanicFiles() {
  if (!fs.existsSync(COMPENDIUM_PATH)) {
    console.error(`\n❌ Compendium path not found: ${COMPENDIUM_PATH}`);
    console.error('   Run this script from within the FourFlowOS repo.\n');
    process.exit(1);
  }

  const mechanics = [];

  const pillarDirs = fs.readdirSync(COMPENDIUM_PATH).filter(
    d => PILLAR_MAP[d] && fs.statSync(path.join(COMPENDIUM_PATH, d)).isDirectory()
  );

  for (const pillarDir of pillarDirs) {
    const pillar = PILLAR_MAP[pillarDir];
    const pillarPath = path.join(COMPENDIUM_PATH, pillarDir);

    const keyDirs = fs.readdirSync(pillarPath).filter(
      d => fs.statSync(path.join(pillarPath, d)).isDirectory()
    );

    for (const keyDir of keyDirs) {
      const flowKey = keyDir.toLowerCase();
      const keyPath = path.join(pillarPath, keyDir);

      const files = fs.readdirSync(keyPath).filter(
        f => f.endsWith('.md') && f !== `${keyDir}.md` // skip key-level overview
      );

      for (const file of files) {
        const filePath = path.join(keyPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter, body } = parseFrontmatter(content);

        // Only process mechanic files (tagged type/mechanic)
        const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
        if (!tags.includes('type/mechanic')) continue;

        const id = file.replace('.md', '');
        const title = String(frontmatter.title || id).replace(/^["']|["']$/g, '');
        const definition = String(frontmatter.definition || '').replace(/^["']|["']$/g, '');
        const keywords = Array.isArray(frontmatter.keywords) ? frontmatter.keywords.map(String) : [];

        mechanics.push({
          id,
          title,
          pillar,
          flow_key: flowKey,
          keywords,
          definition,
          content_md: content,
          enrichment_score: estimateScore(body),
          techniques_count: countTechniques(body),
          related_mechanics: extractRelatedMechanics(body),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  return mechanics;
}

// ─── Sync ────────────────────────────────────────────────────────────────────

async function sync() {
  console.log(`\nFourFlow Compendium Sync`);
  console.log(`Compendium: ${COMPENDIUM_PATH}`);
  console.log(`Supabase:   ${SUPABASE_URL}\n`);

  const mechanics = getMechanicFiles();
  console.log(`Found ${mechanics.length} mechanics\n`);

  if (mechanics.length === 0) {
    console.error('No mechanics found — check compendium path and file structure.');
    process.exit(1);
  }

  // Score summary
  const scores = {};
  for (const m of mechanics) {
    scores[m.enrichment_score] = (scores[m.enrichment_score] || 0) + 1;
  }
  const scoreStr = Object.entries(scores)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([s, c]) => `  score ${s}: ${c}`)
    .join('\n');
  console.log(`Enrichment scores:\n${scoreStr}\n`);

  // Upsert in batches
  const BATCH = 20;
  let total = 0;

  for (let i = 0; i < mechanics.length; i += BATCH) {
    const batch = mechanics.slice(i, i + BATCH);
    const { error } = await supabase
      .from('mechanics')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`\n❌ Error upserting batch:`, error.message);
      process.exit(1);
    }

    total += batch.length;
    process.stdout.write(`Upserting... ${total}/${mechanics.length}\r`);
  }

  console.log(`\n\n✅ Sync complete — ${mechanics.length} mechanics in Supabase\n`);
}

sync().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
