/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `credit_carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credit_carts_number_key" ON "credit_carts"("number");
