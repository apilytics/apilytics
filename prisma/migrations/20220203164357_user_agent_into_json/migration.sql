--  Semi safe since no one yet has any user agent data in the db.
ALTER TABLE "metrics" DROP COLUMN "user_agent",
ADD COLUMN     "user_agent" JSONB;
