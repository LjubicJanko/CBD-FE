// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        logo: string;

        // Brand
        PRIMARY_1: string;
        PRIMARY_2: string;
        PRIMARY_2_HOVER: string;

        // Neutrals / text
        SECONDARY_1: string;
        SECONDARY_2: string;
        SECONDARY_3: string;

        // Surfaces
        SURFACE_1: string;
        SURFACE_2: string;
        SURFACE_3: string;
        SURFACE_4: string;
        SURFACE_SOLID: string;

        // Borders
        BORDER: string;
        BORDER_STRONG: string;

        // Depth
        OVERLAY: string;
        SHADOW: string;
        SHADOW_STRONG: string;

        // Accent tints
        ACCENT_SUBTLE: string;
        ACCENT_SOFT: string;

        // Semantic
        ERROR: string;
        ERROR_TEXT: string;
        ERROR_SOFT: string;
        SUCCESS: string;
        SUCCESS_SOFT: string;
        WARNING: string;
        WARNING_SOFT: string;
    }
}
