/*
  Warnings:

  - You are about to drop the column `walls` on the `stage_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stage_configs" DROP COLUMN "walls",
ADD COLUMN     "blocks" JSONB;
