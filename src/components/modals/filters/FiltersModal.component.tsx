import { Button, Divider } from '@mui/material';
import classNames from 'classnames';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useQueryParams from '../../../hooks/useQueryParams';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import {
  OrderStatus,
  orderStatusArray,
  OrderStatusEnum,
} from '../../../types/Order';
import * as Styled from './FiltersModal.styles';

export type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ButtonVariants = {
  [key: string]: boolean;
};

const FiltersModal = ({ isOpen, onClose }: FiltersModalProps) => {
  const { t } = useTranslation();
  const { setSelectedOrderId } = useContext(OrdersContext);
  const { params, setMultipleQParams, removeMultipleQParams } =
    useQueryParams();

  const initialVariants: ButtonVariants = useMemo(
    () => ({
      DESIGN: 'DESIGN' in params,
      PRINT_READY: 'PRINT_READY' in params,
      PRINTING: 'PRINTING' in params,
      SEWING: 'SEWING' in params,
      SHIP_READY: 'SHIP_READY' in params,
      SHIPPED: 'SHIPPED' in params,
      DONE: 'DONE' in params,
    }),
    [params]
  );

  const [selectedStatuses, setSelectedStatuses] = useState(initialVariants);

  const filterButtonsConfig: {
    label: string;
    key: OrderStatus;
    variant: 'contained' | 'outlined';
  }[] = useMemo(
    () => [
      {
        label: t('DESIGN'),
        key: 'DESIGN',
        variant: selectedStatuses[OrderStatusEnum.DESIGN]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('PRINT_READY'),
        key: 'PRINT_READY',
        variant: selectedStatuses[OrderStatusEnum.PRINT_READY]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('PRINTING'),
        key: 'PRINTING',
        variant: selectedStatuses[OrderStatusEnum.PRINTING]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('SEWING'),
        key: 'SEWING',
        variant: selectedStatuses[OrderStatusEnum.SEWING]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('SHIP_READY'),
        key: 'SHIP_READY',
        variant: selectedStatuses[OrderStatusEnum.SHIP_READY]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('SHIPPED'),
        key: 'SHIPPED',
        variant: selectedStatuses[OrderStatusEnum.SHIPPED]
          ? 'contained'
          : 'outlined',
      },
      {
        label: t('DONE'),
        key: 'DONE',
        variant: selectedStatuses[OrderStatusEnum.DONE]
          ? 'contained'
          : 'outlined',
      },
    ],
    [selectedStatuses, t]
  );

  const toggleVariant = useCallback((key: OrderStatus) => {
    setSelectedStatuses((old) => ({
      ...old,
      [key]: !old[key],
    }));
  }, []);

  const clearAllStatuses = useCallback(() => {
    setSelectedStatuses((old) =>
      Object.keys(old).reduce((acc, key) => {
        acc[key as OrderStatus] = false;
        return acc;
      }, {} as ButtonVariants)
    );
  }, []);

  const updateQParams = useCallback(() => {
    removeMultipleQParams(orderStatusArray);

    const activeStatuses = Object.entries(selectedStatuses)
      .filter(([, isActive]) => isActive)
      .reduce((acc, [key]) => ({ ...acc, [key]: 'true' }), {});

    setSelectedOrderId(0);
    setMultipleQParams(activeStatuses);
    onClose();
  }, [
    onClose,
    removeMultipleQParams,
    selectedStatuses,
    setMultipleQParams,
    setSelectedOrderId,
  ]);

  return (
    <Styled.FiltersModalContainer
      title={t('filters')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="statuses">
        {filterButtonsConfig.map(({ key, label, variant }) => (
          <Button
            key={key}
            className={classNames('filter-button', key)}
            variant={variant}
            onClick={() => toggleVariant(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Divider />
      <div className="actions">
        <Button variant="outlined" color="info" onClick={clearAllStatuses}>
          {t('clear')}
        </Button>
        <Button variant="contained" color="secondary" onClick={updateQParams}>
          {t('apply')}
        </Button>
      </div>
    </Styled.FiltersModalContainer>
  );
};

export default FiltersModal;
