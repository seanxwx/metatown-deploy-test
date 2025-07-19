-- DropForeignKey
ALTER TABLE "user_space_presences" DROP CONSTRAINT "user_space_presences_space_id_fkey";

-- AddForeignKey
ALTER TABLE "user_space_presences" ADD CONSTRAINT "user_space_presences_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
