import { useContext, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../../../hooks/useResponsiveWidth';
import { Order, OrderExecutionStatusEnum } from '../../../../types/Order';
import { xxsMax } from '../../../../util/breakpoints';
import * as Styled from './OrderInfoOverview.styles';
import classNames from 'classnames';
import AuthContext from '../../../../store/AuthProvider/Auth.context';

export type OrderInfoOverviewProps = {
  selectedOrder?: Order;
};

type OrderInfoConfigType = {
  label: string;
  value: string | undefined;
};

const OrderInfoOverview = ({ selectedOrder }: OrderInfoOverviewProps) => {
  const { t } = useTranslation();
  const width = useResponsiveWidth();
  const { authData } = useContext(AuthContext);
  const isMobile = width < xxsMax;
  const isPaused =
    selectedOrder?.executionStatus === OrderExecutionStatusEnum.PAUSED;

  const orderInfoConfig: OrderInfoConfigType[] = useMemo(
    () =>
      [
        { label: t('order-name'), value: selectedOrder?.name },
        authData?.roles?.includes('admin') && {
          label: t('description'),
          value: selectedOrder?.description,
        },
        { label: t('note'), value: selectedOrder?.note },
        { label: t('acquisition-cost'), value: selectedOrder?.acquisitionCost },
        { label: t('sale-price'), value: selectedOrder?.salePrice },
        ...(selectedOrder?.legalEntity
          ? [{ label: t('sale-price-taxed'), value: selectedOrder?.salePriceWithTax }]
          : []),
        {
          label: t('price-difference'),
          value: selectedOrder?.priceDifference,
        },
        { label: t('paid'), value: selectedOrder?.amountPaid },
        { label: t('left-to-pay'), value: selectedOrder?.amountLeftToPay },
        {
          label: t('expected'),
          value: selectedOrder?.plannedEndingDate.toString(),
        },
        {
          label: t('priority'),
          value: t(selectedOrder?.priority ?? '-'),
        },
      ].filter(Boolean) as OrderInfoConfigType[],
    [
      t,
      selectedOrder?.name,
      selectedOrder?.description,
      selectedOrder?.note,
      selectedOrder?.salePrice,
      selectedOrder?.acquisitionCost,
      selectedOrder?.priceDifference,
      selectedOrder?.amountPaid,
      selectedOrder?.amountLeftToPay,
      selectedOrder?.plannedEndingDate,
      selectedOrder?.priority,
      authData?.roles,
    ]
  );

  const pausingInfoRow = useMemo(() => {
    if (!isPaused) return null;
    return isMobile ? (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong className="pause">{t('pausing-comment')}</strong>
        <span className={classNames('pause', 'pausing-value')}>
          {selectedOrder?.pausingComment}
        </span>
      </div>
    ) : (
      <TableRow>
        <Styled.TableCellContainer component="th" scope="row" className="pause">
          {t('pausing-comment')}
        </Styled.TableCellContainer>
        <Styled.TableCellContainer
          className={classNames('pause', 'pausing-value')}
        >
          {selectedOrder?.pausingComment}
        </Styled.TableCellContainer>
      </TableRow>
    );
  }, [isMobile, isPaused, selectedOrder?.pausingComment, t]);

  return isMobile ? (
    <Styled.MobileContainer>
      {pausingInfoRow}
      {orderInfoConfig
        .filter((x) => x.value !== null)
        .map((info, index) => (
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
      <Table className="order-info-table" aria-label="order info overview">
        <TableBody>
          {pausingInfoRow}
          {orderInfoConfig
            .filter((x) => x.value !== null)
            .map((info, index) => (
              <TableRow key={index}>
                <Styled.TableCellContainer
                  component="th"
                  scope="row"
                  style={{ fontWeight: 'bold' }}
                >
                  {info.label}
                </Styled.TableCellContainer>
                <Styled.TableCellContainer className="value">
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
