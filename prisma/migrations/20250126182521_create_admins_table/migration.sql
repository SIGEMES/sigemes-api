-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "telephone_number" VARCHAR(15) NOT NULL,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "profile_picture" TEXT NOT NULL DEFAULT 'https://storage.googleapis.com/sigemes-storage/profile-pictures/default-picture.png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
