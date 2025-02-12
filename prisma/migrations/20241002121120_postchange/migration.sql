/*
  Warnings:

  - You are about to drop the column `adminName` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postHeader` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postMessage` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_adminName_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "adminName",
DROP COLUMN "imageUrl",
DROP COLUMN "postHeader",
DROP COLUMN "postMessage",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_username_idx" ON "Post"("username");
