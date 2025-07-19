/*
  Warnings:

  - A unique constraint covering the columns `[user_id,space_id]` on the table `user_space_positions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_space_positions_user_id_space_id_key" ON "user_space_positions"("user_id", "space_id");
