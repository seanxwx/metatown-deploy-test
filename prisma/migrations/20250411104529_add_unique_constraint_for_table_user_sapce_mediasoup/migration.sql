/*
  Warnings:
  - A unique constraint covering the columns `[user_id,space_id]` on the table `user_space_mediasoup` will be added. If there are existing duplicate values, this will fail.
*/
-- DropIndex
DROP INDEX "user_space_mediasoup_user_id_space_id_producer_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_space_mediasoup_user_id_space_id_key" ON "user_space_mediasoup"("user_id", "space_id");
