/**
 * Compendium metadata — single source for the protocol count.
 *
 * 153 = qualities + techniques synced to the Supabase `mechanics` table
 * (ratified count, ALIGNMENT.md §6, June 2026). After an enrichment session
 * + `scripts/sync-compendium.js` run, verify with:
 *   select count(*) from mechanics;
 * and update this one constant.
 */
export const COMPENDIUM_PROTOCOL_COUNT = 153;

export const COMPENDIUM_SHORT_DESCRIPTION = `The technique library — ${COMPENDIUM_PROTOCOL_COUNT} protocols`;
