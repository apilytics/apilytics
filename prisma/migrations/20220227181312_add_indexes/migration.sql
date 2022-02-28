-- CreateIndex
CREATE INDEX "dynamic_routes_origin_id_idx" ON "dynamic_routes"("origin_id");

-- CreateIndex
CREATE INDEX "metrics_created_at_idx" ON "metrics"("created_at");

-- CreateIndex
CREATE INDEX "metrics_origin_id_idx" ON "metrics"("origin_id");

-- CreateIndex
CREATE INDEX "origins_slug_idx" ON "origins"("slug");

-- CreateIndex
CREATE INDEX "origins_user_id_idx" ON "origins"("user_id");
