-- Vocabulary migration: mechanic_id → quality_id
-- Run in Supabase SQL editor.
-- Table names (mechanics, mechanic_reviews) are kept as-is to avoid RLS/policy churn.
-- Only columns are renamed.

-- 1. Rename mechanic_id column in mechanic_reviews
ALTER TABLE mechanic_reviews RENAME COLUMN mechanic_id TO quality_id;

-- 2. Rename parent_mechanic_id column in mechanics
ALTER TABLE mechanics RENAME COLUMN parent_mechanic_id TO parent_quality_id;

-- 3. Rename related_mechanics column in mechanics
ALTER TABLE mechanics RENAME COLUMN related_mechanics TO related_qualities;

-- 4. Update unique constraint to match renamed column
ALTER TABLE mechanic_reviews DROP CONSTRAINT IF EXISTS mechanic_reviews_user_id_mechanic_id_key;
ALTER TABLE mechanic_reviews ADD CONSTRAINT mechanic_reviews_user_id_quality_id_key UNIQUE (user_id, quality_id);
