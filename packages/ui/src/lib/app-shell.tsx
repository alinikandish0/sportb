import { ReactNode } from 'react';

export interface AppShellProps {
  title: string;
  children: ReactNode;
  nav?: ReactNode;
}

export function AppShell({ title, children, nav }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <span className="text-lg font-semibold text-slate-900">{title}</span>
        {nav}
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
