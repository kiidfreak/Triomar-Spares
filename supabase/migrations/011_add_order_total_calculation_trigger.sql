-- Add missing order total calculation function and trigger
-- This fixes the issue where orders are created with $0.00 amounts

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate subtotal from order items
  SELECT COALESCE(SUM(total_price), 0) INTO NEW.total_amount
  FROM order_items WHERE order_id = NEW.id;
  
  -- Calculate tax (16% tax rate)
  NEW.tax_amount := NEW.total_amount * 0.16;
  
  -- Calculate shipping (free if above threshold)
  IF NEW.total_amount >= 5000 THEN
    NEW.shipping_amount := 0;
  ELSE
    NEW.shipping_amount := 500;
  END IF;
  
  -- Calculate final amount
  NEW.final_amount := NEW.total_amount + NEW.tax_amount + NEW.shipping_amount - COALESCE(NEW.discount_amount, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate order totals when order_items are inserted/updated
CREATE TRIGGER calculate_order_total_trigger 
  AFTER INSERT OR UPDATE ON order_items
  FOR EACH ROW 
  EXECUTE FUNCTION calculate_order_total();

-- Also trigger on order updates to recalculate totals
CREATE TRIGGER calculate_order_total_on_order_update_trigger 
  AFTER UPDATE ON orders
  FOR EACH ROW 
  WHEN (OLD.total_amount IS DISTINCT FROM NEW.total_amount OR 
        OLD.tax_amount IS DISTINCT FROM NEW.tax_amount OR 
        OLD.shipping_amount IS DISTINCT FROM NEW.shipping_amount OR 
        OLD.discount_amount IS DISTINCT FROM NEW.discount_amount)
  EXECUTE FUNCTION calculate_order_total();
