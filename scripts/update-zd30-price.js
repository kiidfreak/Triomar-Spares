const { Pool } = require('pg');

async function updateZD30Price() {
  console.log('🚀 Updating Nissan ZD30 engine price to KSH 160,000...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();

  try {
    const result = await client.query(
      'UPDATE parts SET price = $1 WHERE name = $2',
      [160000, 'Nissan ZD30 Engine - Hardbody']
    );
    
    console.log(`✅ Updated Nissan ZD30 Engine - Hardbody: KSH 160,000`);
    console.log('🎉 Price update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating price:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateZD30Price();
