'use client';

import { formatCurrency } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props {
  monthlyBudget: number;
  totalExpense: number;
  loading?: boolean;
}

export default function MonthlyBudgetBar({ monthlyBudget, totalExpense, loading }: Props) {
  if (!monthlyBudget) return null;

  const pct = Math.min((totalExpense / monthlyBudget) * 100, 100);
  const remaining = monthlyBudget - totalExpense;
  const isExceeded = totalExpense > monthlyBudget;
  const isWarning = pct >= 80 && !isExceeded;

  const barColor = isExceeded ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-green-500';
  const textColor = isExceeded ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-600';
  const wrapperClass = isExceeded
    ? 'bg-red-50 border-red-100'
    : isWarning
    ? 'bg-amber-50 border-amber-100'
    : 'bg-green-50 border-green-100';

  return (
    <div className={cn('rounded-2xl p-4 border', wrapperClass)}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">Monthly Budget</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isExceeded
              ? `Over budget by ${formatCurrency(totalExpense - monthlyBudget)}`
              : `${formatCurrency(remaining)} remaining of ${formatCurrency(monthlyBudget)}`}
          </p>
        </div>
        <p className={cn('text-xl font-bold shrink-0', textColor)}>{Math.round(pct)}%</p>
      </div>

      {loading ? (
        <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
      ) : (
        <div
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Monthly budget used: ${Math.round(pct)}%`}
          className="h-3 bg-white/60 rounded-full overflow-hidden"
        >
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
