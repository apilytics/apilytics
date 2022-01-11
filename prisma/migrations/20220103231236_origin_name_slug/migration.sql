/*
  Warnings:

  - You are about to drop the column `domain` on the `origins` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `origins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `origins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `origins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `origins` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "origins_domain_user_id_key";

-- AlterTable
ALTER TABLE "origins" DROP COLUMN "domain",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "origins_name_key" ON "origins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "origins_slug_key" ON "origins"("slug");
