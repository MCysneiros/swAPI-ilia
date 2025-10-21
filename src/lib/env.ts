import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('SWAPI Explorer'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_ENABLE_MOCK_API: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = parseEnv();
