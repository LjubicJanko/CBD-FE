import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Serve the dev server over plain HTTP by default. Opt into a self-signed HTTPS
// cert (needed for the service worker to register when accessed over the LAN IP
// rather than localhost) with `HTTPS=true npm run dev`.
// `process` is Node-only and @types/node isn't installed; declare just what we use.
declare const process: { env: Record<string, string | undefined> };
const useHttps = process.env.HTTPS === 'true';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true,
    },
    plugins: [
        react(),
        ...(useHttps ? [basicSsl()] : []),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'CBD',
                short_name: 'CBD',
                start_url: '/',
                display: 'standalone',
                // PWA manifest colors, must match theme.PRIMARY_1 in
                // src/styles/theme.ts. Kept as a literal here because this is
                // build-time Node config and can't import the runtime theme.
                background_color: '#2F2F2F',
                theme_color: '#2F2F2F',
                icons: [
                    {
                        src: 'cbd-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'cbd-android-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'cbd-android-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                    {
                        src: 'cbd-iOS-1024.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                        purpose: 'any',
                    },
                ],
            },
        }),
    ],
});
