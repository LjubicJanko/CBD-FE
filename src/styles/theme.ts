import { DefaultTheme } from 'styled-components';

/**
 * Unified color system
 * =====================
 * Single source of truth for every color in the app. Nothing should hardcode a
 * hex / rgb / rgba / named color outside this file, components reference these
 * tokens (or derive an opacity variant with `withAlpha` / `accentAlpha`).
 *
 * The app is a committed DARK UI: a near-black base with a single lime brand
 * accent and neutral grays for text. On top of that sit a small, rational scale
 * of translucent surfaces / borders / overlays, and a semantic set (error /
 * success / warning) for conveying meaning. Color is only ever a SUPPORT for
 * meaning, icons/labels carry it too.
 *
 * PER-TENANT THEMING
 * ------------------
 * Five brand hues, background (`PRIMARY_1`), accent (`PRIMARY_2`, plus its
 * hover + tints), and all three text tiers (`SECONDARY_1/2/3`, primary/muted/
 * subtle), resolve to CSS custom properties (`var(--c-*)`) rather than
 * literal hex. Defaults for those vars live in `globalStyles` `:root`.
 * `applyTenantTheme()` overrides them on `document.documentElement` at
 * runtime when a tenant has the `theming` feature and a color set. Because
 * the tokens are `var()` strings, every consumer, including the many files
 * that import this static `theme` object, re-themes instantly via the CSS
 * cascade, with no per-component change. Tokens that are NOT
 * tenant-overridable (surfaces, borders, depth, semantic error/success/
 * warning) stay literal so they remain stable on any base, semantic colors
 * in particular are left alone deliberately, they signal danger/success/
 * caution the same way for every tenant, not brand identity.
 *
 * The three text tiers are gated by contrast checks against the background
 * at save time (see `TenantDetailsForm` + `util/contrast.ts`), each against
 * its own WCAG-derived floor, and each also capped below the tier above it
 * (muted <= primary, subtle <= muted) so a tenant can't pick colors that
 * invert the intended visual hierarchy even if each one passes its own
 * floor in isolation.
 *
 * KNOWN LIMITATION: SECONDARY_1/2/3 are also reused throughout the app as
 * fill/border colors, not just text (e.g. ConfirmModal fills its container
 * with SECONDARY_2 and draws its heading in SECONDARY_1; ShareLink's QR
 * container fills with SECONDARY_1). The contrast checks only validate each
 * tier against `backgroundColor`, never against every actual fill+text pair
 * that exists elsewhere in the app, so a tenant can pick colors that pass
 * validation and look fine in the live `/profile` preview yet render
 * illegibly (or make the QR code unscannable) somewhere not visible while
 * editing. Accepted as a known risk; a real fix needs separate tokens for
 * "text" vs. "fill/border" roles across the whole app, not just this form.
 *
 * NOTE: the per-status / chart categorical palette lives in `src/util/util.ts`
 * (`statusColors`), 8 distinct hues keyed by order status, intentionally
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
    text: '--c-text',
    textMuted: '--c-text-muted',
    textSubtle: '--c-text-subtle',
} as const;

/**
 * Canonical CBD brand hues, the defaults baked into `:root` and the fallback
 * whenever a tenant has no theme (or the `theming` feature is off). Also used
 * wherever a real hex is required instead of a CSS var (canvas/SVG that can't
 * read CSS variables, e.g. the QR code, the map geofence stroke).
 */
export const DEFAULT_COLORS = {
    background: '#2F2F2F',
    accent: '#D4FF00',
    accentHover: '#C2EB00',
    /** RGB channels of `accent`, for the `:root` default of `--c-accent-rgb`. */
    accentRgb: '212, 255, 0',
    text: '#FFFFFF',
    textMuted: '#979797',
    textSubtle: '#717171',
} as const;

/** rgba() built from the accent CSS-var channels, for accent opacity variants. */
export const accentAlpha = (alpha: number): string =>
    `rgba(var(${THEME_VARS.accentRgb}), ${alpha})`;

// Literal base hues for the NON-themeable tokens.
const BASE = {
    WHITE: '#FFFFFF',
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
    SECONDARY_1: `var(${THEME_VARS.text})`, // primary text (tenant-overridable)
    SECONDARY_2: `var(${THEME_VARS.textMuted})`, // muted text (tenant-overridable)
    SECONDARY_3: `var(${THEME_VARS.textSubtle})`, // subtle / disabled text (tenant-overridable)

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

    // ===== Accent tints (lime, track the accent var) =====
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
