import { useFormik } from 'formik';
import * as Styled from './StatusChangeModal.styles';
import { useCallback, useContext } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Order, OrderStatus } from '../../../types/Order';
import { getNextStatus } from '../../../util/util';
import { orderService } from '../../../api';
import { useTranslation } from 'react-i18next';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import * as Yup from 'yup';

export type StatusChangeModalProps = {
  currentStatus: OrderStatus;
  isOpen?: boolean;
  orderId: number;
  onClose: () => void;
};

export type StatusData = {
  closingComment?: string;
  postalCode?: string;
  postalService?: string;
};

const postServices = ['d-express', 'city-express', 'aks', 'post-express'];

const StatusChangeModal = ({
  currentStatus,
  isOpen = false,
  orderId,
  onClose,
}: StatusChangeModalProps) => {
  const { t } = useTranslation();
  const { setSelectedOrder, updateOrderInOverviewList } =
    useContext(OrdersContext);
  const initialValues: StatusData = {
    closingComment: '',
    postalCode: '',
    postalService: '',
  };

  const nextStatus = getNextStatus(currentStatus);

  const isShipReady = currentStatus === 'SHIP_READY';

  const onSubmit = useCallback(
    async (statusData: StatusData) => {
      try {
        const response: Order = await orderService.changeStatus(
          orderId,
          statusData
        );
        setSelectedOrder(response);
        updateOrderInOverviewList(response);
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
      }
    },
    [onClose, orderId, setSelectedOrder, updateOrderInOverviewList]
  );

  const validationSchema = Yup.object({
    closingComment: Yup.string().required(t('required')),
    postalCode: Yup.string().when('isShipReady', (_, schema) => {
      return isShipReady
        ? schema.required(t('required'))
        : schema.notRequired();
    }),
    postalService: Yup.string().when('isShipReady', (_, schema) => {
      return isShipReady
        ? schema.required(t('required'))
        : schema.notRequired();
    }),
  });

  const formik = useFormik<StatusData>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Styled.StatusChangeModalContainer
      title={t('move-to-next-state')}
      isOpen={isOpen}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="fields">
          <TextField
            className="comment-input"
            label={t('comment')}
            name="closingComment"
            type="text"
            value={formik.values.closingComment}
            helperText={formik.errors.closingComment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            rows={4}
          />
          {isShipReady && (
            <>
              <FormControl fullWidth>
                <InputLabel id="postal-service-input-label">
                  {t('postal-service')}
                </InputLabel>
                <Select
                  labelId="postal-service-input-label"
                  className="postal-service-input"
                  id="postal-service-input"
                  name="postalService"
                  value={formik.values.postalService}
                  label={t('postal-service')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.errors.postalService}
                >
                  {postServices.map((postService) => (
                    <MenuItem key={postService} value={postService}>
                      {postService}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.postalService && (
                <span className="postalService--error">
                  {formik.errors.postalService}
                </span>
              )}
              <TextField
                className="postal-code-input"
                label={t('postal-code')}
                name="postalCode"
                type="text"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText={formik.errors.postalCode}
              />
            </>
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="medium"
          type="submit"
          disabled={!formik.isValid}
          className="submit-button"
        >
          {t('move-to', { STATUS: t(nextStatus) })}
        </Button>
      </form>
    </Styled.StatusChangeModalContainer>
  );
};

export default StatusChangeModal;
