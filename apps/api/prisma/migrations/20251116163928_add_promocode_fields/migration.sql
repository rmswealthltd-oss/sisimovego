/*
  Warnings:

  - You are about to drop the column `discount` on the `PromoCode` table. All the data in the column will be lost.
  - Added the required column `discountPct` to the `PromoCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "discount",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "discountPct" INTEGER NOT NULL;
