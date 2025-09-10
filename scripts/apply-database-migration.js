#!/usr/bin/env node

/**
 * Apply database migration to add missing order columns
 * Run with: node scripts/apply-database-migration.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  console.log('🗄️ Applying database migration for missing order columns...\n');

  // Use the provided DATABASE_URL
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not available');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Railway requires SSL
  });

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '008_add_missing_order_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Executing migration: 008_add_missing_order_columns.sql');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!');
    
    // Verify the columns exist
    console.log('\n🔍 Verifying columns were added...');
    
    const { rows } = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND column_name IN ('final_amount', 'payment_method', 'payment_transaction_id', 'order_number')
      ORDER BY column_name
    `);

    if (rows.length > 0) {
      console.log('✅ Required columns found:');
      rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('❌ No required columns found');
    }

    // Check if there are any existing orders
    const { rows: orderCount } = await pool.query('SELECT COUNT(*) as count FROM orders');
    console.log(`\n📊 Total orders in database: ${orderCount[0].count}`);

    if (orderCount[0].count > 0) {
      // Check if existing orders have final_amount set
      const { rows: nullFinalAmount } = await pool.query('SELECT COUNT(*) as count FROM orders WHERE final_amount IS NULL');
      if (nullFinalAmount[0].count > 0) {
        console.log(`⚠️  ${nullFinalAmount[0].count} orders have NULL final_amount - these will be updated`);
      } else {
        console.log('✅ All existing orders have final_amount set');
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log('\n🎉 Database migration completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Test your order creation API');
  console.log('2. Verify IntaSend payment integration works');
  console.log('3. Check that all payment methods are functioning');
}

// Run the migration
applyMigration().catch(console.error);
