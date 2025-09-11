const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkTriggers() {
  try {
    console.log('Checking database triggers...');
    
    const result = await pool.query(`
      SELECT trigger_name, event_manipulation, action_statement 
      FROM information_schema.triggers 
      WHERE event_object_table = 'orders' OR event_object_table = 'order_items'
      ORDER BY event_object_table, trigger_name
    `);
    
    console.log('Database triggers:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    const functions = await pool.query(`
      SELECT routine_name, routine_definition 
      FROM information_schema.routines 
      WHERE routine_name = 'calculate_order_total'
    `);
    
    console.log('\nCalculate order total function:');
    console.log(JSON.stringify(functions.rows, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTriggers();
