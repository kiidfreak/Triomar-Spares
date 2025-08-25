-- Seed: Initial categories, parts, and product images based on UI sample
-- Run this in Supabase SQL editor after uploading images to Storage (or adjust image_url paths accordingly)

BEGIN;

-- 1) Ensure core categories exist
INSERT INTO categories (id, name, description)
VALUES
  (uuid_generate_v4(), 'Engine & Filters', 'Engine components and filters'),
  (uuid_generate_v4(), 'Brakes & Suspension', 'Brake pads, rotors, shocks and more'),
  (uuid_generate_v4(), 'Electrical', 'Electrical system components and batteries'),
  (uuid_generate_v4(), 'Lighting', 'Headlights, bulbs and lighting accessories'),
  (uuid_generate_v4(), 'Tools', 'Automotive tools and kits')
ON CONFLICT DO NOTHING;

-- Helper: get category id by name
-- Note: using subselects to reference category IDs by name

-- 2) Insert parts (mapping from the static UI list)
-- Defaults for missing fields
-- - stock_quantity: 100
-- - min_stock_level: 2
-- - is_active: true
-- - warranty_months: 12

-- STP Extended Life Oil Filter
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'STP Extended Life Oil Filter',
  'High-quality oil filter for extended service intervals',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  1299,
  'STP',
  100,
  2,
  true,
  12
);

-- K&N Performance Air Filter
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'K&N Performance Air Filter',
  'Performance air filter with cleaning and oiling kit',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  3499,
  'K&N',
  100,
  2,
  true,
  12
);

-- Mobil 1 Synthetic Oil 5L
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Mobil 1 Synthetic Oil 5L',
  '5L Mobil 1 Synthetic Oil + Premium Oil Filter',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  3999,
  'Mobil',
  100,
  2,
  true,
  12
);

-- Brembo Premium Brake Pads
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Brembo Premium Brake Pads',
  'Front & Rear Brembo Premium Brake Pads for most vehicles',
  (SELECT id FROM categories WHERE name = 'Brakes & Suspension' LIMIT 1),
  6499,
  'Brembo',
  100,
  2,
  true,
  12
);

-- Monroe Shock Absorbers
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Monroe Shock Absorbers',
  'Monroe Reflex Shock Absorbers - Front or Rear Set',
  (SELECT id FROM categories WHERE name = 'Brakes & Suspension' LIMIT 1),
  8999,
  'Monroe',
  100,
  2,
  true,
  12
);

-- Bosch S4 Car Battery
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Bosch S4 Car Battery',
  'Bosch S4 Car Battery with free installation service',
  (SELECT id FROM categories WHERE name = 'Electrical' LIMIT 1),
  5999,
  'Bosch',
  100,
  2,
  true,
  12
);

-- Philips LED Headlight Bulbs
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Philips LED Headlight Bulbs',
  'Philips X-tremeVision LED Headlight Bulbs - Brighter than standard',
  (SELECT id FROM categories WHERE name = 'Lighting' LIMIT 1),
  2499,
  'Philips',
  100,
  2,
  true,
  12
);

-- Halfords Advanced Tool Kit
INSERT INTO parts (
  id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months
)
VALUES (
  uuid_generate_v4(),
  'Halfords Advanced Tool Kit',
  'Halfords Advanced 150-Piece Tool Kit with carry case',
  (SELECT id FROM categories WHERE name = 'Tools' LIMIT 1),
  9999,
  'Halfords',
  100,
  2,
  true,
  12
);

-- 3) Attach a primary image for each part (optional)
-- Note: Update image_url to point at your Supabase Storage public URL after uploading.
-- Example: https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/<file>

-- STP Oil Filter image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/oilfilterdeals.jpeg', 'STP Extended Life Oil Filter', true, 1
FROM parts p WHERE p.name = 'STP Extended Life Oil Filter' LIMIT 1;

-- K&N Air Filter image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/K&N Air Filter + Cleaner Kit.jpg', 'K&N Performance Air Filter', true, 1
FROM parts p WHERE p.name = 'K&N Performance Air Filter' LIMIT 1;

