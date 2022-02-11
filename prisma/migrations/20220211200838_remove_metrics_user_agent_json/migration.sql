UPDATE "metrics"
SET "browser" = "user_agent"->'browser'->>'name',
  "os" = "user_agent"->'os'->>'name',
  "device" = "user_agent"->'device'->>'type'
WHERE "user_agent"->>'ua' IS NOT NULL;

ALTER TABLE "metrics" DROP COLUMN "user_agent";
