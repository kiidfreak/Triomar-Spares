const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function fixTrigger() {
  try {
    console.log('Fixing the order total calculation trigger...');
    
    // Drop the existing trigger and function
    await pool.query('DROP TRIGGER IF EXISTS calculate_order_total_trigger ON order_items');
    await pool.query('DROP TRIGGER IF EXISTS calculate_order_total_on_order_update_trigger ON orders');
    await pool.query('DROP FUNCTION IF EXISTS calculate_order_total()');
    
    // Create the corrected function
    const correctedFunction = `
    CREATE OR REPLACE FUNCTION calculate_order_total()
    RETURNS TRIGGER AS $$
    DECLARE
      order_id_to_update UUID;
      subtotal DECIMAL(10,2);
      tax_amount DECIMAL(10,2);
      shipping_amount DECIMAL(10,2);
      final_amount DECIMAL(10,2);
    BEGIN
      -- Get the order_id from the trigger context
      IF TG_TABLE_NAME = 'order_items' THEN
        order_id_to_update := NEW.order_id;
      ELSE
        order_id_to_update := NEW.id;
      END IF;
      
      -- Calculate subtotal from order items
      SELECT COALESCE(SUM(total_price), 0) INTO subtotal
      FROM order_items WHERE order_id = order_id_to_update;
      
      -- Calculate tax (16% tax rate)
      tax_amount := subtotal * 0.16;
      
      -- Calculate shipping (free if above threshold)
      IF subtotal >= 5000 THEN
        shipping_amount := 0;
      ELSE
        shipping_amount := 500;
      END IF;
      
      -- Calculate final amount
      final_amount := subtotal + tax_amount + shipping_amount;
      
      -- Update the orders table
      UPDATE orders 
      SET 
        total_amount = subtotal,
        tax_amount = tax_amount,
        shipping_amount = shipping_amount,
        final_amount = final_amount,
        updated_at = NOW()
      WHERE id = order_id_to_update;
      
      -- Return the appropriate record
      IF TG_TABLE_NAME = 'order_items' THEN
        RETURN NEW;
      ELSE
        RETURN NEW;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    await pool.query(correctedFunction);
    
    // Create the trigger on order_items
    await pool.query(`
      CREATE TRIGGER calculate_order_total_trigger 
        AFTER INSERT OR UPDATE OR DELETE ON order_items
        FOR EACH ROW 
        EXECUTE FUNCTION calculate_order_total()
    `);
    
    console.log('✅ Trigger fixed successfully!');
    
    // Test the fixed trigger
    console.log('Testing the fixed trigger...');
    
    const orderId = '734f8409-6f32-432b-95d2-cc3571df61a0';
    
    // Check current state
    const beforeResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('Before test:', beforeResult.rows[0]);
    
    // Get a part to test with
    const partResult = await pool.query('SELECT id, price FROM parts LIMIT 1');
    const partId = partResult.rows[0].id;
    const partPrice = partResult.rows[0].price;
    
    // Add a test item
    await pool.query(`
      INSERT INTO order_items (order_id, part_id, quantity, unit_price, total_price) 
      VALUES ($1, $2, 1, $3, $3)
    `, [orderId, partId, partPrice]);
    
    // Check state after adding item
    const afterResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('After adding item:', afterResult.rows[0]);
    
    // Clean up
    await pool.query('DELETE FROM order_items WHERE order_id = $1 AND part_id = $2', [orderId, partId]);
    
    const finalResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('After cleanup:', finalResult.rows[0]);
    
    console.log('✅ Fixed trigger test completed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await pool.end();
  }
}

fixTrigger();
