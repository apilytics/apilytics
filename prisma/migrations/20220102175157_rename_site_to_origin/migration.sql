ALTER TABLE "metrics" DROP CONSTRAINT "metrics_site_id_fkey";
ALTER TABLE "sites" DROP CONSTRAINT "sites_user_id_fkey";

ALTER TABLE "sites" RENAME TO "origins";
ALTER INDEX "sites_pkey"  RENAME TO "origins_pkey";
ALTER INDEX "sites_domain_user_id_key"  RENAME TO "origins_domain_user_id_key";

ALTER TABLE "metrics" RENAME COLUMN "site_id" TO "origin_id";

ALTER TABLE "origins" ADD CONSTRAINT "origins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
