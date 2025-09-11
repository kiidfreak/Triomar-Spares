const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkOrders() {
  try {
    console.log('🔍 Checking orders in database...');
    
    // Check total orders count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM orders');
    console.log('📊 Total orders:', countResult.rows[0].total);
    
    if (countResult.rows[0].total > 0) {
      // Get sample orders with details
      const ordersResult = await pool.query(`
        SELECT 
          o.id,
          o.total_amount,
          o.status,
          o.created_at,
          up.first_name,
          up.last_name,
          ua.email,
          COUNT(oi.id) as items_count
        FROM orders o
        LEFT JOIN user_profiles up ON o.user_id = up.user_id
        LEFT JOIN users_auth ua ON o.user_id = ua.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, o.total_amount, o.status, o.created_at, up.first_name, up.last_name, ua.email
        ORDER BY o.created_at DESC
        LIMIT 5
      `);
      
      console.log('📋 Sample orders:');
      ordersResult.rows.forEach((order, index) => {
        console.log(`${index + 1}. ID: ${order.id}`);
        console.log(`   Customer: ${order.first_name || 'N/A'} ${order.last_name || 'N/A'}`);
        console.log(`   Email: ${order.email || 'N/A'}`);
        console.log(`   Amount: ${order.total_amount}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Items: ${order.items_count}`);
        console.log(`   Date: ${order.created_at}`);
        console.log('---');
      });
    }
    
    // Check payment_sessions table
    const paymentResult = await pool.query('SELECT COUNT(*) as total FROM payment_sessions');
    console.log('💳 Payment sessions:', paymentResult.rows[0].total);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkOrders();
