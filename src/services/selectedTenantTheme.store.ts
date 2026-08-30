/**
 * Reactive store over the selected-tenant brand colors in localStorage, the
 * theme counterpart to `selectedTenantFeatures.store`. Lets a superadmin's
 * impersonated-tenant colors be consumed reactively (see `TenantThemeSync`), so
 * picking/saving a tenant's colors re-themes the session without a reload.
 *
 * Same contract as the features store: the only writers, `setSelectedTenant` /
 * `clearSelectedTenant` / `clearData` in localStorage.service, must call
 * `notify()` after mutating the keys. `getSnapshot` returns a cached reference
 * that only changes on `notify()`, keeping `useSyncExternalStore` stable.
 */
export type SelectedTenantTheme = {
    accentColor: string | null;
    backgroundColor: string | null;
    textColor: string | null;
    mutedTextColor: string | null;
    subtleTextColor: string | null;
};

const ACCENT_KEY = 'selectedTenantAccentColor';
const BACKGROUND_KEY = 'selectedTenantBackgroundColor';
const TEXT_KEY = 'selectedTenantTextColor';
const MUTED_TEXT_KEY = 'selectedTenantMutedTextColor';
const SUBTLE_TEXT_KEY = 'selectedTenantSubtleTextColor';

type Listener = () => void;
const listeners = new Set<Listener>();

const read = (): SelectedTenantTheme => ({
    accentColor: localStorage.getItem(ACCENT_KEY),
    backgroundColor: localStorage.getItem(BACKGROUND_KEY),
    textColor: localStorage.getItem(TEXT_KEY),
    mutedTextColor: localStorage.getItem(MUTED_TEXT_KEY),
    subtleTextColor: localStorage.getItem(SUBTLE_TEXT_KEY),
});

let snapshot: SelectedTenantTheme = read();

export const selectedTenantThemeStore = {
    subscribe(listener: Listener): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot(): SelectedTenantTheme {
        return snapshot;
    },
    /** Re-read the keys and notify subscribers. Call after every write. */
    notify(): void {
        snapshot = read();
        listeners.forEach((listener) => listener());
    },
    ACCENT_KEY,
    BACKGROUND_KEY,
    TEXT_KEY,
    MUTED_TEXT_KEY,
    SUBTLE_TEXT_KEY,
};
