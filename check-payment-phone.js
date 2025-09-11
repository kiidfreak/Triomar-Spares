const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkPaymentPhone() {
  try {
    console.log('🔍 Checking phone numbers in payment sessions...');
    
    const result = await pool.query(`
      SELECT 
        ps.order_id,
        ps.session_data->>'phone_number' as phone_number,
        o.user_id,
        ua.email,
        ua.name
      FROM payment_sessions ps
      LEFT JOIN orders o ON ps.order_id = o.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      WHERE ps.session_data->>'phone_number' IS NOT NULL
      ORDER BY ps.created_at DESC
      LIMIT 5
    `);
    
    console.log(`📊 Payment sessions with phone numbers: ${result.rows.length}`);
    
    if (result.rows.length > 0) {
      console.log('📋 Payment sessions with phone data:');
      result.rows.forEach((session, index) => {
        console.log(`${index + 1}. Order: ${session.order_id}`);
        console.log(`   Phone: ${session.phone_number}`);
        console.log(`   User: ${session.name} (${session.email})`);
        console.log('---');
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkPaymentPhone();
