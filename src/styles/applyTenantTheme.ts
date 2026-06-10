import { DEFAULT_COLORS, THEME_VARS } from './theme';
import localStorageService from '../services/localStorage.service';
import { selectedTenantFeaturesStore } from '../services/selectedTenantFeatures.store';
import { selectedTenantThemeStore } from '../services/selectedTenantTheme.store';
import { Feature } from '../util/features';

/**
 * Runtime per-tenant theming.
 *
 * Overrides the brand CSS custom properties on `document.documentElement` so the
 * whole app re-themes via the cascade (see the THEMING note in `theme.ts`).
 * Passing `null`, or a tenant without colors, removes the overrides and the
 * `:root` defaults (the canonical CBD palette) take over again.
 *
 * Only valid 6-digit hex is applied; anything else is ignored for that channel
 * (the backend validates the same `^#[0-9A-Fa-f]{6}$` shape, this is defence in
 * depth so a bad value can never paint an invalid var).
 */

const HEX6 = /^#[0-9a-fA-F]{6}$/;

const channel = (hex: string, start: number): number =>
    parseInt(hex.substring(start, start + 2), 16);

/** "#RRGGBB" -> "r, g, b" (for the --c-accent-rgb var), or null if invalid. */
const hexToRgbChannels = (hex: string): string | null => {
    if (!HEX6.test(hex)) return null;
    return `${channel(hex, 1)}, ${channel(hex, 3)}, ${channel(hex, 5)}`;
};

const toHex = (n: number): string =>
    Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, '0');

/** Darken a hex color toward black by `amount` (0..1). */
const darken = (hex: string, amount: number): string => {
    if (!HEX6.test(hex)) return hex;
    const f = 1 - amount;
    return `#${toHex(channel(hex, 1) * f)}${toHex(channel(hex, 3) * f)}${toHex(
        channel(hex, 5) * f
    )}`;
};

export type TenantThemeColors = {
    accentColor?: string | null;
    backgroundColor?: string | null;
};

export const applyTenantTheme = (colors: TenantThemeColors | null): void => {
    const root = document.documentElement;
    const set = (name: string, value: string | null) =>
        value
            ? root.style.setProperty(name, value)
            : root.style.removeProperty(name);

    const accent =
        colors?.accentColor && HEX6.test(colors.accentColor)
            ? colors.accentColor
            : null;
    const background =
        colors?.backgroundColor && HEX6.test(colors.backgroundColor)
            ? colors.backgroundColor
            : null;

    set(THEME_VARS.background, background);
    set(THEME_VARS.accent, accent);
    set(THEME_VARS.accentRgb, accent ? hexToRgbChannels(accent) : null);
    set(
        THEME_VARS.accentHover,
        accent ? darken(accent, 0.1) : null
    );
};

/** The default (un-themed) accent hover, exposed for parity / tests. */
export const defaultAccentHover = DEFAULT_COLORS.accentHover;

/**
 * The theme that SHOULD be active for the current session, gated on `theming`:
 *  - superadmin: the impersonated (selected) tenant's colors;
 *  - regular user: their own tenant's colors from cached auth;
 *  - anonymous / no theming / no tenant: null (defaults take over).
 *
 * Single source of truth shared by `TenantThemeSync` (the always-mounted
 * applier) and `restoreBaselineTheme` (the cleanup after a transient override
 * such as a public page or the picker's live preview).
 */
export const resolveBaselineColors = (): TenantThemeColors | null => {
    const auth = localStorageService.authData;
    if (auth?.superadmin) {
        const features = selectedTenantFeaturesStore.getSnapshot();
        if (!features.includes(Feature.THEMING)) return null;
        return selectedTenantThemeStore.getSnapshot();
    }
    const features = auth?.features;
    if (!Array.isArray(features) || !features.includes(Feature.THEMING)) {
        return null;
    }
    return {
        accentColor: auth?.tenantAccentColor,
        backgroundColor: auth?.tenantBackgroundColor,
    };
};

/**
 * Re-apply the session baseline (see `resolveBaselineColors`). Used as the
 * unmount cleanup for a transient override (public page, picker preview) so the
 * correct theme is not lost afterwards.
 */
export const restoreBaselineTheme = (): void => {
    applyTenantTheme(resolveBaselineColors());
};
