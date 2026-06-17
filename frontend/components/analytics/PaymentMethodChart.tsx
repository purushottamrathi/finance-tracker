'use client';

import { formatCurrency, PAYMENT_METHODS } from '@/lib/constants';

interface MethodData { _id: string; total: number; count: number; }
interface Props { data: MethodData[]; loading?: boolean; }

const COLORS: Record<string, string> = { upi: '#3b82f6', cash: '#22c55e', bank: '#f59e0b', card: '#8b5cf6' };

export default function PaymentMethodChart({ data, loading }: Props) {
  if (loading) return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!data.length) return <div className="text-center py-8 text-gray-400 text-sm">No data</div>;

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="space-y-3">
      {data.map((d) => {
        const pct = total ? (d.total / total) * 100 : 0;
        const m = PAYMENT_METHODS.find((p) => p.value === d._id);
        return (
          <div key={d._id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 font-medium">
                {m?.emoji} {m?.label || d._id}
              </span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">{formatCurrency(d.total)}</span>
                <span className="text-xs text-gray-400 ml-2">{d.count} txns</span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: COLORS[d._id] || '#6b7280' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
