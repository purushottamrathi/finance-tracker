import { useEffect, useState } from 'react';
import api from '@/lib/api';
import WidgetContainer from '@/components/ui/WidgetContainer';

export default function AccountsWidget(){
  const [accounts, setAccounts] = useState<any[]>([]);
  useEffect(()=>{let m=true; api.get('/accounts').then(r=>{ if(m) setAccounts(r.data); }).catch(()=>{}); return ()=>{ m=false };},[]);
  const total = accounts.reduce((s,a)=>s + (a.balance||0), 0);
  return (
    <WidgetContainer title="Accounts">
      <div className="text-sm text-gray-700">
        <div className="mb-2">Total: <span className="font-medium">₹{Math.round(total).toLocaleString()}</span></div>
        <ul>
          {accounts.map(a=> (
            <li key={a._id} className="flex justify-between py-1 border-b border-gray-100">
              <span>{a.name}</span>
              <span className="font-medium">₹{Math.round(a.balance).toLocaleString()}</span>
            </li>
          ))}
          {!accounts.length && <li className="text-xs text-gray-500">No accounts yet</li>}
        </ul>
      </div>
    </WidgetContainer>
  );
}
