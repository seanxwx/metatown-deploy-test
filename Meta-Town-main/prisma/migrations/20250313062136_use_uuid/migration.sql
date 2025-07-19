/*
  Warnings:

  - The primary key for the `_users_joined_spaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `spaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `spaces` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_space_positions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_space_positions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `A` on the `_users_joined_spaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_users_joined_spaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_id` on the `spaces` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `user_space_positions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `space_id` on the `user_space_positions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_users_joined_spaces" DROP CONSTRAINT "_users_joined_spaces_A_fkey";

-- DropForeignKey
ALTER TABLE "_users_joined_spaces" DROP CONSTRAINT "_users_joined_spaces_B_fkey";

-- DropForeignKey
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "user_space_positions" DROP CONSTRAINT "user_space_positions_space_id_fkey";

-- DropForeignKey
ALTER TABLE "user_space_positions" DROP CONSTRAINT "user_space_positions_user_id_fkey";

-- AlterTable
ALTER TABLE "_users_joined_spaces" DROP CONSTRAINT "_users_joined_spaces_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL,
ADD CONSTRAINT "_users_joined_spaces_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "owner_id",
ADD COLUMN     "owner_id" UUID NOT NULL,
ADD CONSTRAINT "spaces_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_space_positions" DROP CONSTRAINT "user_space_positions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "space_id",
ADD COLUMN     "space_id" UUID NOT NULL,
ADD CONSTRAINT "user_space_positions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "_users_joined_spaces_B_index" ON "_users_joined_spaces"("B");

-- CreateIndex
CREATE UNIQUE INDEX "user_space_positions_user_id_space_id_key" ON "user_space_positions"("user_id", "space_id");

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_positions" ADD CONSTRAINT "user_space_positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_positions" ADD CONSTRAINT "user_space_positions_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_joined_spaces" ADD CONSTRAINT "_users_joined_spaces_A_fkey" FOREIGN KEY ("A") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_joined_spaces" ADD CONSTRAINT "_users_joined_spaces_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
