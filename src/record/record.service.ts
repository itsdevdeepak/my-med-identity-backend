import { Record, User } from '@prisma/client';
import db from '../db';
import ServerError from '../errors/ServerError';
import { log } from 'console';

export const findAll = async (userID: User['id']) => {
  const records = await db.record.findMany({
    where: {
      userID,
    },
  });
  return records;
};

export const createRecord = async (
  userID: User['id'],
  draftRecord: Omit<Record, 'id' | 'userID' | 'user'>,
) => {
  try {
    const record = await db.record.create({
      data: { ...draftRecord, userID },
    });
    return record;
  } catch (error) {
    console.log(error);

    throw new ServerError();
  }
};

export const updateRecord = async (
  id: Record['id'],
  record: Omit<Partial<Record>, 'id' | 'userID' | 'user'>,
) => {
  try {
    const updateRecord = await db.record.update({
      where: {
        id,
      },
      data: { ...record },
    });
    return updateRecord;
  } catch (error) {
    throw new ServerError();
  }
};

export const findByID = async (id: Record['id']) => {
  const record = await db.record.findUnique({
    where: {
      id,
    },
  });
  return record;
};

export const deleteRecord = async (id: Record['id']) => {
  const record = await db.record.delete({
    where: {
      id,
    },
  });
  return record;
};
