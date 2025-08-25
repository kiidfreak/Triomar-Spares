-- =====================================================
-- AutoZone Complete Database Schema
-- This file contains all tables, relationships, and initial data
-- Import this directly into your Supabase project
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year_from INTEGER,
  year_to INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parts table (products)
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  part_number VARCHAR(100),
  description TEXT,
  category_id UUID REFERENCES categories(id),
  vehicle_id UUID REFERENCES vehicles(id),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  brand VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  warranty_months INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postcode VARCHAR(10),
  country VARCHAR(100) DEFAULT 'Kenya',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  billing_address TEXT,
  shipping_method VARCHAR(50) DEFAULT 'standard',
  payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  estimated_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADMIN TABLES
-- =====================================================

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

-- =====================================================
-- ADDITIONAL FEATURE TABLES
-- =====================================================

-- Shopping Cart table
CREATE TABLE shopping_cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, part_id)
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, part_id)
);

-- Product Reviews table
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert initial vehicle data
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Mazda CX-5', 'Mazda', 'CX-5', 2012, 2024, 'Quality spare parts for Mazda CX-5 models'),
('Nissan X-Trail T30', 'Nissan', 'X-Trail T30', 2007, 2013, 'Reliable spare parts for Nissan X-Trail T30 models'),
('Toyota Prado', 'Toyota', 'Prado', 1996, 2024, 'Premium spare parts for Toyota Prado models'),
('Toyota Land Cruiser', 'Toyota', 'Land Cruiser', 1998, 2024, 'Premium spare parts for Toyota Land Cruiser models'),
('Honda CR-V', 'Honda', 'CR-V', 2007, 2024, 'Quality spare parts for Honda CR-V models');

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
('Engine & Filters', 'Engine oil filters, air filters, fuel filters, spark plugs, timing belts'),
('Brakes & Suspension', 'Brake pads, brake discs, brake fluid, shock absorbers, control arms'),
('Transmission & Drivetrain', 'Clutch kits, drive shafts, gearbox parts, differential parts'),
('Cooling System', 'Radiators, water pumps, coolant, thermostats, hoses'),
('Electrical & Lighting', 'Batteries, alternators, starter motors, headlights, tail lights'),
('Body & Accessories', 'Mirrors, wiper blades, body panels, interior accessories'),
('Tools & Equipment', 'Hand tools, diagnostic equipment, workshop supplies');

