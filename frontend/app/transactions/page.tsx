'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '@/components/ui/AppShell';
import TransactionList from '@/components/transactions/TransactionList';
import PeriodFilter from '@/components/ui/PeriodFilter';
import QuickAdd from '@/components/dashboard/QuickAdd';
import api from '@/lib/api';
import { TRANSACTION_TYPES, CATEGORIES } from '@/lib/constants';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period });
      if (typeFilter) params.set('type', typeFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const { data } = await api.get(`/transactions?${params}`);
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period, typeFilter, categoryFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <AppShell title="Transactions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>

        <PeriodFilter value={period} onChange={setPeriod} />

        {/* Type filter pills — horizontal scroll on overflow */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
          role="group"
          aria-label="Filter by type"
        >
          <button
            type="button"
            onClick={() => setTypeFilter('')}
            aria-pressed={!typeFilter}
            className={`text-xs px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
              !typeFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {TRANSACTION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={typeFilter === t.value}
              onClick={() => setTypeFilter(typeFilter === t.value ? '' : t.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                typeFilter === t.value
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={typeFilter === t.value ? { backgroundColor: t.color } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        <TransactionList
          transactions={transactions}
          loading={loading}
          onDelete={fetchTransactions}
        />
      </div>

      <QuickAdd onSuccess={fetchTransactions} />
    </AppShell>
  );
}
