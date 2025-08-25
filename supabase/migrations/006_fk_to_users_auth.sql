-- Point user-related foreign keys to users_auth instead of auth.users

-- Orders.user_id
ALTER TABLE IF EXISTS orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS orders
  ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users_auth(id) ON DELETE SET NULL;

-- Shopping cart.user_id
ALTER TABLE IF EXISTS shopping_cart
  DROP CONSTRAINT IF EXISTS shopping_cart_user_id_fkey;
ALTER TABLE IF EXISTS shopping_cart
  ADD CONSTRAINT shopping_cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES users_auth(id) ON DELETE CASCADE;

-- Wishlist.user_id
ALTER TABLE IF EXISTS wishlist
  DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
ALTER TABLE IF EXISTS wishlist
  ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES users_auth(id) ON DELETE CASCADE;


