-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create parts table
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  part_number VARCHAR(100),
  description TEXT,
  category_id UUID REFERENCES categories(id),
  vehicle_id UUID REFERENCES vehicles(id),
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postcode VARCHAR(10),
  country VARCHAR(100) DEFAULT 'UK',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  shipping_address TEXT,
  billing_address TEXT,
  notes TEXT,
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

-- Insert initial vehicle data
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Mazda CX-5', 'Mazda', 'CX-5', 2012, 2024, 'Quality spare parts for Mazda CX-5 models'),
('Nissan X-Trail T30', 'Nissan', 'X-Trail T30', 2007, 2013, 'Reliable spare parts for Nissan X-Trail T30 models'),
('Toyota Prado', 'Toyota', 'Prado', 1996, 2024, 'Premium spare parts for Toyota Prado models');

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
('Engine & Filters', 'Engine oil filters, air filters, fuel filters, spark plugs'),
('Brakes', 'Brake pads, brake discs, brake fluid'),
('Suspension & Steering', 'Shock absorbers, control arms, ball joints'),
('Transmission & Drivetrain', 'Clutch kits, drive shafts'),
('Cooling System', 'Radiators, water pumps, coolant'),
('Electrical', 'Batteries, alternators, starter motors, lighting'),
('Body & Lighting', 'Headlights, tail lights, mirrors, wiper blades');

-- Insert sample parts for Mazda CX-5
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity) VALUES
('Engine Oil Filter', 'MAZ-CX5-OIL-001', 'High-quality engine oil filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 12.99, 50),
('Air Filter', 'MAZ-CX5-AIR-001', 'Premium air filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 18.99, 45),
('Front Brake Pads', 'MAZ-CX5-BRAKE-F-001', 'Front brake pads for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brakes'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 45.99, 30);

-- Insert sample parts for Nissan X-Trail T30
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity) VALUES
('Engine Oil Filter', 'NIS-XTRAIL-OIL-001', 'High-quality engine oil filter for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 11.99, 40),
('Fuel Pump', 'NIS-XTRAIL-FUEL-001', 'Fuel pump for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 89.99, 15),
('Brake Pads', 'NIS-XTRAIL-BRAKE-001', 'Brake pads for Nissan X-Trail T30', 
 (SELECT id FROM categories WHERE name = 'Brakes'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 42.99, 25);

-- Insert sample parts for Toyota Prado
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity) VALUES
('Engine Oil Filter', 'TOY-PRADO-OIL-001', 'High-quality engine oil filter for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 14.99, 35),
('Timing Belt', 'TOY-PRADO-TIMING-001', 'Timing belt for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 65.99, 20),
('Water Pump', 'TOY-PRADO-WATER-001', 'Water pump for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Cooling System'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 78.99, 18);

-- Create indexes for better performance
CREATE INDEX idx_parts_vehicle_id ON parts(vehicle_id);
CREATE INDEX idx_parts_category_id ON parts(category_id);
CREATE INDEX idx_parts_active ON parts(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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
