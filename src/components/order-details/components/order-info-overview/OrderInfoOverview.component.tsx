import { useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../../../hooks/useResponsiveWidth';
import { Order, OrderExecutionStatusEnum } from '../../../../types/Order';
import { xxsMax } from '../../../../util/breakpoints';
import * as Styled from './OrderInfoOverview.styles';

export type OrderInfoOverviewProps = {
  orderData?: Order;
};

const OrderInfoOverview = ({ orderData }: OrderInfoOverviewProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();
  const isMobile = width < xxsMax;
  const isPaused =
    orderData?.executionStatus === OrderExecutionStatusEnum.PAUSED;
  const priceDifference =
    (orderData?.salePrice ?? 0) - (orderData?.acquisitionCost ?? 0);

  const orderInfoConfig = useMemo(
    () => [
      { label: t('order-name'), value: orderData?.name },
      { label: t('description'), value: orderData?.description },
      { label: t('sale-price'), value: orderData?.salePrice },
      { label: t('acquisition-cost'), value: orderData?.acquisitionCost },
      {
        label: t('price-difference'),
        value: priceDifference,
      },
      { label: t('paid'), value: orderData?.amountPaid },
      { label: t('left-to-pay'), value: orderData?.amountLeftToPay },
      { label: t('expected'), value: orderData?.plannedEndingDate },
    ],
    [
      orderData?.acquisitionCost,
      orderData?.amountLeftToPay,
      orderData?.amountPaid,
      orderData?.description,
      orderData?.name,
      orderData?.plannedEndingDate,
      orderData?.salePrice,
      priceDifference,
      t,
    ]
  );

  const pausingInfoRow = useMemo(() => {
    if (!isPaused) return null;
    return isMobile ? (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong className="pause">{t('pausing-comment')}</strong>
        <span className="pause">{orderData?.pausingComment}</span>
      </div>
    ) : (
      <TableRow>
        <Styled.TableCellContainer
          component="th"
          scope="row"
          className="pause"
          style={{ fontWeight: 'bold', color: 'gray' }}
        >
          {t('pausing-comment')}
        </Styled.TableCellContainer>
        <Styled.TableCellContainer className="pause" style={{ color: 'gray' }}>
          {orderData?.pausingComment}
        </Styled.TableCellContainer>
      </TableRow>
    );
  }, [isMobile, isPaused, orderData?.pausingComment, t]);

  return isMobile ? (
    <Styled.MobileContainer>
      {pausingInfoRow}
      {orderInfoConfig.map((info, index) => (
        <div
          key={index}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <strong>{info.label}</strong>
          <span>{info.value}</span>
        </div>
      ))}
    </Styled.MobileContainer>
  ) : (
    <Styled.DesktopContainer>
      <Table aria-label="order info overview">
        <TableBody>
          {pausingInfoRow}
          {orderInfoConfig.map((info, index) => (
            <TableRow key={index}>
              <Styled.TableCellContainer
                component="th"
                scope="row"
                style={{ fontWeight: 'bold' }}
              >
                {info.label}
              </Styled.TableCellContainer>
              <Styled.TableCellContainer>
                {info.value}
              </Styled.TableCellContainer>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Styled.DesktopContainer>
  );
};

export default OrderInfoOverview;
