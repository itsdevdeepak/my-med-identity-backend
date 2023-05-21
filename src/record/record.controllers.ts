import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ServerError from '../errors/ServerError';
import * as recordService from './record.service';
import { Record } from '@prisma/client';

export const getRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const records = await recordService.findAll(user.id);
    res.status(200).send({ data: records });
  } catch (error) {
    next(new ServerError());
  }
};

export const getRecord = async (
  req: Request<{ id: string }, object, object>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const record = await recordService.findByID(req.params.id);
    if (!record) {
      next(new NotFoundError());
      return;
    }
    res.status(200).send({ data: record });
  } catch (error) {
    next(new NotFoundError());
  }
};

export const createRecord = async (
  req: Request<object, object, Omit<Record, 'id' | 'userID' | 'user'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userID = req.user.id;
    const data: Omit<Record, 'id' | 'userID' | 'user'> = {
      ...req.body,
      date: new Date(req.body.date),
    };
    console.log(data);
    const record = await recordService.createRecord(userID, data);
    res.status(200).send({ data: record });
  } catch (error) {
    console.log(error);
    next(new BadRequestError());
  }
};

export const updateRecord = async (
  req: Request<{ id: Record['id'] }, object, Omit<Record, 'userID' | 'user'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      ...req.body,
    };
    if (req.body.date) {
      data.date = new Date(req.body.date);
    }
    const record = await recordService.updateRecord(req.params.id, data);
    res.status(200).send({ data: record });
  } catch (error) {
    next(new BadRequestError());
  }
};

export const deleteRecord = async (
  req: Request<{ id: string }, object, object>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const record = await recordService.deleteRecord(req.params.id);
    res.status(200).send({ data: record });
  } catch (error) {
    next(new NotFoundError());
  }
};
