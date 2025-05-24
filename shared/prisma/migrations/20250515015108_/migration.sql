/*
  Warnings:

  - Added the required column `unReadMessages` to the `room_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_users" ADD COLUMN     "unReadMessages" INTEGER NOT NULL;
