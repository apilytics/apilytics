ALTER TABLE "metrics" ALTER COLUMN "status_code" SET DEFAULT 0;
UPDATE "metrics" SET "status_code" = 0 WHERE "status_code" IS NULL;
ALTER TABLE "metrics" ALTER COLUMN "status_code" SET NOT NULL;
