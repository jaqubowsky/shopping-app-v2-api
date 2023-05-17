/*
  Warnings:

  - Added the required column `email` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
