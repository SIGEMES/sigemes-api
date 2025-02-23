/*
  Warnings:

  - You are about to drop the column `room_pricing_id` on the `rent_plans` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rent_plans" DROP CONSTRAINT "rent_plans_room_pricing_id_fkey";

-- AlterTable
ALTER TABLE "rent_plans" DROP COLUMN "room_pricing_id",
ADD COLUMN     "guesthouse_room_pricing_id" INTEGER;

-- AddForeignKey
ALTER TABLE "rent_plans" ADD CONSTRAINT "rent_plans_guesthouse_room_pricing_id_fkey" FOREIGN KEY ("guesthouse_room_pricing_id") REFERENCES "guesthouse_room_pricing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
