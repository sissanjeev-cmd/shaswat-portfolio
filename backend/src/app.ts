import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { router } from './routes';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3002',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
    ],
    credentials: true,
  }));

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/api/v1', router);

  app.use(errorHandler);

  return app;
}