-- Insert sample parts for Mazda CX-5
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand) VALUES
('Engine Oil Filter', 'MAZ-CX5-OIL-001', 'High-quality engine oil filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 1299, 50, 'Mazda Genuine'),
('Air Filter', 'MAZ-CX5-AIR-001', 'Premium air filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 1899, 45, 'K&N'),
('Front Brake Pads', 'MAZ-CX5-BRAKE-F-001', 'Front brake pads for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brakes & Suspension'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 4599, 30, 'Brembo'),
('Shock Absorber Set', 'MAZ-CX5-SHOCK-001', 'Complete shock absorber set for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brakes & Suspension'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 15999, 20, 'Bilstein');

-- Insert sample parts for Nissan X-Trail T30
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand) VALUES
('Engine Oil Filter', 'NIS-XTRAIL-OIL-001', 'High-quality engine oil filter for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 1199, 40, 'Nissan Genuine'),
('Fuel Pump', 'NIS-XTRAIL-FUEL-001', 'Fuel pump for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 8999, 15, 'Bosch'),
('Brake Pads', 'NIS-XTRAIL-BRAKE-001', 'Brake pads for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Brakes & Suspension'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 4299, 25, 'Brembo'),
('Timing Chain Kit', 'NIS-XTRAIL-TIMING-001', 'Complete timing chain kit for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 12999, 12, 'Gates');

-- Insert sample parts for Toyota Prado
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand) VALUES
('Engine Oil Filter', 'TOY-PRADO-OIL-001', 'High-quality engine oil filter for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 1499, 35, 'Toyota Genuine'),
('Timing Belt', 'TOY-PRADO-TIMING-001', 'Timing belt for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 6599, 20, 'Gates'),
('Water Pump', 'TOY-PRADO-WATER-001', 'Water pump for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Cooling System'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 7899, 18, 'Aisin'),
('Brake Disc Set', 'TOY-PRADO-BRAKE-001', 'Complete brake disc set for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Brakes & Suspension'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 18999, 15, 'Brembo');

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
('auto_order_enabled', 'false', 'boolean', 'Enable automatic reordering', false),
('store_description', 'Your trusted source for quality automotive parts and accessories', 'string', 'Store description for SEO', true),
('business_hours', 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed', 'string', 'Store business hours', true);

-- Insert default admin user (you should change this in production)
INSERT INTO admin_users (email, role, first_name, last_name, permissions) VALUES
('your-email@yourdomain.com', 'admin', 'Your', 'Name', '{"all": true}');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Core table indexes
CREATE INDEX idx_parts_vehicle_id ON parts(vehicle_id);
CREATE INDEX idx_parts_category_id ON parts(category_id);
CREATE INDEX idx_parts_active ON parts(is_active);
CREATE INDEX idx_parts_brand ON parts(brand);
CREATE INDEX idx_parts_price ON parts(price);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_part_id ON order_items(part_id);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);

-- Admin table indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_store_settings_key ON store_settings(setting_key);
CREATE INDEX idx_notification_settings_admin ON notification_settings(admin_user_id);
CREATE INDEX idx_product_images_part ON product_images(part_id);

-- Feature table indexes
CREATE INDEX idx_shopping_cart_user ON shopping_cart(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_product_reviews_part ON product_reviews(part_id);
CREATE INDEX idx_product_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Public read access for vehicles, categories, parts, and product images
CREATE POLICY "Public read access for vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for parts" ON parts FOR SELECT USING (true);
CREATE POLICY "Public read access for product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read access for coupons" ON coupons FOR SELECT USING (is_active = true);

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Order policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- Shopping cart policies
CREATE POLICY "Users can manage own cart" ON shopping_cart FOR ALL USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Product review policies
CREATE POLICY "Public read access for approved reviews" ON product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create own reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all admin users" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
);

CREATE POLICY "Admins can manage all admin users" ON admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
);

CREATE POLICY "Store settings viewable by authenticated users" ON store_settings FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify store settings" ON store_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
);

CREATE POLICY "Users can view own notification settings" ON notification_settings FOR SELECT USING (
  admin_user_id IN (SELECT id FROM admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update own notification settings" ON notification_settings FOR UPDATE USING (
  admin_user_id IN (SELECT id FROM admin_users WHERE user_id = auth.uid())
);

-- Admin/Manager policies for parts management
CREATE POLICY "Admins and managers can manage parts" ON parts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role IN ('admin', 'manager'))
);

-- Admin/Manager policies for product images
CREATE POLICY "Admins and managers can manage product images" ON product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role IN ('admin', 'manager'))
);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEW.id::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate subtotal from order items
  SELECT COALESCE(SUM(total_price), 0) INTO NEW.total_amount
  FROM order_items WHERE order_id = NEW.id;
  
  -- Calculate tax
  NEW.tax_amount := NEW.total_amount * 0.16; -- 16% tax rate
  
  -- Calculate shipping (free if above threshold)
  IF NEW.total_amount >= 5000 THEN
    NEW.shipping_amount := 0;
  ELSE
    NEW.shipping_amount := 500;
  END IF;
  
  -- Calculate final amount
  NEW.final_amount := NEW.total_amount + NEW.tax_amount + NEW.shipping_amount - COALESCE(NEW.discount_amount, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON shopping_cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for order management
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER calculate_order_total_trigger AFTER INSERT OR UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for product catalog with images
CREATE VIEW product_catalog AS
SELECT 
  p.id,
  p.name,
  p.part_number,
  p.description,
  p.price,
  p.stock_quantity,
  p.brand,
  p.is_active,
  c.name as category_name,
  v.name as vehicle_name,
  v.make,
  v.model,
  pi.image_url,
  pi.image_alt
FROM parts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN vehicles v ON p.vehicle_id = v.id
LEFT JOIN product_images pi ON p.id = pi.part_id AND pi.is_primary = true
WHERE p.is_active = true;

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.total_amount,
  o.final_amount,
  o.created_at,
  up.first_name,
  up.last_name,
  up.phone,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN user_profiles up ON o.user_id = up.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.final_amount, o.created_at, up.first_name, up.last_name, up.phone;

-- =====================================================
-- FINAL SETUP
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a comment for the schema
COMMENT ON SCHEMA public IS 'AutoZone E-commerce Platform Database Schema';

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- This schema includes:
-- ✅ All core tables (vehicles, categories, parts, users, orders)
-- ✅ Admin functionality (admin_users, store_settings, notifications)
-- ✅ E-commerce features (cart, wishlist, reviews, coupons)
-- ✅ Security (RLS policies, role-based access)
-- ✅ Performance (indexes, views)
-- ✅ Sample data for testing
-- ✅ Functions and triggers for automation
-- ✅ Complete documentation and comments

-- Import this file directly into your Supabase project SQL editor
-- All tables, relationships, and initial data will be created automatically
