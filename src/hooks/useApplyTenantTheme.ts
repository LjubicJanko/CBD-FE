import { useEffect } from 'react';
import {
    applyTenantTheme,
    restoreBaselineTheme,
    TenantThemeColors,
} from '../styles/applyTenantTheme';

/**
 * Apply a tenant's brand theme for the lifetime of a component, used by the
 * public pages (track / home / order-extension), which theme by slug. On
 * unmount it restores the logged-in baseline (or clears for anonymous users),
 * so leaving a themed public page never strands its colors on the next screen.
 *
 * Pass `enabled = false` (e.g. tenant lacks the `theming` feature) to render in
 * the default palette regardless of any colors set.
 */
export const useApplyTenantTheme = (
    colors: TenantThemeColors,
    enabled: boolean
): void => {
    const accent = enabled ? colors.accentColor ?? null : null;
    const background = enabled ? colors.backgroundColor ?? null : null;
    const text = enabled ? colors.textColor ?? null : null;
    const mutedText = enabled ? colors.mutedTextColor ?? null : null;
    const subtleText = enabled ? colors.subtleTextColor ?? null : null;

    useEffect(() => {
        applyTenantTheme({
            accentColor: accent,
            backgroundColor: background,
            textColor: text,
            mutedTextColor: mutedText,
            subtleTextColor: subtleText,
        });
        return () => restoreBaselineTheme();
    }, [accent, background, text, mutedText, subtleText]);
};
