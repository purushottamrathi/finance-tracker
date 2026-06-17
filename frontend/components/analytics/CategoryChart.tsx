'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/constants';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

interface CategoryData { _id: string; total: number; count: number; }
interface Props { data: CategoryData[]; loading?: boolean; }

export default function CategoryChart({ data, loading }: Props) {
  if (loading) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!data.length) return (
    <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data</div>
  );

  const chartData = data.map((d) => ({ name: d._id, value: d.total }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Legend formatter={(v) => <span className="text-xs text-gray-600 capitalize">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.map((d, i) => {
          const total = data.reduce((s, x) => s + x.total, 0);
          const pct = total ? ((d.total / total) * 100).toFixed(1) : '0';
          return (
            <div key={d._id} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-sm text-gray-700 flex-1 capitalize">{d._id}</span>
              <span className="text-xs text-gray-400">{pct}%</span>
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(d.total)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
