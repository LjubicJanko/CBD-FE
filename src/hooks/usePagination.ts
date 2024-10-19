import { useCallback, useState } from 'react';
import { PaginatedResponse } from '../types/Response';

export type PaginationProps = {
  pageProp?: number;
  perPageProp?: number;
  request?: (
    params?: Record<string, string | number>
  ) => Promise<PaginatedResponse<unknown>>;

  params: Record<string, string | number>;
};

export const usePagination = (props: PaginationProps) => {
  const {
    pageProp = 0,
    perPageProp = 5,
    request = () => {},
    params = {},
  } = props;

  const [page, setPage] = useState(pageProp);
  const [perPage, setPerPage] = useState(perPageProp);

  const fetchItems = useCallback(async () => {
    if (!request) return;

    const requestParams = {
      page,
      perPage,
      ...params,
    };

    const response = await request(requestParams);

    if (!response) return;

    setPage(response.page);
    setPerPage(response.perPage);
    return response;
  }, [page, params, perPage, request]);

  return {
    fetchItems,
  };
};
