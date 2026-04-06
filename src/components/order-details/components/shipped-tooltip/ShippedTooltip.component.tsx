import { Button, IconButton } from '@mui/material';
import * as Styled from './ShippedTooltip.styles';
import { Order, OrderStatusEnum, OrderStatusHistory, PostServices } from '../../../../types/Order';
import { useTranslation } from 'react-i18next';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useContext, useState } from 'react';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { usePrivileges } from '../../../../hooks/usePrivileges';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { orderService } from '../../../../api';
import OrdersContext from '../../../../store/OrdersProvider/Orders.context';

export type ShippedInfoProps = {
    row: OrderStatusHistory;
    orderId: number;
};

const postServices: PostServices[] = ['d', 'city', 'aks', 'post', 'bex'];

export const ShippedInfoTooltip = ({ row, orderId }: ShippedInfoProps) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const { canEditData } = usePrivileges();
    const { selectedOrder, setSelectedOrder, updateOrderInOverviewList, updateStatusHistory } =
        useContext(OrdersContext);

    const isDone = selectedOrder?.status === OrderStatusEnum.DONE;

    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const copyCode = useCallback(() => {
        navigator.clipboard.writeText(row?.postalCode ?? '');
        showSnackbar(t('postal-code-coppied'), 'success');
    }, [row?.postalCode, showSnackbar, t]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setIsEditing(false);
    }, []);

    const validationSchema = Yup.object({
        postalCode: Yup.string().required(t('validation.required.postal-code')),
        postalService: Yup.string().required(
            t('validation.required.postal-service')
        ),
    });

    const formik = useFormik({
        initialValues: {
            postalService: row.postalService ?? '',
            postalCode: row.postalCode ?? '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (data) => {
            try {
                const response: Order = await orderService.editShipmentInfo(
                    orderId,
                    data.postalService,
                    data.postalCode
                );
                setSelectedOrder(response);
                updateOrderInOverviewList(response);
                updateStatusHistory(response?.statusHistory);
                showSnackbar(t('shipment-info-updated'), 'success');
                handleClose();
            } catch (error) {
                console.error(error);
                showSnackbar(t('shipment-info-update-error'), 'error');
            }
        },
    });

    return (
        <>
            <IconButton onClick={() => setIsOpen(true)} size="small">
                <LocalShippingIcon sx={{ color: '#D4FF00', fontSize: 20 }} />
            </IconButton>

            <Styled.ShipmentModalContainer
                title={t('shipment-info')}
                isOpen={isOpen}
                onClose={handleClose}
            >
                {!isEditing ? (
                    <div className="shipment-info">
                        <div className="shipment-info__row">
                            <span className="shipment-info__label">
                                {t('postal-service')}
                            </span>
                            <span className="shipment-info__value">
                                {t(`${row.postalService}`)}
                            </span>
                        </div>
                        <div className="shipment-info__row">
                            <span className="shipment-info__label">
                                {t('postal-code')}
                            </span>
                            <span className="shipment-info__value">
                                {row.postalCode}
                                <IconButton onClick={copyCode} size="small">
                                    <ContentCopyIcon
                                        sx={{ fontSize: 16, color: '#fff' }}
                                    />
                                </IconButton>
                            </span>
                        </div>
                        {canEditData && !isDone && (
                            <div className="shipment-info__actions">
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        backgroundColor: '#D4FF00',
                                        color: '#2F2F2F',
                                        '&:hover': {
                                            backgroundColor: '#c2eb00',
                                        },
                                    }}
                                >
                                    {t('edit')}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="fields">
                            <FormControl fullWidth>
                                <InputLabel id="edit-postal-service-label">
                                    {t('postal-service')}
                                </InputLabel>
                                <Select
                                    labelId="edit-postal-service-label"
                                    className="postal-service-input"
                                    name="postalService"
                                    value={formik.values.postalService}
                                    label={t('postal-service')}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!formik.errors.postalService}
                                >
                                    {postServices.map((ps) => (
                                        <MenuItem key={ps} value={ps}>
                                            {t(ps)}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.errors.postalService && (
                                    <p className="error">
                                        {formik.errors.postalService}
                                    </p>
                                )}
                            </FormControl>
                            <TextField
                                className="postal-code-input"
                                label={t('postal-code')}
                                name="postalCode"
                                type="text"
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                helperText={formik.errors.postalCode}
                                error={!!formik.errors.postalCode}
                            />
                        </div>
                        <div className="form-actions">
                            <Button
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="cancel-button"
                                onClick={() => {
                                    formik.resetForm();
                                    setIsEditing(false);
                                }}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                size="medium"
                                type="submit"
                                disabled={!formik.isValid || !formik.dirty}
                                className="submit-button"
                            >
                                {t('save')}
                            </Button>
                        </div>
                    </form>
                )}
            </Styled.ShipmentModalContainer>
        </>
    );
};
