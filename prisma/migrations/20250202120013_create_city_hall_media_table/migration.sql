-- CreateTable
CREATE TABLE "city_hall_media" (
    "id" SERIAL NOT NULL,
    "city_hall_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "city_hall_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "city_hall_media" ADD CONSTRAINT "city_hall_media_city_hall_id_fkey" FOREIGN KEY ("city_hall_id") REFERENCES "city_halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
