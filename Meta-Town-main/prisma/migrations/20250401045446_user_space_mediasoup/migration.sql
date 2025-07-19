-- CreateTable
CREATE TABLE "user_space_mediasoup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "space_id" UUID NOT NULL,
    "producer_id" TEXT NOT NULL,

    CONSTRAINT "user_space_mediasoup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_space_mediasoup_user_id_space_id_producer_id_key" ON "user_space_mediasoup"("user_id", "space_id", "producer_id");

-- AddForeignKey
ALTER TABLE "user_space_mediasoup" ADD CONSTRAINT "user_space_mediasoup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_mediasoup" ADD CONSTRAINT "user_space_mediasoup_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
