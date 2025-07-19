-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_space_id_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
