-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "endpoint" TEXT NOT NULL;

UPDATE metrics

SET endpoint = (
    SELECT CASE WHEN route IS NULL THEN metrics.path ELSE route END
    FROM dynamic_routes
    WHERE dynamic_routes.id = metrics.dynamic_route_id
        AND metrics.path IS NOT NULL
);

-- DropIndex
DROP INDEX "metrics_origin_id_path_method_status_code_browser_os_device_idx";

-- CreateIndex
CREATE INDEX "metrics_origin_id_path_endpoint_method_status_code_browser__idx" ON "metrics"("origin_id", "path", "endpoint", "method", "status_code", "browser", "os", "device", "country", "region", "city", "dynamic_route_id", "excluded_route_id", "created_at");
