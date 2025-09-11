const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkPartsTableStructure() {
  try {
    console.log('Checking parts table structure...\n');
    
    // Get table structure
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'parts' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 PARTS TABLE STRUCTURE:');
    console.log('='.repeat(80));
    structureResult.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(25)} | ${col.data_type.padEnd(15)} | ${col.is_nullable.padEnd(5)} | ${col.column_default || 'NULL'}`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Get sample data
    const sampleResult = await pool.query(`
      SELECT * FROM parts LIMIT 5
    `);
    
    console.log('\n📦 SAMPLE DATA (first 5 rows):');
    console.log('='.repeat(80));
    sampleResult.rows.forEach((row, index) => {
      console.log(`\nRow ${index + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        const displayValue = value === null ? 'NULL' : 
                           typeof value === 'string' && value.length > 50 ? 
                           value.substring(0, 47) + '...' : 
                           value;
        console.log(`  ${key}: ${displayValue}`);
      });
    });
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM parts');
    console.log(`\n📊 Total parts in database: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPartsTableStructure();
