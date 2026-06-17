import { useState } from 'react';
import api from '@/lib/api';
import WidgetContainer from '@/components/ui/WidgetContainer';

const PRESETS = [
  { label: 'Conservative', monthly: 1000, years: 10, rate: 6 },
  { label: 'Balanced', monthly: 2000, years: 10, rate: 8 },
  { label: 'Aggressive', monthly: 5000, years: 10, rate: 12 },
];

export default function SimulatorWidget() {
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await api.post('/simulations/run', { monthlyAmount: monthly, years, annualReturn: rate / 100 });
      setResult(res.data.result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <WidgetContainer title="What-if Simulator">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <label className="flex flex-col">Monthly ₹<input className="mt-1 p-2 border rounded w-full" value={monthly} onChange={e=>setMonthly(Number(e.target.value))} /></label>
        <label className="flex flex-col">Years<input className="mt-1 p-2 border rounded w-full" value={years} onChange={e=>setYears(Number(e.target.value))} /></label>
        <label className="flex flex-col">Return %<input className="mt-1 p-2 border rounded w-full" value={rate} onChange={e=>setRate(Number(e.target.value))} /></label>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex gap-2">
          {PRESETS.map(p=> (
            <button key={p.label} onClick={()=>{ setMonthly(p.monthly); setYears(p.years); setRate(p.rate); }} className="px-2 py-1 border rounded text-sm">{p.label}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={run} disabled={loading}>{loading? 'Running…':'Run'}</button>
        </div>
      </div>
      {result && (
        <div className="mt-3 text-sm text-gray-700">
          <div>Projected final value: <strong>₹{Math.round(result.final).toLocaleString()}</strong></div>
          <div>Contributed: ₹{Math.round(result.contributed).toLocaleString()}</div>
          <div>Estimated returns: ₹{Math.round(result.returns).toLocaleString()}</div>
        </div>
      )}
    </WidgetContainer>
  );
}
