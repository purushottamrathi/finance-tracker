'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/constants';

interface DayData { _id: number; total: number; count: number; }
interface Props { data: DayData[]; loading?: boolean; }

export default function DailyChart({ data, loading }: Props) {
  if (loading) return <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  if (!data.length) return (
    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data for this month</div>
  );

  const chartData = data.map((d) => ({ day: `${d._id}`, amount: d.total }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Spent']} labelFormatter={(l) => `Day ${l}`} />
        <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
