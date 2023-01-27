import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ServerError from '../errors/ServerError';
import labResultService from './labResult.service';

export const getLabResults = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const labResults = await labResultService.findAll(user.id);
    res.status(200).send({ data: labResults });
  } catch (error) {
    next(new ServerError());
  }
};

export const getLabResult = async (
  req: Request<{ id: string }, object, object>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const labResult = await labResultService.findByID(req.params.id);
    if (!labResult) {
      next(new NotFoundError());
      return;
    }
    res.status(200).send({ data: labResult });
  } catch (error) {
    next(new NotFoundError());
  }
};

export const createLabResult = async (
  req: Request<
    object,
    object,
    { testName: string; testDate: Date; testResult: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.user.id;
    const data = {
      testName: req.body.testName,
      testDate: req.body.testDate,
      testResult: req.body.testResult,
    };
    const labResult = await labResultService.createOne(userID, data);
    res.status(200).send({ data: labResult });
  } catch (error) {
    next(new BadRequestError());
  }
};

export const updateLabResult = async (
  req: Request<
    object,
    object,
    { testName: string; testDate: Date; testResult: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.user.id;

    const labResult = await labResultService.createOne(userID, req.body);
    res.status(200).send({ data: labResult });
  } catch (error) {
    next(new BadRequestError());
  }
};

export const deleteLabResult = async (
  req: Request<{ id: string }, object, object>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const labResult = await labResultService.deleteByID(req.params.id);
    res.status(200).send({ data: labResult });
  } catch (error) {
    next(new NotFoundError());
  }
};
