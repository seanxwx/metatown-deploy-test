/*
  Warnings:

  - Made the column `x` on table `user_space_positions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `y` on table `user_space_positions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direction` on table `user_space_positions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_space_positions" ALTER COLUMN "x" SET NOT NULL,
ALTER COLUMN "y" SET NOT NULL,
ALTER COLUMN "direction" SET NOT NULL;
