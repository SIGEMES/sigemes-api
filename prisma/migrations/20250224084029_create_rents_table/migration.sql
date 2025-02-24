-- CreateEnum
CREATE TYPE "RentStatus" AS ENUM ('pending', 'dikonfirmasi', 'dibatalkan', 'selesai');

-- CreateTable
CREATE TABLE "rents" (
    "id" SERIAL NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "guesthouse_room_pricing_id" INTEGER,
    "city_hall_pricing_id" INTEGER,
    "slot" INTEGER NOT NULL DEFAULT 1,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "renter_gender" "Gender" NOT NULL,
    "check_in" TIMESTAMP(3),
    "check_out" TIMESTAMP(3),
    "rent_status" "RentStatus" NOT NULL DEFAULT 'selesai',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rents" ADD CONSTRAINT "rents_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rents" ADD CONSTRAINT "rents_guesthouse_room_pricing_id_fkey" FOREIGN KEY ("guesthouse_room_pricing_id") REFERENCES "guesthouse_room_pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rents" ADD CONSTRAINT "rents_city_hall_pricing_id_fkey" FOREIGN KEY ("city_hall_pricing_id") REFERENCES "city_hall_pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
