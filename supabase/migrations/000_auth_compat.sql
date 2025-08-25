-- Compatibility shim to run Supabase-oriented schema on plain Postgres
-- Creates minimal auth schema, users table, and stub auth functions

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
	id uuid PRIMARY KEY
);

-- Stub: return NULL by default; replace with real auth if needed
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULL::uuid
$$;

-- Stub: return 'authenticated' by default
CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT 'authenticated'::text
$$;


