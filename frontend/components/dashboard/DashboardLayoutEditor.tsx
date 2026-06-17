import { useState, useEffect } from 'react';
import api from '@/lib/api';

const DEFAULT = ['recommendations','simulator','accounts','milestones','reminders'];

export default function DashboardLayoutEditor({ current, onSave }: { current?: string[]; onSave: (arr: string[]) => void }) {
  const [order, setOrder] = useState<string[]>(current || DEFAULT);

  useEffect(()=>{ if (current) setOrder(current); }, [current]);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const j = idx + dir;
    if (j<0 || j>=next.length) return;
    const tmp = next[j]; next[j] = next[idx]; next[idx] = tmp;
    setOrder(next);
  };

  const toggle = (key: string) => {
    if (order.includes(key)) setOrder(order.filter(k=>k!==key));
    else setOrder([...order, key]);
  };

  const save = async () => {
    await api.put('/settings', { dashboardLayout: order });
    onSave(order);
  };

  const widgets = ['recommendations','simulator','accounts','milestones','reminders'];

  return (
    <div className="p-3 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Edit Dashboard</h3>
      <div className="space-y-2">
        {order.map((k, i) => (
          <div key={k} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={()=>move(i,-1)} className="px-2">↑</button>
              <button onClick={()=>move(i,1)} className="px-2">↓</button>
              <span className="font-medium">{k}</span>
            </div>
            <button onClick={()=>toggle(k)} className="text-sm text-red-600">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {widgets.filter(w=>!order.includes(w)).map(w=> (
          <button key={w} onClick={()=>toggle(w)} className="px-2 py-1 border rounded">Add {w}</button>
        ))}
        <button onClick={save} className="ml-auto px-3 py-1 bg-blue-600 text-white rounded">Save layout</button>
      </div>
    </div>
  );
}
