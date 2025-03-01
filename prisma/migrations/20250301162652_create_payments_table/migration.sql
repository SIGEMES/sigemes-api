/*
  Warnings:

  - You are about to drop the `rent_plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'dibayar', 'gagal');

-- DropForeignKey
ALTER TABLE "rent_plans" DROP CONSTRAINT "rent_plans_city_hall_pricing_id_fkey";

-- DropForeignKey
ALTER TABLE "rent_plans" DROP CONSTRAINT "rent_plans_guesthouse_room_pricing_id_fkey";

-- DropForeignKey
ALTER TABLE "rent_plans" DROP CONSTRAINT "rent_plans_renter_id_fkey";

-- DropTable
DROP TABLE "rent_plans";

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "rent_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" VARCHAR(50),
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_gateway_token" VARCHAR(255),
    "payment_triggered_at" TIMESTAMP(3),
    "payment_confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_rent_id_key" ON "payments"("rent_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rent_id_fkey" FOREIGN KEY ("rent_id") REFERENCES "rents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
