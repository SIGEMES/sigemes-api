-- DropForeignKey
ALTER TABLE "city_hall_media" DROP CONSTRAINT "city_hall_media_city_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "city_hall_pricing" DROP CONSTRAINT "city_hall_pricing_city_hall_id_fkey";

-- AddForeignKey
ALTER TABLE "city_hall_media" ADD CONSTRAINT "city_hall_media_city_hall_id_fkey" FOREIGN KEY ("city_hall_id") REFERENCES "city_halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city_hall_pricing" ADD CONSTRAINT "city_hall_pricing_city_hall_id_fkey" FOREIGN KEY ("city_hall_id") REFERENCES "city_halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
