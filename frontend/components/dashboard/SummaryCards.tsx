'use client';

import { memo } from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, Star, Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Summary {
  income: number;
  expense: number;
  investment: number;
}

interface Settings {
  startingBalance: number;
  monthlyBudget: number;
}

interface Props {
  summary: Summary | null;
  settings: Settings | null;
  loading?: boolean;
}

const cards = [
  {
    key: 'startingBalance',
    label: 'Starting Balance',
    icon: Landmark,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    iconBg: 'bg-slate-100',
    border: 'border-slate-100',
  },
  {
    key: 'income',
    label: 'Total Earned',
    icon: TrendingUp,
    bg: 'bg-green-50',
    text: 'text-green-700',
    iconBg: 'bg-green-100',
    border: 'border-green-100',
  },
  {
    key: 'expense',
    label: 'Total Spent',
    icon: TrendingDown,
    bg: 'bg-red-50',
    text: 'text-red-700',
    iconBg: 'bg-red-100',
    border: 'border-red-100',
  },
  {
    key: 'investment',
    label: 'Investments',
    icon: PiggyBank,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
    border: 'border-blue-100',
  },
  {
    key: 'availableBalance',
    label: 'Available Now',
    icon: Wallet,
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    iconBg: 'bg-violet-100',
    border: 'border-violet-100',
  },
  {
    key: 'netWorth',
    label: 'Net Worth',
    icon: Star,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100',
    border: 'border-amber-100',
  },
] as const;

function SummaryCards({ summary, settings, loading }: Props) {
  const startingBalance = settings?.startingBalance ?? 0;
  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;
  const investment = summary?.investment ?? 0;
  const availableBalance = startingBalance + income - expense - investment;
  const netWorth = startingBalance + income - expense + investment;

  const values: Record<string, number> = {
    startingBalance,
    income,
    expense,
    investment,
    availableBalance,
    netWorth,
  };

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))' }}
      aria-label="Financial summary"
      aria-busy={loading}
    >
      {cards.map(({ key, label, icon: Icon, bg, text, iconBg, border }) => {
        const value = values[key] ?? 0;
        const isNegative = value < 0;
        return (
          <div
            key={key}
            className={cn('rounded-2xl border p-4 flex flex-col gap-2 min-w-0', bg, border)}
          >
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
              <Icon size={16} className={text} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium leading-snug">{label}</p>
              {loading ? (
                <div className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse mt-1" />
              ) : (
                <p
                  className={cn(
                    'text-base font-bold mt-0.5 break-all leading-tight',
                    isNegative ? 'text-red-600' : text
                  )}
                >
                  {formatCurrency(value)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(SummaryCards);
