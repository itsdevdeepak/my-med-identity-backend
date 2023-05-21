import { User } from '@prisma/client';

export type UserRegistrationAttributes = Pick<
  User,
  'name' | 'email' | 'ssn' | 'password'
>;

export type UserSignInAttributes = Pick<
  User,
  'name' | 'email' | 'ssn' | 'password'
>;

export type PostSignupAttributes = Pick<
  User,
  'mobileNumber' | 'bloodType' | 'gender' | 'weight' | 'height' | 'dateOfBirth'
>;

export type UserUpdateAttributes = Omit<Partial<User>, 'id'>;

export type UserProfile = Omit<User, 'role' | 'createdAt' | 'password'>;
