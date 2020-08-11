import 'dotenv/config';
import express, { NextFunction, Response, Request } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import 'reflect-metadata';
import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import cors from 'cors';
import routes from './routes/index';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());

app.use(rateLimiter);
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

// A TRATATIVA DOS ERROS PRECISA SER DEPOIS DAS ROTAS
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('[ 🟢 ] Server started');
});
