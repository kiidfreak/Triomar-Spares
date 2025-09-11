const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkNewOrder() {
  try {
    const orderId = '734f8409-6f32-432b-95d2-cc3571df61a0';
    
    // Check order items
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    console.log('Order items:', JSON.stringify(itemsResult.rows, null, 2));
    
    // Check order details
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    console.log('Order details:', JSON.stringify(orderResult.rows, null, 2));
    
    // Calculate total from items
    if (itemsResult.rows.length > 0) {
      const total = itemsResult.rows.reduce((sum, item) => {
        return sum + (parseFloat(item.unit_price) * parseInt(item.quantity));
      }, 0);
      console.log('Calculated total from items:', total);
      
      // Update order with correct totals
      const shipping = 500; // Default shipping
      const finalTotal = total + shipping;
      
      const updateResult = await pool.query(`
        UPDATE orders 
        SET 
          total_amount = $1,
          final_amount = $2,
          shipping_amount = $3,
          tax_amount = 0.00,
          updated_at = NOW()
        WHERE id = $4
      `, [total, finalTotal, shipping, orderId]);
      
      console.log(`Update result:`, updateResult);
      console.log(`Order updated - Total: ${total}, Final: ${finalTotal}, Shipping: ${shipping}`);
      
      // Verify the update by reading the order again
      const verifyResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
      console.log('Verification - Updated values:', verifyResult.rows[0]);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkNewOrder();
