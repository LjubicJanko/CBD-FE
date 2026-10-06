import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import OrdersContext from '../store/OrdersProvider/Orders.context';
import useQueryParams from './useQueryParams';
import { useSnackbar } from './useSnackbar';

const ORDER_ID_PARAM = 'orderId';

const parseOrderId = (value: string | undefined): number | null => {
    if (!value || !/^\d+$/.test(value)) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

/**
 * Opens `/dashboard?orderId=<id>` once: reads the id on mount, loads only that
 * order through the context's single-order fetch, and removes the param so a
 * refresh or later filter change doesn't re-open it.
 */
export const useOrderDeepLink = () => {
    const { t } = useTranslation();
    const { params, removeQParam } = useQueryParams();
    const { setSelectedOrderId, selectedOrderError } =
        useContext(OrdersContext);
    const { showSnackbar } = useSnackbar();

    const hasConsumedRef = useRef(false);
    const linkedOrderIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (hasConsumedRef.current) return;
        hasConsumedRef.current = true;

        if (!(ORDER_ID_PARAM in params)) return;
        const orderId = parseOrderId(params[ORDER_ID_PARAM]);
        removeQParam(ORDER_ID_PARAM);
        if (orderId === null) return;
        linkedOrderIdRef.current = orderId;
        setSelectedOrderId(orderId);
        // Intentionally read once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            !selectedOrderError ||
            selectedOrderError.orderId !== linkedOrderIdRef.current
        ) {
            return;
        }
        linkedOrderIdRef.current = null;
        showSnackbar(
            t(
                selectedOrderError.status === 404
                    ? 'order-link-not-found'
                    : 'order-load-failed'
            ),
            'error'
        );
    }, [selectedOrderError, showSnackbar, t]);
};
