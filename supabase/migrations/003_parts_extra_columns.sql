-- Extend parts table to accommodate seed dataset
ALTER TABLE parts
	ADD COLUMN IF NOT EXISTS brand TEXT,
	ADD COLUMN IF NOT EXISTS warranty_months INTEGER;


