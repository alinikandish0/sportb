'use client';
import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

/**
 * یه wrapper نازک روی useForm که resolver رو خودکار از schema میسازه.
 * مثال:
 *   const form = useZodForm(loginSchema);
 *   <input {...form.register('email')} />   // ← type-safe: فقط فیلدهای واقعی schema رو قبول می‌کنه
 */
export function useZodForm<Schema extends z.ZodType<any, any>>(
  schema: Schema,
  options?: Omit<UseFormProps<z.infer<Schema>>, 'resolver'>,
): UseFormReturn<z.infer<Schema>> {
  const form = useForm<any>({
    resolver: zodResolver(schema),
    ...(options as Record<string, unknown>),
  });
  return form as UseFormReturn<z.infer<Schema>>;
}
