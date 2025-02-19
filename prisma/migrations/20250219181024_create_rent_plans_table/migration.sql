-- CreateTable
CREATE TABLE "rent_plans" (
    "id" SERIAL NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "room_pricing_id" INTEGER,
    "city_hall_pricing_id" INTEGER,
    "slot" INTEGER NOT NULL DEFAULT 1,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "renter_gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rent_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rent_plans" ADD CONSTRAINT "rent_plans_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_plans" ADD CONSTRAINT "rent_plans_room_pricing_id_fkey" FOREIGN KEY ("room_pricing_id") REFERENCES "guesthouse_room_pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_plans" ADD CONSTRAINT "rent_plans_city_hall_pricing_id_fkey" FOREIGN KEY ("city_hall_pricing_id") REFERENCES "city_hall_pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
