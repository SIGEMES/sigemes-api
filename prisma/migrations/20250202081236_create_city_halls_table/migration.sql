-- CreateEnum
CREATE TYPE "CityHallStatus" AS ENUM ('tersedia', 'tidak_tersedia');

-- CreateTable
CREATE TABLE "city_halls" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "area_m2" DECIMAL(10,2) NOT NULL,
    "people_capacity" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "city_hall_status" "CityHallStatus" NOT NULL DEFAULT 'tersedia',
    "contact_person" VARCHAR(15) NOT NULL,

    CONSTRAINT "city_halls_pkey" PRIMARY KEY ("id")
);
