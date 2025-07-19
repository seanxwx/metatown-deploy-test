/*
  Warnings:

  - Added the required column `state` to the `user_space_mediasoup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('ACTIVE', 'PAUSED');

TRUNCATE TABLE "user_space_mediasoup";

-- AlterTable
ALTER TABLE "user_space_mediasoup" ADD COLUMN     "state" "State" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
