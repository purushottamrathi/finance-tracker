# PWA Verification & Troubleshooting

This file lists quick checks to diagnose why the browser's "Install / Add to Home screen" option may not appear.

1) Confirm assets are reachable

```bash
curl -I https://<your-site>/manifest.json
curl -I https://<your-site>/sw.js
```

Expected: HTTP 200 and `Content-Type: application/json` (for manifest) and `application/javascript` (for sw.js).

2) DevTools checks (Chrome)

- Open DevTools → Application → Manifest: confirm icons load, `display` is `standalone` or `fullscreen`, and there are no errors.
- Application → Service Workers: confirm a registered, activated worker is controlling the page.
- Console: look for `[SW] registering` and registration logs (see `components/ui/ServiceWorkerRegister.tsx`).

3) Service worker scope vs. start_url

- `start_url` in `manifest.json` must be within the service worker scope. By default the SW scope is `/` when `sw.js` is served at the root.
- If you deploy under a subpath, set `NEXT_PUBLIC_BASE_PATH` and ensure `ServiceWorkerRegister` computes the correct path.

4) HTTPS and production considerations

- PWAs require secure contexts (HTTPS) except for `localhost`.
- Some browsers delay the installability criteria until user engagement.

5) Use Lighthouse for a concrete checklist

- Run Lighthouse (DevTools → Lighthouse) and inspect failing PWA items.

6) Common fixes

- Ensure `manifest.json` includes 192/512 icons with correct `purpose` and reachable `src` paths.
- Ensure `sw.js` is served from the site root and is registered without errors (check Console). 404 means the file needs to be placed into `public/` or `assetPrefix`/`basePath` must be adjusted.
- Temporarily enable SW registration logs (already added to `components/ui/ServiceWorkerRegister.tsx`) and redeploy.

7) Quick local dev commands

```bash
# check sw and manifest
curl -I http://localhost:3000/manifest.json
curl -I http://localhost:3000/sw.js

# open Lighthouse from Chrome devtools and run PWA audit
```

If you want, share the deployed URL and I can run the `curl` checks and Lighthouse audit here.
