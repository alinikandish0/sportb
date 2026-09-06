import { AppShell } from '@platform/ui';
import { QueryProvider, ToastProvider } from '@platform/sdk';
import './global.css';

export const metadata = {
  title: 'Platform · Partner',
  description: 'Platform partner portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <QueryProvider>
          <AppShell title="پنل همکاران">{children}</AppShell>
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
