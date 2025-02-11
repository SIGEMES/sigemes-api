-- CreateTable
CREATE TABLE "guesthouse_media" (
    "id" SERIAL NOT NULL,
    "guesthouse_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "guesthouse_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guesthouse_media" ADD CONSTRAINT "guesthouse_media_guesthouse_id_fkey" FOREIGN KEY ("guesthouse_id") REFERENCES "guesthouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
