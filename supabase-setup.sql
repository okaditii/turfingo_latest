-- Supabase SQL to create the registrations table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  registration_id TEXT UNIQUE NOT NULL,
  player_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  age_group TEXT NOT NULL,
  sport TEXT NOT NULL,
  team_name TEXT NOT NULL,
  city TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount NUMERIC DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public registration)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (for the waitlist page)
CREATE POLICY "Allow public reads" ON registrations
  FOR SELECT
  USING (true);

-- Create index for search performance
CREATE INDEX IF NOT EXISTS idx_registrations_search
  ON registrations (player_name, registration_id, email, team_name, city);

CREATE INDEX IF NOT EXISTS idx_registrations_sport
  ON registrations (sport);

CREATE INDEX IF NOT EXISTS idx_registrations_age_group
  ON registrations (age_group);

CREATE INDEX IF NOT EXISTS idx_registrations_payment_status
  ON registrations (payment_status);
