const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkPaymentSessions() {
  try {
    console.log('🔍 Checking payment_sessions table structure...');
    
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'payment_sessions' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 payment_sessions table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Also check if there are any payment sessions
    const countResult = await pool.query('SELECT COUNT(*) as total FROM payment_sessions');
    console.log(`\n📊 Total payment sessions: ${countResult.rows[0].total}`);
    
    if (countResult.rows[0].total > 0) {
      const sampleResult = await pool.query('SELECT * FROM payment_sessions LIMIT 3');
      console.log('\n📋 Sample payment sessions:');
      sampleResult.rows.forEach((session, index) => {
        console.log(`\n${index + 1}. Session:`, JSON.stringify(session, null, 2));
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkPaymentSessions();
