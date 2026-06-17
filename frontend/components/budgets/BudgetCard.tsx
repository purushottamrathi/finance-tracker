'use client';

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency, getCategoryConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BudgetData {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  isWarning: boolean;
  isExceeded: boolean;
}

interface Props {
  budget: BudgetData;
}

export default function BudgetCard({ budget }: Props) {
  const cat = getCategoryConfig(budget.category);
  const barColor = budget.isExceeded ? 'bg-red-500' : budget.isWarning ? 'bg-amber-400' : 'bg-green-500';
  const barWidth = Math.min(budget.percentage, 100);

  return (
    <div className={cn(
      'bg-white rounded-2xl p-4 border',
      budget.isExceeded ? 'border-red-100' : budget.isWarning ? 'border-amber-100' : 'border-gray-50'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm capitalize">{budget.category}</p>
            <p className="text-xs text-gray-400">Limit: {formatCurrency(budget.limit)}</p>
          </div>
        </div>
        <div className="text-right">
          {budget.isExceeded ? (
            <XCircle size={20} className="text-red-500 ml-auto" />
          ) : budget.isWarning ? (
            <AlertTriangle size={20} className="text-amber-500 ml-auto" />
          ) : (
            <CheckCircle2 size={20} className="text-green-500 ml-auto" />
          )}
          <p className="text-xs text-gray-500 mt-0.5">{budget.percentage}%</p>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">Spent: {formatCurrency(budget.spent)}</span>
        <span className="text-xs text-gray-500">
          {budget.isExceeded
            ? `Over by ${formatCurrency(budget.spent - budget.limit)}`
            : `Remaining: ${formatCurrency(budget.limit - budget.spent)}`}
        </span>
      </div>
    </div>
  );
}
