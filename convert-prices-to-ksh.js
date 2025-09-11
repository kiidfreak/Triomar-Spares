const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

// Exchange rate: 1 USD = 135 KSH (reasonable current rate)
const USD_TO_KSH_RATE = 135;

async function convertPricesToKSH() {
  try {
    console.log('Converting all USD prices to KSH...');
    console.log(`Using exchange rate: 1 USD = ${USD_TO_KSH_RATE} KSH`);
    
    // First, let's see what we're working with
    console.log('\n1. Checking current prices...');
    const currentPrices = await pool.query(`
      SELECT id, name, price, 
             ROUND(price * ${USD_TO_KSH_RATE}, 2) as new_price_ksh
      FROM parts 
      ORDER BY price DESC 
      LIMIT 10
    `);
    
    console.log('Sample current prices (top 10):');
    currentPrices.rows.forEach(row => {
      console.log(`${row.name}: $${row.price} USD → KSH ${row.new_price_ksh}`);
    });
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM parts');
    console.log(`\nTotal parts to convert: ${countResult.rows[0].total}`);
    
    // Convert all prices
    console.log('\n2. Converting prices...');
    const updateResult = await pool.query(`
      UPDATE parts 
      SET price = ROUND(price * ${USD_TO_KSH_RATE}, 2)
      WHERE price > 0
    `);
    
    console.log(`✅ Updated ${updateResult.rowCount} parts`);
    
    // Verify the conversion
    console.log('\n3. Verifying conversion...');
    const verifyResult = await pool.query(`
      SELECT id, name, price 
      FROM parts 
      ORDER BY price DESC 
      LIMIT 10
    `);
    
    console.log('Sample converted prices (top 10):');
    verifyResult.rows.forEach(row => {
      console.log(`${row.name}: KSH ${row.price}`);
    });
    
    // Check for any remaining USD-like prices (very low values)
    const lowPrices = await pool.query(`
      SELECT COUNT(*) as count 
      FROM parts 
      WHERE price < 100
    `);
    
    console.log(`\nParts with prices under KSH 100: ${lowPrices.rows[0].count}`);
    
    if (lowPrices.rows[0].count > 0) {
      console.log('These might need manual review:');
      const lowPriceParts = await pool.query(`
        SELECT id, name, price 
        FROM parts 
        WHERE price < 100 
        LIMIT 5
      `);
      
      lowPriceParts.rows.forEach(row => {
        console.log(`- ${row.name}: KSH ${row.price}`);
      });
    }
    
    console.log('\n✅ Price conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error converting prices:', error.message);
  } finally {
    await pool.end();
  }
}

convertPricesToKSH();
