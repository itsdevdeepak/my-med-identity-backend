import { Router } from 'express';
import { body } from 'express-validator';
// import { protect } from '../modules/auth';
import { validationErrorHandler } from '../modules/middlewares';
import {
  createMedicalHistory,
  deleteMedicalHistory,
  getMedicalHistory,
  getMedicalHistorys,
  updateMedicalHistory,
} from './medicalHistory.controller';

const router = Router();

const createMedicalHistoryValidators = [
  body('condition').isString(),
  body('illness').isString(),
  body('medication').isString(),
  body('allergies').isString(),
  body('Immunizations').isString(),
];
const updateMedicalHistoryValidators = [
  body('condition').isString().optional(),
  body('illness').isString().optional(),
  body('medication').isString().optional(),
  body('allergies').isString().optional(),
  body('Immunizations').isString().optional(),
];

// router.use('/', protect);
router.get('/medical-history', getMedicalHistorys);
router.get('/medical-history/:id', getMedicalHistory);
router.post(
  '/medical-history',
  createMedicalHistoryValidators,
  validationErrorHandler,
  createMedicalHistory,
);
router.put(
  '/medical-history/:id',
  updateMedicalHistoryValidators,
  validationErrorHandler,
  updateMedicalHistory,
);
router.delete('/medical-history/:id', deleteMedicalHistory);

router.use(validationErrorHandler);

export default router;
