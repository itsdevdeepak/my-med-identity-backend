-- CreateEnum
CREATE TYPE "AuthenticatorTranspoter" AS ENUM ('usb', 'ble', 'nfc', 'internal');

-- CreateEnum
CREATE TYPE "CredentialDeviceType" AS ENUM ('singleDevice', 'multiDevice');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'MEDICAL_STAFF', 'HEALTH_INSURANCE_COMPANY', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE');

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" "CredentialDeviceType" NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" "AuthenticatorTranspoter"[],
    "userID" TEXT,
    "medicalStaffID" TEXT,
    "healthInsurancCompanyID" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNumber" INTEGER,
    "ssn" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "bloodType" "BloodType",
    "currentChallenge" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalStaff" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNumber" INTEGER,
    "ssn" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEDICAL_STAFF',
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "bloodType" "BloodType",
    "currentChallenge" TEXT,

    CONSTRAINT "MedicalStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthInsuranceCompany" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNumber" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'HEALTH_INSURANCE_COMPANY',
    "currentChallenge" TEXT,

    CONSTRAINT "HealthInsuranceCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_credentialID_key" ON "devices"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_ssn_key" ON "User"("ssn");

-- CreateIndex
CREATE INDEX "userSSN" ON "User"("ssn");

-- CreateIndex
CREATE INDEX "userEmail" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_email_key" ON "MedicalStaff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_mobileNumber_key" ON "MedicalStaff"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_ssn_key" ON "MedicalStaff"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "HealthInsuranceCompany_email_key" ON "HealthInsuranceCompany"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HealthInsuranceCompany_mobileNumber_key" ON "HealthInsuranceCompany"("mobileNumber");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_medicalStaffID_fkey" FOREIGN KEY ("medicalStaffID") REFERENCES "MedicalStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_healthInsurancCompanyID_fkey" FOREIGN KEY ("healthInsurancCompanyID") REFERENCES "HealthInsuranceCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;
