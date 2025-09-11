const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function verifyPriceConversion() {
  try {
    console.log('Verifying price conversion results...');
    
    // Check the part that was in the recent order
    const partId = '469fbe6b-50a7-481b-b59e-a7c15a8d5722';
    const partResult = await pool.query('SELECT name, price FROM parts WHERE id = $1', [partId]);
    
    if (partResult.rows.length > 0) {
      const part = partResult.rows[0];
      console.log(`\nPart from recent order: ${part.name}`);
      console.log(`Current price: KSH ${part.price}`);
      
      // This should now be a reasonable KSH price
      if (part.price > 1000 && part.price < 100000) {
        console.log('✅ Price looks reasonable for KSH');
      } else {
        console.log('❌ Price might need adjustment');
      }
    }
    
    // Show current price distribution
    console.log('\nCurrent price distribution:');
    const stats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN price < 1000 THEN 1 END) as under_1k,
        COUNT(CASE WHEN price BETWEEN 1000 AND 10000 THEN 1 END) as between_1k_10k,
        COUNT(CASE WHEN price BETWEEN 10000 AND 100000 THEN 1 END) as between_10k_100k,
        COUNT(CASE WHEN price > 100000 THEN 1 END) as over_100k
      FROM parts 
      WHERE price IS NOT NULL
    `);
    
    const s = stats.rows[0];
    console.log(`Under KSH 1,000: ${s.under_1k} parts`);
    console.log(`KSH 1,000 - 10,000: ${s.between_1k_10k} parts`);
    console.log(`KSH 10,000 - 100,000: ${s.between_10k_100k} parts`);
    console.log(`Over KSH 100,000: ${s.over_100k} parts`);
    
    // Show examples of reasonable KSH prices
    console.log('\nExamples of reasonable KSH prices:');
    const examples = await pool.query(`
      SELECT name, price 
      FROM parts 
      WHERE price BETWEEN 1000 AND 50000
      ORDER BY price
      LIMIT 10
    `);
    
    examples.rows.forEach(row => {
      console.log(`${row.name}: KSH ${row.price}`);
    });
    
    console.log('\n✅ Price conversion verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyPriceConversion();
