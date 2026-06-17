'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListOrdered, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ListOrdered },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Budgets', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden bg-white border-t border-gray-100 shrink-0"
      aria-label="Main navigation"
    >
      <div className="flex items-center h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-colors',
                active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
