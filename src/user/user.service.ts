import { User } from '@prisma/client';
import prisma from '../db';
import ServerError from '../errors/ServerError';
import {
  UserProfile,
  UserRegistrationAttributes,
  UserUpdateAttributes,
} from './user.interface';

const userProfileFields = {
  id: true,
  name: true,
  email: true,
  ssn: true,
  bloodGroup: true,
  dateOfBirth: true,
  gender: true,
  height: true,
  mobileNumber: true,
  weight: true,
  allergies: true,
};

export const createUser = async (user: UserRegistrationAttributes) => {
  try {
    const userRes = await prisma.user.create({
      data: user,
      select: userProfileFields,
    });
    return userRes;
  } catch (error) {
    throw new ServerError();
  }
};

export const findUserBySSN = async (ssn: User['ssn']) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        ssn,
      },
    });
    return user;
  } catch (error) {
    throw new ServerError();
  }
};

export const findUserByEmail = async (email: User['email']) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const updateUser = async (
  id: User['id'],
  draftUser: UserUpdateAttributes,
) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...draftUser,
      },
      select: userProfileFields,
    });
    return user;
  } catch (error) {
    throw new ServerError();
  }
};

export const getProfile = async (
  id: User['id'],
): Promise<UserProfile | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: userProfileFields,
  });
};
