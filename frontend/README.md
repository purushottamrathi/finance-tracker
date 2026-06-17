# Frontend — Next.js (FinTracker)

Local development

1. Install dependencies and run dev server:

```bash
cd frontend
npm install
npm run dev
```

2. Open the app in the browser. Development port may be `3000` or the next free port.

Configuration
- `NEXT_PUBLIC_API_URL` — optional. Defaults to `${window.location.origin}/api` when not set. For local backend use `http://localhost:5000/api`.

PWA / service worker
- Manifest: `public/manifest.json` (ensure `start_url` and `scope` are correct).
- Service worker: `public/sw.js` and registration in `components/ui/ServiceWorkerRegister.tsx`.
- Debug: use the `DebugInstallButton` (rendered in layout) or `window.__deferredPWAEvent` in console to trigger install flow.

Common commands
- `npm run build` — build for production
- `npm run start` — start built app (after build)

Notes
- The frontend includes client-side throttling and backoff for `429` responses in `lib/api.ts`. For local dev testing, you can clear `localStorage` keys: `api-cooldown-until`, `pwa-installed`, `pwa-ios-dismissed`.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
