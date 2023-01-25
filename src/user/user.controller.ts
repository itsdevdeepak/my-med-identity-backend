import { NextFunction, Request, Response } from 'express';
import {
  createToken,
  getAuthenticationOptions,
  getRegistrationOptions,
  verifyAuthenticationOptions,
  verifyRegistrationOptions,
} from '../modules/auth';
import { createUser, findUserByEmail, findUserBySSN } from './user.service';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { User } from '@prisma/client';
import BadRequestError from '../errors/BadRequestError';
import { updateDeviceCounter } from '../devices/devices.service';
import AuthorizationError from '../errors/AuthorizationError';
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';

export const generateRegOptions = async (
  req: Request<
    object,
    object,
    { user: { name: string; email: string; ssn: string } }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req.body;

  if (await findUserBySSN(user.ssn)) {
    next(new BadRequestError());
    return;
  }

  const authOptions = await getRegistrationOptions(user.name, user.email);
  res.status(200).send({ data: authOptions });
};

// TODO: Move it Somewhere else
export type AuthenticatorType = {
  credentialID: string;
  counter: number;
  credentialPublicKey: string;
  credentialDeviceType: 'singleDevice' | 'multiDevice';
  credentialBackedUp: boolean;
};

const isRegistrationResponceJson = (
  object: unknown,
): object is RegistrationResponseJSON => {
  if (
    object &&
    typeof object === 'object' &&
    'id' in object &&
    'rawId' in object &&
    'response' in object
  ) {
    return true;
  }
  return false;
};

const isAuthenticationResponseJson = (
  object: unknown,
): object is AuthenticationResponseJSON => {
  if (
    object &&
    typeof object === 'object' &&
    'id' in object &&
    'rawId' in object &&
    'response' in object
  ) {
    return true;
  }
  return false;
};

export const registerUser = async (
  req: Request<
    object,
    object,
    {
      authOptions: object;
      user: { name: string; email: string; ssn: string };
      challenge: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  const { authOptions, user, challenge } = req.body;

  if (!isRegistrationResponceJson(authOptions)) {
    next(new BadRequestError());
    return;
  }

  const verificationJson = await verifyRegistrationOptions(
    authOptions,
    challenge,
  );

  const { verified, registrationInfo } = verificationJson;
  if (verified && registrationInfo) {
    const authenticator: AuthenticatorType = {
      credentialID: isoBase64URL.fromBuffer(
        registrationInfo.credentialID,
        'base64url',
      ),
      counter: registrationInfo.counter,
      credentialPublicKey: isoBase64URL.fromBuffer(
        registrationInfo.credentialPublicKey,
      ),
      credentialDeviceType: registrationInfo.credentialDeviceType,
      credentialBackedUp: registrationInfo.credentialBackedUp,
    };
    const userRes = await createUser(user, authenticator);

    const token = createToken(userRes);
    res.status(200).send({ data: token });
  } else {
    next(new AuthorizationError());
  }
};

export const generateAuthenticationOptions = async (
  req: Request<object, object, { ssn?: string; email?: string }>,
  res: Response,
  next: NextFunction,
) => {
  let dbUser: User | null;
  if (req.body.ssn) {
    dbUser = await findUserBySSN(req.body.ssn);
  } else if (req.body.email) {
    dbUser = await findUserByEmail(req.body.email);
  } else {
    next(new BadRequestError());
    return;
  }
  if (!dbUser) {
    next(new BadRequestError());
    return;
  }

  const authOptions = await getAuthenticationOptions(dbUser);
  res.status(200).send({ data: authOptions });
  return;
};

export const signInUser = async (
  req: Request<
    object,
    object,
    {
      authOptions: object;
      user: { name: string; email: string; ssn: string };
      challenge: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  let dbUser: User | null;
  if (req.body.user.ssn) {
    dbUser = await findUserBySSN(req.body.user.ssn);
  } else if (req.body.user.email) {
    dbUser = await findUserByEmail(req.body.user.email);
  } else {
    next(new BadRequestError());
    return;
  }
  if (!dbUser) {
    next(new BadRequestError());
    return;
  }

  const { authOptions, challenge } = req.body;
  if (!isAuthenticationResponseJson(authOptions)) {
    next(new BadRequestError());
    return;
  }
  const verificationJson = await verifyAuthenticationOptions(
    dbUser.id,
    authOptions,
    challenge,
  );

  const { authenticationInfo, verified } = verificationJson;

  if (verified && authenticationInfo) {
    updateDeviceCounter(
      isoBase64URL.fromBuffer(authenticationInfo.credentialID),
      authenticationInfo.newCounter,
    );
    const token = createToken(dbUser);
    res.status(200).send({ data: token });
    return;
  } else {
    next(new AuthorizationError());
  }
};
