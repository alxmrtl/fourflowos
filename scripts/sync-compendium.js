#!/usr/bin/env node
/**
 * sync-compendium.js
 *
 * Reads all quality/technique/concept markdown files from compendium/framework/,
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
const crypto = require('crypto');
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
  // New template: ## What it is · ## Science · ## Techniques · ## Recall
  const hasScience = /^## Science\b/m.test(body);
  const hasRecall = /^## Recall\b/m.test(body);
  const hasTechniquesSection = /^## Techniques\b/m.test(body);

  // Science section has real content (not just a placeholder)
  const scienceSection = body.match(/## Science\n\n?([\s\S]*?)(?=\n##|$)/);
  const scienceContent = scienceSection ? scienceSection[1].replace(/<!--[\s\S]*?-->/g, '').trim() : '';
  const hasRichScience = scienceContent.length > 120;

  // Techniques section links out (wikilinks to technique files)
  const techSection = body.match(/## Techniques\n\n?([\s\S]*?)(?=\n##|$)/);
  const techLinks = techSection ? (techSection[1].match(/\[\[/g) || []).length : 0;

  if (hasRichScience && hasRecall && techLinks >= 3) return 5;
  if (hasRichScience && hasRecall) return 4;
  if (hasScience && hasTechniquesSection && hasRecall) return 3;
  if (hasScience || hasTechniquesSection) return 2;
  return 1;
}

function extractRecallMd(body) {
  const match = body.match(/## Recall\n([\s\S]*?)(?=\n##|$)/);
  return match ? match[1].trim() : null;
}

function extractRelatedQualities(body) {
  const section = body.match(/## Related Qualities\n([\s\S]*?)(?=\n##|$)/);
  if (!section) return [];
  const matches = [...section[1].matchAll(/\[\[([^\]]+)\]\]/g)];
  return matches.map(m => m[1]);
}

function countTechniques(body) {
  return (body.match(/^### /gm) || []).length;
}

// ─── Discovery ───────────────────────────────────────────────────────────────

function computeContentHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function extractParentQuality(frontmatter) {
  // Techniques have: quality: "[[slug]]"
  const raw = frontmatter.quality;
  if (!raw) return null;
  const match = String(raw).match(/\[\[([^\]]+)\]\]/);
  return match ? match[1] : null;
}

function processMarkdownFile({ filePath, content, pillar, flowKey }) {
  const { frontmatter, body } = parseFrontmatter(content);
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const isQuality = tags.includes('type/quality');
  const isTechnique = tags.includes('type/technique');
  // Concepts are archived — skip them
  if (!isQuality && !isTechnique) return null;

  const cardType = isQuality ? 'quality' : 'technique';

  const file = path.basename(filePath);
  const id = file.replace('.md', '');
  const title = String(frontmatter.title || id).replace(/^["']|["']$/g, '');
  const definition = String(frontmatter.definition || '').replace(/^["']|["']$/g, '');
  const keywords = Array.isArray(frontmatter.keywords) ? frontmatter.keywords.map(String) : [];
  const qualityType = frontmatter.quality_type ? String(frontmatter.quality_type) : null;

  return {
    id,
    title,
    pillar,
    flow_key: flowKey,
    keywords,
    definition,
    content_md: content,
    recall_md: extractRecallMd(body),
    enrichment_score: isQuality ? estimateScore(body) : null,
    techniques_count: isQuality ? countTechniques(body) : null,
    related_qualities: extractRelatedQualities(body),
    card_type: cardType,
    quality_type: qualityType,
    parent_quality_id: isTechnique ? extractParentQuality(frontmatter) : null,
    content_hash: computeContentHash(content),
    updated_at: new Date().toISOString(),
  };
}

function getQualityFiles() {
  if (!fs.existsSync(COMPENDIUM_PATH)) {
    console.error(`\n❌ Compendium path not found: ${COMPENDIUM_PATH}`);
    console.error('   Run this script from within the FourFlowOS repo.\n');
    process.exit(1);
  }

  const cards = [];

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

      // Quality files at key level (exclude key-level overview)
      const keyFiles = fs.readdirSync(keyPath).filter(
        f => f.endsWith('.md') && f !== `${keyDir}.md`
      );

      for (const file of keyFiles) {
        const filePath = path.join(keyPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const row = processMarkdownFile({ filePath, content, pillar, flowKey });
        if (row) cards.push(row);
      }

      // Atomic technique notes in _techniques/ subfolder
      const techniquesDir = path.join(keyPath, '_techniques');
      if (fs.existsSync(techniquesDir) && fs.statSync(techniquesDir).isDirectory()) {
        const techFiles = fs.readdirSync(techniquesDir).filter(f => f.endsWith('.md'));
        for (const file of techFiles) {
          const filePath = path.join(techniquesDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const row = processMarkdownFile({ filePath, content, pillar, flowKey });
          if (row) cards.push(row);
        }
      }

      // _concepts/ subfolders are archived — not synced
    }
  }

  return cards;
}

// ─── Sync ────────────────────────────────────────────────────────────────────

async function sync() {
  console.log(`\nFourFlow Compendium Sync`);
  console.log(`Compendium: ${COMPENDIUM_PATH}`);
  console.log(`Supabase:   ${SUPABASE_URL}\n`);

  const cards = getQualityFiles();
  console.log(`Found ${cards.length} cards\n`);

  if (cards.length === 0) {
    console.error('No cards found — check compendium path and file structure.');
    process.exit(1);
  }

  // Breakdown by type
  const qualityRows = cards.filter(m => m.card_type === 'quality');
  const techniqueRows = cards.filter(m => m.card_type === 'technique');
  console.log(`  ${qualityRows.length} qualities, ${techniqueRows.length} techniques\n`);

  // Score summary (qualities only)
  const scores = {};
  for (const m of qualityRows) {
    scores[m.enrichment_score] = (scores[m.enrichment_score] || 0) + 1;
  }
  const scoreStr = Object.entries(scores)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([s, c]) => `  score ${s}: ${c}`)
    .join('\n');
  console.log(`Enrichment scores (qualities):\n${scoreStr}\n`);

  // Upsert in batches
  const BATCH = 20;
  let total = 0;

  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);
    const { error } = await supabase
      .from('mechanics')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`\n❌ Error upserting batch:`, error.message);
      process.exit(1);
    }

    total += batch.length;
    process.stdout.write(`Upserting... ${total}/${cards.length}\r`);
  }

  // Prune orphaned rows (rows in DB that no longer have a corresponding file)
  const scannedIds = new Set(cards.map(m => m.id));

  const { data: allDbRows, error: fetchErr } = await supabase
    .from('mechanics')
    .select('id');

  if (fetchErr) {
    console.warn('  ⚠️  Could not fetch DB rows for pruning:', fetchErr.message);
  } else {
    const orphanIds = (allDbRows || []).map(r => r.id).filter(id => !scannedIds.has(id));

    if (orphanIds.length > 0) {
      const { error: deleteErr } = await supabase
        .from('mechanics')
        .delete()
        .in('id', orphanIds);

      if (deleteErr) {
        console.warn('  ⚠️  Could not prune orphaned rows:', deleteErr.message);
      } else {
        console.log(`  🗑️  Pruned ${orphanIds.length} orphaned rows: ${orphanIds.join(', ')}\n`);
      }
    } else {
      console.log('  ✓  No orphaned rows to prune\n');
    }
  }

  console.log(`✅ Sync complete — ${cards.length} cards in Supabase`);
  console.log(`   (${qualityRows.length} qualities, ${techniqueRows.length} techniques)\n`);
}

sync().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
