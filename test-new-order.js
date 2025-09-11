const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function testNewOrder() {
  try {
    console.log('Testing new order with KSH prices...');
    
    // Get a sample part to test with
    const partResult = await pool.query(`
      SELECT id, name, price 
      FROM parts 
      WHERE price BETWEEN 1000 AND 10000
      LIMIT 1
    `);
    
    if (partResult.rows.length === 0) {
      console.log('No parts found in the test range');
      return;
    }
    
    const part = partResult.rows[0];
    console.log(`\nTesting with part: ${part.name}`);
    console.log(`Part price: KSH ${part.price}`);
    
    // Simulate order calculation
    const subtotal = parseFloat(part.price);
    const tax = subtotal * 0.16; // 16% VAT
    const shipping = subtotal >= 5000 ? 0 : 500; // Free shipping over KSH 5,000
    const final = subtotal + tax + shipping;
    
    console.log('\nOrder calculation:');
    console.log(`Subtotal: KSH ${subtotal.toFixed(2)}`);
    console.log(`Tax (16%): KSH ${tax.toFixed(2)}`);
    console.log(`Shipping: KSH ${shipping}`);
    console.log(`Final Total: KSH ${final.toFixed(2)}`);
    
    // Check if this matches what the trigger would calculate
    console.log('\nThis should now match the M-Pesa charge amount!');
    
    // Show what the frontend should display
    console.log('\nFrontend should display:');
    console.log(`Subtotal: KSH ${Math.round(subtotal).toLocaleString()}`);
    console.log(`Tax (16% VAT): KSH ${Math.round(tax).toLocaleString()}`);
    console.log(`Shipping: ${shipping === 0 ? 'FREE' : `KSH ${shipping.toLocaleString()}`}`);
    console.log(`Total: KSH ${Math.round(final).toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testNewOrder();
