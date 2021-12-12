ALTER TABLE IF EXISTS "User" RENAME TO "users";

ALTER TABLE IF EXISTS "users" RENAME COLUMN "useCases" TO "use_cases";
ALTER TABLE IF EXISTS "users" RENAME COLUMN "howThisCouldHelp" TO "how_this_could_help";
ALTER TABLE IF EXISTS "users" RENAME COLUMN "willingToPay" TO "willing_to_pay";

ALTER INDEX IF EXISTS "User_pkey" RENAME TO "users_pkey";
ALTER INDEX IF EXISTS "User_email_key"  RENAME TO "users_email_key" ;
