/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "username",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;
