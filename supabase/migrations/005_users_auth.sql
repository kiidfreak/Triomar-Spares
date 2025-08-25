-- Users auth table for NextAuth credentials provider
CREATE TABLE IF NOT EXISTS users_auth (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	email text UNIQUE NOT NULL,
	password_hash text NOT NULL,
	name text,
	created_at timestamptz DEFAULT now(),
	updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_auth_email ON users_auth(email);

-- Simple trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_auth_updated_at ON users_auth;
CREATE TRIGGER trg_users_auth_updated_at
BEFORE UPDATE ON users_auth
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


