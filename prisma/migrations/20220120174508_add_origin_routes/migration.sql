-- CreateTable
CREATE TABLE "origin_routes" (
    "id" UUID NOT NULL,
    "route" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "origin_id" UUID NOT NULL,

    CONSTRAINT "origin_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "origin_routes_route_origin_id_key" ON "origin_routes"("route", "origin_id");

-- CreateIndex
CREATE UNIQUE INDEX "origin_routes_pattern_origin_id_key" ON "origin_routes"("pattern", "origin_id");

-- AddForeignKey
ALTER TABLE "origin_routes" ADD CONSTRAINT "origin_routes_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
