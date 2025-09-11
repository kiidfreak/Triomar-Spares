const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkOrderAmounts() {
  try {
    const orderId = 'e1078752-7c00-4cdc-8a56-bdba4feca403';
    
    console.log('Checking order amounts for:', orderId);
    
    // Get order details
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    console.log('Order details:', JSON.stringify(orderResult.rows[0], null, 2));
    
    // Get order items
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    console.log('Order items:', JSON.stringify(itemsResult.rows, null, 2));
    
    // Calculate totals manually
    if (itemsResult.rows.length > 0) {
      const subtotal = itemsResult.rows.reduce((sum, item) => {
        return sum + (parseFloat(item.unit_price) * parseInt(item.quantity));
      }, 0);
      
      const tax = subtotal * 0.16;
      const shipping = subtotal >= 5000 ? 0 : 500;
      const final = subtotal + tax + shipping;
      
      console.log('Manual calculations:');
      console.log('Subtotal:', subtotal);
      console.log('Tax (16%):', tax);
      console.log('Shipping:', shipping);
      console.log('Final:', final);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkOrderAmounts();
