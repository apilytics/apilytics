ALTER TABLE "origin_routes" DROP CONSTRAINT "origin_routes_origin_id_fkey";

ALTER TABLE "origin_routes" RENAME TO "dynamic_routes";
ALTER INDEX "origin_routes_route_origin_id_key" RENAME TO "dynamic_routes_route_origin_id_key";
ALTER INDEX "origin_routes_pattern_origin_id_key"  RENAME TO "dynamic_routes_pattern_origin_id_key";

ALTER TABLE "dynamic_routes" RENAME CONSTRAINT "origin_routes_pkey" TO "dynamic_routes_pkey";
ALTER TABLE "dynamic_routes" ADD CONSTRAINT "dynamic_routes_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
