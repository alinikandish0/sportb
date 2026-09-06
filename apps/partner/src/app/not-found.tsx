import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h2 className="text-xl font-bold text-slate-900">صفحه پیدا نشد</h2>
      <p className="text-slate-600">صفحه‌ای که دنبالش بودی وجود نداره یا جابه‌جا شده.</p>
      <Link
        href="/"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        برگشت به صفحه‌ی اصلی
      </Link>
    </div>
  );
}
