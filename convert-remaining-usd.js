const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

// Exchange rate: 1 USD = 135 KSH
const USD_TO_KSH_RATE = 135;

async function convertRemainingUSD() {
  try {
    console.log('Converting remaining USD prices (1000-50000 range)...');
    
    // Show what we're about to convert
    console.log('\n1. Prices to be converted:');
    const toConvert = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price BETWEEN 1000 AND 50000
      ORDER BY price
    `);
    
    toConvert.rows.forEach(row => {
      const newPrice = Math.round(row.price * USD_TO_KSH_RATE);
      console.log(`${row.name}: $${row.price} → KSH ${newPrice}`);
    });
    
    console.log(`\nTotal parts to convert: ${toConvert.rows.length}`);
    
    // Convert the remaining USD prices
    console.log('\n2. Converting prices...');
    const convertResult = await pool.query(`
      UPDATE parts 
      SET price = ROUND(price * ${USD_TO_KSH_RATE}, 2)
      WHERE price BETWEEN 1000 AND 50000
    `);
    
    console.log(`✅ Converted ${convertResult.rowCount} parts from USD to KSH`);
    
    // Show final results
    console.log('\n3. Final price ranges:');
    const finalRanges = await pool.query(`
      SELECT 
        COUNT(CASE WHEN price < 10000 THEN 1 END) as under_10k,
        COUNT(CASE WHEN price BETWEEN 10000 AND 100000 THEN 1 END) as between_10k_100k,
        COUNT(CASE WHEN price > 100000 THEN 1 END) as over_100k
      FROM parts 
      WHERE price IS NOT NULL
    `);
    
    console.log('Final price distribution:');
    console.log(`Under KSH 10,000: ${finalRanges.rows[0].under_10k} parts`);
    console.log(`KSH 10,000 - 100,000: ${finalRanges.rows[0].between_10k_100k} parts`);
    console.log(`Over KSH 100,000: ${finalRanges.rows[0].over_100k} parts`);
    
    // Show sample of each range
    console.log('\n4. Sample prices by range:');
    
    const under10k = await pool.query(`
      SELECT name, price FROM parts 
      WHERE price < 10000 
      ORDER BY price DESC 
      LIMIT 3
    `);
    console.log('\nUnder KSH 10,000:');
    under10k.rows.forEach(row => {
      console.log(`  ${row.name}: KSH ${row.price}`);
    });
    
    const between10k100k = await pool.query(`
      SELECT name, price FROM parts 
      WHERE price BETWEEN 10000 AND 100000 
      ORDER BY price DESC 
      LIMIT 3
    `);
    console.log('\nKSH 10,000 - 100,000:');
    between10k100k.rows.forEach(row => {
      console.log(`  ${row.name}: KSH ${row.price}`);
    });
    
    const over100k = await pool.query(`
      SELECT name, price FROM parts 
      WHERE price > 100000 
      ORDER BY price DESC 
      LIMIT 3
    `);
    console.log('\nOver KSH 100,000:');
    over100k.rows.forEach(row => {
      console.log(`  ${row.name}: KSH ${row.price}`);
    });
    
    console.log('\n✅ All USD prices converted to KSH!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

convertRemainingUSD();
