const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

// Exchange rate: 1 USD = 135 KSH
const USD_TO_KSH_RATE = 135;

async function smartPriceConversion() {
  try {
    console.log('Smart price conversion: USD to KSH');
    console.log(`Using exchange rate: 1 USD = ${USD_TO_KSH_RATE} KSH`);
    
    // Strategy: Convert prices that look like USD (reasonable USD ranges)
    // Leave prices that are already in KSH (higher values)
    
    console.log('\n1. Analyzing which prices need conversion...');
    
    // Get all parts with their current prices
    const allParts = await pool.query(`
      SELECT id, name, price,
             CASE 
               WHEN price <= 1000 THEN 'likely_usd'
               WHEN price BETWEEN 1000 AND 50000 THEN 'maybe_usd'
               WHEN price > 50000 THEN 'likely_ksh'
               ELSE 'unknown'
             END as price_type
      FROM parts 
      WHERE price IS NOT NULL
      ORDER BY price
    `);
    
    console.log('Price analysis:');
    const typeCounts = allParts.rows.reduce((acc, row) => {
      acc[row.price_type] = (acc[row.price_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count} parts`);
    });
    
    // Show examples of each type
    console.log('\nExamples by type:');
    const examples = allParts.rows.reduce((acc, row) => {
      if (!acc[row.price_type] || acc[row.price_type].length < 3) {
        if (!acc[row.price_type]) acc[row.price_type] = [];
        acc[row.price_type].push(row);
      }
      return acc;
    }, {});
    
    Object.entries(examples).forEach(([type, parts]) => {
      console.log(`\n${type.toUpperCase()}:`);
      parts.forEach(part => {
        console.log(`  ${part.name}: $${part.price}`);
      });
    });
    
    // Convert only the likely USD prices (under $1000)
    console.log('\n2. Converting likely USD prices to KSH...');
    
    const convertResult = await pool.query(`
      UPDATE parts 
      SET price = ROUND(price * ${USD_TO_KSH_RATE}, 2)
      WHERE price <= 1000
    `);
    
    console.log(`✅ Converted ${convertResult.rowCount} parts from USD to KSH`);
    
    // Show what was converted
    console.log('\n3. Showing converted prices...');
    const convertedParts = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price <= ${1000 * USD_TO_KSH_RATE}
      ORDER BY price DESC
      LIMIT 10
    `);
    
    console.log('Top 10 converted prices:');
    convertedParts.rows.forEach(row => {
      console.log(`${row.name}: KSH ${row.price}`);
    });
    
    // Show prices that were left unchanged
    console.log('\n4. Prices left unchanged (likely already KSH):');
    const unchangedParts = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price > ${1000 * USD_TO_KSH_RATE}
      ORDER BY price DESC
      LIMIT 5
    `);
    
    console.log('Top 5 unchanged prices:');
    unchangedParts.rows.forEach(row => {
      console.log(`${row.name}: KSH ${row.price}`);
    });
    
    // Final statistics
    console.log('\n5. Final price statistics:');
    const finalStats = await pool.query(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_parts
      FROM parts 
      WHERE price IS NOT NULL
    `);
    
    console.log(JSON.stringify(finalStats.rows[0], null, 2));
    
    console.log('\n✅ Smart price conversion completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

smartPriceConversion();
