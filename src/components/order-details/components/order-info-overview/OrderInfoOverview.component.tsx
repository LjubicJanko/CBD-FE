import React, { useMemo } from 'react';
import { Order } from '../../../../types/Order';
import * as Styled from './OrderInfoOverview.styles';
import { useTranslation } from 'react-i18next';

export type OrderInfoOverviewProps = {
  orderData?: Order;
};

const OrderInfoOverview = ({ orderData }: OrderInfoOverviewProps) => {
  const { t } = useTranslation();

  const orderInfoConfig = useMemo(
    () => [
      {
        label: t('order-name'),
        value: orderData?.name,
      },
      {
        label: t('description'),
        value: orderData?.description,
      },
      {
        label: t('sale-price'),
        value: orderData?.salePrice,
      },
      {
        label: t('acquisition-cost'),
        value: orderData?.acquisitionCost,
      },
    ],
    [
      orderData?.acquisitionCost,
      orderData?.description,
      orderData?.name,
      orderData?.salePrice,
      t,
    ]
  );

  return (
    <Styled.OrderInfoOverviewContainer>
      {orderInfoConfig.map((orderInfo, index) => (
        <React.Fragment key={index}>
          <dt>{orderInfo.label}</dt>
          <dd>{orderInfo.value}</dd>
        </React.Fragment>
      ))}
    </Styled.OrderInfoOverviewContainer>
  );
};

export default OrderInfoOverview;
