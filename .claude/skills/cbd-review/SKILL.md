---
name: cbd-review
description: Review the current git diff against CBD-FE's own conventions (React 18 + TS + Vite, styled-components, Context state, Axios service layer, i18n, multi-tenant/privilege rules). Use when the user asks to review changes, a PR, or a branch for this project specifically. For a generic bug/cleanup pass, prefer the built-in /code-review.
---

# CBD-FE Code Review

Review the working-tree changes against this project's conventions and likely bug classes. This skill encodes CBD-FE-specific rules, it complements, not replaces, the built-in `/code-review` (use that for broad correctness sweeps).

## Step 1, Scope the diff

Determine what changed. Default to the uncommitted working tree; if the user named a branch or PR, diff against `main`.

```
git status --short
git diff --stat
git diff            # staged + unstaged; add --cached if only staged matters
```

Read every changed file in full (not just the hunk) before forming findings, context outside the diff often determines whether a change is correct.

## Step 2, Review against these dimensions

Walk each changed file through the checklist below. Only report a finding when you can name the file:line and explain the concrete consequence. Skip dimensions that don't apply.

### Correctness & bugs (highest priority)
- Logic errors, off-by-one, inverted conditions, unhandled `null`/`undefined`.
- `useEffect` / `useMemo` / `useCallback` dependency arrays, missing or stale deps (the repo runs `react-hooks/recommended`, so flag what the linter would).
- Async: unawaited promises, missing `.catch`, race conditions, state updates after unmount.
- Promise chains in the service layer return `res.data`, verify the typed return actually matches the backend shape.

### Multi-tenant & auth (this app's sharpest edges)
- **Privilege gating**: UI actions and routes must be guarded with `useHasPrivilege` / `ProtectedRoute`. A new mutating action without a privilege check is a finding.
- **Superadmin vs regular user**: superadmins impersonate tenants via the `X-Tenant-Id` header (see `src/api/privateClient.tsx`). Regular users are bound to their JWT tenant. New tenant-scoped calls must not assume a selected tenant for non-superadmins.
- **Tenant-context-loss handling**: 403/410 responses have special recovery logic in `privateClient`. New error handling should not swallow or duplicate it.
- **Token expiry**: 498 → `authBus.emit('token-expired')` + clear localStorage. Don't reinvent this path.
- Per a recent commit, superadmin password change is forbidden, don't reintroduce it.

### API / service layer
- New API calls belong in `src/api/services/*.ts`, using `client` (public) or `privateClient` (authenticated), not inline `axios` in components.
- `null` vs omitted field semantics matter to the BE (e.g. `socialLink?: SocialLink | null` in `platform.ts`: omit = unchanged, `null` = clear). Preserve that distinction.
- Use `import.meta.env.VITE_API_URL` for the base URL; never hardcode hosts.

### State management (Context, no Redux)
- State lives in the five providers (Auth, Orders, Banner, Snackbar, Router). New cross-component state should extend a provider, not prop-drill or duplicate.
- Watch for unnecessary re-renders: context values that aren't memoized, new object/array literals passed as values each render.

### i18n
- No user-facing hardcoded strings, every label goes through `react-i18next` (`t('...')`).
- New keys must exist in **both** `public/locales/en/translation.json` and `public/locales/rs/translation.json` (fallback language is `rs`). A key added to only one is a finding.

### Styling & conventions
- Styled-components live in the sibling `.styles.tsx` file, imported into `.component.tsx`, not defined inline in the component.
- Theme tokens (`#2F2F2F` bg, `#D4FF00` accent) come from `src/styles/theme.ts`; flag hardcoded hex that duplicates a theme value.
- File naming: `ComponentName.component.tsx`, `ComponentName.styles.tsx`, `Entity.context.ts`, `Entity.provider.tsx`.
- Prettier: single quotes, 4-space indent, trailing commas (es5), semicolons. TS strict, no unused locals/params (build will fail on these).

### Reuse & simplification
- Duplicated logic that an existing hook (`src/hooks/`) or util (`src/util/`) already covers.
- Over-complex conditionals, dead code, redundant state.

## Step 3, Report

Group findings by severity:
- **🔴 Bug / correctness**, will misbehave; fix before merge.
- **🟡 Convention / risk**, violates a project rule above or is a latent hazard.
- **🟢 Cleanup**, reuse/simplification, optional.

For each: `path:line` (as a clickable markdown link), one-line problem statement, and a concrete suggested fix. If the diff is clean, say so plainly rather than inventing nits.

Do not edit files unless the user asks you to apply fixes.
