-- CreateTable
CREATE TABLE "origin_users" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "origin_id" UUID NOT NULL,

    CONSTRAINT "origin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "origin_invites" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "origin_id" UUID NOT NULL,

    CONSTRAINT "origin_invites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "origin_users" ADD CONSTRAINT "origin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "origin_users" ADD CONSTRAINT "origin_users_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "origin_invites" ADD CONSTRAINT "origin_invites_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "origin_invites_origin_id_idx" ON "origin_invites"("origin_id");

-- CreateIndex
CREATE INDEX "origin_users_user_id_idx" ON "origin_users"("user_id");

-- CreateIndex
CREATE INDEX "origin_users_origin_id_idx" ON "origin_users"("origin_id");

-- CreateIndex
CREATE UNIQUE INDEX "origin_invites_origin_id_email_key" ON "origin_invites"("origin_id", "email");

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "origin_users" (
  "id",
  "role",
  "updated_at",
  "user_id",
  "origin_id"
) SELECT
    uuid_generate_v4(),
    'owner',
    NOW(),
    "user_id",
    "id"
  FROM "origins";

-- DropForeignKey
ALTER TABLE "origins" DROP CONSTRAINT "origins_user_id_fkey";

-- DropIndex
DROP INDEX "origins_user_id_idx";

-- AlterTable
ALTER TABLE "origins" DROP COLUMN "user_id";
