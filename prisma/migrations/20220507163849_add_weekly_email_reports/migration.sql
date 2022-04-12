-- AlterTable
ALTER TABLE "origins" ADD COLUMN     "weekly_email_reports_enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_permission" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "weekly_email_report_recipients" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "origin_id" UUID,

    CONSTRAINT "weekly_email_report_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weekly_email_report_recipients_email_key" ON "weekly_email_report_recipients"("email");

-- AddForeignKey
ALTER TABLE "weekly_email_report_recipients" ADD CONSTRAINT "weekly_email_report_recipients_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "weekly_email_report_recipients" (
  "id",
  "email",
  "origin_id",
  "updated_at"
) SELECT
  uuid_generate_v4(),
  "users"."email",
  "origins"."id",
  NOW()
  FROM "origin_users"
  LEFT JOIN "users" ON "origin_users"."user_id" = "users"."id"
  LEFT JOIN "origins" ON "origin_users"."origin_id" = "origins"."id"
  WHERE "origins"."weekly_email_reports_enabled" = TRUE;
