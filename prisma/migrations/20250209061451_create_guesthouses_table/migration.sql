/*
  Warnings:

  - The `city_hall_status` column on the `city_halls` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('tersedia', 'tidak_tersedia');

-- AlterTable
ALTER TABLE "city_halls" DROP COLUMN "city_hall_status",
ADD COLUMN     "city_hall_status" "Status" NOT NULL DEFAULT 'tersedia';

-- DropEnum
DROP TYPE "CityHallStatus";

-- CreateTable
CREATE TABLE "guesthouses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "area_m2" DOUBLE PRECISION NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "contact_person" VARCHAR(15) NOT NULL,

    CONSTRAINT "guesthouses_pkey" PRIMARY KEY ("id")
);
