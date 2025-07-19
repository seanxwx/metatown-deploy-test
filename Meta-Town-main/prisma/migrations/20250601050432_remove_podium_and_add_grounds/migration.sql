/*
  Warnings:

  - You are about to drop the column `podium` on the `stage_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stage_configs" DROP COLUMN "podium",
ADD COLUMN     "grounds" JSONB;
