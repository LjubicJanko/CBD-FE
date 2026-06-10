---
name: theming-css-vars
description: How per-tenant theming works and the hard rule for the themeable color tokens
metadata:
  type: project
---

Per-tenant theming (accent + background) is implemented with **CSS custom properties**, not a dynamic styled-components ThemeProvider — because most `.styles.tsx` files import the *static* `theme` object, a dynamic provider wouldn't re-theme them.

Themeable tokens in `src/styles/theme.ts` resolve to CSS vars: `PRIMARY_1 = var(--c-bg)`, `PRIMARY_2 = var(--c-accent)`, `PRIMARY_2_HOVER = var(--c-accent-hover)`, and accent tints use `rgba(var(--c-accent-rgb), a)`. Defaults live in `globalStyles` `:root`. `applyTenantTheme()` overrides them on `document.documentElement` at runtime.

**Hard rule — when using the themeable tokens (`PRIMARY_1`, `PRIMARY_2`, `PRIMARY_2_HOVER`):**
- NEVER append a hex-alpha suffix (e.g. `${theme.PRIMARY_2}80`) — `var(--c-accent)80` is invalid CSS. Use `accentAlpha(0.5)` instead.
- NEVER pass them to canvas or SVG-attribute contexts that can't read CSS vars (QR `QRCodeCanvas` fg/bg, Leaflet `pathOptions.color`). Use the literal `DEFAULT_COLORS` export there.
- The non-themeable tokens (text/surfaces/borders/depth/semantic) stay literal hex/rgba and `withAlpha(token, a)` is fine for them.

**Why:** these are the gotchas that silently break theming. **How to apply:** reach for `accentAlpha()` for accent opacity, `DEFAULT_COLORS` for canvas/SVG, keep `withAlpha` only for non-themeable tokens.

Application points (single resolver `resolveBaselineColors`, applied by the always-mounted `TenantThemeSync`):
- Regular user: own tenant colors from `authData` (login payload), gated on `Feature.THEMING`.
- Superadmin: the IMPERSONATED tenant's colors, read reactively from `selectedTenantTheme.store` (+ `selectedTenantFeatures.store` for the gate). Persisted by `setSelectedTenant`/`recacheSelectedTenant`, so picking a tenant or saving its colors re-themes the whole superadmin session live (tenant switch is a hard reload anyway).
- Public pages: `useApplyTenantTheme` (slug tenant); restores baseline on unmount.
- Superadmin live-preview while editing in `TenantDetailsForm` (gated on the `allowColorEdit` prop).

The brand-color picker lives in /profile → "Tenant details" tab (`allowColorEdit={isSuperadmin}`), NOT the /platform/tenants/:id page. Colors are superadmin-only writes (self-service endpoint ignores them). See [[color-system]].
