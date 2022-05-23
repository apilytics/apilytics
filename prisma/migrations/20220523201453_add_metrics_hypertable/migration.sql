ALTER TABLE "metrics" DROP CONSTRAINT "metrics_pkey";

CREATE UNIQUE INDEX "metrics_id_created_at_key" ON "metrics"("id", "created_at");

SELECT create_hypertable('metrics', 'created_at', migrate_data => TRUE);
