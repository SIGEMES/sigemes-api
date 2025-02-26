/*
  Warnings:

  - You are about to drop the column `available_slot` on the `guesthouse_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `guesthouse_rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guesthouse_rooms" DROP COLUMN "available_slot",
DROP COLUMN "status";
