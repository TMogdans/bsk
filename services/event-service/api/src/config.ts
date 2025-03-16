import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  env: z.enum(['development', 'test', 'production']).default('development'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  db: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    user: z.string().default('postgres'),
    password: z.string().default('postgres'),
    database: z.string().default('events')
  }),
  nats: z.object({
    url: z.string().default('nats://localhost:4222')
  })
});

type Config = z.infer<typeof configSchema>;

const parseConfig = (): Config => {
  try {
    return configSchema.parse({
      port: process.env.PORT,
      env: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL,
      db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      },
      nats: {
        url: process.env.NATS_SERVER
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:', error.format());
      process.exit(1);
    }
    throw error;
  }
};

export const config = parseConfig();