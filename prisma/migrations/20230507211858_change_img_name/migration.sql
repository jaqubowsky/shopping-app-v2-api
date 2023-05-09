/*
  Warnings:

  - You are about to drop the column `picture` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "picture",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT 'https://i.pravatar.cc/300';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "picture",
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT 'https://i.pravatar.cc/300';
