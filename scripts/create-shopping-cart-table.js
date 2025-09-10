const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Use the provided DATABASE_URL
const DATABASE_URL = 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';

async function createShoppingCartTable() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  
  try {
    console.log('🔄 Creating shopping_cart table...');
    
    await client.query('BEGIN');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '009_create_shopping_cart_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    await client.query('COMMIT');
    
    console.log('✅ shopping_cart table created successfully!');
    console.log('📋 Table structure:');
    console.log('   - id: UUID (Primary Key)');
    console.log('   - user_id: UUID (Foreign Key to users_auth)');
    console.log('   - part_id: UUID (Foreign Key to parts)');
    console.log('   - quantity: INTEGER');
    console.log('   - created_at: TIMESTAMP');
    console.log('   - updated_at: TIMESTAMP');
    console.log('   - Unique constraint on (user_id, part_id)');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating shopping_cart table:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createShoppingCartTable();
