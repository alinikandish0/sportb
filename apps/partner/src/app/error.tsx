'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h2 className="text-xl font-bold text-slate-900">یه مشکلی پیش اومد</h2>
      <p className="text-slate-600">{error.message || 'خطای غیرمنتظره‌ای رخ داد.'}</p>
      <button
        onClick={reset}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
