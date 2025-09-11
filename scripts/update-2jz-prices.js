const { Pool } = require('pg');

async function update2JZPrices() {
  console.log('🚀 Updating 2JZ engine prices to realistic market values...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Railway's self-signed certs
    },
  });

  const client = await pool.connect();

  try {
    // Update prices based on real market research
    const updates = [
      { name: 'Toyota 2JZ-GTE Engine - Complete', price: 850000 }, // Complete with wiring and ECU
      { name: 'Toyota 2JZ Long Motor', price: 450000 }, // Long motor assembly
      { name: 'Toyota 2JZ Engine - Used', price: 320000 } // Used but working condition
    ];
    
    for (const update of updates) {
      const result = await client.query(
        'UPDATE parts SET price = $1 WHERE name = $2',
        [update.price, update.name]
      );
      console.log(`✅ Updated ${update.name}: KSH ${update.price.toLocaleString()}`);
    }
    
    console.log('🎉 All 2JZ engine prices updated successfully!');
    console.log('📊 New pricing:');
    console.log('   - Toyota 2JZ-GTE Engine - Complete: KSH 850,000');
    console.log('   - Toyota 2JZ Long Motor: KSH 450,000');
    console.log('   - Toyota 2JZ Engine - Used: KSH 320,000');
  } catch (error) {
    console.error('❌ Error updating prices:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

update2JZPrices();
