'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title = 'FinTracker' }: TopbarProps) {
  const { user, logout } = useAuth();
  return (
    <header
      className="md:hidden sticky top-0 bg-white border-b border-gray-100 z-40 px-4 h-14 flex items-center justify-between shrink-0"
      role="banner"
      aria-label="App header"
    >
      <div className="flex items-center gap-2.5">
        <Link href="/dashboard" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" aria-label="Go to dashboard">
          <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold select-none" aria-hidden="false">₹</span>
          <span className="font-bold text-gray-900 text-base">{title}</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {user?.name && (
          <span className="text-sm text-gray-600 font-medium max-w-[100px] truncate">
            {user.name}
          </span>
        )}
        <button
          type="button"
          onClick={logout}
          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg"
          aria-label="Sign out of your account"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
