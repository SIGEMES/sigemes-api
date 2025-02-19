/*
  Warnings:

  - You are about to alter the column `fullname` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `activity_type` on the `city_hall_pricing` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `city_halls` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `retribution_type` on the `guesthouse_room_pricing` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `guesthouse_rooms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `guesthouses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `renters` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `password` on the `renters` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `fullname` on the `renters` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phone_number` on the `renters` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "city_hall_media" ALTER COLUMN "url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "city_hall_pricing" ALTER COLUMN "activity_type" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "city_halls" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "guesthouse_media" ALTER COLUMN "url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "guesthouse_room_media" ALTER COLUMN "url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "guesthouse_room_pricing" ALTER COLUMN "retribution_type" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "guesthouse_rooms" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "guesthouses" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "renters" ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(15);
