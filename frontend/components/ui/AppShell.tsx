'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import PWAInstall from './PWAInstall';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) {
    // Render an invisible skeleton of the shell so there's zero layout shift
    // when auth resolves — no spinner flash, no blank screen
    return (
      <div className="flex h-[100dvh] overflow-hidden bg-gray-50 pointer-events-none" aria-hidden="true">
        {/* Sidebar placeholder */}
        <div className="hidden md:block w-60 shrink-0 bg-white border-r border-gray-100" />
        {/* Content placeholder */}
        <div className="flex flex-col flex-1">
          <div className="md:hidden h-14 bg-white border-b border-gray-100 shrink-0" />
          <div className="flex-1" />
          <div className="md:hidden h-16 bg-white border-t border-gray-100 shrink-0" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gray-50">
      {/* Desktop: fixed sidebar */}
      <Sidebar />

      {/* Right side: topbar (mobile) + scrollable content + bottom nav (mobile) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar — hidden on md+ */}
        <Topbar title={title} />

        {/* Main scrollable area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          aria-label="Page content"
        >
          {/* PWA banner — mobile only, below topbar */}
          <div className="md:hidden">
            <PWAInstall variant="banner" />
          </div>

          {children}
        </main>

        {/* Mobile bottom nav — hidden on md+ */}
        <BottomNav />
      </div>
    </div>
  );
}
