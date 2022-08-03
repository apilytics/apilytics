-- AlterTable
ALTER TABLE "metrics" ADD COLUMN     "endpoint" TEXT NOT NULL;

UPDATE metrics

SET endpoint = (
  SELECT CASE WHEN route IS NULL THEN metrics.path ELSE route END
  FROM dynamic_routes
  WHERE dynamic_routes.id = metrics.dynamic_route_id
);
