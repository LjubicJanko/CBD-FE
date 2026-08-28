// Slugs that collide with FE routes or BE path prefixes. Backend enforces
// these on tenant creation; the FE list exists for two reasons:
//   1. Snappier validation on the Platform create-tenant form.
//   2. Defensive rendering, if a tenant somehow gets created with one of
//      these slugs (or someone visits /<reserved> manually), public pages
//      treat it as not-found instead of firing a doomed API call.
export const RESERVED_SLUGS = [
    'platform',
    'login',
    'dashboard',
    'profile',
    'reports',
    'createOrder',
    'track',
    'order-extension',
    'select-tenant',
    'api',
    'public',
    'banners',
    'orders',
    'orderExtend',
    'assets',
    'locales',
];

export const isReservedSlug = (slug: string | null | undefined): boolean =>
    Boolean(slug) && RESERVED_SLUGS.includes(slug as string);
