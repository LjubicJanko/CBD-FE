import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const getParams = (urlParams: URLSearchParams) => {
  const res: { [key: string]: string } = {};
  urlParams.forEach((value, key) => (res[key] = value));
  return res;
};

export default function useQueryParams<
  Params extends { [K in keyof Params]?: string } = Record<string, string>
>() {
  const { search } = useLocation();
  const navigate = useNavigate();

  const getUrlSearchParams = useCallback(
    () => new URLSearchParams(window.location.search),
    []
  );

  const params = useMemo(
    () => getParams(new URLSearchParams(search)),
    [search]
  );

  const setQParam = useCallback(
    (key: keyof Params, value: string | number | string[]) => {
      const urlSP = getUrlSearchParams();
      if (urlSP.get(key as string) === value.toString()) return;
      urlSP.set(key as string, value.toString());

      navigate(
        {
          search: `?${urlSP.toString()}`,
        },
        { replace: true }
      );
    },
    [getUrlSearchParams, navigate]
  );

  const setMultipleQParams = useCallback(
    (newParams: Partial<Record<keyof Params, string | number | string[]>>) => {
      const urlSP = getUrlSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlSP.set(
            key,
            Array.isArray(value) ? value.join(',') : value.toString()
          );
        }
      });

      navigate(
        {
          search: `?${urlSP.toString()}`,
        },
        { replace: true }
      );
    },
    [getUrlSearchParams, navigate]
  );

  const removeQParam = useCallback(
    (key: keyof Params) => {
      const urlSearchParam = getUrlSearchParams();

      urlSearchParam.delete(key as string);
      navigate(
        {
          search: `?${urlSearchParam.toString()}`,
        },
        { replace: true }
      );
    },
    [getUrlSearchParams, navigate]
  );

  const removeMultipleQParams = useCallback(
    (keys: (keyof Params)[]) => {
      const urlSearchParam = getUrlSearchParams();

      keys.forEach((key) => {
        urlSearchParam.delete(key as string);
      });

      navigate(
        {
          search: `?${urlSearchParam.toString()}`,
        },
        { replace: true }
      );
    },
    [getUrlSearchParams, navigate]
  );

  return {
    params,
    setQParam,
    setMultipleQParams,
    removeQParam,
    removeMultipleQParams,
  };
}
