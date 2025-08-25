-- Create product_images table for storing image data
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  image_name VARCHAR(255) NOT NULL,
  image_data TEXT NOT NULL, -- Base64 encoded image data
  image_type VARCHAR(100) NOT NULL,
  folder VARCHAR(100) DEFAULT 'products',
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_folder ON product_images(folder);

-- Add image_url column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') THEN
    ALTER TABLE products ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_product_images_updated_at 
  BEFORE UPDATE ON product_images 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample image data (optional - for testing)
-- INSERT INTO product_images (image_name, image_data, image_type, folder) VALUES 
-- ('sample.jpg', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...', 'image/jpeg', 'products');
