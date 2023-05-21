import { Router } from 'express';
import { body, oneOf } from 'express-validator';
// import { protect } from '../modules/auth';
import { validationErrorHandler } from '../modules/middlewares';
import {
  createLabResult,
  deleteLabResult,
  getLabResult,
  getLabResults,
  updateLabResult,
} from './labResult.controller';

const router = Router();

const labRetultValidator = [
  body('testName').isString(),
  body('testResult').isString(),
  body('testDate').isDate().toDate(),
];

// router.use('/', protect);
router.get('/lab-result', getLabResults);
router.get('/lab-result/:id', getLabResult);
router.post(
  '/lab-result/',
  labRetultValidator,
  validationErrorHandler,
  createLabResult,
);
router.put(
  '/lab-result/:id',
  oneOf(labRetultValidator),
  validationErrorHandler,
  updateLabResult,
);
router.delete('/lab-result/:id', deleteLabResult);

export default router;
