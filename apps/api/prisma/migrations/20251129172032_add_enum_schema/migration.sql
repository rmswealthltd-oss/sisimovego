/*
  Warnings:

  - Added the required column `amount` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sisimove_schema"."Ledger" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "entityType" "sisimove_schema"."LedgerEntityType";
