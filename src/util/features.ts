/**
 * Per-tenant premium feature/module system.
 *
 * Features are a tenant-level capability layer that sits ABOVE the per-user
 * `privileges` layer: if a tenant doesn't have a feature, it is hidden for
 * EVERYONE in that tenant regardless of their individual privileges. The
 * effective gate is `tenantHasFeature(F) && userHasPrivilege(P)`.
 *
 * NOTE: FE gating is cosmetic. The backend is the real security boundary and
 * must reject (403) feature-bound requests for tenants lacking the feature.
 *
 * Defaults are backend-owned (seeded on tenant creation), they intentionally
 * do NOT live here, to avoid drifting from the authoritative source.
 */
export enum Feature {
  ORDERS = 'orders', // order management + payments
  ORDER_EXTENSION = 'order-extension',
  BANNERS = 'banners',
  ATTENDANCE = 'attendance', // check-in/out + attendance overview + locations
  // GPS/geofence check-in specifically (still beta), QR is the default,
  // always-on check-in method under `attendance`; GEOFENCE is the older,
  // more failure-prone path (permission prompts, spoofable via mock-location,
  // device accuracy) and needs this separate opt-in. A location-level knob
  // (WorkLocation.checkInMethod) gated by a tenant-level capability, same
  // dependency shape as order-extension -> orders. The backend enforces this
  // on POST/PATCH /locations when checkInMethod is being set/switched to
  // GEOFENCE; an already-GEOFENCE location stays fully editable even if this
  // is later disabled, only a NEW switch into GEOFENCE is blocked. Like its
  // parent, this dependency is FE-only form nesting: the backend doesn't
  // cross-validate that ATTENDANCE is also enabled.
  ATTENDANCE_GEOFENCE = 'attendance-geofence',
  REPORTS = 'reports',
  THEMING = 'theming', // per-tenant brand colors (accent + background)
}

export type FeatureCatalogEntry = {
  key: Feature;
  labelKey: string; // i18n key for the toggle label
  descriptionKey: string; // i18n key for the toggle helper text
};

/**
 * Ordered list of every feature, drives the superadmin toggle list so all
 * features render even when a tenant's `features[]` omits some keys. The order
 * also defines module precedence for `firstEnabledModuleRoute`.
 */
export const FEATURE_CATALOG: FeatureCatalogEntry[] = [
  {
    key: Feature.ORDERS,
    labelKey: 'feature-orders-label',
    descriptionKey: 'feature-orders-description',
  },
  {
    key: Feature.ORDER_EXTENSION,
    labelKey: 'feature-order-extension-label',
    descriptionKey: 'feature-order-extension-description',
  },
  {
    key: Feature.BANNERS,
    labelKey: 'feature-banners-label',
    descriptionKey: 'feature-banners-description',
  },
  {
    key: Feature.ATTENDANCE,
    labelKey: 'feature-attendance-label',
    descriptionKey: 'feature-attendance-description',
  },
  {
    key: Feature.ATTENDANCE_GEOFENCE,
    labelKey: 'feature-attendance-geofence-label',
    descriptionKey: 'feature-attendance-geofence-description',
  },
  {
    key: Feature.REPORTS,
    labelKey: 'feature-reports-label',
    descriptionKey: 'feature-reports-description',
  },
  {
    key: Feature.THEMING,
    labelKey: 'feature-theming-label',
    descriptionKey: 'feature-theming-description',
  },
];

export const hasFeature = (features: string[], feature: Feature): boolean =>
  features.includes(feature);

/**
 * Prerequisite features. A feature may only be enabled while ALL of its
 * prerequisites are enabled; disabling a prerequisite cascades its dependents
 * off. Independent features are simply absent from this map.
 *
 *  - order-extension (public order requests) builds on order management.
 *  - reports analyse orders, so they need the orders module too.
 */
export const FEATURE_DEPENDENCIES: Partial<Record<Feature, Feature[]>> = {
  [Feature.ORDER_EXTENSION]: [Feature.ORDERS],
  [Feature.REPORTS]: [Feature.ORDERS],
  [Feature.ATTENDANCE_GEOFENCE]: [Feature.ATTENDANCE],
};

/** Prerequisites of `feature` that are not currently enabled. */
export const getMissingDependencies = (
  feature: Feature,
  features: string[]
): Feature[] => {
  const deps = FEATURE_DEPENDENCIES[feature] ?? [];
  return deps.filter((dep) => !features.includes(dep));
};

/** True when every prerequisite of `feature` is enabled. */
export const dependenciesMet = (
  feature: Feature,
  features: string[]
): boolean => getMissingDependencies(feature, features).length === 0;

/**
 * The next enabled-feature set after toggling `key`:
 *  - enabling is rejected (returns the input unchanged) when a prerequisite is
 *    missing, the UI also disables such a switch, this is the safety net;
 *  - disabling cascades off every feature that (transitively) depends on `key`,
 *    so the set can never end up in an inconsistent state.
 */
export const applyFeatureToggle = (
  current: string[],
  key: Feature,
  enabled: boolean
): string[] => {
  if (enabled) {
    if (!dependenciesMet(key, current)) return current;
    return current.includes(key) ? current : [...current, key];
  }
  const toRemove = new Set<string>([key]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const feature of Object.keys(FEATURE_DEPENDENCIES) as Feature[]) {
      if (toRemove.has(feature)) continue;
      const deps = FEATURE_DEPENDENCIES[feature] ?? [];
      if (deps.some((dep) => toRemove.has(dep))) {
        toRemove.add(feature);
        changed = true;
      }
    }
  }
  return current.filter((feature) => !toRemove.has(feature));
};

/**
 * Private landing page per feature, in catalog precedence order. Features
 * without a standalone private landing page (e.g. order-extension is public,
 * banners live inside /profile) are intentionally omitted.
 */
const FEATURE_LANDING_ROUTE: Partial<Record<Feature, string>> = {
  [Feature.ORDERS]: '/dashboard',
  [Feature.ATTENDANCE]: '/attendance',
  [Feature.REPORTS]: '/reports',
};

/**
 * Post-login / fallback landing route for a regular user when `orders` (the
 * usual /dashboard landing) is disabled, e.g. a customer who bought only the
 * attendance module. Walks the catalog in order and returns the first enabled
 * module that has a private landing page, falling back to '/profile'.
 *
 * MUST NOT be used for superadmin (who has no `authData.features` and lands on
 * /select-tenant -> /platform), callers guard on `!superadmin`.
 */
export const firstEnabledModuleRoute = (features: string[]): string => {
  for (const { key } of FEATURE_CATALOG) {
    const route = FEATURE_LANDING_ROUTE[key];
    if (route && features.includes(key)) return route;
  }
  return '/profile';
};
