import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './user/user.router';
import NotFoundError from './errors/NotFoundError';
import { errorHandler } from './modules/middlewares';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);

app.get('/', (_req, res) => {
  res.send('version 1.0.0');
});

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
