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

export type StatusChangeModalProps = {
  currentStatus: OrderStatus;
  isOpen?: boolean;
  orderId: number;
  setOrderData: React.Dispatch<React.SetStateAction<Order>>;
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
  setOrderData,
  onClose,
}: StatusChangeModalProps) => {
  const { t } = useTranslation();
  const { updateOrderInOverviewList } = useContext(OrdersContext);
  const initialValues: StatusData = {
    closingComment: '',
    postalCode: '',
    postalService: '',
  };
  const nextStatus = getNextStatus(currentStatus);

  const onSubmit = useCallback(
    async (statusData: StatusData) => {
      try {
        const response: Order = await orderService.changeStatus(
          orderId,
          statusData
        );
        setOrderData(response);
        updateOrderInOverviewList(response);
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
      }
    },
    [onClose, orderId, setOrderData, updateOrderInOverviewList]
  );

  const formik = useFormik<StatusData>({
    initialValues,
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            rows={4}
          />
          {currentStatus === 'SHIP_READY' && (
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
                >
                  {postServices.map((postService) => (
                    <MenuItem key={postService} value={postService}>
                      {t(postService)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                className="postal-code-input"
                label={t('postal-code')}
                name="postalCode"
                type="text"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
