const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testFixedOrders() {
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
        ps.session_data,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN payment_sessions ps ON o.id = ps.order_id
      GROUP BY o.id, o.total_amount, o.final_amount, o.status, o.payment_transaction_id, o.payment_method, o.payment_status, o.created_at, o.updated_at, up.first_name, up.last_name, up.phone, ua.email, ps.provider, ps.session_data
      ORDER BY o.created_at DESC
      LIMIT 3
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
      console.log(`   Payment Method: ${order.payment_method || 'N/A'}`);
      console.log(`   Payment Status: ${order.payment_status || 'N/A'}`);
      console.log(`   Transaction ID: ${order.payment_transaction_id || 'N/A'}`);
      console.log(`   Items: ${order.items_count}`);
      console.log(`   Created: ${order.created_at}`);
      
      // Show payment session data if available
      if (order.session_data) {
        try {
          const sessionData = typeof order.session_data === 'string' 
            ? JSON.parse(order.session_data) 
            : order.session_data
          
          console.log(`   Session Payment Method: ${order.session_payment_method || 'N/A'}`);
          if (sessionData.webhook_data?.state) {
            console.log(`   Webhook State: ${sessionData.webhook_data.state}`);
          }
          if (sessionData.intasend_response?.invoice?.state) {
            console.log(`   IntaSend State: ${sessionData.intasend_response.invoice.state}`);
          }
        } catch (error) {
          console.log(`   Session Data Error: ${error.message}`);
        }
      }
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

testFixedOrders();
