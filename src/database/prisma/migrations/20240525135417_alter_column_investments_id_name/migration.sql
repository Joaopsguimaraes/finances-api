/*
  Warnings:

  - You are about to drop the column `investiments_id` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_investiments_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "investiments_id",
ADD COLUMN     "investments_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investments_id_fkey" FOREIGN KEY ("investments_id") REFERENCES "investiments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
