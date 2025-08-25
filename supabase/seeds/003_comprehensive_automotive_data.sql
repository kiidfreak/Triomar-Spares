-- =====================================================
-- Comprehensive Automotive Data Seed File
-- This file populates the database with realistic automotive data
-- for the Kenyan market, including popular vehicle brands and parts
-- =====================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM parts;
-- DELETE FROM categories;
-- DELETE FROM vehicles;

-- =====================================================
-- VEHICLES - Popular brands in Kenya
-- =====================================================

-- Toyota Models (Very popular in Kenya)
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Toyota Prado', 'Toyota', 'Prado', 1996, 2024, 'Premium SUV parts for Toyota Prado models'),
('Toyota Land Cruiser', 'Toyota', 'Land Cruiser', 1980, 2024, 'Heavy-duty SUV parts for Land Cruiser'),
('Toyota Hilux', 'Toyota', 'Hilux', 1997, 2024, 'Pickup truck parts for Toyota Hilux'),
('Toyota Corolla', 'Toyota', 'Corolla', 1990, 2024, 'Sedan parts for Toyota Corolla'),
('Toyota Camry', 'Toyota', 'Camry', 1990, 2024, 'Sedan parts for Toyota Camry'),
('Toyota RAV4', 'Toyota', 'RAV4', 1994, 2024, 'Compact SUV parts for Toyota RAV4'),
('Toyota Hiace', 'Toyota', 'Hiace', 1989, 2024, 'Van parts for Toyota Hiace'),
('Toyota Vitz', 'Toyota', 'Vitz', 1999, 2024, 'Compact car parts for Toyota Vitz');

-- Nissan Models
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Nissan X-Trail T30', 'Nissan', 'X-Trail T30', 2007, 2013, 'SUV parts for Nissan X-Trail T30'),
('Nissan X-Trail T31', 'Nissan', 'X-Trail T31', 2013, 2019, 'SUV parts for Nissan X-Trail T31'),
('Nissan X-Trail T32', 'Nissan', 'X-Trail T32', 2019, 2024, 'SUV parts for Nissan X-Trail T32'),
('Nissan Navara', 'Nissan', 'Navara', 1997, 2024, 'Pickup truck parts for Nissan Navara'),
('Nissan Sunny', 'Nissan', 'Sunny', 1990, 2024, 'Sedan parts for Nissan Sunny'),
('Nissan Note', 'Nissan', 'Note', 2004, 2024, 'Compact car parts for Nissan Note'),
('Nissan March', 'Nissan', 'March', 1992, 2024, 'Compact car parts for Nissan March');

-- Mazda Models
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Mazda CX-5', 'Mazda', 'CX-5', 2012, 2024, 'SUV parts for Mazda CX-5'),
('Mazda CX-3', 'Mazda', 'CX-3', 2015, 2024, 'Compact SUV parts for Mazda CX-3'),
('Mazda 3', 'Mazda', '3', 2003, 2024, 'Compact car parts for Mazda 3'),
('Mazda 6', 'Mazda', '6', 2002, 2024, 'Sedan parts for Mazda 6'),
('Mazda BT-50', 'Mazda', 'BT-50', 2006, 2024, 'Pickup truck parts for Mazda BT-50');

-- Honda Models
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Honda CR-V', 'Honda', 'CR-V', 1995, 2024, 'SUV parts for Honda CR-V'),
('Honda Civic', 'Honda', 'Civic', 1990, 2024, 'Compact car parts for Honda Civic'),
('Honda Accord', 'Honda', 'Accord', 1990, 2024, 'Sedan parts for Honda Accord'),
('Honda Fit', 'Honda', 'Fit', 2001, 2024, 'Compact car parts for Honda Fit');

-- Suzuki Models
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Suzuki Swift', 'Suzuki', 'Swift', 2004, 2024, 'Compact car parts for Suzuki Swift'),
('Suzuki Vitara', 'Suzuki', 'Vitara', 1988, 2024, 'SUV parts for Suzuki Vitara'),
('Suzuki Jimny', 'Suzuki', 'Jimny', 1970, 2024, 'Compact SUV parts for Suzuki Jimny'),
('Suzuki Carry', 'Suzuki', 'Carry', 1985, 2024, 'Pickup truck parts for Suzuki Carry');

