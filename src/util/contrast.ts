const HEX6 = /^#[0-9a-fA-F]{6}$/;

const channel = (hex: string, start: number): number =>
    parseInt(hex.substring(start, start + 2), 16);

/** WCAG relative luminance of a "#RRGGBB" color (0..1). */
const relativeLuminance = (hex: string): number => {
    const [r, g, b] = [1, 3, 5].map((start) => {
        const c = channel(hex, start) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * WCAG contrast ratio between two "#RRGGBB" colors, from 1 (identical) to 21
 * (black on white). Returns null if either color isn't valid 6-digit hex.
 */
export const contrastRatio = (hexA: string, hexB: string): number | null => {
    if (!HEX6.test(hexA) || !HEX6.test(hexB)) return null;
    const lA = relativeLuminance(hexA);
    const lB = relativeLuminance(hexB);
    const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
    return (lighter + 0.05) / (darker + 0.05);
};

/** WCAG AA minimum contrast ratio for normal-sized body text. */
export const MIN_TEXT_CONTRAST = 4.5;

/**
 * Floor for muted/secondary text (labels, descriptions), WCAG's threshold for
 * large text / non-text UI components. Deliberately lower than
 * `MIN_TEXT_CONTRAST`: muted text is meant to recede, not match primary text.
 */
export const MIN_MUTED_TEXT_CONTRAST = 3;

/**
 * Floor for subtle/disabled text, below WCAG AA on purpose (this tier is
 * explicitly low-emphasis), just enough that it isn't literally invisible
 * against the background.
 */
export const MIN_SUBTLE_TEXT_CONTRAST = 1.5;
