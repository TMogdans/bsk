import { pino } from 'pino';
import { config } from '../config';

// Einfacherer Logger für die Entwicklung
export const createLogger = (name: string) => {
  return pino({
    name,
    level: config.logLevel,
    transport: config.env === 'development' 
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined
  });
};
