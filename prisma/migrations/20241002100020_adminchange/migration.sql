/*
  Warnings:

  - You are about to drop the column `adminId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `adminName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_adminId_fkey";

-- DropIndex
DROP INDEX "Post_adminId_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "adminId",
ADD COLUMN     "adminName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_adminName_idx" ON "Post"("adminName");
