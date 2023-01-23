import prisma from '../db';
import ServerError from '../errors/ServerError';
import { AuthenticatorType } from './user.controller';

export const createUser = async (
  user: {
    email: string;
    ssn: string;
    name: string;
  },
  authenticator: AuthenticatorType,
) => {
  try {
    const userRes = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        ssn: user.ssn,
        devices: {
          create: {
            ...authenticator,
          },
        },
      },
    });

    return userRes;
  } catch (error) {
    throw new ServerError();
  }
};

export const findUserBySSN = async (ssn: string) => {
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

export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    throw new ServerError();
  }
};
