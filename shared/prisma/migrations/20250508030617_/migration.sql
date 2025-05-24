/*
  Warnings:

  - You are about to drop the column `ProfilePicPath` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profilePicPath]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_ProfilePicPath_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ProfilePicPath",
ADD COLUMN     "profilePicPath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_profilePicPath_key" ON "users"("profilePicPath");
