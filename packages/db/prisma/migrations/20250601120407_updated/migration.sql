/*
  Warnings:

  - Made the column `planEndsAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "planEndsAt" SET NOT NULL;
