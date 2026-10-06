import { useCallback, useState } from 'react';

/**
 * 0-based page index that falls back to the first page whenever `key` (the
 * serialized filters/sort/page size) changes, without an intermediate request
 * for the old page number.
 */
export const usePageForKey = (key: string) => {
    const [state, setState] = useState({ key, page: 0 });
    const page = state.key === key ? state.page : 0;
    const setPage = useCallback(
        (nextPage: number) => setState({ key, page: nextPage }),
        [key]
    );
    return [page, setPage] as const;
};
