-- CreateTable
CREATE TABLE "review_media" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "review_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review_media" ADD CONSTRAINT "review_media_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
