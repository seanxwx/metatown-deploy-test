-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('N', 'E', 'S', 'W');

-- CreateTable
CREATE TABLE "user_space_positions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "space_id" INTEGER NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "direction" "Direction",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_space_positions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_space_positions" ADD CONSTRAINT "user_space_positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_positions" ADD CONSTRAINT "user_space_positions_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
