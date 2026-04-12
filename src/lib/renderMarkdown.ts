/**
 * Shared markdown renderer for FourFlow compendium content.
 * Used across: Your Practice (CompendiumNavigator), Train (MechanicCard), and synced to FlowStation.
 *
 * Canonical note format supported:
 *   Techniques: opening blockquote → ## Mechanism → ## Protocol → ## When to Use → ## Key Insight → ## Related → ## Recall
 *   Concepts:   opening blockquote → ## What It Is → ## Why It Matters for Flow → ## Application → ## Related
 *
 * Features:
 *   - Opening blockquote → hero essence line (higher opacity, accent border)
 *   - ## Key Insight blockquote → pull-quote hero treatment
 *   - [[wikilinks]] → styled inline pill (not raw text)
 *   - Numbered lists → proper <ol> with chip numbers
 *   - Bullet lists    → proper <ul> with dot markers
 *   - Tables          → clean <table> rendering
 *   - ## Recall       → stripped when skipRecall: true (shown separately in training)
 *   - # Title         → always stripped (shown as card title)
 */

export interface RenderOptions {
  /** Dark background mode. Default: false (light). */
  dark?: boolean;
  /** Strip the ## Recall section (shown separately in training reps). Default: true. */
  skipRecall?: boolean;
}

// ── HTML helpers ────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s: string, tokens: ReturnType<typeof makeTokens>): string {
  // Wikilinks: strip brackets, render as dim code pill
  return s
    .replace(/\[\[([^\]]+)\]\]/g, (_, slug) =>
      `<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${tokens.wiki} mx-0.5 leading-none">${esc(slug)}</span>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="font-semibold ${tokens.strong}">$1</strong>`)
    .replace(/\*([^*]+?)\*/g, `<em class="italic opacity-75">$1</em>`);
}

// ── Theme tokens ─────────────────────────────────────────────────────────────

function makeTokens(dark: boolean) {
  return {
    body:       dark ? 'text-white/65'              : 'text-neutral/70',
    strong:     dark ? 'text-white/88'              : 'text-neutral/88',
    head:       dark ? 'text-white/55'              : 'text-neutral/55',
    wiki:       dark ? 'bg-white/[0.08] text-white/38' : 'bg-black/[0.06] text-neutral/45',
    numBg:      dark ? 'bg-white/[0.08] text-white/38' : 'bg-black/[0.06] text-neutral/45',
    heroBorder: dark ? 'border-white/30'            : 'border-black/20',
    heroText:   dark ? 'text-white/78'              : 'text-neutral/78',
    bqBorder:   dark ? 'border-white/15'            : 'border-black/12',
    bqText:     dark ? 'text-white/50'              : 'text-neutral/55',
    tableBorder:dark ? 'border-white/10'            : 'border-black/8',
    tableHead:  dark ? 'text-white/55'              : 'text-neutral/55',
    dot:        dark ? 'bg-white/30'                : 'bg-neutral/30',
  };
}

// ── Main renderer ────────────────────────────────────────────────────────────

