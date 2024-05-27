/*
  Warnings:

  - You are about to drop the column `is_repet` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `repet_times` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_repet",
DROP COLUMN "repet_times",
ADD COLUMN     "is_repeat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeat_times" INTEGER;
