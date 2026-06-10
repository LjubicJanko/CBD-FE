import { useEffect } from 'react';
import {
    applyTenantTheme,
    restoreBaselineTheme,
} from '../styles/applyTenantTheme';

/**
 * Apply a tenant's brand theme for the lifetime of a component — used by the
 * public pages (track / home / order-extension), which theme by slug. On
 * unmount it restores the logged-in baseline (or clears for anonymous users),
 * so leaving a themed public page never strands its colors on the next screen.
 *
 * Pass `enabled = false` (e.g. tenant lacks the `theming` feature) to render in
 * the default palette regardless of any colors set.
 */
export const useApplyTenantTheme = (
    accentColor: string | null | undefined,
    backgroundColor: string | null | undefined,
    enabled: boolean
): void => {
    const accent = enabled ? accentColor ?? null : null;
    const background = enabled ? backgroundColor ?? null : null;

    useEffect(() => {
        applyTenantTheme({ accentColor: accent, backgroundColor: background });
        return () => restoreBaselineTheme();
    }, [accent, background]);
};
