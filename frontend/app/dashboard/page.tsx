'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AppShell from '@/components/ui/AppShell';
import SummaryCards from '@/components/dashboard/SummaryCards';
import MonthlyBudgetBar from '@/components/dashboard/MonthlyBudgetBar';
import GlobalSummary from '@/components/analytics/GlobalSummary';
import RecommendationsWidget from '@/components/dashboard/RecommendationsWidget';
import SimulatorWidget from '@/components/dashboard/SimulatorWidget';
import AccountsWidget from '@/components/dashboard/AccountsWidget';
import MilestonesWidget from '@/components/dashboard/MilestonesWidget';
import RemindersWidget from '@/components/dashboard/RemindersWidget';
import dynamic from 'next/dynamic';
const DashboardLayoutEditor = dynamic(() => import('@/components/dashboard/DashboardLayoutEditor'), { ssr: false });
import PeriodFilter from '@/components/ui/PeriodFilter';
import QuickAdd from '@/components/dashboard/QuickAdd';
import TransactionList from '@/components/transactions/TransactionList';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Summary {
  income: number;
  expense: number;
  investment: number;
  availableBalance: number;
  netWorth: number;
  count: number;
}

interface Settings {
  startingBalance: number;
  monthlyBudget: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('monthly');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editingLayout, setEditingLayout] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState<string[] | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, txRes, settingsRes] = await Promise.all([
        api.get(`/transactions/summary?period=${period}`),
        api.get(`/transactions?period=${period}`),
        api.get('/settings'),
      ]);
      setSummary(summaryRes.data);
      setTransactions(txRes.data.slice(0, 10));
      setSettings(settingsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (settings && (settings as any).dashboardLayout) setDashboardLayout((settings as any).dashboardLayout);
  }, [settings]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell title="Dashboard">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page header */}
        <div>
          <p className="text-gray-500 text-sm">
            {greeting()},{' '}
            <span className="font-semibold text-gray-800">{user?.name}</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Your Finances</h1>
        </div>

        <PeriodFilter value={period} onChange={setPeriod} />

        <GlobalSummary />
        <SummaryCards summary={summary} settings={settings} loading={loading} />

        <MonthlyBudgetBar
          monthlyBudget={settings?.monthlyBudget ?? 0}
          totalExpense={summary?.expense ?? 0}
          loading={loading}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Dashboard Widgets</h2>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded" onClick={()=>setEditingLayout(v=>!v)}>{editingLayout? 'Close editor':'Edit layout'}</button>
          </div>
        </div>

        {editingLayout && (
          <div className="mb-4">
            {/* lazy-load editor to keep bundle small */}
            <DashboardLayoutEditor current={dashboardLayout || undefined} onSave={(arr)=>{ setDashboardLayout(arr); fetchData(); setEditingLayout(false); }} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            {(!dashboardLayout || dashboardLayout.includes('recommendations')) && <RecommendationsWidget />}
            {(!dashboardLayout || dashboardLayout.includes('simulator')) && <SimulatorWidget />}
          </div>
          <div className="space-y-4">
            {(!dashboardLayout || dashboardLayout.includes('accounts')) && <AccountsWidget />}
            {(!dashboardLayout || dashboardLayout.includes('milestones')) && <MilestonesWidget />}
            {(!dashboardLayout || dashboardLayout.includes('reminders')) && <RemindersWidget />}
          </div>
        </div>

        {/* Recent transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
            <Link
              href="/transactions"
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <TransactionList
            transactions={transactions}
            loading={loading}
            onDelete={fetchData}
          />
        </section>
      </div>

      <QuickAdd onSuccess={fetchData} />
    </AppShell>
  );
}
