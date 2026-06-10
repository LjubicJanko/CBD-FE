import { DefaultTheme } from 'styled-components';

/**
 * Unified color system
 * =====================
 * Single source of truth for every color in the app. Nothing should hardcode a
 * hex / rgb / rgba / named color outside this file — components reference these
 * tokens (or derive an opacity variant with `withAlpha` / `accentAlpha`).
 *
 * The app is a committed DARK UI: a near-black base with a single lime brand
 * accent and neutral grays for text. On top of that sit a small, rational scale
 * of translucent surfaces / borders / overlays, and a semantic set (error /
 * success / warning) for conveying meaning. Color is only ever a SUPPORT for
 * meaning — icons/labels carry it too.
 *
 * PER-TENANT THEMING
 * ------------------
 * The two brand hues — background (`PRIMARY_1`) and accent (`PRIMARY_2`, plus
 * its hover + tints) — resolve to CSS custom properties (`var(--c-*)`) rather
 * than literal hex. Defaults for those vars live in `globalStyles` `:root`.
 * `applyTenantTheme()` overrides them on `document.documentElement` at runtime
 * when a tenant has the `theming` feature and a color set. Because the tokens
 * are `var()` strings, every consumer — including the many files that import
 * this static `theme` object — re-themes instantly via the CSS cascade, with no
 * per-component change. Tokens that are NOT tenant-overridable (text, surfaces,
 * borders, depth, semantic) stay literal so they remain stable on any base.
 *
 * NOTE: the per-status / chart categorical palette lives in `src/util/util.ts`
 * (`statusColors`) — 8 distinct hues keyed by order status, intentionally
 * separate from this semantic theme.
 */

/** Build an rgba() string from a #RRGGBB token and an alpha in [0,1]. */
export const withAlpha = (hex: string, alpha: number): string => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * CSS custom-property names carrying the tenant-overridable hues. The accent is
 * also stored as comma-separated RGB channels (`--c-accent-rgb`) so opacity
 * variants can be expressed as `rgba(var(--c-accent-rgb), a)`.
 */
export const THEME_VARS = {
    background: '--c-bg',
    accent: '--c-accent',
    accentRgb: '--c-accent-rgb',
    accentHover: '--c-accent-hover',
} as const;

/**
 * Canonical CBD brand hues — the defaults baked into `:root` and the fallback
 * whenever a tenant has no theme (or the `theming` feature is off). Also used
 * wherever a real hex is required instead of a CSS var (canvas/SVG that can't
 * read CSS variables — e.g. the QR code, the map geofence stroke).
 */
export const DEFAULT_COLORS = {
    background: '#2F2F2F',
    accent: '#D4FF00',
    accentHover: '#C2EB00',
    /** RGB channels of `accent`, for the `:root` default of `--c-accent-rgb`. */
    accentRgb: '212, 255, 0',
} as const;

/** rgba() built from the accent CSS-var channels — for accent opacity variants. */
export const accentAlpha = (alpha: number): string =>
    `rgba(var(${THEME_VARS.accentRgb}), ${alpha})`;

// Literal base hues for the NON-themeable tokens.
const BASE = {
    WHITE: '#FFFFFF',
    GRAY: '#979797',
    GRAY_DARK: '#717171',
    SURFACE: '#3A3A3A', // opaque elevated surface
    BLACK: '#000000', // for shadows / scrims only
    RED: '#F44336', // danger
    RED_LIGHT: '#FF8A8A', // danger text on dark
    GREEN: '#66BB6A', // success
    AMBER: '#FFA500', // warning
};

const theme: DefaultTheme = {
    logo: '/cbd-logo.png',

    // ===== Brand (tenant-overridable via CSS vars) =====
    PRIMARY_1: `var(${THEME_VARS.background})`,
    PRIMARY_2: `var(${THEME_VARS.accent})`,
    PRIMARY_2_HOVER: `var(${THEME_VARS.accentHover})`,

    // ===== Neutrals / text =====
    SECONDARY_1: BASE.WHITE, // primary text
    SECONDARY_2: BASE.GRAY, // muted text
    SECONDARY_3: BASE.GRAY_DARK, // subtle / disabled text

    // ===== Surfaces (translucent white over the dark base) =====
    SURFACE_1: withAlpha(BASE.WHITE, 0.04), // subtle fill (inputs, low cards)
    SURFACE_2: withAlpha(BASE.WHITE, 0.05), // default card / panel
    SURFACE_3: withAlpha(BASE.WHITE, 0.08), // raised / hover fill
    SURFACE_4: withAlpha(BASE.WHITE, 0.12), // active / strong hover fill
    SURFACE_SOLID: BASE.SURFACE, // opaque elevated (tooltips, popovers, charts)

    // ===== Borders =====
    BORDER: withAlpha(BASE.WHITE, 0.08), // default divider / border
    BORDER_STRONG: withAlpha(BASE.WHITE, 0.2), // input hover / focus border

    // ===== Depth =====
    OVERLAY: withAlpha(BASE.BLACK, 0.6), // modal scrim / image overlay
    SHADOW: withAlpha(BASE.BLACK, 0.2), // default elevation shadow
    SHADOW_STRONG: withAlpha(BASE.BLACK, 0.4), // modal / strong elevation shadow

    // ===== Accent tints (lime — track the accent var) =====
    ACCENT_SUBTLE: accentAlpha(0.04), // faint accent fill
    ACCENT_SOFT: accentAlpha(0.1), // selected / hover accent fill

    // ===== Semantic =====
    ERROR: BASE.RED, // danger: icons, solid chips, borders
    ERROR_TEXT: BASE.RED_LIGHT, // danger text on dark surfaces
    ERROR_SOFT: withAlpha(BASE.RED, 0.12), // danger tint / fill
    SUCCESS: BASE.GREEN, // positive: icons, text
    SUCCESS_SOFT: withAlpha(BASE.GREEN, 0.12), // positive tint / fill
    WARNING: BASE.AMBER, // caution: icons, solid chips, borders
    WARNING_SOFT: withAlpha(BASE.AMBER, 0.15), // caution tint / fill
};

export default theme;
