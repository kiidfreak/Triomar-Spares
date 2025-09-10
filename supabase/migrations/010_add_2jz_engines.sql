-- Add 2JZ Engine products to the database
-- These are high-performance engines popular in the automotive community

BEGIN;

-- First, ensure we have the Engine & Filters category
-- Check if category exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Engine & Filters') THEN
    INSERT INTO categories (id, name, description)
    VALUES (
      uuid_generate_v4(),
      'Engine & Filters',
      'Engine components and filters'
    );
  END IF;
END $$;

-- Add 2JZ Engine products
INSERT INTO parts (
  id,
  name,
  description,
  category_id,
  price,
  brand,
  stock_quantity,
  min_stock_level,
  is_active,
  warranty_months,
  part_number
)
VALUES 
  -- 2JZ Engine - New/Refurbished
  (
    uuid_generate_v4(),
    'Toyota 2JZ-GTE Engine - Complete',
    'Complete Toyota 2JZ-GTE twin-turbo inline-6 engine. Includes all accessories, wiring harness, and ECU. Perfect for swaps and rebuilds. Low mileage, excellent condition.',
    (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
    89999,
    'Toyota',
    3,
    1,
    true,
    12,
    '2JZ-GTE-COMPLETE'
  ),
  
  -- 2JZ Long Motor
  (
    uuid_generate_v4(),
    'Toyota 2JZ Long Motor',
    'Toyota 2JZ long motor assembly. Includes engine block, cylinder head, pistons, connecting rods, and crankshaft. Ready for rebuild or as core exchange.',
    (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
    45999,
    'Toyota',
    5,
    2,
    true,
    6,
    '2JZ-LONG-MOTOR'
  ),
  
  -- Used 2JZ Engine - Budget Option
  (
    uuid_generate_v4(),
    'Toyota 2JZ Engine - Used',
    'Used Toyota 2JZ engine in good working condition. Perfect for budget builds and projects. Engine has been tested and verified to run. Some wear expected.',
    (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
    29999,
    'Toyota',
    2,
    1,
    true,
    3,
    '2JZ-USED'
  );

-- Add product images for the 2JZ engines
INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
SELECT 
  uuid_generate_v4(),
  p.id,
  CASE 
    WHEN p.part_number = '2JZ-GTE-COMPLETE' THEN '/images/categories/2jz engine.png'
    WHEN p.part_number = '2JZ-LONG-MOTOR' THEN '/images/categories/2jzlongmotor.jpg'
    WHEN p.part_number = '2JZ-USED' THEN '/images/categories/used2jzengineoffer.png'
  END,
  p.name,
  true,
  1
FROM parts p
WHERE p.part_number IN ('2JZ-GTE-COMPLETE', '2JZ-LONG-MOTOR', '2JZ-USED');

COMMIT;
