"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/constants';

export default function GlobalSummary() {
  const [ytd, setYtd] = useState<number | null>(null);
  const [allTime, setAllTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [ytdRes, allRes] = await Promise.all([
          api.get('/transactions/summary?period=yearly'),
          api.get('/transactions/summary?period=lifetime'),
        ]);
        if (!mounted) return;
        setYtd((ytdRes.data?.income ?? 0) - (ytdRes.data?.expense ?? 0));
        setAllTime((allRes.data?.income ?? 0) - (allRes.data?.expense ?? 0));
      } catch (err) {
        console.error('GlobalSummary load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white border rounded-2xl p-4 mb-4">
      <h3 className="text-sm text-gray-500">Global Summary</h3>
      <div className="flex gap-4 mt-2 items-end">
        <div>
          <p className="text-xs text-gray-500">Year to date</p>
          <p className="text-lg font-bold">{loading ? '...' : formatCurrency(ytd ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">All time</p>
          <p className="text-lg font-bold">{loading ? '...' : formatCurrency(allTime ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}
