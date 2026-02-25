-- Add shared_with column to leads table for role-based access control
ALTER TABLE leads ADD COLUMN IF NOT EXISTS shared_with TEXT[] DEFAULT '{}';

-- Allow authenticated users to read the new column
-- (Existing RLS policies on leads already cover authenticated access)
