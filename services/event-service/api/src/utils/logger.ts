import pino from 'pino';
import { config } from '../config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname'
  }
});

export const createLogger = (name: string) => {
  return pino({
    name,
    level: config.logLevel,
    transport: config.env === 'development' ? transport : undefined
  });
};