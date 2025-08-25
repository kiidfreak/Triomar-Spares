-- Payment sessions table to store Worldpay session data
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  session_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment logs table to track payment responses
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  response_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add payment_transaction_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_sessions_order_id ON payment_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_order_id ON payment_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_transaction ON orders(payment_transaction_id);

-- RLS policies for payment tables
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment sessions
CREATE POLICY "Users can view own payment sessions" ON payment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o JOIN users_auth ua ON o.user_id = ua.id
      WHERE o.id = payment_sessions.order_id AND ua.id = auth.uid()
    )
  );

-- Users can view their own payment logs
CREATE POLICY "Users can view own payment logs" ON payment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o JOIN users_auth ua ON o.user_id = ua.id
      WHERE o.id = payment_logs.order_id AND ua.id = auth.uid()
    )
  );

-- System can insert payment sessions and logs (for webhooks)
CREATE POLICY "System can insert payment sessions" ON payment_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert payment logs" ON payment_logs
  FOR INSERT WITH CHECK (true);

-- System can update payment sessions
CREATE POLICY "System can update payment sessions" ON payment_sessions
  FOR UPDATE USING (true);
