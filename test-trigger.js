const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function testTrigger() {
  try {
    console.log('Testing the order total calculation trigger...');
    
    // First, let's test the trigger on the existing order by adding a new item
    const orderId = '734f8409-6f32-432b-95d2-cc3571df61a0';
    
    console.log('1. Checking current order state...');
    const beforeResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('Before trigger test:', beforeResult.rows[0]);
    
    // Get a part ID to test with
    const partResult = await pool.query('SELECT id, price FROM parts LIMIT 1');
    if (partResult.rows.length === 0) {
      console.log('No parts found in database');
      return;
    }
    
    const partId = partResult.rows[0].id;
    const partPrice = partResult.rows[0].price;
    
    console.log('2. Adding a test item to trigger recalculation...');
    console.log(`Using part: ${partId}, price: ${partPrice}`);
    
    // Add a test item (this should trigger the calculation)
    await pool.query(`
      INSERT INTO order_items (order_id, part_id, quantity, unit_price, total_price) 
      VALUES ($1, $2, 1, $3, $3)
    `, [orderId, partId, partPrice]);
    
    console.log('3. Checking order state after adding item...');
    const afterResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('After trigger test:', afterResult.rows[0]);
    
    // Clean up - remove the test item
    console.log('4. Cleaning up test item...');
    await pool.query('DELETE FROM order_items WHERE order_id = $1 AND part_id = $2', [orderId, partId]);
    
    console.log('5. Final state after cleanup...');
    const finalResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('Final state:', finalResult.rows[0]);
    
    console.log('✅ Trigger test completed successfully!');
    
  } catch (error) {
    console.error('❌ Trigger test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testTrigger();
