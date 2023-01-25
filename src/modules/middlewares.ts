import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CustomError from '../errors/CustomError';
import ServerError from '../errors/ServerError';
import ValidationError from '../errors/ValidationError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({ errors: err.serializeError() });
    return;
  }
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.serializeError() });
  } else {
    next(new ServerError());
  }
};

export const validationErrorHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }
  next();
};
