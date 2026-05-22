-- ============================================
-- Migration 002: Align houses table with census form
-- ============================================

-- Make ward_id optional (form doesn't require it)
ALTER TABLE houses ALTER COLUMN ward_id DROP NOT NULL;

-- Drop the unique constraint that requires ward_id
ALTER TABLE houses DROP CONSTRAINT IF EXISTS uq_ward_house;

-- Add population/census columns to houses table
ALTER TABLE houses ADD COLUMN IF NOT EXISTS total_population INTEGER DEFAULT 0;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS male INTEGER DEFAULT 0;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS female INTEGER DEFAULT 0;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS senior_citizens INTEGER DEFAULT 0;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE houses ADD COLUMN IF NOT EXISTS survey_status VARCHAR(20) DEFAULT 'PENDING';

-- Make enumerator_id optional (no auth integration yet)
ALTER TABLE houses ALTER COLUMN enumerator_id DROP NOT NULL;

-- Enable Row Level Security but allow all operations for now
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read houses
CREATE POLICY IF NOT EXISTS "Allow all to read houses" ON houses
  FOR SELECT USING (true);

-- Allow all authenticated users to insert houses  
CREATE POLICY IF NOT EXISTS "Allow all to insert houses" ON houses
  FOR INSERT WITH CHECK (true);

-- Allow all authenticated users to update houses
CREATE POLICY IF NOT EXISTS "Allow all to update houses" ON houses
  FOR UPDATE USING (true);

-- Also enable public access (for anon key usage during development)
CREATE POLICY IF NOT EXISTS "Allow anon to read houses" ON houses
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "Allow anon to insert houses" ON houses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anon to update houses" ON houses
  FOR UPDATE TO anon USING (true);
