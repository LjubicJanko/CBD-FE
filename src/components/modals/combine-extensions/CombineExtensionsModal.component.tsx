import { Button, CircularProgress, IconButton, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../../api';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import { Order } from '../../../types/Order';
import { OrderContactInfo } from '../../../types/OrderExtension';
import { useSnackbar } from '../../../hooks/useSnackbar';
import * as Styled from './CombineExtensionsModal.styles';

type CombineExtensionsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentOrder: Order;
};

type ResultFields = {
    name: string;
    description: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    zipCode: string;
    city: string;
};

const CONTACT_FIELDS: (keyof OrderContactInfo)[] = [
    'fullName',
    'phoneNumber',
    'address',
    'zipCode',
    'city',
];

const ALL_FIELDS: (keyof ResultFields)[] = [
    'name',
    'description',
    ...CONTACT_FIELDS,
];

const getOrderFieldValue = (order: Order, field: keyof ResultFields): string => {
    if (field === 'name' || field === 'description') {
        return order[field] ?? '';
    }
    return order.contactInfo?.[field as keyof OrderContactInfo] ?? '';
};

const CombineExtensionsModal = ({
    isOpen,
    onClose,
    currentOrder,
}: CombineExtensionsModalProps) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const { setSelectedOrderId, fetchOrders } = useContext(OrdersContext);

    const [extensions, setExtensions] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedExtension, setSelectedExtension] = useState<Order | null>(
        null
    );
    const [result, setResult] = useState<ResultFields>({
        name: '',
        description: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        zipCode: '',
        city: '',
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchExtensions = async () => {
            setIsLoading(true);
            try {
                const allOrders: Order[] = await orderService.getAll();
                const filtered = allOrders.filter(
                    (o) =>
                        o.extension &&
                        o.id !== currentOrder.id &&
                        o.executionStatus === 'ACTIVE'
                );
                setExtensions(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExtensions();
    }, [isOpen, currentOrder.id]);

    const prefillResult = useCallback(
        (ext: Order) => {
            const newResult: ResultFields = {} as ResultFields;
            for (const field of ALL_FIELDS) {
                const val1 = getOrderFieldValue(currentOrder, field);
                const val2 = getOrderFieldValue(ext, field);
                newResult[field] = val1 === val2 ? val1 : '';
            }
            setResult(newResult);
        },
        [currentOrder]
    );

    const handleSelectExtension = useCallback(
        (ext: Order) => {
            setSelectedExtension(ext);
            prefillResult(ext);
        },
        [prefillResult]
    );

    const handleBack = useCallback(() => {
        setSelectedExtension(null);
        setResult({
            name: '',
            description: '',
            fullName: '',
            phoneNumber: '',
            address: '',
            zipCode: '',
            city: '',
        });
    }, []);

    const handleFieldChange = useCallback(
        (field: keyof ResultFields, value: string) => {
            setResult((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const copyToClipboard = useCallback(
        (order: Order, field: keyof ResultFields) => {
            const value = getOrderFieldValue(order, field);
            navigator.clipboard.writeText(value);
            showSnackbar(t('copied-to-clipboard'), 'success');
        },
        [showSnackbar, t]
    );

    const useFieldFromOrder = useCallback(
        (order: Order, field: keyof ResultFields) => {
            const value = getOrderFieldValue(order, field);
            setResult((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const useAllFromOrder = useCallback(
        (order: Order) => {
            const newResult: ResultFields = {} as ResultFields;
            for (const field of ALL_FIELDS) {
                newResult[field] = getOrderFieldValue(order, field);
            }
            setResult(newResult);
        },
        []
    );

    const isValid = useMemo(() => {
        return (
            result.name.trim() !== '' &&
            result.fullName.trim() !== '' &&
            result.phoneNumber.trim() !== '' &&
            result.address.trim() !== '' &&
            result.zipCode.trim() !== '' &&
            result.city.trim() !== ''
        );
    }, [result]);

    const handleSubmit = useCallback(async () => {
        if (!selectedExtension || !isValid) return;

        setIsSubmitting(true);
        try {
            const response = await orderService.combineExtensions({
                extensionIds: [currentOrder.id, selectedExtension.id],
                name: result.name,
                description: result.description,
                contactInfo: {
                    fullName: result.fullName,
                    phoneNumber: result.phoneNumber,
                    address: result.address,
                    zipCode: result.zipCode,
                    city: result.city,
                },
            });
            showSnackbar(t('extensions-combined'), 'success');
            onClose();
            await fetchOrders();
            setSelectedOrderId(response.id);
        } catch (error) {
            console.error(error);
            showSnackbar(t('error-combining-extensions'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        selectedExtension,
        isValid,
        currentOrder.id,
        result,
        showSnackbar,
        t,
        setSelectedOrderId,
        fetchOrders,
        onClose,
    ]);

    const renderOrderCard = (order: Order, label: string) => (
        <div className="combine-view__order-card">
            <div className="combine-view__order-card__header">
                <span className="combine-view__order-card__header__title">
                    {label}
                </span>
                <button
                    className="combine-view__order-card__header__copy-all"
                    onClick={() => useAllFromOrder(order)}
                >
                    {t('use-all')}
                </button>
            </div>
            {ALL_FIELDS.map((field) => (
                <div
                    key={field}
                    className="combine-view__order-card__field"
                >
                    <span className="combine-view__order-card__field__label">
                        {t(field)}
                    </span>
                    <span className="combine-view__order-card__field__value">
                        {getOrderFieldValue(order, field) || '-'}
                    </span>
                    <IconButton
                        className="combine-view__order-card__field__copy-btn"
                        size="small"
                        onClick={() => copyToClipboard(order, field)}
                        title={t('copy')}
                    >
                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                        className="combine-view__order-card__field__use-btn"
                        size="small"
                        onClick={() => useFieldFromOrder(order, field)}
                        title={t('use-value')}
                    >
                        <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </div>
            ))}
        </div>
    );

    const renderSelectStep = () => {
        if (isLoading) {
            return (
                <div className="loading-container">
                    <CircularProgress />
                </div>
            );
        }

        if (extensions.length === 0) {
            return (
                <div className="extension-list__empty">
                    {t('no-extensions-available')}
                </div>
            );
        }

        return (
            <div className="extension-list">
                {extensions.map((ext) => (
                    <div
                        key={ext.id}
                        className="extension-list__item"
                        onClick={() => handleSelectExtension(ext)}
                    >
                        <div className="extension-list__item__info">
                            <span className="extension-list__item__info__name">
                                {ext.name}
                            </span>
                            <span className="extension-list__item__info__tracking">
                                {ext.trackingId}
                            </span>
                            {ext.description && (
                                <span className="extension-list__item__info__description">
                                    {ext.description}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCombineStep = () => {
        if (!selectedExtension) return null;

        return (
            <div className="combine-view">
                <div className="combine-view__columns">
                    {renderOrderCard(currentOrder, `${t('order')} 1`)}
                    {renderOrderCard(selectedExtension, `${t('order')} 2`)}
                </div>

                <div className="combine-view__result">
                    <div className="combine-view__result__title">
                        {t('result')}
                    </div>
                    <div className="combine-view__result__fields">
                        {ALL_FIELDS.map((field) => (
                            <TextField
                                key={field}
                                className={field === 'description' ? 'full-width' : ''}
                                label={t(field)}
                                value={result[field]}
                                onChange={(e) =>
                                    handleFieldChange(field, e.target.value)
                                }
                                size="small"
                                fullWidth
                                {...(field === 'description' && {
                                    multiline: true,
                                    minRows: 3,
                                })}
                            />
                        ))}
                    </div>
                </div>

                <div className="combine-view__actions">
                    <Button
                        className="combine-view__actions__back"
                        onClick={handleBack}
                    >
                        {t('back')}
                    </Button>
                    <Button
                        className="combine-view__actions__submit"
                        variant="contained"
                        disabled={!isValid || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={20} />
                        ) : (
                            t('combine')
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Styled.CombineModalContainer
            className="combine-modal"
            isOpen={isOpen}
            onClose={onClose}
            title={
                selectedExtension
                    ? t('combine-extensions')
                    : t('select-extension')
            }
        >
            {selectedExtension ? renderCombineStep() : renderSelectStep()}
        </Styled.CombineModalContainer>
    );
};

export default CombineExtensionsModal;
