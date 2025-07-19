/*
  Warnings:

  - You are about to drop the column `auth_id` on the `spaces` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "spaces_auth_id_key";

-- AlterTable
ALTER TABLE "spaces" DROP COLUMN "auth_id";
