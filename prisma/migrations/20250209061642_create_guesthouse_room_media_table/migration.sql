-- CreateTable
CREATE TABLE "guesthouse_room_media" (
    "id" SERIAL NOT NULL,
    "guesthouse_room_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "guesthouse_room_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guesthouse_room_media" ADD CONSTRAINT "guesthouse_room_media_guesthouse_room_id_fkey" FOREIGN KEY ("guesthouse_room_id") REFERENCES "guesthouse_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
