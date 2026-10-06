import { ReactNode, useMemo } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Rating, Table, TableBody, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useResponsiveWidth from '../../../../hooks/useResponsiveWidth';
import { useIsCompanyAdmin } from '../../../../hooks/useRole';
import {
    Order,
    OrderExecutionStatusEnum,
    orderPriorityArray,
} from '../../../../types/Order';
import { xxsMax } from '../../../../util/breakpoints';
import * as Styled from './OrderInfoOverview.styles';
import classNames from 'classnames';
import theme from '../../../../styles/theme';
import { useCanEditPrintFiles } from '../../../../hooks/useCanEditPrintFiles';
import { isSafeHttpsHref } from '../../../../util/util';
import PrintFilesLink from '../../../print-files-link/PrintFilesLink.component';
import PrintFilesEdit from '../print-files-edit/PrintFilesEdit.component';

export type OrderInfoOverviewProps = {
    selectedOrder?: Order;
};

type OrderInfoConfigType = {
    label: string;
    value: string | ReactNode | undefined;
};

const OrderInfoOverview = ({ selectedOrder }: OrderInfoOverviewProps) => {
    const { t } = useTranslation();
    const width = useResponsiveWidth();
    const isMobile = width < xxsMax;
    const isAdmin = useIsCompanyAdmin();
    const note = selectedOrder?.note;
    const isInternalNote = isAdmin && !!selectedOrder?.internalNote;
    // Admins always see the note; others only when it is a string (null or
    // undefined means hidden, so no row is rendered).
    const isNoteVisible = isAdmin || typeof note === 'string';
    const printFilesUrl = selectedOrder?.printFilesUrl;
    const canEditPrintFiles = useCanEditPrintFiles(selectedOrder);
    const isPaused =
        selectedOrder?.executionStatus === OrderExecutionStatusEnum.PAUSED;

    const orderInfoConfig: OrderInfoConfigType[] = useMemo(
        () =>
            [
                { label: t('order-name'), value: selectedOrder?.name },
                {
                    label: t('description'),
                    value: selectedOrder?.description ? (
                        <span style={{ whiteSpace: 'pre-line' }}>
                            {selectedOrder.description}
                        </span>
                    ) : undefined,
                },
                ...(isNoteVisible
                    ? [
                          {
                              label: t('note'),
                              value: (
                                  <>
                                      {isInternalNote && (
                                          <LockOutlinedIcon
                                              fontSize="small"
                                              titleAccess={t('internal-note')}
                                              className="internal-note-badge"
                                          />
                                      )}
                                      <span style={{ whiteSpace: 'pre-line' }}>
                                          {note ?? ''}
                                      </span>
                                  </>
                              ),
                          },
                      ]
                    : []),
                {
                    label: t('acquisition-cost'),
                    value: selectedOrder?.acquisitionCost,
                },
                { label: t('sale-price'), value: selectedOrder?.salePrice },
                ...(selectedOrder?.legalEntity
                    ? [
                          {
                              label: t('sale-price-taxed'),
                              value: selectedOrder?.salePriceWithTax,
                          },
                      ]
                    : []),
                {
                    label: t('price-difference'),
                    value: selectedOrder?.priceDifference,
                },
                { label: t('paid'), value: selectedOrder?.amountPaid },
                {
                    label: t('left-to-pay'),
                    value: selectedOrder?.amountLeftToPay,
                },
                {
                    label: t('expected'),
                    value: selectedOrder?.plannedEndingDate?.toString(),
                },
                {
                    label: t('priority'),
                    value: selectedOrder?.priority ? (
                        <Rating
                            readOnly
                            max={3}
                            style={{ color: theme.SECONDARY_1 }}
                            value={
                                orderPriorityArray.indexOf(
                                    selectedOrder?.priority
                                ) + 1
                            }
                        />
                    ) : (
                        ''
                    ),
                },
                ...((isSafeHttpsHref(printFilesUrl) || canEditPrintFiles) &&
                selectedOrder
                    ? [
                          {
                              label: t('print-files'),
                              value: (
                                  <>
                                      <PrintFilesLink url={printFilesUrl} />
                                      <PrintFilesEdit order={selectedOrder} />
                                  </>
                              ),
                          },
                      ]
                    : []),
            ].filter(Boolean) as OrderInfoConfigType[],
        [
            t,
            isNoteVisible,
            isInternalNote,
            note,
            printFilesUrl,
            canEditPrintFiles,
            selectedOrder,
        ]
    );

    const pausingInfoRow = useMemo(() => {
        if (!isPaused) return null;
        return isMobile ? (
            <div className="info-row">
                <strong className="pause">{t('pausing-comment')}</strong>
                <span className={classNames('pause', 'pausing-value')}>
                    {selectedOrder?.pausingComment}
                </span>
            </div>
        ) : (
            <TableRow>
                <Styled.TableCellContainer
                    component="th"
                    scope="row"
                    className="pause"
                >
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
                    <div key={index} className="info-row">
                        <strong>{info.label}</strong>
                        <span>{info.value}</span>
                    </div>
                ))}
        </Styled.MobileContainer>
    ) : (
        <Styled.DesktopContainer>
            <Table
                className="order-info-table"
                aria-label="order info overview"
            >
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
