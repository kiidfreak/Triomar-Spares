const { Pool } = require('pg');

async function cleanupDuplicate2JZ() {
  console.log('🧹 Cleaning up duplicate 2JZ engine entries...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();

  try {
    // First, let's see what we have
    const checkResult = await client.query(`
      SELECT name, COUNT(*) as count 
      FROM parts 
      WHERE name LIKE '%2JZ%' 
      GROUP BY name
      ORDER BY name
    `);
    
    console.log('Current 2JZ engine counts:');
    checkResult.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.count} entries`);
    });

    // Delete duplicates, keeping only the first one of each type
    const deleteResult = await client.query(`
      DELETE FROM parts 
      WHERE id IN (
        SELECT id FROM (
          SELECT id, 
                 ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
          FROM parts 
          WHERE name LIKE '%2JZ%'
        ) t 
        WHERE rn > 1
      )
    `);
    
    console.log(`\n✅ Removed ${deleteResult.rowCount} duplicate entries`);
    
    // Check final count
    const finalResult = await client.query(`
      SELECT name, price 
      FROM parts 
      WHERE name LIKE '%2JZ%' 
      ORDER BY name
    `);
    
    console.log('\nFinal 2JZ engines:');
    finalResult.rows.forEach(row => {
      console.log(`- ${row.name}: KSH ${Math.round(Number(row.price)).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupDuplicate2JZ();
