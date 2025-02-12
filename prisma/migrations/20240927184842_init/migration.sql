/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Admin` table. All the data in the column will be lost.
  - Made the column `phone` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Admin_id_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "createdAt",
DROP COLUMN "profileImage",
ALTER COLUMN "phone" SET NOT NULL;
