const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testOrdersQuery() {
  try {
    console.log('🔍 Testing fixed orders query...');
    
    const { rows: orders } = await pool.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.final_amount,
        o.status,
        o.payment_transaction_id,
        o.payment_method,
        o.payment_status,
        o.created_at,
        o.updated_at,
        up.first_name,
        up.last_name,
        up.phone,
        ua.email,
        ps.provider as session_payment_method,
        ps.status as session_payment_status,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN payment_sessions ps ON o.id = ps.order_id
      GROUP BY o.id, o.total_amount, o.final_amount, o.status, o.payment_transaction_id, o.payment_method, o.payment_status, o.created_at, o.updated_at, up.first_name, up.last_name, up.phone, ua.email, ps.provider, ps.status
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    
    console.log(`📊 Found ${orders.length} orders:`);
    orders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order.id}`);
      console.log(`   Customer: ${order.first_name || 'N/A'} ${order.last_name || 'N/A'}`);
      console.log(`   Email: ${order.email || 'N/A'}`);
      console.log(`   Phone: ${order.phone || 'N/A'}`);
      console.log(`   Amount: ${order.total_amount}`);
      console.log(`   Final Amount: ${order.final_amount}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Payment Method: ${order.payment_method || order.session_payment_method || 'N/A'}`);
      console.log(`   Payment Status: ${order.payment_status || order.session_payment_status || 'N/A'}`);
      console.log(`   Transaction ID: ${order.payment_transaction_id || 'N/A'}`);
      console.log(`   Items: ${order.items_count}`);
      console.log(`   Created: ${order.created_at}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

testOrdersQuery();
