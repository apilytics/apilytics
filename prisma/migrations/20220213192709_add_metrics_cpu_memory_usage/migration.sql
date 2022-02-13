-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "cpu_usage" DOUBLE PRECISION,
ADD COLUMN     "memory_usage" BIGINT,
ADD COLUMN     "memory_total" BIGINT;
