-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "endpoint" TEXT;

ALTER TABLE "metrics" ALTER COLUMN "endpoint" SET NOT NULL;

-- DropIndex
DROP INDEX "metrics_origin_id_path_method_status_code_browser_os_device_idx";

-- CreateIndex
CREATE INDEX "metrics_origin_id_path_endpoint_method_status_code_browser__idx" ON "metrics"("origin_id", "path", "endpoint", "method", "status_code", "browser", "os", "device", "country", "region", "city", "dynamic_route_id", "excluded_route_id", "created_at");
