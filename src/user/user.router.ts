import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import { validationErrorHandler } from '../modules/middlewares';
import {
  registerUser,
  generateRegOptions,
  generateAuthenticationOptions,
  signInUser,
} from './user.controller';

const router = Router();

const createUserValidations = [
  body('user.name').isString(),
  body('user.email').isEmail().normalizeEmail(),
  body('user.ssn').isString(),
];

const verifyCreateUserValidation = [
  ...createUserValidations,
  body('challenge').isString(),
  body('authOptions').isObject(),
];

// Registration With WebAuthn
router.post('/signup/get-options', createUserValidations, generateRegOptions);
router.post('/signup/verify-options', verifyCreateUserValidation, registerUser);

// Signin With WebAuthn
router.post(
  '/signin/get-options',
  oneOf([body('ssn').isString(), body('email').isEmail().normalizeEmail()]),
  generateAuthenticationOptions,
);
router.post(
  '/signin/verify-options',
  oneOf([body('ssn').isString(), body('email').isEmail().normalizeEmail()]),
  body('authOptions').isObject(),
  body('challenge').isString(),
  signInUser,
);

router.use(validationErrorHandler);

export default router;
