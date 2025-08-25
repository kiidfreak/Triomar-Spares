-- Update admin_users.user_id foreign key to reference users_auth
ALTER TABLE IF EXISTS admin_users
  DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

ALTER TABLE IF EXISTS admin_users
  ADD CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users_auth(id) ON DELETE CASCADE;
