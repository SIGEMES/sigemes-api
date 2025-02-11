-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('vip', 'standard');

-- CreateTable
CREATE TABLE "guesthouse_rooms" (
    "id" SERIAL NOT NULL,
    "guesthouse_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "RoomType" NOT NULL DEFAULT 'standard',
    "facilities" TEXT NOT NULL,
    "available_slot" INTEGER NOT NULL,
    "total_slot" INTEGER NOT NULL,
    "area_m2" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'tersedia',

    CONSTRAINT "guesthouse_rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guesthouse_rooms" ADD CONSTRAINT "guesthouse_rooms_guesthouse_id_fkey" FOREIGN KEY ("guesthouse_id") REFERENCES "guesthouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
