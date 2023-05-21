import { BloodGroup, Gender } from '@prisma/client';
import { CustomValidator } from 'express-validator';

export const ssnValidator: CustomValidator = (value: string) => {
  if (value.length !== 10) {
    throw new Error('Invalid SSN');
  }
  return true;
};

export const genderValidation = (value: string) => {
  const validGenders = Gender;
  const isExist = Object.values(validGenders).find(
    (gender) => gender === value,
  );
  if (!isExist) {
    throw new Error('Invalid Gender');
  }
  return true;
};

export const bloodGroupValidation = (value: string) => {
  const bloodGroups = BloodGroup;
  const isExist = Object.values(bloodGroups).find((bloodGroup) => {
    return bloodGroup === value;
  });

  if (!isExist) {
    throw new Error('Invalid Blood Group');
  }
  return true;
};
