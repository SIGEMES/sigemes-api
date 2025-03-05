/*
  Warnings:

  - You are about to drop the column `createdAt` on the `rents` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rents` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `rents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rents" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "rent_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rent_id_fkey" FOREIGN KEY ("rent_id") REFERENCES "rents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
