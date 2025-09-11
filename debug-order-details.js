const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function debugOrderDetails() {
  try {
    const orderId = 'ae9286be-6b66-47a1-a199-ac590edcb3ac'
    console.log('🔍 Debugging order details for:', orderId);
    
    // Check the order data
    const orderResult = await pool.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.final_amount,
        o.status,
        o.payment_transaction_id,
        o.payment_method,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        up.first_name,
        up.last_name,
        up.phone,
        ua.email,
        ua.name,
        ps.provider as session_payment_method,
        ps.session_data
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN payment_sessions ps ON o.id = ps.order_id
      WHERE o.id = $1
    `, [orderId]);
    
    if (orderResult.rows.length === 0) {
      console.log('❌ Order not found');
      return;
    }
    
    const order = orderResult.rows[0];
    console.log('\n📋 Order Data:');
    console.log('Order ID:', order.id);
    console.log('Total Amount:', order.total_amount);
    console.log('Final Amount:', order.final_amount);
    console.log('Status:', order.status);
    console.log('Created At:', order.created_at);
    console.log('Updated At:', order.updated_at);
    console.log('User Profile - First Name:', order.first_name);
    console.log('User Profile - Last Name:', order.last_name);
    console.log('User Profile - Phone:', order.phone);
    console.log('User Auth - Email:', order.email);
    console.log('User Auth - Name:', order.name);
    
    // Check order items
    const itemsResult = await pool.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        p.name as part_name,
        p.part_number,
        p.brand,
        c.name as category_name
      FROM order_items oi
      LEFT JOIN parts p ON oi.part_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = $1
    `, [orderId]);
    
    console.log(`\n📦 Order Items (${itemsResult.rows.length}):`);
    itemsResult.rows.forEach((item, index) => {
      console.log(`${index + 1}. Item ID: ${item.id}`);
      console.log(`   Part Name: ${item.part_name}`);
      console.log(`   Part Number: ${item.part_number}`);
      console.log(`   Brand: ${item.brand}`);
      console.log(`   Category: ${item.category_name}`);
      console.log(`   Quantity: ${item.quantity}`);
      console.log(`   Unit Price: ${item.unit_price}`);
      console.log(`   Total Price: ${item.total_price}`);
      console.log('---');
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

debugOrderDetails();
