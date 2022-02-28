-- CreateTable
CREATE TABLE "excluded_routes" (
    "id" UUID NOT NULL,
    "route" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "origin_id" UUID NOT NULL,

    CONSTRAINT "excluded_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "excluded_routes_origin_id_idx" ON "excluded_routes"("origin_id");

-- CreateIndex
CREATE UNIQUE INDEX "excluded_routes_route_origin_id_key" ON "excluded_routes"("route", "origin_id");

-- CreateIndex
CREATE UNIQUE INDEX "excluded_routes_pattern_origin_id_key" ON "excluded_routes"("pattern", "origin_id");

-- AddForeignKey
ALTER TABLE "excluded_routes" ADD CONSTRAINT "excluded_routes_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
