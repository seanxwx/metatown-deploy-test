-- CreateTable
CREATE TABLE "stage_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "space_id" UUID NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "walls" JSONB,
    "entry" JSONB,

    CONSTRAINT "stage_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stage_configs_space_id_key" ON "stage_configs"("space_id");

-- AddForeignKey
ALTER TABLE "stage_configs" ADD CONSTRAINT "stage_configs_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
