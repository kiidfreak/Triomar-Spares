const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function simpleCheck() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Get table names
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if parts table exists and get its structure
    const partsExists = tablesResult.rows.some(row => row.table_name === 'parts');
    
    if (partsExists) {
      console.log('\n🔍 Parts table structure:');
      const structureResult = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'parts' 
        ORDER BY ordinal_position
      `);
      
      structureResult.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type}`);
      });
      
      // Get count
      const countResult = await client.query('SELECT COUNT(*) as total FROM parts');
      console.log(`\n📊 Total parts: ${countResult.rows[0].total}`);
      
      // Get sample data
      const sampleResult = await client.query('SELECT * FROM parts LIMIT 3');
      console.log('\n📦 Sample data:');
      sampleResult.rows.forEach((row, index) => {
        console.log(`\nRow ${index + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    } else {
      console.log('\n❌ Parts table not found');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

simpleCheck();
