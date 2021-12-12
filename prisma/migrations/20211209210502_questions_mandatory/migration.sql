/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `useCases` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `howThisCouldHelp` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `willingToPay` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "useCases" SET NOT NULL,
ALTER COLUMN "howThisCouldHelp" SET NOT NULL,
ALTER COLUMN "willingToPay" SET NOT NULL;
