import { useEffect, useState } from 'react';
import api from '@/lib/api';
import WidgetContainer from '@/components/ui/WidgetContainer';

export default function MilestonesWidget(){
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{let m=true; api.get('/milestones').then(r=>{ if(m) setList(r.data); }).catch(()=>{}); return ()=>{ m=false };},[]);
  return (
    <WidgetContainer title="Milestones">
      <ul className="mt-2 text-sm text-gray-700 space-y-2">
        {list.map(m=> (
          <li key={m._id} className="py-1 flex justify-between items-center">
            <div>
              <div className="font-medium">{m.key}</div>
              <div className="text-xs text-gray-500">{m.description}</div>
            </div>
            <div className="text-sm">
              {m.achievedAt ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Achieved</span>
              ) : (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
              )}
            </div>
          </li>
        ))}
        {!list.length && <li className="text-xs text-gray-500">No milestones</li>}
      </ul>
    </WidgetContainer>
  );
}
