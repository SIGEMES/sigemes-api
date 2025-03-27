/*
  Warnings:

  - A unique constraint covering the columns `[rent_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reviews_rent_id_key" ON "reviews"("rent_id");
