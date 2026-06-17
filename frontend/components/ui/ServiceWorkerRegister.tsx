'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        const publicBase = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';
        const base = publicBase ? publicBase.replace(/\/$/, '') : '';
        const swPath = base ? `${base}/sw.js` : '/sw.js';
        const scope = base || '/';
        navigator.serviceWorker.register(swPath, { scope }).catch(() => {});
      } catch (e) {
        // ignore registration errors in older browsers
      }
    }
  }, []);
  return null;
}
