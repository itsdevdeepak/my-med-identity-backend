import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import { validationErrorHandler } from '../modules/middlewares';

import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
} from './record.controllers';

const router = Router();

const recordValidator = [
  body('name').isString(),
  body('date').isString(),
  body('description').isString(),
  body('fileUrl').isURL().optional(),
  body('allergies').isArray(),
];

// router.use('/', protect);
router.get('/records', getRecords);
router.get('/record/:id', getRecord);
router.post('/record', recordValidator, validationErrorHandler, createRecord);

router.put(
  '/record/:id',
  oneOf(recordValidator),
  validationErrorHandler,
  updateRecord,
);
router.delete('/record/:id', deleteRecord);

export default router;
