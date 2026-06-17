'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListOrdered, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import PWAInstall from './PWAInstall';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ListOrdered },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Budgets & Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-100 h-full overflow-hidden"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold select-none"
            aria-hidden="true"
          >
            ₹
          </div>
          <span className="font-bold text-gray-900 text-lg">FinTracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 1.8}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: PWA install + user */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-50 space-y-2 shrink-0">
        <PWAInstall variant="sidebar" />

        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 select-none"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">Personal account</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg shrink-0"
            aria-label="Sign out of your account"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
