import { pino } from 'pino';
import { env } from '../config/env';

export const logger =
  env.NODE_ENV === 'development'
    ? pino({
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      })
    : pino({ level: 'info' });
