/*
  Warnings:

  - Made the column `walls` on table `stage_configs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entry` on table `stage_configs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stage_configs" ALTER COLUMN "walls" SET NOT NULL,
ALTER COLUMN "entry" SET NOT NULL;
