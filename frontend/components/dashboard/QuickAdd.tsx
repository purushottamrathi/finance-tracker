'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { TRANSACTION_TYPES, CATEGORIES, PAYMENT_METHODS, todayISO } from '@/lib/constants';

const defaultForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'food',
  paymentMethod: 'upi',
  date: todayISO(),
  notes: '',
};

interface Props {
  onSuccess?: () => void;
}

export default function QuickAdd({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  // Open / close native dialog in sync with React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Sync Escape-key close back to React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setIsOpen(false);
      setForm({ ...defaultForm, date: todayISO() });
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    setForm({ ...defaultForm, date: todayISO() });
  };

  // Close when clicking the backdrop (outside the content)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeDialog();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setLoading(true);
    try {
      const { data } = await api.post('/transactions', {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
      });
      if (data.budgetWarning?.isExceeded) {
        toast.error(`Budget exceeded for ${data.budgetWarning.category}!`);
      } else if (data.budgetWarning?.isWarning) {
        toast(`Budget at ${data.budgetWarning.percentage}% for ${data.budgetWarning.category}`, {
          icon: '⚠️',
        });
      } else {
        toast.success('Transaction added!');
      }
      closeDialog();
      onSuccess?.();
    } catch {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[calc(4rem+16px)] right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="Add new transaction"
      >
        <Plus size={24} aria-hidden="true" />
      </button>

      {/* Native dialog — provides focus trap + Escape key + backdrop for free */}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="quick-add-dialog bg-white shadow-2xl"
        aria-labelledby="quick-add-title"
        aria-modal="true"
      >
        {/* Drag handle — visible on mobile only, signals swipe-down dismissal */}
        <div className="md:hidden flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 sticky top-0 bg-white z-10">
          <h2 id="quick-add-title" className="text-lg font-bold text-gray-900">
            Add Transaction
          </h2>
          <button
            type="button"
            onClick={closeDialog}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="tx-title" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Title <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="tx-title"
              type="text"
              placeholder="e.g. Grocery shopping"
              required
              autoComplete="off"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-amount" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Amount <span aria-hidden="true" className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none"
                  aria-hidden="true"
                >
                  ₹
                </span>
                <input
                  id="tx-amount"
                  type="number"
                  placeholder="0"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="tx-date" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Date
              </label>
              <input
                id="tx-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type — 4 cols × 2 rows */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Type</p>
            <div className="grid grid-cols-4 gap-1.5">
              {TRANSACTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={form.type === t.value}
                  onClick={() => set('type', t.value)}
                  className={`text-[10px] leading-tight py-2 px-1 rounded-xl border font-medium transition-all truncate ${
                    form.type === t.value
                      ? 'text-white border-transparent'
                      : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                  }`}
                  style={
                    form.type === t.value
                      ? { backgroundColor: t.color, borderColor: t.color }
                      : {}
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="tx-category" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Category
            </label>
            <select
              id="tx-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment method — 2×2 grid */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  aria-pressed={form.paymentMethod === m.value}
                  onClick={() => set('paymentMethod', m.value)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    form.paymentMethod === m.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                  }`}
                >
                  <span aria-hidden="true">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="tx-notes" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="tx-notes"
              type="text"
              placeholder="Any additional details"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Adding…' : 'Add Transaction'}
          </button>
        </form>
      </dialog>
    </>
  );
}
