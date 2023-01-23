import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CustomError from '../errors/CustomError';
import ValidationError from '../errors/ValidationError';

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).send({ errors: err.serializeError() });
    return;
  }

  res.status(err.statusCode).send({ error: err.serializeError() });
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
