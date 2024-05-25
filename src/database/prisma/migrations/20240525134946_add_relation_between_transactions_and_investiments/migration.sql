-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "investiments_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investiments_id_fkey" FOREIGN KEY ("investiments_id") REFERENCES "investiments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
