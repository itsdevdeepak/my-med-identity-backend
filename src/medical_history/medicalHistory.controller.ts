import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import medicalHistoryService from './medicalHistory.service';

export const getMedicalHistorys = async (req: Request, res: Response) => {
  const user: User = req.user;
  const medicalHistory = await medicalHistoryService.findAll(user.id);
  res.status(200).send({ data: medicalHistory });
};

export const getMedicalHistory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const medicalHistoryID = req.params.id;
  const medicalHistory = await medicalHistoryService.findOneByID(
    medicalHistoryID,
  );
  if (!medicalHistory) {
    next(new NotFoundError());
    return;
  }
  res.status(200).send({ data: medicalHistory });
};

export const createMedicalHistory = async (
  req: Request<
    object,
    object,
    {
      condition: string;
      illness: string;
      medication: string;
      allergies: string;
      Immunizations: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  const user: User = req.user;
  try {
    const medicalHistory = await medicalHistoryService.createOne(
      user.id,
      req.body,
    );
    res.status(200).send({ data: medicalHistory });
  } catch (error) {
    next(new BadRequestError());
    return;
  }
};

export const updateMedicalHistory = async (
  req: Request<
    { id: string },
    object,
    {
      condition: string;
      illness: string;
      medication: string;
      allergies: string;
      Immunizations: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicalHistory = await medicalHistoryService.updateByID(
      req.params.id,
      req.body,
    );
    res.status(200).send({ data: medicalHistory });
  } catch (error) {
    console.log(error);

    next(new BadRequestError());
    return;
  }
};

export const deleteMedicalHistory = async (
  req: Request<{ id: string }, object, object>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const medicalHistory = await medicalHistoryService.deleteByID(
      req.params.id,
    );
    res.status(200).send({ data: medicalHistory });
  } catch (error) {
    next(new NotFoundError());
    return;
  }
};
