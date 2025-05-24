/*
  Warnings:

  - You are about to drop the column `identifier` on the `Message` table. All the data in the column will be lost.
  - Made the column `userId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "identifier",
ALTER COLUMN "userId" SET NOT NULL;
