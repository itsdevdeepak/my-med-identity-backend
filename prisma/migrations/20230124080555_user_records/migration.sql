/*
  Warnings:

  - The `gender` column on the `MedicalStaff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- DropIndex
DROP INDEX "userEmail";

-- DropIndex
DROP INDEX "userSSN";

-- AlterTable
ALTER TABLE "MedicalStaff" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "condition" TEXT NOT NULL,
    "illness" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "Immunizations" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "testName" TEXT NOT NULL,
    "testResult" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "insurance_provider" TEXT NOT NULL,
    "policy_number" INTEGER NOT NULL,
    "policy_start_date" TIMESTAMP(3) NOT NULL,
    "policy_end_date" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
