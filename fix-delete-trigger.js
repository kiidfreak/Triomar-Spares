const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function fixDeleteTrigger() {
  try {
    console.log('Fixing the DELETE trigger...');
    
    // Drop the existing trigger and function
    await pool.query('DROP TRIGGER IF EXISTS calculate_order_total_trigger ON order_items');
    await pool.query('DROP FUNCTION IF EXISTS calculate_order_total()');
    
    // Create the corrected function that handles DELETE properly
    const correctedFunction = `
    CREATE OR REPLACE FUNCTION calculate_order_total()
    RETURNS TRIGGER AS $$
    DECLARE
      order_id_to_update UUID;
      calculated_subtotal DECIMAL(10,2);
      calculated_tax DECIMAL(10,2);
      calculated_shipping DECIMAL(10,2);
      calculated_final DECIMAL(10,2);
    BEGIN
      -- Get the order_id from the trigger context
      IF TG_OP = 'DELETE' THEN
        order_id_to_update := OLD.order_id;
      ELSE
        order_id_to_update := NEW.order_id;
      END IF;
      
      -- Calculate subtotal from order items
      SELECT COALESCE(SUM(total_price), 0) INTO calculated_subtotal
      FROM order_items WHERE order_id = order_id_to_update;
      
      -- Calculate tax (16% tax rate)
      calculated_tax := calculated_subtotal * 0.16;
      
      -- Calculate shipping (free if above threshold)
      IF calculated_subtotal >= 5000 THEN
        calculated_shipping := 0;
      ELSE
        calculated_shipping := 500;
      END IF;
      
      -- Calculate final amount
      calculated_final := calculated_subtotal + calculated_tax + calculated_shipping;
      
      -- Update the orders table
      UPDATE orders 
      SET 
        total_amount = calculated_subtotal,
        tax_amount = calculated_tax,
        shipping_amount = calculated_shipping,
        final_amount = calculated_final,
        updated_at = NOW()
      WHERE id = order_id_to_update;
      
      -- Return the appropriate record
      IF TG_OP = 'DELETE' THEN
        RETURN OLD;
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
    
    console.log('✅ DELETE trigger fixed successfully!');
    
    // Test the fixed trigger
    console.log('Testing the fixed trigger with DELETE...');
    
    const orderId = '734f8409-6f32-432b-95d2-cc3571df61a0';
    
    // Check current state
    const beforeResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('Before test:', beforeResult.rows[0]);
    
    // Get a part to test with
    const partResult = await pool.query('SELECT id, price FROM parts LIMIT 1');
    const partId = partResult.rows[0].id;
    const partPrice = partResult.rows[0].price;
    
    console.log(`Adding test item: part ${partId}, price ${partPrice}`);
    
    // Add a test item
    await pool.query(`
      INSERT INTO order_items (order_id, part_id, quantity, unit_price, total_price) 
      VALUES ($1, $2, 1, $3, $3)
    `, [orderId, partId, partPrice]);
    
    // Check state after adding item
    const afterResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('After adding item:', afterResult.rows[0]);
    
    // Now test DELETE
    console.log('Deleting test item...');
    await pool.query('DELETE FROM order_items WHERE order_id = $1 AND part_id = $2', [orderId, partId]);
    
    const finalResult = await pool.query('SELECT total_amount, final_amount, shipping_amount, tax_amount FROM orders WHERE id = $1', [orderId]);
    console.log('After DELETE:', finalResult.rows[0]);
    
    console.log('✅ DELETE trigger test completed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

fixDeleteTrigger();
