-- Update product image URLs to use local paths
-- Run this after uploading images to public/images/products/

-- STP Oil Filter
UPDATE product_images 
SET image_url = '/images/products/stp-oil-filter.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'STP Extended Life Oil Filter' LIMIT 1);

-- K&N Air Filter
UPDATE product_images 
SET image_url = '/images/products/k-n-air-filter.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'K&N Performance Air Filter' LIMIT 1);

-- Mobil 1 Oil
UPDATE product_images 
SET image_url = '/images/products/mobil1-synthetic-oil.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Mobil 1 Synthetic Oil 5L' LIMIT 1);

-- Brembo Brake Pads
UPDATE product_images 
SET image_url = '/images/products/brembo-brake-pads.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Brembo Premium Brake Pads' LIMIT 1);

-- Monroe Shocks
UPDATE product_images 
SET image_url = '/images/products/monroe-shocks.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Monroe Shock Absorbers' LIMIT 1);

-- Bosch Battery
UPDATE product_images 
SET image_url = '/images/products/bosch-battery.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Bosch S4 Car Battery' LIMIT 1);

-- Philips LED Bulbs
UPDATE product_images 
SET image_url = '/images/products/philips-led-bulbs.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Philips LED Headlight Bulbs' LIMIT 1);

-- Halfords Tool Kit
UPDATE product_images 
SET image_url = '/images/products/halfords-tool-kit.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Halfords Advanced Tool Kit' LIMIT 1);

-- Shell Oil
UPDATE product_images 
SET image_url = '/images/products/shell-helix-oil.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Shell Helix Ultra 5W-30 Oil 4L' LIMIT 1);

-- Mobil 1 ESP
UPDATE product_images 
SET image_url = '/images/products/mobil1-esp-oil.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Mobil 1 ESP X3 0W-30 5L' LIMIT 1);

-- Castrol Edge
UPDATE product_images 
SET image_url = '/images/products/castrol-edge-oil.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Castrol Edge 0W-20 Professional' LIMIT 1);

-- Castrol Brake Fluid
UPDATE product_images 
SET image_url = '/images/products/castrol-brake-fluid.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Castrol Brake Fluid + Bleeding Kit' LIMIT 1);

-- NGK Spark Plugs
UPDATE product_images 
SET image_url = '/images/products/ngk-spark-plugs.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'NGK Spark Plugs 4-Pack' LIMIT 1);

-- K&N Intake System
UPDATE product_images 
SET image_url = '/images/products/k-n-intake-system.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'K&N Performance Intake System' LIMIT 1);

-- Hella LED DRLs
UPDATE product_images 
SET image_url = '/images/products/hella-led-drls.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Hella LED Daytime Running Lights' LIMIT 1);

-- Bilstein Shocks
UPDATE product_images 
SET image_url = '/images/products/bilstein-shocks.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Bilstein B8 Performance Shocks' LIMIT 1);

-- Brembo Sport Discs
UPDATE product_images 
SET image_url = '/images/products/brembo-sport-discs.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Brembo Sport Brake Discs & Pads' LIMIT 1);

-- Snap-on Tools
UPDATE product_images 
SET image_url = '/images/products/snap-on-tools.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Snap-on Professional Tool Set' LIMIT 1);

-- Microfiber Towels
UPDATE product_images 
SET image_url = '/images/products/microfiber-towels.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Microfiber Towels Pack' LIMIT 1);

-- Lucas Fuel Treatment
UPDATE product_images 
SET image_url = '/images/products/lucas-fuel-treatment.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'Lucas Fuel Treatment' LIMIT 1);

-- STP Filters Combo
UPDATE product_images 
SET image_url = '/images/products/stp-filters-combo.jpg'
WHERE part_id = (SELECT id FROM parts WHERE name = 'STP Filters Combo' LIMIT 1);