-- Mobil 1 Oil image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/oilfilterdeals.jpeg', 'Mobil 1 Synthetic Oil 5L', true, 1
FROM parts p WHERE p.name = 'Mobil 1 Synthetic Oil 5L' LIMIT 1;

-- Brembo Pads image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Brembo Sport Brake Discs & Pads.jpg', 'Brembo Premium Brake Pads', true, 1
FROM parts p WHERE p.name = 'Brembo Premium Brake Pads' LIMIT 1;

-- Monroe Shocks image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Monroe Shock Absorbers Set.JPG', 'Monroe Shock Absorbers', true, 1
FROM parts p WHERE p.name = 'Monroe Shock Absorbers' LIMIT 1;

-- Bosch Battery image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Bosch S5 Battery + Installation.webp', 'Bosch S4 Car Battery', true, 1
FROM parts p WHERE p.name = 'Bosch S4 Car Battery' LIMIT 1;

-- Philips LED image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Philips LED Headlight Bulbs Pair.jpg', 'Philips LED Headlight Bulbs', true, 1
FROM parts p WHERE p.name = 'Philips LED Headlight Bulbs' LIMIT 1;

-- Halfords Toolkit image
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Halfords Advanced Tool Kit.webp', 'Halfords Advanced Tool Kit', true, 1
FROM parts p WHERE p.name = 'Halfords Advanced Tool Kit' LIMIT 1;

-- =====================================================
-- Additional categories
INSERT INTO categories (id, name, description)
VALUES
  (uuid_generate_v4(), 'Oils & Fluids', 'Motor oils, brake fluids and related'),
  (uuid_generate_v4(), 'Accessories', 'Cleaning, care and misc accessories')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Additional parts from assets

-- Shell Helix Ultra 5W-30 Oil 4L
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Shell Helix Ultra 5W-30 Oil 4L',
  'Fully synthetic motor oil for modern engines',
  (SELECT id FROM categories WHERE name = 'Oils & Fluids' LIMIT 1),
  5499,
  'Shell',
  100,
  2,
  true,
  12
);

-- Mobil 1 ESP X3 0W-30 5L
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Mobil 1 ESP X3 0W-30 5L',
  'Advanced full synthetic motor oil',
  (SELECT id FROM categories WHERE name = 'Oils & Fluids' LIMIT 1),
  7999,
  'Mobil 1',
  100,
  2,
  true,
  12
);

-- Castrol Edge 0W-20 Professional
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Castrol Edge 0W-20 Professional',
  'High-performance full synthetic engine oil',
  (SELECT id FROM categories WHERE name = 'Oils & Fluids' LIMIT 1),
  6999,
  'Castrol',
  100,
  2,
  true,
  12
);

-- Castrol Brake Fluid + Bleeding Kit
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Castrol Brake Fluid + Bleeding Kit',
  'DOT brake fluid with bleeding kit',
  (SELECT id FROM categories WHERE name = 'Oils & Fluids' LIMIT 1),
  2499,
  'Castrol',
  100,
  2,
  true,
  12
);

-- NGK Spark Plugs 4-Pack
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'NGK Spark Plugs 4-Pack',
  'High-performance spark plugs pack of 4',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  3299,
  'NGK',
  150,
  3,
  true,
  12
);

-- K&N Performance Intake System
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'K&N Performance Intake System',
  'High-flow cold air intake system for performance',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  19999,
  'K&N',
  40,
  2,
  true,
  12
);

-- Hella LED Daytime Running Lights
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Hella LED Daytime Running Lights',
  'Energy-efficient LED DRLs for improved visibility',
  (SELECT id FROM categories WHERE name = 'Lighting' LIMIT 1),
  5999,
  'Hella',
  80,
  2,
  true,
  12
);

-- Bilstein B8 Performance Shocks
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Bilstein B8 Performance Shocks',
  'High-performance shock absorbers',
  (SELECT id FROM categories WHERE name = 'Brakes & Suspension' LIMIT 1),
  25999,
  'Bilstein',
  30,
  2,
  true,
  24
);

