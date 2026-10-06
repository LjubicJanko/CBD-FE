// The BE rejects perPage outside 1..100. The page size is fixed, like the
// orders list, so no selectable size can exceed it.
export const DEFAULT_PER_PAGE = 10;
