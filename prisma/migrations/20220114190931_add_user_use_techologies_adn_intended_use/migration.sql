-- AlterTable
ALTER TABLE "users" ADD COLUMN     "intended_use" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "used_technologies" TEXT NOT NULL DEFAULT E'';
