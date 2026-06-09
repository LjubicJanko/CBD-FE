/**
 * Tiny reactive store over the `selectedTenantFeatures` localStorage key, so a
 * superadmin's impersonated-tenant feature set can be consumed reactively via
 * `useSyncExternalStore` (see `useFeatures`).
 *
 * localStorage is not reactive and same-tab writes don't fire the `storage`
 * event, so the only writers — `localStorage.service.setSelectedTenant` /
 * `clearSelectedTenant` / `clearData` — must call `notify()` after mutating the
 * key. `getSnapshot` returns a cached array reference that only changes on
 * `notify()`, which keeps `useSyncExternalStore` stable (no render loops).
 */
const STORAGE_KEY = 'selectedTenantFeatures';

type Listener = () => void;
const listeners = new Set<Listener>();

const read = (): string[] => {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) return [];
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
        // Corrupt/legacy value — fail safe to "no features" rather than throwing
        // on every superadmin render.
        return [];
    }
};

let snapshot: string[] = read();

export const selectedTenantFeaturesStore = {
    subscribe(listener: Listener): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot(): string[] {
        return snapshot;
    },
    /** Re-read the key and notify subscribers. Call after every write. */
    notify(): void {
        snapshot = read();
        listeners.forEach((listener) => listener());
    },
};
