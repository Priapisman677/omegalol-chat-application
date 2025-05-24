/*
  Warnings:

  - A unique constraint covering the columns `[ProfilePicPath]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ProfilePicPath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_ProfilePicPath_key" ON "users"("ProfilePicPath");
