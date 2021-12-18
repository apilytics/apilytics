ALTER TABLE IF EXISTS "users" RENAME TO "waitlist_users";

ALTER INDEX IF EXISTS "users_pkey" RENAME TO "waitlist_users_pkey";
ALTER INDEX IF EXISTS "users_email_key"  RENAME TO "waitlist_users_email_key";
