/*
  Warnings:

  - Added the required column `name` to the `credit_carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_current_name` to the `credit_carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_carts" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "owner_current_name" TEXT NOT NULL;
