-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "identifier" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
