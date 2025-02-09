-- CreateTable
CREATE TABLE "guesthouse_room_pricing" (
    "id" SERIAL NOT NULL,
    "guesthouse_room_id" INTEGER NOT NULL,
    "retribution_type" VARCHAR(255) NOT NULL,
    "price_per_day" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "guesthouse_room_pricing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guesthouse_room_pricing" ADD CONSTRAINT "guesthouse_room_pricing_guesthouse_room_id_fkey" FOREIGN KEY ("guesthouse_room_id") REFERENCES "guesthouse_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
