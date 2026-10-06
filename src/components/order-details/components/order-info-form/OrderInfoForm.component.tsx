import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
  TextField,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { BasicDatePicker, InternalNoteCheckbox } from '../../..';
import { useIsCompanyAdmin } from '../../../../hooks/useRole';
import { orderService } from '../../../../api';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';
import {
  Order,
  OrderMutationResponse,
  orderPriorityArray,
  OrderPriorityEnum,
} from '../../../../types/Order';
import * as Styled from './OrderInfoForm.styles';
import classNames from 'classnames';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { useCanEditPrintFiles } from '../../../../hooks/useCanEditPrintFiles';
import { isSafeHttpsHref } from '../../../../util/util';
import PrintFilesLink from '../../../print-files-link/PrintFilesLink.component';
import PrintFilesEdit from '../print-files-edit/PrintFilesEdit.component';

const initialOrderData: Order = {
  id: 0,
  trackingId: '',
  name: '',
  description: '',
  note: '',
  status: 'DESIGN',
  executionStatus: 'ACTIVE',
  priority: OrderPriorityEnum.MEDIUM,
  statusHistory: [],
  postalService: '',
  postalCode: '',
  plannedEndingDate: dayjs().add(1, 'week').format('DD.MM.YYYY'),
  amountLeftToPay: 0,
  legalEntity: false,
  acquisitionCost: 0,
  salePrice: 0,
  amountPaid: 0,
  payments: [],
  pausingComment: '',
};

