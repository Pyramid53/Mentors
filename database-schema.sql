-- ==========================================================
-- MENTORS MARINE SERVICES - DATABASE SETUP & ADMIN SCHEMA
-- Platform: Supabase (PostgreSQL 15+)
-- Description: Sets up the secure users table, inserts the 
-- authorized Admin account (admin@mentors.com / tarekmentorsowner),
-- and configures RFQs and Contact Inquiry tables.
-- ==========================================================

-- 1. Create table for application users (Admin & Clients)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  company TEXT,
  phone TEXT,
  avatar_initials TEXT DEFAULT 'MM',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert or update the authorized Admin account
-- Credentials:
-- Email: admin@mentors.com
-- Password: tarekmentorsowner
INSERT INTO app_users (
  id,
  name,
  email,
  role,
  company,
  phone,
  avatar_initials,
  password_hash,
  created_at,
  updated_at
)
VALUES (
  'USR-ADM-01',
  'Capt. Tarek Mansour (Owner)',
  'admin@mentors.com',
  'admin',
  'Mentors Marine Services SAE',
  '+20 100 489 2210',
  'TM',
  'tarekmentorsowner',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'admin',
  password_hash = 'tarekmentorsowner',
  name = 'Capt. Tarek Mansour (Owner)',
  updated_at = NOW();

-- 3. Optional sample client user for testing client portal
INSERT INTO app_users (
  id,
  name,
  email,
  role,
  company,
  phone,
  avatar_initials,
  password_hash,
  created_at,
  updated_at
)
VALUES (
  'USR-CLT-01',
  'Capt. Marco Rossi',
  'm.rossi@msc-operations.com',
  'client',
  'Mediterranean Shipping Company (Geneva)',
  '+39 340 551 2894',
  'MR',
  'client123',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 4. Create Quote Requests table (Suez RFQs)
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vessel_name TEXT NOT NULL,
  imo_number TEXT,
  vessel_type TEXT,
  port_of_call TEXT,
  eta_date TEXT,
  eta_time TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  file_name TEXT,
  file_size TEXT,
  selected_items JSONB DEFAULT '[]'::jsonb,
  crew_nationalities TEXT,
  priority TEXT DEFAULT 'Standard (60 Min)',
  additional_notes TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company_name TEXT,
  status TEXT DEFAULT 'New',
  assigned_officer TEXT DEFAULT 'Capt. Tarek (Suez Desk)',
  quoted_amount_usd NUMERIC,
  dispatch_launch_boat TEXT,
  admin_notes TEXT,
  last_updated TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Contact Inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT,
  port_of_call TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  assigned_to TEXT DEFAULT 'Duty Officer (Suez Operations)',
  admin_notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indices for fast lookup
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);

-- 7. Verification Query (to verify setup)
SELECT id, name, email, role, created_at FROM app_users;
