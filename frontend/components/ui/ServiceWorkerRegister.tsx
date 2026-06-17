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
        console.debug('[SW] registering', { swPath, scope });
        navigator.serviceWorker
          .register(swPath, { scope })
          .then((reg) => {
            console.debug('[SW] registered', reg);
            // show whether a controller is active
            console.debug('[SW] controller', !!navigator.serviceWorker.controller);
          })
          .catch((err) => {
            console.warn('[SW] registration failed', err);
          });
      } catch (e) {
        // ignore registration errors in older browsers
        // eslint-disable-next-line no-console
        console.warn('[SW] registration error', e);
      }
    }
  }, []);
  return null;
}
