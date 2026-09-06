import { AxiosError } from 'axios';

export interface ApiErrorShape {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly path?: string;

  constructor(message: string, statusCode: number, path?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.path = path;
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

/**
 * خروجی axios error رو به یه ApiError یکدست تبدیل می‌کنه.
 * فرمت ورودی دقیقاً همون چیزیه که HttpExceptionFilter سمت api برمی‌گردونه.
 */
export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorShape> | undefined;
    const rawMessage = data?.message;
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

    return new ApiError(
      message ?? error.message ?? 'یه خطای غیرمنتظره رخ داد',
      error.response?.status ?? 0,
      data?.path,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError('یه خطای غیرمنتظره رخ داد', 0);
}