-- Mitsubishi Models
INSERT INTO vehicles (name, make, model, year_from, year_to, description) VALUES
('Mitsubishi Pajero', 'Mitsubishi', 'Pajero', 1982, 2024, 'SUV parts for Mitsubishi Pajero'),
('Mitsubishi L200', 'Mitsubishi', 'L200', 1996, 2024, 'Pickup truck parts for Mitsubishi L200'),
('Mitsubishi Outlander', 'Mitsubishi', 'Outlander', 2003, 2024, 'SUV parts for Mitsubishi Outlander'),
('Mitsubishi Lancer', 'Mitsubishi', 'Lancer', 1990, 2024, 'Sedan parts for Mitsubishi Lancer');

-- =====================================================
-- CATEGORIES - Comprehensive automotive parts categories
-- =====================================================

-- Engine & Performance
INSERT INTO categories (name, description) VALUES
('Engine & Filters', 'Engine oil filters, air filters, fuel filters, spark plugs, engine oil'),
('Engine Components', 'Pistons, rings, bearings, gaskets, valves, camshafts'),
('Fuel System', 'Fuel pumps, injectors, carburetors, fuel filters, fuel lines'),
('Exhaust System', 'Mufflers, catalytic converters, exhaust pipes, oxygen sensors'),
('Turbo & Supercharger', 'Turbochargers, superchargers, intercoolers, wastegates');

-- Braking System
INSERT INTO categories (name, description) VALUES
('Brake Pads & Shoes', 'Front and rear brake pads, brake shoes for drum brakes'),
('Brake Discs & Drums', 'Brake rotors, brake drums, brake hardware'),
('Brake Fluid & Lines', 'Brake fluid, brake lines, brake hoses, brake master cylinder'),
('Brake Calipers', 'Brake calipers, caliper rebuild kits, brake pistons');

-- Suspension & Steering
INSERT INTO categories (name, description) VALUES
('Shock Absorbers', 'Front and rear shock absorbers, struts, suspension kits'),
('Springs & Coilovers', 'Coil springs, leaf springs, coilover kits, lowering springs'),
('Control Arms & Bushings', 'Control arms, bushings, ball joints, tie rod ends'),
('Steering Components', 'Steering racks, power steering pumps, steering columns');

-- Transmission & Drivetrain
INSERT INTO categories (name, description) VALUES
('Clutch System', 'Clutch kits, clutch discs, pressure plates, release bearings'),
('Manual Transmission', 'Gearboxes, gear sets, synchros, shift forks'),
('Automatic Transmission', 'Transmission fluid, filters, valve bodies, torque converters'),
('Drive Shafts & Axles', 'Drive shafts, CV joints, differentials, axle shafts');

-- Cooling System
INSERT INTO categories (name, description) VALUES
('Radiators & Fans', 'Radiators, cooling fans, fan clutches, radiator caps'),
('Water Pumps & Thermostats', 'Water pumps, thermostats, coolant, hoses'),
('Heating & AC', 'Heater cores, AC compressors, condensers, evaporators');

-- Electrical System
INSERT INTO categories (name, description) VALUES
('Batteries & Charging', 'Car batteries, alternators, starters, voltage regulators'),
('Lighting & Bulbs', 'Headlights, tail lights, turn signals, interior lights'),
('Ignition System', 'Ignition coils, distributors, spark plug wires, ignition modules'),
('Sensors & Electronics', 'Oxygen sensors, temperature sensors, speed sensors, ECUs');

-- Body & Interior
INSERT INTO categories (name, description) VALUES
('Body Panels', 'Fenders, bumpers, hoods, doors, quarter panels'),
('Mirrors & Glass', 'Side mirrors, rearview mirrors, windshields, side windows'),
('Wiper System', 'Wiper blades, wiper arms, wiper motors, washer pumps'),
('Interior Parts', 'Seat covers, floor mats, dashboard parts, door handles');

-- Tires & Wheels
INSERT INTO categories (name, description) VALUES
('Tires', 'All-season tires, summer tires, winter tires, off-road tires'),
('Wheels & Rims', 'Alloy wheels, steel wheels, wheel covers, hubcaps'),
('Tire Accessories', 'Tire pressure sensors, valve stems, wheel weights');

-- Maintenance & Fluids
INSERT INTO categories (name, description) VALUES
('Engine Oils', 'Synthetic oils, conventional oils, high-mileage oils'),
('Transmission Fluids', 'ATF, manual transmission fluid, gear oil'),
('Brake & Power Steering', 'Brake fluid, power steering fluid, clutch fluid'),
('Coolants & Antifreeze', 'Engine coolant, antifreeze, water wetter');

