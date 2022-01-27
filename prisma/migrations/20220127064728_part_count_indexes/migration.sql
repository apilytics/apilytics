CREATE INDEX "metrics_path_part_count_idx" ON "metrics" ((LENGTH("path") - LENGTH(REPLACE("path", '/', ''))));
CREATE INDEX "dynamic_routes_pattern_part_count_idx" ON "dynamic_routes" ((LENGTH("pattern") - LENGTH(REPLACE("pattern", '/', ''))));
