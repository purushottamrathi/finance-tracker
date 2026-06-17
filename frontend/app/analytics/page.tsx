'use client';

import { useEffect, useState, useCallback } from 'react';
import AppShell from '@/components/ui/AppShell';
import PeriodFilter from '@/components/ui/PeriodFilter';
import CategoryChart from '@/components/analytics/CategoryChart';
import DailyChart from '@/components/analytics/DailyChart';
import PaymentMethodChart from '@/components/analytics/PaymentMethodChart';
import SummaryCards from '@/components/dashboard/SummaryCards';
import api from '@/lib/api';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const p = `period=${period}`;
      const now = new Date();
      const dailyParams = `year=${now.getFullYear()}&month=${now.getMonth()}`;
      const [sum, cats, methods, d, settingsRes] = await Promise.all([
        api.get(`/transactions/summary?${p}`),
        api.get(`/analytics/categories?${p}`),
        api.get(`/analytics/payment-methods?${p}`),
        api.get(`/analytics/daily?${dailyParams}`),
        api.get('/settings'),
      ]);
      setSummary(sum.data);
      setCategories(cats.data);
      setPaymentMethods(methods.data);
      setDaily(d.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  return (
    <AppShell title="Analytics">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

        <PeriodFilter value={period} onChange={setPeriod} />

        <SummaryCards summary={summary} settings={settings} loading={loading} />

        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Spending by Category</h2>
          <CategoryChart data={categories} loading={loading} />
        </section>

        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-1">Daily Spending (This Month)</h2>
          <p className="text-xs text-gray-400 mb-4">Day-by-day expense breakdown</p>
          <DailyChart data={daily} loading={loading} />
        </section>

        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">By Payment Method</h2>
          <PaymentMethodChart data={paymentMethods} loading={loading} />
        </section>
      </div>
    </AppShell>
  );
}
