import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import AuthorizationError from '../errors/AuthorizationError';
import bcrypt from 'bcrypt';

// ! Required For extending Request Object
declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

export const createToken = ({ id, email }: Pick<User, 'id' | 'email'>) => {
  const token = jwt.sign(
    {
      id,
      email,
    },
    config.secret.jwt,
  );

  return token;
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 8);
};

export const compairePassword = async (
  password: string,
  hashPassword: string,
) => {
  return await bcrypt.compare(password, hashPassword);
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    next(new AuthorizationError());
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    next(new AuthorizationError());
    return;
  }

  try {
    const payload = jwt.verify(token, config.secret.jwt);
    req.user = payload as User;
    next();
  } catch (e) {
    next(new AuthorizationError());
  }
};
