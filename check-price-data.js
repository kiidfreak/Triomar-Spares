const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkPriceData() {
  try {
    console.log('Analyzing price data in database...');
    
    // Get price statistics
    const stats = await pool.query(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_parts,
        COUNT(CASE WHEN price < 100 THEN 1 END) as under_100,
        COUNT(CASE WHEN price BETWEEN 100 AND 1000 THEN 1 END) as between_100_1000,
        COUNT(CASE WHEN price BETWEEN 1000 AND 10000 THEN 1 END) as between_1k_10k,
        COUNT(CASE WHEN price > 10000 THEN 1 END) as over_10k
      FROM parts 
      WHERE price IS NOT NULL
    `);
    
    console.log('Price Statistics:');
    console.log(JSON.stringify(stats.rows[0], null, 2));
    
    // Get sample prices in different ranges
    console.log('\nSample prices under $100:');
    const lowPrices = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price < 100 
      ORDER BY price 
      LIMIT 5
    `);
    lowPrices.rows.forEach(row => {
      console.log(`${row.name}: $${row.price}`);
    });
    
    console.log('\nSample prices $100-$1000:');
    const midPrices = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price BETWEEN 100 AND 1000 
      ORDER BY price 
      LIMIT 5
    `);
    midPrices.rows.forEach(row => {
      console.log(`${row.name}: $${row.price}`);
    });
    
    console.log('\nSample prices over $1000:');
    const highPrices = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price > 1000 
      ORDER BY price 
      LIMIT 5
    `);
    highPrices.rows.forEach(row => {
      console.log(`${row.name}: $${row.price}`);
    });
    
    // Check if prices might already be in KSH
    console.log('\nChecking if prices might already be in KSH...');
    const kshCheck = await pool.query(`
      SELECT 
        COUNT(CASE WHEN price BETWEEN 100 AND 10000 THEN 1 END) as reasonable_ksh_range,
        COUNT(CASE WHEN price > 100000 THEN 1 END) as too_high_for_ksh
      FROM parts 
      WHERE price IS NOT NULL
    `);
    
    console.log('Price range analysis:');
    console.log(`Parts in reasonable KSH range (100-10,000): ${kshCheck.rows[0].reasonable_ksh_range}`);
    console.log(`Parts with very high prices (>100,000): ${kshCheck.rows[0].too_high_for_ksh}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPriceData();
