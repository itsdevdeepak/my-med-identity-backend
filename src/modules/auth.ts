import { Authenticator, User } from '@prisma/client';
import {
  GenerateRegistrationOptionsOpts,
  generateRegistrationOptions,
  VerifyRegistrationResponseOpts,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
  GenerateAuthenticationOptionsOpts,
  generateAuthenticationOptions,
  VerifiedAuthenticationResponse,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import base64url from 'base64url';
import config from '../config';
import { getUserDevices } from '../devices/devices.service';
import {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import AuthorizationError from '../errors/AuthorizationError';
import BadRequestError from '../errors/BadRequestError';

// ! Required For extending Request Object
declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

const rpID = config.rpID;
const rpName = config.applicationName;
const origin = config.origin;

export const createToken = ({ id, email }: User) => {
  const token = jwt.sign(
    {
      id,
      email,
    },
    config.secret.jwt,
  );

  return token;
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

export const getRegistrationOptions = async (
  userName: string,
  userID: string,
) => {
  const devices: Authenticator[] = await getUserDevices(userID);
  const opts: GenerateRegistrationOptionsOpts = {
    rpID,
    rpName,
    userID,
    userName,
    timeout: 60000,
    attestationType: 'none',
    excludeCredentials: devices.map((device) => ({
      id: base64url.toBuffer(device.credentialID),
      type: 'public-key',
      transports: device.transports,
    })),
    authenticatorSelection: {
      residentKey: 'discouraged',
    },
    supportedAlgorithmIDs: [-7, -257],
  };

  return generateRegistrationOptions(opts);
};

export const verifyRegistrationOptions = async (
  registrationResponceJson: RegistrationResponseJSON,
  expectedChallenge: string,
) => {
  let verification: VerifiedRegistrationResponse;
  try {
    const opts: VerifyRegistrationResponseOpts = {
      response: registrationResponceJson,
      expectedChallenge: expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    throw new BadRequestError();
  }

  return verification;
};

export const getAuthenticationOptions = async (user: User) => {
  const device = await getUserDevices(user.id);
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID,
    userVerification: 'required',
    timeout: 60000,
    allowCredentials: device.map((device) => ({
      id: base64url.toBuffer(device.credentialID),
      type: 'public-key',
      transports: device.transports,
    })),
  };
  return generateAuthenticationOptions(opts);
};

export const verifyAuthenticationOptions = async (
  userID: string,
  authenticationResponseJson: AuthenticationResponseJSON,
  expectedChallenge: string,
) => {
  const userCredentialIDBuffer = base64url.toBuffer(
    authenticationResponseJson.id,
  );

  const devices = await getUserDevices(userID);

  let userAuthenticator: AuthenticatorDevice | null = null;
  for (const device of devices) {
    const credentialIDBuffer = base64url.toBuffer(device.credentialID);

    if (isoUint8Array.areEqual(userCredentialIDBuffer, credentialIDBuffer)) {
      const authenticator = {
        credentialID: credentialIDBuffer,
        counter: device.counter,
        transports: device.transports,
        credentialPublicKey: isoBase64URL.toBuffer(device.credentialPublicKey),
      };
      userAuthenticator = authenticator;
      break;
    }
  }

  if (!userAuthenticator) {
    throw new BadRequestError();
  }

  let verification: VerifiedAuthenticationResponse;

  try {
    const opts: VerifyAuthenticationResponseOpts = {
      response: authenticationResponseJson,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: userAuthenticator,
      requireUserVerification: true,
    };
    verification = await verifyAuthenticationResponse(opts);
    return verification;
  } catch (error) {
    console.log(error);
    throw new BadRequestError();
  }
};
