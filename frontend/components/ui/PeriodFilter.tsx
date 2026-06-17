'use client';

import { PERIODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (period: string) => void;
}

export default function PeriodFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            'flex-1 text-xs font-medium py-1.5 px-2 rounded-lg transition-all',
            value === p.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
