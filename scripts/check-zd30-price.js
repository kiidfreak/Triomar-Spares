const { Pool } = require('pg');

async function checkZD30Price() {
  console.log('🔍 Checking Nissan ZD30 engine price in database...');

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
      WHERE name LIKE '%ZD30%' 
      ORDER BY name
    `);
    
    console.log('Nissan ZD30 engine price in database:');
    result.rows.forEach(row => {
      console.log(`- ${row.name}: KSH ${Math.round(Number(row.price)).toLocaleString()}`);
    });
    
    if (result.rows.length === 0) {
      console.log('No ZD30 engines found in database.');
    }
  } catch (error) {
    console.error('❌ Error checking price:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkZD30Price();
