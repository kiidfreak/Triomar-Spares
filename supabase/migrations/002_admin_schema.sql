-- Admin Users table for role-based access control
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'viewer')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES admin_users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Settings table for configurable store parameters
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Settings table for admin preferences
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  low_stock_alerts BOOLEAN DEFAULT true,
  new_order_notifications BOOLEAN DEFAULT true,
  customer_registration_alerts BOOLEAN DEFAULT false,
  system_maintenance_alerts BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images table for storing product images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default store settings
INSERT INTO store_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('store_name', 'AutoZone', 'string', 'Store display name', true),
('store_email', 'your-email@yourdomain.com', 'string', 'Primary store contact email', true),
('store_phone', '+254 700 000 000', 'string', 'Primary store contact phone', true),
('store_address', 'Nairobi, Kenya', 'string', 'Store physical address', true),
('currency', 'KSH', 'string', 'Store currency code', true),
('tax_rate', '16', 'number', 'Default tax rate percentage', true),
('shipping_cost', '500', 'number', 'Default shipping cost', true),
('free_shipping_threshold', '5000', 'number', 'Order amount for free shipping', true),
('low_stock_threshold', '5', 'number', 'Stock level to trigger low stock alerts', false),
('auto_order_enabled', 'false', 'boolean', 'Enable automatic reordering', false);

-- Insert default admin user (you should change this in production)
INSERT INTO admin_users (email, role, first_name, last_name, permissions) VALUES
('your-email@yourdomain.com', 'admin', 'Your', 'Name', '{"all": true}');

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_store_settings_key ON store_settings(setting_key);
CREATE INDEX idx_notification_settings_admin ON notification_settings(admin_user_id);
CREATE INDEX idx_product_images_part ON product_images(part_id);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'admin'
    )
  );

-- RLS Policies for store_settings
CREATE POLICY "Store settings are viewable by all authenticated users" ON store_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify store settings" ON store_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'admin'
    )
  );

-- RLS Policies for notification_settings
CREATE POLICY "Users can view own notification settings" ON notification_settings
  FOR SELECT USING (
    admin_user_id IN (
      SELECT id FROM admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own notification settings" ON notification_settings
  FOR UPDATE USING (
    admin_user_id IN (
      SELECT id FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for product_images
CREATE POLICY "Product images are viewable by all" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Only admins and managers can manage product images" ON product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role IN ('admin', 'manager')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is manager or admin
CREATE OR REPLACE FUNCTION is_manager_or_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid AND role IN ('admin', 'manager') AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