-- Brembo Sport Brake Discs & Pads
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Brembo Sport Brake Discs & Pads',
  'Performance brake discs and pads set',
  (SELECT id FROM categories WHERE name = 'Brakes & Suspension' LIMIT 1),
  18999,
  'Brembo',
  25,
  2,
  true,
  24
);

-- Snap-on Professional Tool Set
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Snap-on Professional Tool Set',
  'Comprehensive professional-grade tool set',
  (SELECT id FROM categories WHERE name = 'Tools' LIMIT 1),
  49999,
  'Snap-on',
  20,
  2,
  true,
  24
);

-- Microfiber Towels (Accessories)
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Microfiber Towels Pack',
  'Soft microfiber towels for car cleaning',
  (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1),
  899,
  'Generic',
  300,
  5,
  true,
  12
);

-- Lucas Fuel Treatment
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'Lucas Fuel Treatment',
  'Cleans and lubricates the fuel system',
  (SELECT id FROM categories WHERE name = 'Oils & Fluids' LIMIT 1),
  1599,
  'Lucas',
  200,
  5,
  true,
  12
);

-- STP Filters Deal
INSERT INTO parts (id, name, description, category_id, price, brand, stock_quantity, min_stock_level, is_active, warranty_months)
VALUES (
  uuid_generate_v4(),
  'STP Filters Combo',
  'Value combo of STP filters',
  (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
  2999,
  'STP',
  120,
  3,
  true,
  12
);

-- =====================================================
-- Images for additional parts

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Shell Helix Ultra 5W-30 Oil 4L.jpg', 'Shell Helix Ultra 5W-30 Oil 4L', true, 1
FROM parts p WHERE p.name = 'Shell Helix Ultra 5W-30 Oil 4L' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Mobil 1 ESP X3 0W-30 5L.jpg', 'Mobil 1 ESP X3 0W-30 5L', true, 1
FROM parts p WHERE p.name = 'Mobil 1 ESP X3 0W-30 5L' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Castrol Edge 0W-20 Professional.jpg', 'Castrol Edge 0W-20 Professional', true, 1
FROM parts p WHERE p.name = 'Castrol Edge 0W-20 Professional' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Castrol Brake Fluid + Bleeding Kit.jpg', 'Castrol Brake Fluid + Bleeding Kit', true, 1
FROM parts p WHERE p.name = 'Castrol Brake Fluid + Bleeding Kit' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/NGK Spark Plugs 4-Pack.jpg', 'NGK Spark Plugs 4-Pack', true, 1
FROM parts p WHERE p.name = 'NGK Spark Plugs 4-Pack' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/K&N Performance Intake System.jpg', 'K&N Performance Intake System', true, 1
FROM parts p WHERE p.name = 'K&N Performance Intake System' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Hella LED Daytime Running Lights.webp', 'Hella LED Daytime Running Lights', true, 1
FROM parts p WHERE p.name = 'Hella LED Daytime Running Lights' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Bilstein B8 Performance Shocks.webp', 'Bilstein B8 Performance Shocks', true, 1
FROM parts p WHERE p.name = 'Bilstein B8 Performance Shocks' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Brembo Sport Brake Discs & Pads.jpg', 'Brembo Sport Brake Discs & Pads', true, 1
FROM parts p WHERE p.name = 'Brembo Sport Brake Discs & Pads' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/Snap-on Professional Tool Set.webp', 'Snap-on Professional Tool Set', true, 1
FROM parts p WHERE p.name = 'Snap-on Professional Tool Set' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/microfiber-towels.jpg', 'Microfiber Towels Pack', true, 1
FROM parts p WHERE p.name = 'Microfiber Towels Pack' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/lucas-fuel.jpg', 'Lucas Fuel Treatment', true, 1
FROM parts p WHERE p.name = 'Lucas Fuel Treatment' LIMIT 1;

INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT uuid_generate_v4(), p.id, 'https://<PROJECT_REF>.supabase.co/storage/v1/object/public/part-images/stp-filters.jpg', 'STP Filters Combo', true, 1
FROM parts p WHERE p.name = 'STP Filters Combo' LIMIT 1;

COMMIT;
