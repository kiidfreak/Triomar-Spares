# AutoZone Database Schema Setup Guide

This guide will help you set up the complete AutoZone database schema in Supabase and test its functionality.

## 🚀 Quick Start

### 1. Import the Complete Schema

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy the entire contents of `supabase/complete_schema.sql`**
4. **Paste it into the SQL Editor**
5. **Click "Run" to execute the schema**

The schema will create:
- ✅ 13 core tables
- ✅ All relationships and constraints
- ✅ Sample data for testing
- ✅ Security policies (RLS)
- ✅ Performance indexes
- ✅ Views and functions
- ✅ Triggers for automation

## 📊 What Gets Created

### Core Tables
- `vehicles` - Vehicle makes, models, and years
- `categories` - Product categories (hierarchical)
- `parts` - Products/parts with full details
- `user_profiles` - Extended user information
- `orders` - Customer orders with status tracking
- `order_items` - Individual items in orders

### Admin Tables
- `admin_users` - Role-based access control
- `store_settings` - Configurable store parameters
- `notification_settings` - Admin notification preferences
- `product_images` - Product image management

### Feature Tables
- `shopping_cart` - User shopping carts
- `wishlist` - User wishlists
- `product_reviews` - Customer reviews and ratings
- `coupons` - Discount codes and promotions

## 🧪 Testing the Schema

### Step 1: Run the Test Script

After importing the schema, run the test script:

1. **Copy the contents of `test_schema.sql`**
2. **Paste into SQL Editor**
3. **Click "Run"**

### Step 2: Verify Expected Results

The test script should show:

```
✅ All 13 tables exist
✅ Sample data is present:
  - Vehicles: 5 records
  - Categories: 7 records  
  - Parts: 12 records
  - Store Settings: 12 records
  - Admin Users: 1 record
✅ All relationships work correctly
✅ RLS policies are in place
✅ Indexes are created
✅ Views are functional
✅ Triggers are active
✅ Constraints are enforced
✅ UUID generation works
✅ Admin user is created
✅ All required columns exist
✅ RLS is enabled on all tables
```

## 🔧 Manual Testing

### Test Admin Functions

```sql
-- Test if admin functions work
SELECT is_admin('00000000-0000-0000-0000-000000000000');
SELECT is_manager_or_admin('00000000-0000-0000-0000-000000000000');
```

### Test Data Relationships

```sql
-- Get parts with category and vehicle info
SELECT 
  p.name as part_name,
  c.name as category,
  v.make || ' ' || v.model as vehicle,
  p.price
FROM parts p
JOIN categories c ON p.category_id = c.id
JOIN vehicles v ON p.vehicle_id = v.id
LIMIT 5;
```

### Test Views

```sql
-- Test product catalog view
SELECT * FROM product_catalog LIMIT 5;

-- Test order summary view  
SELECT * FROM order_summary LIMIT 5;
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Table already exists" errors
- **Solution**: Drop existing tables first or use `CREATE TABLE IF NOT EXISTS`

#### 2. "Function already exists" errors  
- **Solution**: Use `CREATE OR REPLACE FUNCTION` (already in schema)

#### 3. "Policy already exists" errors
- **Solution**: Drop existing policies first:
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

#### 4. RLS not working
- **Check**: Verify RLS is enabled on tables
- **Check**: Verify policies are created correctly

#### 5. UUID generation fails
- **Check**: Verify `uuid-ossp` extension is enabled
- **Solution**: Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Reset Schema (if needed)

If you need to start over:

```sql
-- Drop all tables (WARNING: This will delete all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-import the complete schema
```

## 🔐 Security Features

### Row Level Security (RLS)
- **Public tables**: `vehicles`, `categories`, `parts` (read-only)
- **User tables**: `user_profiles`, `orders`, `cart`, `wishlist` (user-specific)
- **Admin tables**: `admin_users`, `store_settings` (admin-only)

### Role-Based Access
- **Admin**: Full access to everything
- **Manager**: Can manage products and orders
- **Viewer**: Read-only access to dashboard

### Authentication Required
- Most operations require user authentication
- Admin functions require admin role verification

## 📈 Performance Features

### Indexes
- Primary keys (automatic)
- Foreign keys for relationships
- Custom indexes for common queries
- Composite indexes for complex searches

### Views
- `product_catalog`: Optimized product listing
- `order_summary`: Order overview with user info

### Triggers
- Automatic `updated_at` timestamps
- Order number generation
- Order total calculations

## 🎯 Next Steps

### 1. Test Admin Panel
- Navigate to `/admin` in your app
- Try adding a new product
- Test admin settings

### 2. Test User Features
- User registration/login
- Product browsing
- Shopping cart functionality

### 3. Customize Data
- Update store settings
- Add more vehicles/categories
- Modify sample products

### 4. Monitor Performance
- Check query performance
- Monitor RLS policy effectiveness
- Optimize indexes if needed

## 📞 Support

If you encounter issues:

1. **Check the test script output** for specific errors
2. **Verify Supabase project settings** (RLS enabled, etc.)
3. **Check browser console** for frontend errors
4. **Review Supabase logs** for backend errors

## 🔄 Schema Updates

To update the schema later:

1. **Create new migration files** for changes
2. **Test in development** first
3. **Backup production data** before applying
4. **Apply migrations** during maintenance windows

---

**Schema Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: Supabase (PostgreSQL 15+)
