import pino from 'pino';
import { isProd } from './env';

const transport = isProd
  ? undefined // production: let infra aggregate the plain JSON
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard', // 2025-06-20 17:42:10
        ignore: 'pid,hostname',
      },
    };

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  
    redact: {
      paths: ['password', 'token', 'authorization', 'headers.cookie'],
      censor: '***',
    },
  transport,
});

export const loggerStream = {
  // morgan gives each line with a trailing newline -> trim it
  write: (msg: string) => {
    logger.info(msg.trim());
  },
};

export default logger;
