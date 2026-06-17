import { useEffect, useState } from 'react';
import api from '@/lib/api';
import WidgetContainer from '@/components/ui/WidgetContainer';

export default function RemindersWidget(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{let m=true; api.get('/reminders').then(r=>{ if(m) setItems(r.data); }).catch(()=>{}); return ()=>{ m=false };},[]);

  const snooze = async (id: string) => {
    // simple snooze: postpone by 1 day
    try {
      const it = items.find(i=>i._id===id);
      if (!it) return;
      const next = new Date(it.date); next.setDate(next.getDate()+1);
      await api.put(`/reminders/${id}`, { date: next.toISOString(), isActive: true });
      setItems(items.map(i=> i._id===id ? { ...i, date: next } : i));
    } catch (e) { console.error(e); }
  };

  const toggleEmail = async (id: string) => {
    // toggle email flag on metadata
    try {
      const it = items.find(i=>i._id===id);
      if (!it) return;
      const sendEmail = !(it.metadata && it.metadata.sendEmail);
      await api.put(`/reminders/${id}`, { metadata: { ...(it.metadata||{}), sendEmail } });
      setItems(items.map(i=> i._id===id ? { ...i, metadata: { ...(i.metadata||{}), sendEmail } } : i));
    } catch (e) { console.error(e); }
  };

  return (
    <WidgetContainer title="Reminders">
      <ul className="mt-2 text-sm text-gray-700 space-y-2">
        {items.map(it=> (
          <li key={it._id} className="py-1 flex justify-between items-center">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-gray-500">{new Date(it.date).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>snooze(it._id)} className="text-xs px-2 py-1 border rounded">Snooze</button>
              <button onClick={()=>toggleEmail(it._id)} className="text-xs px-2 py-1 border rounded">{it.metadata?.sendEmail? 'Email On' : 'Email Off'}</button>
            </div>
          </li>
        ))}
        {!items.length && <li className="text-xs text-gray-500">No reminders</li>}
      </ul>
    </WidgetContainer>
  );
}