const OrderInfoForm = () => {
  const { t } = useTranslation();
  const { selectedOrder, applyOrderResponse } = useContext(OrdersContext);
  const { showSnackbar } = useSnackbar();
  const isAdmin = useIsCompanyAdmin();
  const canEditPrintFiles = useCanEditPrintFiles(selectedOrder);

  // Admins always see the note; others only when the response carried a string
  // (null/undefined means the note is hidden/internal).
  const isNoteVisible = isAdmin || typeof selectedOrder?.note === 'string';

  const validationSchema = Yup.object({
    name: Yup.string().required(t('validation.required.name')),
    description: Yup.string().required(t('validation.required.description')),
    salePrice: Yup.number()
      .positive(t('validation.invalid.sale-price'))
      .required(t('validation.required.sale-price'))
      .min(0),
    acquisitionCost: Yup.number()
      .positive(t('validation.invalid.acquisition-cost'))
      .required(t('validation.required.acquisition-cost'))
      .min(0),
    plannedEndingDate: Yup.mixed()
      .required(t('validation.required.plannedEndingDate'))
      .test(
        'valid-date',
        t('validation.required.plannedEndingDate'),
        (value) => Boolean(value) && dayjs(value as Dayjs | string).isValid()
      ),
  });
  const onSubmit = useCallback(
    async (values: Order, { resetForm }: FormikHelpers<Order>) => {
      try {
        // Payload rules: admin sends note + internalNote; non-admin never sends
        // internalNote and sends note only when it is visible (even if unchanged).
        // printFilesUrl is edited through its own endpoint, never via PUT /orders/{id}.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { note, internalNote, printFilesUrl, ...rest } = values;
        const res: OrderMutationResponse = await orderService.updateOrder({
          ...rest,
          ...(isAdmin
            ? { note: note ?? '', internalNote: !!internalNote }
            : isNoteVisible && { note: note ?? '' }),
          acquisitionCost: Number(values.acquisitionCost),
          salePrice: Number(values.salePrice),
          plannedEndingDate: dayjs(values.plannedEndingDate).format(
            'YYYY-MM-DD'
          ),
        });
        applyOrderResponse(res);
        resetForm({
          values,
        });
      } catch (error) {
        console.error(error);
        showSnackbar(t('order-update-failed'), 'error');
      }
    },
    [applyOrderResponse, isAdmin, isNoteVisible, showSnackbar, t]
  );

  const initialValues = useMemo(
    () =>
      selectedOrder
        ? {
            ...selectedOrder,
            ...(isAdmin && {
              note: selectedOrder.note ?? '',
              internalNote: selectedOrder.internalNote ?? false,
            }),
            plannedEndingDate: selectedOrder?.plannedEndingDate,
          }
        : initialOrderData,
    [isAdmin, selectedOrder]
  );

  const formik = useFormik<Order>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleDateChange = useCallback(
    (newValue: Dayjs | null) => {
      if (newValue) {
        formik.setFieldValue('plannedEndingDate', newValue);
      }
    },
    [formik]
  );

  return (
    <Styled.OrderInfoFormContainer
      className="order-info"
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <div className="order-info__left">
        <TextField
          className="order-info__name"
          label={t('order-name')}
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.name}
          helperText={formik.errors.name ?? ''}
          multiline
          maxRows={4}
        />
        <TextField
          className="order-info__description"
          label={t('description')}
          name="description"
          type="text"
          value={formik.values.description}
          error={!!formik.errors.description}
          helperText={formik.errors.description ?? ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
        />
        {isNoteVisible && (
          <TextField
            className={classNames('order-info__note', {
              'note--internal': isAdmin && formik.values.internalNote,
            })}
            label={t('note')}
            name="note"
            type="text"
            value={formik.values.note ?? ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.note}
            helperText={formik.errors.note ?? ''}
            multiline
          />
        )}
        {isAdmin && (
          <InternalNoteCheckbox
            checked={!!formik.values.internalNote}
            onChange={formik.handleChange}
          />
        )}
        <BasicDatePicker
          label={t('expected')}
          value={formik.values.plannedEndingDate}
          disablePast
          onChange={handleDateChange}
          errorMessage={
            typeof formik.errors.plannedEndingDate === 'string'
              ? formik.errors.plannedEndingDate
              : undefined
          }
        />
      </div>
      <div className="order-info__right">
        <TextField
          className="order-info__acquisition-cost"
          label={t('acquisition-cost')}
          type="number"
          name="acquisitionCost"
          value={formik.values.acquisitionCost ?? ''}
          error={!!formik.errors.acquisitionCost}
          helperText={formik.errors.acquisitionCost ?? ''}
          onChange={(e) =>
            formik.setFieldValue(
              'acquisitionCost',
              e.target.value === '' ? undefined : e.target.value
            )
          }
          onBlur={formik.handleBlur}
        />
        <TextField
          className="order-info__sale-price"
          label={t('sale-price')}
          type="number"
          name="salePrice"
          value={formik.values.salePrice ?? ''}
          error={!!formik.errors.salePrice}
          helperText={formik.errors.salePrice ?? ''}
          onChange={(e) =>
            formik.setFieldValue(
              'salePrice',
              e.target.value === '' ? undefined : e.target.value
            )
          }
          onBlur={formik.handleBlur}
        />
        <dl className="order-info__calculations">
          {selectedOrder?.legalEntity && (
            <>
              <dt>{t('sale-price-taxed')}:</dt>
              <dd>{selectedOrder?.salePriceWithTax} RSD</dd>
            </>
          )}
          <dt>{t('price-difference')}:</dt>
          <dd>{selectedOrder?.priceDifference} RSD</dd>
          <dt>{t('paid')}:</dt>
          <dd>{selectedOrder?.amountPaid} RSD</dd>
          <dt>{t('left-to-pay')}:</dt>
          <dd>{selectedOrder?.amountLeftToPay} RSD</dd>
          <dt>{t('is-legal-entity')}:</dt>
          <dd>
            <FormControlLabel
              label=""
              className="order-info__is-legal"
              control={
                <Checkbox
                  name="legalEntity"
                  checked={formik.values.legalEntity}
                  onChange={formik.handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
            />
          </dd>
          {selectedOrder &&
            (canEditPrintFiles ||
              isSafeHttpsHref(selectedOrder.printFilesUrl)) && (
            <>
              <dt className="order-info__print-files-label">
                {t('print-files')}:
              </dt>
              <dd className="order-info__print-files">
                {isSafeHttpsHref(selectedOrder.printFilesUrl) && (
                  <PrintFilesLink url={selectedOrder.printFilesUrl} />
                )}
                <PrintFilesEdit order={selectedOrder} />
              </dd>
            </>
          )}
          <dt>{t('priority')}</dt>
          <dd>
            <Rating
              name="priority"
              max={3}
              value={orderPriorityArray.indexOf(formik.values.priority) + 1}
              onChange={(_, newValue) => {
                if (newValue) {
                  formik.setFieldValue(
                    'priority',
                    orderPriorityArray[newValue - 1]
                  );
                }
              }}
            />
          </dd>
        </dl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="medium"
          className={classNames('order-info__save-changes', {
            'order-info__save-changes--disabled':
              !formik.isValid || !formik.dirty,
          })}
          disabled={!formik.isValid || !formik.dirty}
        >
          {t('save-changes')}
          <SaveOutlinedIcon />
        </Button>
      </div>
    </Styled.OrderInfoFormContainer>
  );
};

export default OrderInfoForm;
