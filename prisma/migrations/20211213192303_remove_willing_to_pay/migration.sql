/*
  Warnings:

  - You are about to drop the column `willing_to_pay` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "willing_to_pay",
ALTER COLUMN "use_cases" DROP NOT NULL,
ALTER COLUMN "how_this_could_help" DROP NOT NULL;
