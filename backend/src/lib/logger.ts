import pino from 'pino';

const useDevTransport =
  process.env.NODE_ENV !== 'production' &&
  process.env.VERCEL !== '1' &&
  process.env.VERCEL_ENV == null;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: useDevTransport
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});
