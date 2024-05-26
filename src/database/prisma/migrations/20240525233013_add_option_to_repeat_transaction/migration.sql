-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "is_repet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repet_times" INTEGER;
