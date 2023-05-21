import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { authRouter, profileRouter } from './user/user.router';
import MedicalHistoryRouter from './medical_history/medicalHistory.routes';
import LabResultRouter from './lab_result/labResult.routes';
import NotFoundError from './errors/NotFoundError';
import { errorHandler } from './modules/middlewares';
import recordRouter from './record/record.routes';
import { protect } from './modules/auth';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('version 1.0.0');
});

app.use('/', authRouter);
app.use('/api', protect);
app.use('/api', profileRouter);
app.use('/api', MedicalHistoryRouter);
app.use('/api', LabResultRouter);
app.use('/api', recordRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
