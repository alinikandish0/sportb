import { toast } from 'sonner';
import { parseApiError } from '../api/api-error';

export const notify = {
  success: (message: string) => toast.success(message),
  info: (message: string) => toast.info(message),
  /**
   * error می‌تونه یه پیام ساده باشه یا خودِ error که از catch گرفتی —
   * توی حالت دوم خودکار با parseApiError پردازش میشه.
   */
  error: (error: unknown) => {
    const message = typeof error === 'string' ? error : parseApiError(error).message;
    toast.error(message);
  },
};
