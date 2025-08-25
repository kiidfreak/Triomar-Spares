-- Create product_catalog view for the products API
CREATE OR REPLACE VIEW product_catalog AS
SELECT 
  p.id,
  p.name,
  p.part_number,
  p.description,
  p.price,
  p.stock_quantity,
  p.brand,
  p.is_active,
  c.name as category_name,
  v.name as vehicle_name,
  v.make,
  v.model,
  pi.image_url,
  pi.image_alt
FROM parts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN vehicles v ON p.vehicle_id = v.id
LEFT JOIN product_images pi ON p.id = pi.part_id AND pi.is_primary = true
WHERE p.is_active = true;