-- Tools & Accessories
INSERT INTO categories (name, description) VALUES
('Hand Tools', 'Wrenches, sockets, screwdrivers, pliers'),
('Power Tools', 'Impact wrenches, drills, grinders, sanders'),
('Diagnostic Tools', 'OBD scanners, multimeters, test lights'),
('Car Care Products', 'Car wash, wax, polish, interior cleaners');

-- =====================================================
-- PARTS - Sample parts for various vehicles
-- =====================================================

-- Toyota Prado Parts
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Engine Oil Filter', 'TOY-PRADO-OIL-001', 'High-quality engine oil filter for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 15.99, 45, 'Toyota Genuine', 12),
('Air Filter', 'TOY-PRADO-AIR-001', 'Premium air filter for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 22.99, 38, 'Toyota Genuine', 12),
('Front Brake Pads', 'TOY-PRADO-BRAKE-F-001', 'Front brake pads for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 89.99, 25, 'Brembo', 24),
('Rear Brake Pads', 'TOY-PRADO-BRAKE-R-001', 'Rear brake pads for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 79.99, 25, 'Brembo', 24),
('Front Brake Discs', 'TOY-PRADO-DISC-F-001', 'Front brake discs for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Brake Discs & Drums'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 129.99, 18, 'Brembo', 24),
('Shock Absorbers Front', 'TOY-PRADO-SHOCK-F-001', 'Front shock absorbers for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 189.99, 15, 'Bilstein', 24),
('Shock Absorbers Rear', 'TOY-PRADO-SHOCK-R-001', 'Rear shock absorbers for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 169.99, 15, 'Bilstein', 24),
('Timing Belt Kit', 'TOY-PRADO-TIMING-001', 'Complete timing belt kit for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Engine Components'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 89.99, 12, 'Gates', 24),
('Water Pump', 'TOY-PRADO-WATER-001', 'Water pump for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Water Pumps & Thermostats'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 78.99, 18, 'Toyota Genuine', 12),
('Battery', 'TOY-PRADO-BAT-001', 'High-performance battery for Toyota Prado', 
 (SELECT id FROM categories WHERE name = 'Batteries & Charging'),
 (SELECT id FROM vehicles WHERE name = 'Toyota Prado'), 149.99, 20, 'Bosch', 24);

-- Mazda CX-5 Parts
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Engine Oil Filter', 'MAZ-CX5-OIL-001', 'High-quality engine oil filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 12.99, 50, 'Mazda Genuine', 12),
('Air Filter', 'MAZ-CX5-AIR-001', 'Premium air filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 18.99, 45, 'Mazda Genuine', 12),
('Front Brake Pads', 'MAZ-CX5-BRAKE-F-001', 'Front brake pads for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 45.99, 30, 'Brembo', 24),
('Rear Brake Pads', 'MAZ-CX5-BRAKE-R-001', 'Rear brake pads for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 39.99, 30, 'Brembo', 24),
('Front Brake Discs', 'MAZ-CX5-DISC-F-001', 'Front brake discs for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Brake Discs & Drums'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 89.99, 22, 'Brembo', 24),
('Shock Absorbers Front', 'MAZ-CX5-SHOCK-F-001', 'Front shock absorbers for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 159.99, 18, 'KYB', 24),
('Shock Absorbers Rear', 'MAZ-CX5-SHOCK-R-001', 'Rear shock absorbers for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 139.99, 18, 'KYB', 24),
('Spark Plugs Set', 'MAZ-CX5-SPARK-001', 'Set of 4 spark plugs for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 34.99, 35, 'NGK', 12),
('Fuel Filter', 'MAZ-CX5-FUEL-001', 'Fuel filter for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Fuel System'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 24.99, 28, 'Mazda Genuine', 12),
('Battery', 'MAZ-CX5-BAT-001', 'High-performance battery for Mazda CX-5', 
 (SELECT id FROM categories WHERE name = 'Batteries & Charging'),
 (SELECT id FROM vehicles WHERE name = 'Mazda CX-5'), 129.99, 25, 'Bosch', 24);

-- Nissan X-Trail Parts
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Engine Oil Filter', 'NIS-XTRAIL-OIL-001', 'High-quality engine oil filter for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 11.99, 40, 'Nissan Genuine', 12),
('Air Filter', 'NIS-XTRAIL-AIR-001', 'Premium air filter for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 16.99, 38, 'Nissan Genuine', 12),
('Fuel Pump', 'NIS-XTRAIL-FUEL-001', 'Fuel pump for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Fuel System'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 89.99, 15, 'Nissan Genuine', 24),
('Brake Pads Front', 'NIS-XTRAIL-BRAKE-F-001', 'Front brake pads for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 42.99, 25, 'Brembo', 24),
('Brake Pads Rear', 'NIS-XTRAIL-BRAKE-R-001', 'Rear brake pads for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 38.99, 25, 'Brembo', 24),
('Shock Absorbers Front', 'NIS-XTRAIL-SHOCK-F-001', 'Front shock absorbers for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 149.99, 18, 'KYB', 24),
('Shock Absorbers Rear', 'NIS-XTRAIL-SHOCK-R-001', 'Rear shock absorbers for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 129.99, 18, 'KYB', 24),
('Timing Belt Kit', 'NIS-XTRAIL-TIMING-001', 'Complete timing belt kit for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Engine Components'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 79.99, 12, 'Gates', 24),
('Water Pump', 'NIS-XTRAIL-WATER-001', 'Water pump for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Water Pumps & Thermostats'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 69.99, 15, 'Nissan Genuine', 12),
('Battery', 'NIS-XTRAIL-BAT-001', 'High-performance battery for Nissan X-Trail', 
 (SELECT id FROM categories WHERE name = 'Batteries & Charging'),
 (SELECT id FROM vehicles WHERE name = 'Nissan X-Trail T30'), 119.99, 22, 'Bosch', 24);

-- Honda CR-V Parts
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Engine Oil Filter', 'HON-CRV-OIL-001', 'High-quality engine oil filter for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 13.99, 42, 'Honda Genuine', 12),
('Air Filter', 'HON-CRV-AIR-001', 'Premium air filter for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 19.99, 40, 'Honda Genuine', 12),
('Front Brake Pads', 'HON-CRV-BRAKE-F-001', 'Front brake pads for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 49.99, 28, 'Brembo', 24),
('Rear Brake Pads', 'HON-CRV-BRAKE-R-001', 'Rear brake pads for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 44.99, 28, 'Brembo', 24),
('Shock Absorbers Front', 'HON-CRV-SHOCK-F-001', 'Front shock absorbers for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 169.99, 20, 'KYB', 24),
('Shock Absorbers Rear', 'HON-CRV-SHOCK-R-001', 'Rear shock absorbers for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 149.99, 20, 'KYB', 24),
('Timing Belt Kit', 'HON-CRV-TIMING-001', 'Complete timing belt kit for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Engine Components'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 89.99, 15, 'Gates', 24),
('Battery', 'HON-CRV-BAT-001', 'High-performance battery for Honda CR-V', 
 (SELECT id FROM categories WHERE name = 'Batteries & Charging'),
 (SELECT id FROM vehicles WHERE name = 'Honda CR-V'), 139.99, 25, 'Bosch', 24);

-- Suzuki Swift Parts
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Engine Oil Filter', 'SUZ-SWIFT-OIL-001', 'High-quality engine oil filter for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 9.99, 55, 'Suzuki Genuine', 12),
('Air Filter', 'SUZ-SWIFT-AIR-001', 'Premium air filter for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 14.99, 50, 'Suzuki Genuine', 12),
('Front Brake Pads', 'SUZ-SWIFT-BRAKE-F-001', 'Front brake pads for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 29.99, 35, 'Brembo', 24),
('Rear Brake Pads', 'SUZ-SWIFT-BRAKE-R-001', 'Rear brake pads for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Brake Pads & Shoes'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 24.99, 35, 'Brembo', 24),
('Shock Absorbers Front', 'SUZ-SWIFT-SHOCK-F-001', 'Front shock absorbers for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 89.99, 25, 'KYB', 24),
('Shock Absorbers Rear', 'SUZ-SWIFT-SHOCK-R-001', 'Rear shock absorbers for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Shock Absorbers'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 79.99, 25, 'KYB', 24),
('Spark Plugs Set', 'SUZ-SWIFT-SPARK-001', 'Set of 4 spark plugs for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Engine & Filters'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 24.99, 40, 'NGK', 12),
('Battery', 'SUZ-SWIFT-BAT-001', 'High-performance battery for Suzuki Swift', 
 (SELECT id FROM categories WHERE name = 'Batteries & Charging'),
 (SELECT id FROM vehicles WHERE name = 'Suzuki Swift'), 89.99, 30, 'Bosch', 24);

-- =====================================================
-- UNIVERSAL PARTS - Parts that fit multiple vehicles
-- =====================================================

-- Universal Engine Oils
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Castrol Edge 5W-30 4L', 'UNI-OIL-5W30-001', 'High-performance synthetic engine oil 5W-30, 4 liters', 
 (SELECT id FROM categories WHERE name = 'Engine Oils'), NULL, 45.99, 100, 'Castrol', 0),
('Castrol Edge 10W-40 4L', 'UNI-OIL-10W40-001', 'High-performance synthetic engine oil 10W-40, 4 liters', 
 (SELECT id FROM categories WHERE name = 'Engine Oils'), NULL, 42.99, 100, 'Castrol', 0),
('Mobil 1 ESP X3 0W-30 5L', 'UNI-OIL-0W30-001', 'Premium synthetic engine oil 0W-30, 5 liters', 
 (SELECT id FROM categories WHERE name = 'Engine Oils'), NULL, 55.99, 80, 'Mobil', 0),
('Shell Helix Ultra 5W-30 4L', 'UNI-OIL-SHELL-001', 'Advanced synthetic engine oil 5W-30, 4 liters', 
 (SELECT id FROM categories WHERE name = 'Engine Oils'), NULL, 48.99, 90, 'Shell', 0);

-- Universal Brake Fluids
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Castrol DOT 4 Brake Fluid 500ml', 'UNI-BRAKE-DOT4-001', 'High-performance DOT 4 brake fluid, 500ml', 
 (SELECT id FROM categories WHERE name = 'Brake Fluid & Lines'), NULL, 12.99, 150, 'Castrol', 0),
('Mobil DOT 4 Brake Fluid 500ml', 'UNI-BRAKE-MOBIL-001', 'Premium DOT 4 brake fluid, 500ml', 
 (SELECT id FROM categories WHERE name = 'Brake Fluid & Lines'), NULL, 14.99, 120, 'Mobil', 0);

-- Universal Coolants
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Castrol Radicool 5L', 'UNI-COOL-CASTROL-001', 'Long-life coolant concentrate, 5 liters', 
 (SELECT id FROM categories WHERE name = 'Coolants & Antifreeze'), NULL, 28.99, 80, 'Castrol', 0),
('Shell Coolant 5L', 'UNI-COOL-SHELL-001', 'Premium coolant concentrate, 5 liters', 
 (SELECT id FROM categories WHERE name = 'Coolants & Antifreeze'), NULL, 26.99, 80, 'Shell', 0);

-- Universal Wiper Blades
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Bosch Aerotwin Wiper Blades 24"/20"', 'UNI-WIPER-BOSCH-001', 'Premium wiper blades, 24" driver + 20" passenger', 
 (SELECT id FROM categories WHERE name = 'Wiper System'), NULL, 34.99, 60, 'Bosch', 12),
('Valeo Wiper Blades 26"/18"', 'UNI-WIPER-VALEO-001', 'High-quality wiper blades, 26" driver + 18" passenger', 
 (SELECT id FROM categories WHERE name = 'Wiper System'), NULL, 29.99, 60, 'Valeo', 12);

-- Universal Car Care Products
INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, brand, warranty_months) VALUES
('Meguiar\'s Car Wash 1.89L', 'UNI-CARE-MEGUIARS-001', 'Professional car wash soap, 1.89 liters', 
 (SELECT id FROM categories WHERE name = 'Car Care Products'), NULL, 18.99, 100, 'Meguiar\'s', 0),
('Turtle Wax Car Wax 500ml', 'UNI-CARE-TURTLE-001', 'Premium carnauba car wax, 500ml', 
 (SELECT id FROM categories WHERE name = 'Car Care Products'), NULL, 22.99, 80, 'Turtle Wax', 0),
('Armor All Interior Cleaner 500ml', 'UNI-CARE-ARMOR-001', 'Interior cleaner and protectant, 500ml', 
 (SELECT id FROM categories WHERE name = 'Car Care Products'), NULL, 15.99, 90, 'Armor All', 0);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check total counts
SELECT 'Vehicles' as table_name, COUNT(*) as count FROM vehicles
UNION ALL
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Parts' as table_name, COUNT(*) as count FROM parts;

-- Check parts by vehicle
SELECT 
  v.name as vehicle_name,
  COUNT(p.id) as parts_count,
  SUM(p.stock_quantity) as total_stock
FROM vehicles v
LEFT JOIN parts p ON v.id = p.vehicle_id
GROUP BY v.id, v.name
ORDER BY parts_count DESC;

-- Check parts by category
SELECT 
  c.name as category_name,
  COUNT(p.id) as parts_count,
  AVG(p.price) as avg_price
FROM categories c
LEFT JOIN parts p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY parts_count DESC;
