/*
  Warnings:

  - You are about to alter the column `price_per_day` on the `city_hall_pricing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `area_m2` on the `city_halls` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `latitude` on the `city_halls` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `city_halls` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "city_hall_pricing" ALTER COLUMN "price_per_day" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "city_halls" ALTER COLUMN "area_m2" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;
