import { NextFunction, Request, Response } from 'express';
import { compairePassword, createToken, hashPassword } from '../modules/auth';
import {
  createUser,
  findUserByEmail,
  findUserBySSN,
  getProfile,
  updateUser,
} from './user.service';
import AuthorizationError from '../errors/AuthorizationError';
import { User } from '@prisma/client';
import {
  PostSignupAttributes,
  UserRegistrationAttributes,
  UserSignInAttributes,
  UserUpdateAttributes,
} from './user.interface';

export const registerUser = async (
  req: Request<object, object, UserRegistrationAttributes>,
  res: Response,
  next: NextFunction,
) => {
  const user = req.body;

  const isEmailAlreadyExist = await findUserByEmail(user.email);
  const isSSNAlreadyExist = await findUserBySSN(user.ssn);

  if (isEmailAlreadyExist || isSSNAlreadyExist) {
    next(new AuthorizationError());
    return;
  }

  const draftUser = {
    ...user,
    password: await hashPassword(user.password),
  };

  const newUser = await createUser(draftUser);
  const token = createToken(newUser);

  res.status(200).send({ data: { token, user: newUser } });
};

export const signInUser = async (
  req: Request<object, object, UserSignInAttributes>,
  res: Response,
  next: NextFunction,
) => {
  const user = await findUserByEmail(req.body.email);
  if (!user) {
    next(new AuthorizationError());
    return;
  }
  const validUser = await compairePassword(req.body.password, user.password);

  if (!validUser) {
    next(new AuthorizationError());
    return;
  }

  const token = createToken(user);
  const userRes: Partial<User> = user;
  delete userRes.password;

  res.status(200).send({ data: { token, user: userRes } });
  return;
};

export const postSignUp = async (
  req: Request<object, object, PostSignupAttributes>,
  res: Response,
) => {
  const user = req.user;
  console.log(req.body);
  const data: PostSignupAttributes = req.body;
  const updatedUser = await updateUser(user.id, data);
  res.status(200).send({ data: updatedUser });
};

export const updateUserProfile = async (
  req: Request<object, object, UserUpdateAttributes>,
  res: Response,
) => {
  const user = req.user;
  const data = req.body;
  const updatedUser = await updateUser(user.id, data);

  res.status(200).send({ data: updatedUser });
};

export const getUserProfile = async (
  req: Request<object, object, object>,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const profile = await getProfile(user.id);

  if (!profile) {
    next(new AuthorizationError());
    return;
  }

  res.status(200).send({ data: profile });
};
