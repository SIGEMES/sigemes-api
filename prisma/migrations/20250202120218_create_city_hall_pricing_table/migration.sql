-- CreateTable
CREATE TABLE "city_hall_pricing" (
    "id" SERIAL NOT NULL,
    "city_hall_id" INTEGER NOT NULL,
    "activity_type" VARCHAR(255) NOT NULL,
    "facilities" TEXT NOT NULL,
    "price_per_day" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "city_hall_pricing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "city_hall_pricing" ADD CONSTRAINT "city_hall_pricing_city_hall_id_fkey" FOREIGN KEY ("city_hall_id") REFERENCES "city_halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
