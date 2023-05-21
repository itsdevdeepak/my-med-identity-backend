/*
  Warnings:

  - You are about to drop the column `currentChallenge` on the `HealthInsuranceCompany` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `MedicalStaff` table. All the data in the column will be lost.
  - You are about to drop the column `currentChallenge` on the `MedicalStaff` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentChallenge` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `devices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE');

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_healthInsurancCompanyID_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_medicalStaffID_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_userID_fkey";

-- AlterTable
ALTER TABLE "HealthInsuranceCompany" DROP COLUMN "currentChallenge";

-- AlterTable
ALTER TABLE "MedicalStaff" DROP COLUMN "bloodType",
DROP COLUMN "currentChallenge",
ADD COLUMN     "bloodGroup" "BloodGroup";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bloodType",
DROP COLUMN "currentChallenge",
ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "bloodGroup" "BloodGroup",
ADD COLUMN     "height" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "weight" TEXT;

-- DropTable
DROP TABLE "devices";

-- DropEnum
DROP TYPE "AuthenticatorTranspoter";

-- DropEnum
DROP TYPE "BloodType";

-- DropEnum
DROP TYPE "CredentialDeviceType";

-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "allergies" TEXT[],
    "userID" TEXT NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
