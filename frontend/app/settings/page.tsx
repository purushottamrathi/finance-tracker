'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import AppShell from '@/components/ui/AppShell';
import BudgetCard from '@/components/budgets/BudgetCard';
import api from '@/lib/api';
import { CATEGORIES, formatCurrency } from '@/lib/constants';
import toast from 'react-hot-toast';
import { Plus, Landmark, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface BudgetData {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  isWarning: boolean;
  isExceeded: boolean;
}

interface UserSettings {
  startingBalance: number;
  monthlyBudget: number;
}

export default function SettingsPage() {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    startingBalance: 0,
    monthlyBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAccountSetup, setShowAccountSetup] = useState(true);
  const [form, setForm] = useState({ category: 'food', limit: '' });
  const [accountForm, setAccountForm] = useState({ startingBalance: '', monthlyBudget: '' });
  const [saving, setSaving] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const [budgetsRes, settingsRes] = await Promise.all([
        api.get(`/budgets?month=${now.getMonth()}&year=${now.getFullYear()}`),
        api.get('/settings'),
      ]);
      setBudgets(budgetsRes.data);
      setUserSettings(settingsRes.data);
      setAccountForm({
        startingBalance:
          settingsRes.data.startingBalance > 0 ? String(settingsRes.data.startingBalance) : '',
        monthlyBudget:
          settingsRes.data.monthlyBudget > 0 ? String(settingsRes.data.monthlyBudget) : '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSaveAccount = async (e: FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const { data } = await api.put('/settings', {
        startingBalance: accountForm.startingBalance ? parseFloat(accountForm.startingBalance) : 0,
        monthlyBudget: accountForm.monthlyBudget ? parseFloat(accountForm.monthlyBudget) : 0,
      });
      setUserSettings(data);
      toast.success('Account settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSaveBudget = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.limit) return;
    setSaving(true);
    try {
      await api.post('/budgets', {
        category: form.category,
        limit: parseFloat(form.limit),
      });
      toast.success('Budget saved!');
      setShowForm(false);
      setForm({ category: 'food', limit: '' });
      fetchAll();
    } catch {
      toast.error('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Budgets & Settings</h1>

        {/* Account Setup */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAccountSetup((v) => !v)}
            aria-expanded={showAccountSetup}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Landmark size={18} className="text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-gray-900 text-sm">Account Setup</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  Balance: {formatCurrency(userSettings.startingBalance)} · Budget:{' '}
                  {userSettings.monthlyBudget > 0
                    ? formatCurrency(userSettings.monthlyBudget) + '/mo'
                    : 'Not set'}
                </p>
              </div>
            </div>
            {showAccountSetup ? (
              <ChevronUp size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
            )}
          </button>

          {showAccountSetup && (
            <form
              onSubmit={handleSaveAccount}
              className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4"
            >
              {/* Starting balance */}
              <div>
                <label
                  htmlFor="starting-balance"
                  className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                >
                  Current Bank / Wallet Balance
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none"
                    aria-hidden="true"
                  >
                    ₹
                  </span>
                  <input
                    id="starting-balance"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 50000"
                    value={accountForm.startingBalance}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, startingBalance: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Your total savings / money available right now. Used to calculate real available
                  balance.
                </p>
              </div>

              {/* Monthly budget */}
              <div>
                <label
                  htmlFor="monthly-budget"
                  className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                >
                  Monthly Spending Budget
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none"
                    aria-hidden="true"
                  >
                    ₹
                  </span>
                  <input
                    id="monthly-budget"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 30000"
                    value={accountForm.monthlyBudget}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, monthlyBudget: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum you plan to spend this month. Shown as a progress bar on the dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingAccount}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {savingAccount ? 'Saving…' : 'Save Account Settings'}
              </button>
            </form>
          )}
        </div>

        {/* Category Budgets header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Target size={18} className="text-amber-600" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Category Budgets</p>
              <p className="text-xs text-gray-400 mt-0.5">Monthly limits per category</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={16} aria-hidden="true" /> Add
          </button>
        </div>

        {/* New budget form */}
        {showForm && (
          <form
            onSubmit={handleSaveBudget}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4"
          >
            <h2 className="font-semibold text-gray-800">New Category Limit</h2>

            <div>
              <label htmlFor="budget-category" className="sr-only">
                Category
              </label>
              <select
                id="budget-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budget-limit" className="sr-only">
                Monthly limit
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none"
                  aria-hidden="true"
                >
                  ₹
                </span>
                <input
                  id="budget-limit"
                  type="number"
                  placeholder="Monthly limit"
                  required
                  min="1"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Budget'}
              </button>
            </div>
          </form>
        )}

        {/* Budget list */}
        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-50" />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2" aria-hidden="true">🎯</p>
            <p className="text-sm font-medium">No category budgets set</p>
            <p className="text-xs mt-1">Tap Add to set spending limits</p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((b) => (
              <BudgetCard key={b.category} budget={b} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
