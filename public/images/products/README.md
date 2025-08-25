# Product Images for Railway

## How to organize images:

1. **Place your product images here** in this folder
2. **Use descriptive filenames** that match your database:
   - `stp-oil-filter.jpg`
   - `k-n-air-filter.jpg`
   - `brembo-brake-pads.jpg`

3. **Update your database** to use local URLs:
   ```sql
   UPDATE product_images 
   SET image_url = '/images/products/stp-oil-filter.jpg'
   WHERE part_id = (SELECT id FROM parts WHERE name = 'STP Extended Life Oil Filter');
   ```

4. **Railway will serve** these files at:
   - `https://your-app.railway.app/images/products/stp-oil-filter.jpg`

## Image Guidelines:
- **Formats**: JPG, PNG, WebP (recommended for performance)
- **Sizes**: Keep under 2MB per image
- **Dimensions**: Consistent aspect ratios work best
- **Naming**: Use lowercase, hyphens, no spaces
