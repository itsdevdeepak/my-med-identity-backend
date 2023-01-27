import { LabResult } from '@prisma/client';
import prisma from '../db';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

type LabResultType = Omit<
  LabResult,
  'id' | 'createdAt' | 'updateAt' | 'userID'
>;

const createOne = async (userID: string, labResult: LabResultType) => {
  try {
    return await prisma.labResult.create({
      data: {
        ...labResult,
        userID,
      },
    });
  } catch (error) {
    throw new BadRequestError('Invalid Data');
  }
};

const updateOne = async (id: string, labResult: LabResultType) => {
  try {
    return await prisma.labResult.update({
      where: { id },
      data: {
        ...labResult,
      },
    });
  } catch (error) {
    throw new BadRequestError();
  }
};

const findByID = async (id: string) => {
  try {
    return await prisma.labResult.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new NotFoundError();
  }
};

const findAll = async (userID: string) => {
  try {
    return await prisma.labResult.findMany({
      where: { userID },
    });
  } catch (error) {
    throw new BadRequestError();
  }
};

const deleteByID = async (id: string) => {
  try {
    return await prisma.labResult.delete({
      where: { id },
    });
  } catch (error) {
    throw new NotFoundError();
  }
};

export default {
  createOne,
  updateOne,
  findAll,
  findByID,
  deleteByID,
};
