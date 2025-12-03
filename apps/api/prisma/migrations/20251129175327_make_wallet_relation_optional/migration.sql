-- DropForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" DROP CONSTRAINT "LedgerEntry_walletId_fkey";

-- AlterTable
ALTER TABLE "sisimove_schema"."LedgerEntry" ALTER COLUMN "walletId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "sisimove_schema"."Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
