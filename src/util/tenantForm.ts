// Shared helpers for tenant create/edit forms. Used by the platform CRUD
// screens (superadmin) and the tenant-details form embedded in /profile
// (client admin), so they live in /util rather than inside a single feature
// folder.

export const MAX_LOGO_BYTES = 1024 * 1024;

// MethodArgumentNotValidException can serialize in a few shapes depending on
// Spring's exception handler. Try the common ones; return null if nothing
// parses (caller falls back to the generic snackbar).
export const extractFieldErrors = (
    data: unknown
): Record<string, string> | null => {
    if (!data || typeof data !== 'object') return null;
    const body = data as Record<string, unknown>;

    // Spring default: errors: [{ field, defaultMessage }]
    if (Array.isArray(body.errors)) {
        const out: Record<string, string> = {};
        for (const entry of body.errors) {
            if (entry && typeof entry === 'object') {
                const e = entry as {
                    field?: string;
                    defaultMessage?: string;
                    message?: string;
                };
                const msg = e.defaultMessage ?? e.message;
                if (e.field && msg) out[e.field] = msg;
            }
        }
        return Object.keys(out).length ? out : null;
    }

    // ProblemDetail-style: errors: { slug: '...' }
    if (body.errors && typeof body.errors === 'object') {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(
            body.errors as Record<string, unknown>
        )) {
            if (typeof v === 'string') out[k] = v;
        }
        return Object.keys(out).length ? out : null;
    }

    // Custom map: fieldErrors: { slug: '...' }
    if (body.fieldErrors && typeof body.fieldErrors === 'object') {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(
            body.fieldErrors as Record<string, unknown>
        )) {
            if (typeof v === 'string') out[k] = v;
        }
        return Object.keys(out).length ? out : null;
    }

    return null;
};

export const validateLogoFile = (
    file: File,
    t: (key: string) => string
): string | null => {
    if (file.type !== 'image/png') {
        return t('platform.logoMustBePng');
    }
    if (file.size > MAX_LOGO_BYTES) {
        return t('platform.logoTooLarge');
    }
    return null;
};
