import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

/**
 * این موقع import شدن اجرا میشه — یعنی اگه NEXT_PUBLIC_API_URL رو فراموش کرده
 * باشی یا فرمتش غلط باشه، بلافاصله (نه بعد از یه fetch fail مبهم) خطای واضح میگیری.
 */
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
