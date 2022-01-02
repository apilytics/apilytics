/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `origins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `api_key` to the `origins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "origins" ADD COLUMN     "api_key" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "origins_api_key_key" ON "origins"("api_key");
