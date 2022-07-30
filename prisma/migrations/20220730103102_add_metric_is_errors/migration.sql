-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "is_error" BOOLEAN NOT NULL DEFAULT false;

UPDATE metrics
SET is_error = status_code >= 400;
