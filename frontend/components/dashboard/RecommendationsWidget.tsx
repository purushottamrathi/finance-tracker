import { useEffect, useState } from 'react';
import api from '@/lib/api';
import WidgetContainer from '@/components/ui/WidgetContainer';

export default function RecommendationsWidget() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/recommendations').then(r => { if (mounted) setRecs(r.data); }).catch(()=>{}).finally(()=>mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <WidgetContainer title="Personalized Suggestions">Loading recommendations…</WidgetContainer>;
  if (!recs.length) return <WidgetContainer title="Personalized Suggestions">No suggestions right now.</WidgetContainer>;

  return (
    <WidgetContainer title="Personalized Suggestions">
      <ul className="text-sm text-gray-700 space-y-2">
        {recs.map((r:any) => (
          <li key={r.key} className="flex items-start gap-2">
            <div className="text-blue-600">•</div>
            <div className="flex-1">
              <div className="font-medium">{r.message}</div>
            </div>
          </li>
        ))}
      </ul>
    </WidgetContainer>
  );
}
