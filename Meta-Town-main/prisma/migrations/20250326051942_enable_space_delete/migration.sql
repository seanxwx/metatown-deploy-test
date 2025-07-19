-- DropForeignKey
ALTER TABLE "stage_configs" DROP CONSTRAINT "stage_configs_space_id_fkey";

-- DropForeignKey
ALTER TABLE "user_space_positions" DROP CONSTRAINT "user_space_positions_space_id_fkey";

-- AddForeignKey
ALTER TABLE "user_space_positions" ADD CONSTRAINT "user_space_positions_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_configs" ADD CONSTRAINT "stage_configs_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
