import { Router } from 'express';
import { body, oneOf, validationResult } from 'express-validator';
import { validationErrorHandler } from '../modules/middlewares';
import {
  getUserProfile,
  postSignUp,
  registerUser,
  signInUser,
  updateUserProfile,
} from './user.controller';
import {
  bloodGroupValidation,
  genderValidation,
  ssnValidator,
} from '../utils/validation';
import { BloodGroup } from '@prisma/client';

const authRouter = Router();
const profileRouter = Router(); // Protected Router

const signupValidations = [
  body('name').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  body('ssn').custom(ssnValidator),
];

const signinValidations = [
  oneOf([
    body('ssn').custom(ssnValidator),
    body('email').isEmail().normalizeEmail(),
  ]),
  body('password').isLength({ min: 8 }),
];

const postSignupValidations = [
  body('mobileNumber').isLength({ min: 10, max: 10 }).toInt(),
  body('dateOfBirth').isISO8601().toDate(),
  body('gender').custom(genderValidation),
  body('bloodGroup').custom(bloodGroupValidation),
  body('allergies').isArray(),
  body('height').isString(),
  body('weight').isString(),
];

const userUpdateValidations = [
  body('name').optional().isLength({ min: 3 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 8 }).trim(),
  body('ssn').optional().custom(ssnValidator),
  body('mobileNumber').optional().isLength({ min: 10, max: 10 }),
  body('dateOfBirth').optional().isDate().toDate(),
  body('gender').optional().custom(genderValidation),
  body('bloodGroup').optional().isIn(Object.values(BloodGroup)),
  body('allergies').optional().isArray(),
];

authRouter.post(
  '/signin',
  signinValidations,
  validationErrorHandler,
  signInUser,
);
authRouter.post(
  '/signup',
  signupValidations,
  validationErrorHandler,
  registerUser,
);

profileRouter.post(
  '/user/postsignup',
  postSignupValidations,
  validationErrorHandler,
  postSignUp,
);
profileRouter.get('/user', getUserProfile);
profileRouter.put(
  '/user',
  userUpdateValidations,
  validationErrorHandler,
  updateUserProfile,
);

export { authRouter, profileRouter };
