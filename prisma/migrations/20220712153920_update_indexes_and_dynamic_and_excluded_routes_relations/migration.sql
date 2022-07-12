-- DropIndex
DROP INDEX "dynamic_routes_origin_id_idx";

-- DropIndex
DROP INDEX "dynamic_routes_pattern_origin_id_key";

-- DropIndex
DROP INDEX "excluded_routes_origin_id_idx";

-- DropIndex
DROP INDEX "excluded_routes_pattern_origin_id_key";

-- DropIndex
DROP INDEX "metrics_created_at_idx";

-- DropIndex
DROP INDEX "metrics_id_created_at_key";

-- DropIndex
DROP INDEX "metrics_origin_id_idx";

-- DropIndex
DROP INDEX "origin_users_origin_id_idx";

-- DropIndex
DROP INDEX "origin_users_user_id_idx";

-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "dynamic_route_id" UUID,
ADD COLUMN     "excluded_route_id" UUID;

-- CreateIndex
CREATE INDEX "dynamic_routes_origin_id_pattern_idx" ON "dynamic_routes"("origin_id", "pattern");

-- CreateIndex
CREATE INDEX "excluded_routes_origin_id_pattern_idx" ON "excluded_routes"("origin_id", "pattern");

-- CreateIndex
CREATE INDEX "metrics_origin_id_path_method_status_code_browser_os_device_idx" ON "metrics"("origin_id", "path", "method", "status_code", "browser", "os", "device", "country", "region", "city", "dynamic_route_id", "excluded_route_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "metrics_id_origin_id_created_at_key" ON "metrics"("id", "origin_id", "created_at");

-- CreateIndex
CREATE INDEX "origin_users_user_id_origin_id_idx" ON "origin_users"("user_id", "origin_id");

-- CreateIndex
CREATE INDEX "weekly_email_report_recipients_email_origin_id_idx" ON "weekly_email_report_recipients"("email", "origin_id");

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_dynamic_route_id_fkey" FOREIGN KEY ("dynamic_route_id") REFERENCES "dynamic_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_excluded_route_id_fkey" FOREIGN KEY ("excluded_route_id") REFERENCES "excluded_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
