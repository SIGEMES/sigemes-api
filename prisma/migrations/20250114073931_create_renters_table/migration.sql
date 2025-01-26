-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "renters" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "profile_picture" TEXT DEFAULT './.temp-file-storage/avatar-default.png',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "otp" VARCHAR(5),
    "otp_expiry" TIMESTAMP(3),
    "forgot_password_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "renters_email_key" ON "renters"("email");
