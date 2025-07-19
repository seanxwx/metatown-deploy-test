/*
  Warnings:

  - A unique constraint covering the columns `[user_id,space_id,kind]` on the table `user_space_mediasoup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kind` to the `user_space_mediasoup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('audio', 'video');

-- DropIndex
DROP INDEX "user_space_mediasoup_user_id_space_id_key";

-- AlterTable
ALTER TABLE "user_space_mediasoup" ADD COLUMN     "kind" "MediaKind" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_space_mediasoup_user_id_space_id_kind_key" ON "user_space_mediasoup"("user_id", "space_id", "kind");
