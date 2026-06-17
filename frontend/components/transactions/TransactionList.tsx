'use client';

import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, getCategoryConfig, getTypeConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  paymentMethod: string;
  date: string;
  notes?: string;
  isRecurring?: boolean;
}

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  onDelete?: () => void;
}

function TransactionList({ transactions, loading, onDelete }: Props) {
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Deleted');
      onDelete?.();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Loading transactions">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[72px] bg-white rounded-2xl animate-pulse border border-gray-50" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-3xl mb-2" aria-hidden="true">📋</p>
        <p className="text-sm font-medium">No transactions yet</p>
        <p className="text-xs mt-1">Tap + to add your first transaction</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-2"
      aria-live="polite"
      aria-label="Transactions list"
    >
      {transactions.map((tx) => {
        const typeConfig = getTypeConfig(tx.type);
        const catConfig = getCategoryConfig(tx.category);
        const isIncome = tx.type === 'income';
        return (
          <div
            key={tx._id}
            className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-50 shadow-sm"
          >
            {/* Category icon */}
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0',
                typeConfig.bg
              )}
              aria-hidden="true"
            >
              {catConfig.emoji}
            </div>

            {/* Title + meta — flex-1 min-w-0 prevents overflow */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{tx.title}</p>
                {tx.isRecurring && (
                  <span
                    className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full shrink-0"
                    title="Recurring"
                    aria-label="Recurring"
                  >
                    🔄
                  </span>
                )}
              </div>
              {/* Meta row — wraps on narrow screens */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                    typeConfig.bg,
                    typeConfig.text
                  )}
                >
                  {typeConfig.label}
                </span>
                <span className="text-xs text-gray-400 shrink-0">{catConfig.label}</span>
                <span className="text-xs text-gray-300 shrink-0" aria-hidden="true">•</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(tx.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>

            {/* Amount + delete — never shrinks */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn('font-bold text-sm tabular-nums', isIncome ? 'text-green-600' : 'text-gray-800')}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(tx._id, tx.title)}
                className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg"
                aria-label={`Delete transaction: ${tx.title}`}
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(TransactionList);
