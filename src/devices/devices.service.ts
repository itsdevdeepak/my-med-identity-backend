import { Authenticator } from '@prisma/client';
import prisma from '../db';
import ServerError from '../errors/ServerError';

export const getUserDevices = async (userID: string) => {
  try {
    const devices = await prisma.authenticator.findMany({
      where: {
        userID: userID,
      },
    });
    return devices;
  } catch (error) {
    throw new ServerError();
  }
};

export const addDevice = async (
  userID: string,
  authenticator: Authenticator,
) => {
  let device;
  try {
    device = await prisma.authenticator.create({
      data: {
        ...authenticator,
        userID: userID,
      },
    });
  } catch (error) {
    throw new ServerError();
  }
  return device;
};

export const updateDeviceCounter = async (
  credentialID: string,
  newCounter: number,
) => {
  try {
    const authenticatorRes = await prisma.authenticator.update({
      where: {
        credentialID: credentialID,
      },
      data: {
        counter: newCounter,
      },
    });
    return authenticatorRes;
  } catch (error) {
    throw new ServerError();
  }
};
