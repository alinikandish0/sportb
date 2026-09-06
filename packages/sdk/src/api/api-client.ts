import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clientEnv } from '../env/client-env';

export const apiClient = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
  withCredentials: true, // برای اینکه کوکی‌های httpOnly (access/refresh) خودکار ارسال بشن
  headers: {
    'Content-Type': 'application/json',
  },
});

const SAFE_METHODS = new Set(['get', 'head', 'options']);

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// کوکی csrf_token (که سرور با CsrfMiddleware ست می‌کنه، بر خلاف کوکی‌های
// auth عمداً httpOnly نیست) رو می‌خونه و برای هر درخواست تغییردهنده
// به‌عنوان هدر x-csrf-token می‌فرسته. سرور این دو مقدار رو با هم مقایسه
// می‌کنه (الگوی double-submit cookie).
apiClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (method && !SAFE_METHODS.has(method)) {
    const csrfToken = readCookie('csrf_token');
    if (csrfToken) {
      config.headers.set('x-csrf-token', csrfToken);
    }
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // اگه خودِ endpoint رفرش هم 401 داد، دیگه تلاش نکن (جلوگیری از لوپ بی‌نهایت)
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post('/auth/refresh');
      isRefreshing = false;
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);

      const isAuthCheckRequest = originalRequest.url?.includes('/auth/me');

      if (typeof window !== 'undefined' && !isAuthCheckRequest) {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/sign')) {
          window.location.href = `/sign?callbackUrl=${encodeURIComponent(currentPath)}`;
        }
      }

      return Promise.reject(refreshError);
    }
  },
);
