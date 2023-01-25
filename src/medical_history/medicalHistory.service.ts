import prisma from '../db';
import ServerError from '../errors/ServerError';
import { MedicalHistory } from './interfaces/medicalHistoryInterface';

const findAll = async (userID: string) => {
  try {
    const medicalHistory = await prisma.medicalHistory.findMany({
      where: {
        userID,
      },
    });
    return medicalHistory;
  } catch (error) {
    throw new ServerError();
  }
};

const findOneByID = async (medicalHistoryID: string) => {
  try {
    const medicalHistory = await prisma.medicalHistory.findUnique({
      where: {
        id: medicalHistoryID,
      },
    });
    return medicalHistory;
  } catch (error) {
    throw new ServerError();
  }
};

const createOne = async (userID: string, medicalHistory: MedicalHistory) => {
  try {
    const medicalHistoryRes = await prisma.medicalHistory.create({
      data: {
        ...medicalHistory,
        userID: userID,
      },
    });
    return medicalHistoryRes;
  } catch (error) {
    throw new ServerError();
  }
};

const updateByID = async (
  medicalHistoryID: string,
  medicalHistory: MedicalHistory,
) => {
  try {
    const medicalHistoryRes = await prisma.medicalHistory.update({
      where: {
        id: medicalHistoryID,
      },
      data: {
        ...medicalHistory,
      },
    });
    return medicalHistoryRes;
  } catch (error) {
    throw new ServerError();
  }
};

const deleteByID = async (medicalHistoryID: string) => {
  try {
    const medicalHistory = await prisma.medicalHistory.delete({
      where: {
        id: medicalHistoryID,
      },
    });
    return medicalHistory;
  } catch (error) {
    throw new ServerError();
  }
};

export default {
  findAll,
  findOneByID,
  createOne,
  updateByID,
  deleteByID,
};
