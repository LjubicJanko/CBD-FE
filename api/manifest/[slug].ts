// Per-tenant Web App Manifest, swapped in at runtime by useApplyTenantBranding.
// Standalone (not imported from src/): a separately bundled deployment unit,
// and getLogoAbsoluteUrl (src/api/services/platform.ts) reads
// import.meta.env.VITE_API_URL, unavailable in this runtime.
export const config = { runtime: 'edge' };

// No @types/node in this project; declare just what's used.
declare const process: { env: Record<string, string | undefined> };

type PublicTenantResponse = {
    name: string;
    logoUrl: string | null;
    features: string[];
    backgroundColor: string | null;
};

// Mirrors vite.config.ts's VitePWA({ manifest: {...} }) block - keep both in sync.
const DEFAULT_MANIFEST = {
    id: '/',
    name: 'CBD',
    short_name: 'CBD',
    start_url: '/',
    display: 'standalone',
    background_color: '#2F2F2F',
    theme_color: '#2F2F2F',
    icons: [
        {
            src: '/cbd-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
        },
        {
            src: '/cbd-android-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
        },
        {
            src: '/cbd-android-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
        },
        {
            src: '/cbd-iOS-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any',
        },
    ],
};

// Standalone copy of getLogoAbsoluteUrl (src/api/services/platform.ts).
const absoluteLogoUrl = (relativePath: string | null): string | null => {
    if (!relativePath) return null;
    if (/^https?:\/\//.test(relativePath)) return relativePath;
    const base = (process.env.API_URL || '').replace(/\/+$/, '');
    const path = relativePath.startsWith('/')
        ? relativePath
        : `/${relativePath}`;
    return `${base}${path}`;
};

const jsonResponse = (body: unknown): Response =>
    new Response(JSON.stringify(body), {
        headers: {
            'Content-Type': 'application/manifest+json',
            // Branding changes rarely; cut backend load between edits.
            'Cache-Control': 'public, max-age=300, s-maxage=3600',
        },
    });

export default async function handler(request: Request): Promise<Response> {
    const slug = new URL(request.url).pathname.split('/').pop();
    if (!slug) return jsonResponse(DEFAULT_MANIFEST);

    try {
        const base = (process.env.API_URL || '').replace(/\/+$/, '');
        const tenantRes = await fetch(`${base}/public/tenants/${slug}`);
        if (!tenantRes.ok) return jsonResponse(DEFAULT_MANIFEST);

        const tenant = (await tenantRes.json()) as PublicTenantResponse;
        // 'theming' mirrors Feature.THEMING in src/util/features.ts.
        if (!tenant.features?.includes('theming')) {
            return jsonResponse(DEFAULT_MANIFEST);
        }

        const logoUrl = absoluteLogoUrl(tenant.logoUrl);

        return jsonResponse({
            id: `/${slug}`,
            name: tenant.name,
            short_name: tenant.name.slice(0, 12),
            start_url: `/${slug}`,
            display: 'standalone',
            // theme_color mirrors background_color, not the accent - matches vite.config.ts's manifest block.
            background_color:
                tenant.backgroundColor || DEFAULT_MANIFEST.background_color,
            theme_color:
                tenant.backgroundColor || DEFAULT_MANIFEST.theme_color,
            icons: logoUrl
                ? [
                      {
                          src: logoUrl,
                          sizes: 'any',
                          type: 'image/png',
                          purpose: 'any',
                      },
                  ]
                : DEFAULT_MANIFEST.icons,
        });
    } catch {
        return jsonResponse(DEFAULT_MANIFEST);
    }
}
