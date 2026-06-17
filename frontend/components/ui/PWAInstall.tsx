'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface Props {
  variant?: 'sidebar' | 'banner';
}

export default function PWAInstall({ variant = 'sidebar' }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(() =>
    typeof window !== 'undefined' && Boolean(localStorage.getItem('pwa-installed'))
  );

  // iOS fallback dismissal flag
  const [iosDismissed, setIosDismissed] = useState(() =>
    typeof window !== 'undefined' && Boolean(localStorage.getItem('pwa-ios-dismissed'))
  );

  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    if (hidden) return;
    const handler = (e: Event) => {
      e.preventDefault();
      try {
        // expose for debugging
        // @ts-ignore
        window.__deferredPWAEvent = e;
      } catch {}
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [hidden]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', '1');
    }
    setDeferredPrompt(null);
    setHidden(true);
  };

  const handleIosDismiss = () => {
    if (typeof window !== 'undefined') localStorage.setItem('pwa-ios-dismissed', '1');
    setIosDismissed(true);
  };

  if (hidden) return null;

  // iOS: show manual instructions when beforeinstallprompt isn't available
  if (isIOS && !deferredPrompt && !iosDismissed) {
    if (variant === 'sidebar') {
      return (
        <div className="text-xs px-3 py-2.5 rounded-xl bg-yellow-50 text-yellow-800">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium">Install FinTracker</div>
              <div className="text-[11px]">Tap Share → Add to Home Screen</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleIosDismiss}
                className="text-xs text-yellow-600 px-2 py-1 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-4 mb-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-yellow-900">Install FinTracker</p>
          <p className="text-xs text-yellow-700 mt-0.5">Open Share → Add to Home Screen</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleIosDismiss}
            className="text-xs text-yellow-600 hover:text-yellow-800 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // Non-iOS: only show when the beforeinstallprompt event is available
  if (!deferredPrompt) return null;

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleInstall}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-medium"
        aria-label="Install FinTracker as an app"
      >
        <Download size={16} aria-hidden="true" />
        Install App
      </button>
    );
  }

  return (
    <div className="mx-4 mb-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-blue-900">Install FinTracker</p>
        <p className="text-xs text-blue-600 mt-0.5">Add to home screen for offline access</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="text-xs text-blue-400 hover:text-blue-600 px-2 py-1"
          aria-label="Dismiss install prompt"
        >
          Later
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
