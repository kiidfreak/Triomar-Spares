const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkTableStructure() {
  try {
    console.log('🔍 Checking table structures...');
    
    // Check user_profiles table structure
    console.log('\n📋 user_profiles table structure:');
    const userProfilesResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' 
      ORDER BY ordinal_position
    `);
    userProfilesResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Check orders table structure
    console.log('\n📋 orders table structure:');
    const ordersResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `);
    ordersResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Check users_auth table structure
    console.log('\n📋 users_auth table structure:');
    const usersAuthResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users_auth' 
      ORDER BY ordinal_position
    `);
    usersAuthResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkTableStructure();