export function renderMarkdown(md: string, opts: RenderOptions = {}): string {
  if (!md) return '';
  const { dark = false, skipRecall = true } = opts;
  const t = makeTokens(dark);

  // Strip YAML frontmatter
  const content = md.replace(/^---[\s\S]*?---\n/, '');
  const lines = content.split('\n');
  const out: string[] = [];

  // State
  let firstQuoteSeen  = false;
  let inKeyInsight    = false;
  let inRecall        = false;
  let inOl            = false;
  let olNum           = 0;
  let inUl            = false;
  let inTable         = false;
  let tableRows: string[][] = [];

  const flushOl = () => {
    if (inOl) { out.push('</ol>'); inOl = false; olNum = 0; }
  };
  const flushUl = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
  };
  const flushTable = () => {
    if (!inTable) return;
    let html = `<table class="w-full text-xs border-collapse my-3">`;
    tableRows.forEach((row, ri) => {
      // Skip separator rows (all dashes/spaces)
      if (row.every(c => /^[\s-:]+$/.test(c))) return;
      html += '<tr>';
      row.forEach(cell => {
        const tag = ri === 0 ? 'th' : 'td';
        const cls = ri === 0
          ? `px-2 py-1.5 text-left font-semibold ${t.tableHead} border-b ${t.tableBorder}`
          : `px-2 py-1.5 ${t.body} border-b ${t.tableBorder}`;
        html += `<${tag} class="${cls}">${inline(esc(cell.trim()), t)}</${tag}>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    out.push(html);
    inTable = false;
    tableRows = [];
  };
  const flushAll = () => { flushOl(); flushUl(); flushTable(); };

  for (const raw of lines) {
    const line = raw.trim();

    // ── Table rows ────────────────────────────────────────────────────────
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) { flushOl(); flushUl(); inTable = true; }
      const cells = line.slice(1, -1).split('|');
      tableRows.push(cells);
      continue;
    }
    if (inTable) flushTable();

    // ── Empty line ────────────────────────────────────────────────────────
    if (!line) {
      flushAll();
      continue;
    }

    // ── Headings ──────────────────────────────────────────────────────────
    if (line.startsWith('#')) {
      flushAll();
      const isH1 = line.startsWith('# ') && !line.startsWith('## ');
      const isH2 = line.startsWith('## ') && !line.startsWith('### ');
      const isH3 = line.startsWith('### ');

      // Always strip the # Title line
      if (isH1) continue;

      const name = line.replace(/^#+\s+/, '');

      // Track section state
      inKeyInsight = (name === 'Key Insight');

      if (skipRecall && name === 'Recall') {
        inRecall = true;
        continue;
      }
      if (!skipRecall || name !== 'Recall') inRecall = false;

      if (inRecall) continue;

      const cls = isH2
        ? `text-[10px] font-black uppercase tracking-[0.18em] mt-5 mb-2 ${t.head}`
        : `text-[9px] font-black uppercase tracking-[0.14em] mt-3.5 mb-1.5 ${t.head} opacity-80`;
      out.push(`<p class="${cls}">${esc(name)}</p>`);
      continue;
    }

    if (inRecall) continue;

    // ── Blockquote ────────────────────────────────────────────────────────
    if (line.startsWith('> ')) {
      flushAll();
      const bqText = line.slice(2);
      const isHero = !firstQuoteSeen || inKeyInsight;
      if (!firstQuoteSeen) firstQuoteSeen = true;

      if (isHero) {
        out.push(
          `<blockquote class="border-l-2 ${t.heroBorder} pl-4 my-3">` +
          `<p class="text-sm italic ${t.heroText} leading-relaxed">${inline(esc(bqText), t)}</p>` +
          `</blockquote>`
        );
      } else {
        out.push(
          `<blockquote class="border-l-2 ${t.bqBorder} pl-3 my-2">` +
          `<p class="text-sm italic ${t.bqText}">${inline(esc(bqText), t)}</p>` +
          `</blockquote>`
        );
      }
      continue;
    }

    // ── Numbered list ─────────────────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      flushUl(); flushTable();
      const itemText = line.replace(/^\d+\.\s+/, '');
      if (!inOl) { out.push(`<ol class="space-y-2 mt-2 mb-2">`); inOl = true; olNum = 0; }
      olNum++;
      out.push(
        `<li class="flex gap-2.5 ${t.body} text-sm leading-relaxed">` +
        `<span class="flex-shrink-0 w-5 h-5 rounded-full ${t.numBg} flex items-center justify-center text-[10px] font-bold mt-0.5">${olNum}</span>` +
        `<span>${inline(esc(itemText), t)}</span>` +
        `</li>`
      );
      continue;
    }

    // ── Bullet list ───────────────────────────────────────────────────────
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushOl(); flushTable();
      const itemText = line.slice(2);
      if (!inUl) { out.push(`<ul class="space-y-1.5 mt-2 mb-2">`); inUl = true; }
      out.push(
        `<li class="flex gap-2.5 ${t.body} text-sm leading-relaxed">` +
        `<span class="flex-shrink-0 mt-[7px] w-1 h-1 rounded-full ${t.dot}"></span>` +
        `<span>${inline(esc(itemText), t)}</span>` +
        `</li>`
      );
      continue;
    }

    // ── Paragraph ─────────────────────────────────────────────────────────
    flushAll();
    if (!firstQuoteSeen) firstQuoteSeen = true;
    out.push(`<p class="text-sm ${t.body} leading-relaxed">${inline(esc(line), t)}</p>`);
  }

  flushAll();
  return out.join('\n');
}

// ── Recall section renderer ──────────────────────────────────────────────────
// Used for the "What to Remember" callout in training reps.
// Input: the extracted recall_md field (content of ## Recall section).
// Format expected: **Label:** text, one per line.

export function renderRecallMd(md: string, opts: RenderOptions = {}): string {
  if (!md) return '';
  const { dark = false } = opts;
  const t = makeTokens(dark);

  const lines = md.split('\n');
  const out: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // **Label:** text pattern
    const labeled = line.match(/^\*\*(.+?)\*\*[:\s]+(.+)/);
    if (labeled) {
      out.push(
        `<p class="text-sm ${t.body} leading-relaxed mb-1.5">` +
        `<strong class="font-semibold ${t.strong}">${esc(labeled[1])}:</strong> ` +
        `${inline(esc(labeled[2]), t)}` +
        `</p>`
      );
    } else {
      // Plain line
      out.push(`<p class="text-sm ${t.body} leading-relaxed mb-1">${inline(esc(line), t)}</p>`);
    }
  }

  return out.join('\n');
}
