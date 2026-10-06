import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Runs a report request whenever `fetcher` changes (so callers memoize it with
 * useCallback over their filters) and `enabled` is true. Late responses of a
 * superseded request are dropped. A 403 means the caller is not an admin and
 * sends them back to /reports; any other failure becomes `hasError` with a
 * `retry` that re-runs the request.
 */
export const useReportRequest = <T>(
    fetcher: () => Promise<T>,
    enabled: boolean
) => {
    const navigate = useNavigate();
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }
        let isCurrent = true;
        setIsLoading(true);
        setHasError(false);
        fetcher()
            .then((response) => {
                if (isCurrent) setData(response);
            })
            .catch((error) => {
                if (!isCurrent) return;
                console.error(error);
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 403
                ) {
                    navigate('/reports', { replace: true });
                    return;
                }
                setHasError(true);
            })
            .finally(() => {
                if (isCurrent) setIsLoading(false);
            });
        return () => {
            isCurrent = false;
        };
    }, [fetcher, enabled, attempt, navigate]);

    const retry = useCallback(() => setAttempt((old) => old + 1), []);

    return { data, isLoading, hasError, retry };
};
