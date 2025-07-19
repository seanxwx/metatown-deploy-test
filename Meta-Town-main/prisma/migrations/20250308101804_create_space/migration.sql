/*
  Warnings:

  - You are about to drop the column `displayName` on the `users` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "displayName",
ADD COLUMN     "display_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "spaces" (
    "id" SERIAL NOT NULL,
    "auth_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_users_joined_spaces" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_users_joined_spaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "spaces_auth_id_key" ON "spaces"("auth_id");

-- CreateIndex
CREATE INDEX "_users_joined_spaces_B_index" ON "_users_joined_spaces"("B");

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_joined_spaces" ADD CONSTRAINT "_users_joined_spaces_A_fkey" FOREIGN KEY ("A") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_joined_spaces" ADD CONSTRAINT "_users_joined_spaces_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
