-- Add quality_type column to mechanics table
-- Run once in Supabase SQL editor, then re-run sync-compendium.js

ALTER TABLE mechanics ADD COLUMN IF NOT EXISTS quality_type text;
