-- =====================================================
-- AutoZone Schema Test Script
-- Run this after importing the complete schema to test functionality
-- =====================================================

-- Test 1: Check if all tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'vehicles', 'categories', 'parts', 'user_profiles', 'orders', 
    'order_items', 'admin_users', 'store_settings', 'notification_settings',
    'product_images', 'shopping_cart', 'wishlist', 'product_reviews', 'coupons'
  )
ORDER BY table_name;

-- Test 2: Check if sample data was inserted correctly
SELECT 'Vehicles' as table_name, COUNT(*) as record_count FROM vehicles
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Parts', COUNT(*) FROM parts
UNION ALL
SELECT 'Store Settings', COUNT(*) FROM store_settings
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users;

-- Test 3: Test relationships - Get parts with category and vehicle info
SELECT 
  p.name as part_name,
  c.name as category,
  v.make || ' ' || v.model as vehicle,
  p.price,
  p.stock_quantity
FROM parts p
JOIN categories c ON p.category_id = c.id
JOIN vehicles v ON p.vehicle_id = v.id
LIMIT 5;

-- Test 4: Test admin functions
SELECT 
  is_admin('00000000-0000-0000-0000-000000000000') as test_admin_function,
  is_manager_or_admin('00000000-0000-0000-0000-000000000000') as test_manager_function;

-- Test 5: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 6: Check indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Test 7: Check views
SELECT 
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;

-- Test 8: Check triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Test 9: Verify store settings
SELECT 
  setting_key,
  setting_value,
  setting_type,
  is_public
FROM store_settings
ORDER BY setting_key;

-- Test 10: Check sample parts data
SELECT 
  p.name,
  p.part_number,
  p.price,
  p.stock_quantity,
  c.name as category,
  v.name as vehicle
FROM parts p
JOIN categories c ON p.category_id = c.id
JOIN vehicles v ON p.vehicle_id = v.id
ORDER BY v.name, c.name, p.name;

-- Test 11: Verify constraints
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- Test 12: Check if UUID extension is working
SELECT uuid_generate_v4() as test_uuid;

-- Test 13: Verify admin user creation
SELECT 
  email,
  role,
  first_name,
  last_name,
  is_active
FROM admin_users;

-- Test 14: Check if all required columns exist in parts table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'parts'
ORDER BY ordinal_position;

-- Test 15: Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'vehicles', 'categories', 'parts', 'user_profiles', 'orders', 
    'order_items', 'admin_users', 'store_settings', 'notification_settings',
    'product_images', 'shopping_cart', 'wishlist', 'product_reviews', 'coupons'
  )
ORDER BY tablename;

-- =====================================================
-- MANUAL TESTS TO RUN
-- =====================================================

-- Test A: Try to insert a new part (should work for admin users)
-- INSERT INTO parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity) 
-- VALUES ('Test Part', 'TEST-001', 'Test description', 
--         (SELECT id FROM categories LIMIT 1), 
--         (SELECT id FROM vehicles LIMIT 1), 999, 10);

-- Test B: Try to update store settings (should work for admin users)
-- UPDATE store_settings SET setting_value = 'Test Value' WHERE setting_key = 'store_name';

-- Test C: Try to create a new order (should work for authenticated users)
-- INSERT INTO orders (user_id, total_amount, final_amount) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 1000, 1160);

-- =====================================================
-- EXPECTED RESULTS
-- =====================================================

-- ✅ All 13 tables should exist
-- ✅ Sample data should be present (vehicles: 5, categories: 7, parts: 12, etc.)
-- ✅ All relationships should work correctly
-- ✅ RLS policies should be in place
-- ✅ Indexes should be created
-- ✅ Views should be functional
-- ✅ Triggers should be active
-- ✅ Constraints should be enforced
-- ✅ UUID generation should work
-- ✅ Admin user should be created
-- ✅ All required columns should exist
-- ✅ RLS should be enabled on all tables

-- If any test fails, check the error messages and verify the schema import
