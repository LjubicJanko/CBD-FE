import { useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../../../hooks/useResponsiveWidth';
import { Order, OrderExecutionStatusEnum } from '../../../../types/Order';
import { xxsMax } from '../../../../util/breakpoints';
import * as Styled from './OrderInfoOverview.styles';

export type OrderInfoOverviewProps = {
  selectedOrder?: Order;
};

const OrderInfoOverview = ({ selectedOrder }: OrderInfoOverviewProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();
  const isMobile = width < xxsMax;
  const isPaused =
    selectedOrder?.executionStatus === OrderExecutionStatusEnum.PAUSED;
  const priceDifference =
    (selectedOrder?.salePrice ?? 0) - (selectedOrder?.acquisitionCost ?? 0);

  const orderInfoConfig = useMemo(
    () => [
      { label: t('order-name'), value: selectedOrder?.name },
      { label: t('description'), value: selectedOrder?.description },
      { label: t('sale-price'), value: selectedOrder?.salePrice },
      { label: t('acquisition-cost'), value: selectedOrder?.acquisitionCost },
      {
        label: t('price-difference'),
        value: priceDifference,
      },
      { label: t('paid'), value: selectedOrder?.amountPaid },
      { label: t('left-to-pay'), value: selectedOrder?.amountLeftToPay },
      {
        label: t('expected'),
        value: selectedOrder?.plannedEndingDate.toString(),
      },
    ],
    [
      selectedOrder?.acquisitionCost,
      selectedOrder?.amountLeftToPay,
      selectedOrder?.amountPaid,
      selectedOrder?.description,
      selectedOrder?.name,
      selectedOrder?.plannedEndingDate,
      selectedOrder?.salePrice,
      priceDifference,
      t,
    ]
  );

  const pausingInfoRow = useMemo(() => {
    if (!isPaused) return null;
    return isMobile ? (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong className="pause">{t('pausing-comment')}</strong>
        <span className="pause">{selectedOrder?.pausingComment}</span>
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
          {selectedOrder?.pausingComment}
        </Styled.TableCellContainer>
      </TableRow>
    );
  }, [isMobile, isPaused, selectedOrder?.pausingComment, t]);

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
