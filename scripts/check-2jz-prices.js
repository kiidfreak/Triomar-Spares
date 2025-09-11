const { Pool } = require('pg');

async function check2JZPrices() {
  console.log('🔍 Checking current 2JZ engine prices in database...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT name, price 
      FROM parts 
      WHERE name LIKE '%2JZ%' 
      ORDER BY name, price
    `);
    
    console.log('Current 2JZ engine prices in database:');
    result.rows.forEach(row => {
      console.log(`- ${row.name}: KSH ${Math.round(Number(row.price)).toLocaleString()}`);
    });
    
    console.log(`\nTotal 2JZ engines found: ${result.rows.length}`);
  } catch (error) {
    console.error('❌ Error checking prices:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

check2JZPrices();
