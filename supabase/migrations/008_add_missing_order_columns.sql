-- Add missing columns to orders table for IntaSend integration
-- This migration adds the columns that are referenced in the code but missing from the database

-- Add final_amount column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2);

-- Add payment_method column if it doesn't exist  
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Add payment_transaction_id column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);

-- Add order_number column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);

-- Add tax_amount column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0;

-- Add shipping_amount column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0;

-- Add discount_amount column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Add shipping_method column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(50) DEFAULT 'standard';

-- Add payment_status column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Add notes column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add estimated_delivery column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;

-- Add actual_delivery column if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS actual_delivery DATE;

-- Update existing orders to have final_amount = total_amount if final_amount is NULL
UPDATE orders SET final_amount = total_amount WHERE final_amount IS NULL;

-- Make final_amount NOT NULL after setting default values
ALTER TABLE orders ALTER COLUMN final_amount SET NOT NULL;

-- Add constraints for payment_status (drop first if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_status_check') THEN
        ALTER TABLE orders DROP CONSTRAINT orders_payment_status_check;
    END IF;
END $$;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Add constraints for status (drop first if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
        ALTER TABLE orders DROP CONSTRAINT orders_status_check;
    END IF;
END $$;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'pending_payment', 'payment_pending', 'payment_failed'));

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on payment_transaction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_transaction_id ON orders(payment_transaction_id);

-- Create index on payment_status for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
