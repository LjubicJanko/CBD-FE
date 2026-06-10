import { DefaultTheme } from 'styled-components';

/**
 * Unified color system
 * =====================
 * Single source of truth for every color in the app. Nothing should hardcode a
 * hex / rgb / rgba / named color outside this file — components reference these
 * tokens (or derive an opacity variant with `withAlpha`) so the palette stays
 * consistent and tweakable from one place.
 *
 * The app is a committed DARK UI: a near-black base with a single lime brand
 * accent and neutral grays for text. On top of that sit a small, rational scale
 * of translucent surfaces / borders / overlays, and a semantic set (error /
 * success / warning) for conveying meaning. Per accessibility guidance, color
 * is only ever a SUPPORT for meaning — icons/labels carry it too.
 *
 * Token groups:
 *  - Brand:     PRIMARY_1 (base bg), PRIMARY_2 (accent) + accent hover
 *  - Neutrals:  SECONDARY_1..3 (text from primary -> subtle)
 *  - Surfaces:  SURFACE_1..4 (translucent elevation) + SURFACE_SOLID (opaque)
 *  - Lines:     BORDER, BORDER_STRONG
 *  - Depth:     OVERLAY (scrims), SHADOW / SHADOW_STRONG (elevation)
 *  - Accent FX: ACCENT_SUBTLE, ACCENT_SOFT (lime tints)
 *  - Semantic:  ERROR(/_TEXT/_SOFT), SUCCESS(/_SOFT), WARNING(/_SOFT)
 *
 * For a one-off opacity not covered by a token, use `withAlpha(theme.TOKEN, a)`
 * rather than writing a raw rgba — it still derives from a defined base color.
 *
 * NOTE: the per-status / chart categorical palette lives in `src/util/util.ts`
 * (`statusColors`) — 8 distinct hues keyed by order status. It is intentionally
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

// Base hues — the only literal colors in the codebase.
const BASE = {
    NEAR_BLACK: '#2F2F2F', // app background
    ACCENT: '#D4FF00', // lime brand
    ACCENT_DARK: '#C2EB00', // lime brand, pressed/hover
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

    // ===== Brand =====
    PRIMARY_1: BASE.NEAR_BLACK,
    PRIMARY_2: BASE.ACCENT,
    PRIMARY_2_HOVER: BASE.ACCENT_DARK,

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

    // ===== Accent tints (lime) =====
    ACCENT_SUBTLE: withAlpha(BASE.ACCENT, 0.04), // faint accent fill
    ACCENT_SOFT: withAlpha(BASE.ACCENT, 0.1), // selected / hover accent fill

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
