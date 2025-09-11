const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function fixPaymentSessions() {
  try {
    console.log('Fixing payment_sessions table...');
    
    // Add unique constraint on order_id + provider combination
    // This makes sense because one order can have multiple payment attempts with different providers
    await pool.query(`
      ALTER TABLE payment_sessions 
      ADD CONSTRAINT payment_sessions_order_provider_unique 
      UNIQUE (order_id, provider)
    `);
    
    console.log('✅ Added unique constraint on (order_id, provider)');
    
    // Verify the constraint was added
    const constraints = await pool.query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'payment_sessions' AND constraint_type = 'UNIQUE'
    `);
    
    console.log('Payment sessions constraints:', constraints.rows);
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Constraint already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await pool.end();
  }
}

fixPaymentSessions();
