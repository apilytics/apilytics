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
CREATE UNIQUE INDEX "weekly_email_report_recipients_email_origin_id_key" ON "weekly_email_report_recipients"("email", "origin_id");

-- AddForeignKey
ALTER TABLE "weekly_email_report_recipients" ADD CONSTRAINT "weekly_email_report_recipients_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
