/*
  Warnings:

  - Made the column `profile_picture` on table `renters` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "renters" ALTER COLUMN "profile_picture" SET NOT NULL;
