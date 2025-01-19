import {
  Button,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import classNames from 'classnames';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useQueryParams from '../../../hooks/useQueryParams';
import OrdersContext from '../../../store/OrdersProvider/Orders.context';
import {
  OrderStatus,
  orderStatusArray,
  OrderStatusEnum,
} from '../../../types/Order';
import * as Styled from './FiltersModal.styles';
import { Q_PARAM } from '../../../util/constants';
import theme from '../../../styles/theme';
import TuneIcon from '@mui/icons-material/Tune';

export type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ButtonVariants = {
  [key: string]: boolean;
};

export type SortCriteriaType = 'expected-date' | 'creation-date';
export type SortType = 'asc' | 'desc';
export type ExecutionStatusType = 'ACTIVE' | 'ARCHIVED';

const FiltersModal = ({ isOpen, onClose }: FiltersModalProps) => {
  const { t } = useTranslation();
  const { setSelectedOrderId } = useContext(OrdersContext);
  const { params, setMultipleQParams, setQParam, removeMultipleQParams } =
    useQueryParams();
  const [sortByCriteria, setSortByCriteria] = useState(
    (params[Q_PARAM.SORT_CRITERIA] as SortCriteriaType) ?? 'expected-date'
  );
  const [sort, setSort] = useState<SortType>(
    (params[Q_PARAM.SORT] as SortType) ?? 'desc'
  );
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatusType>(
    (params[Q_PARAM.EXECUTION_STATUS] as ExecutionStatusType) ?? 'ACTIVE'
  );

  const initialVariants: ButtonVariants = useMemo(
    () => ({
      DESIGN: 'DESIGN' in params,
      PRINT_READY: 'PRINT_READY' in params,
      PRINTING: 'PRINTING' in params,
      SEWING: 'SEWING' in params,
      SHIP_READY: 'SHIP_READY' in params,
      SHIPPED: 'SHIPPED' in params,
      DONE: 'DONE' in params,
    }),
    [params]
  );

  const [selectedStatuses, setSelectedStatuses] = useState(initialVariants);

  const filterButtonsConfig: {
    label: string;
    key: OrderStatus;
    variant: 'filled' | 'outlined';
  }[] = useMemo(
    () => [
      {
        label: t('DESIGN'),
        key: 'DESIGN',
        variant: selectedStatuses[OrderStatusEnum.DESIGN]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('PRINT_READY'),
        key: 'PRINT_READY',
        variant: selectedStatuses[OrderStatusEnum.PRINT_READY]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('PRINTING'),
        key: 'PRINTING',
        variant: selectedStatuses[OrderStatusEnum.PRINTING]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('SEWING'),
        key: 'SEWING',
        variant: selectedStatuses[OrderStatusEnum.SEWING]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('SHIP_READY'),
        key: 'SHIP_READY',
        variant: selectedStatuses[OrderStatusEnum.SHIP_READY]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('SHIPPED'),
        key: 'SHIPPED',
        variant: selectedStatuses[OrderStatusEnum.SHIPPED]
          ? 'filled'
          : 'outlined',
      },
      {
        label: t('DONE'),
        key: 'DONE',
        variant: selectedStatuses[OrderStatusEnum.DONE] ? 'filled' : 'outlined',
      },
    ],
    [selectedStatuses, t]
  );

  const filterTitle = useMemo(
    () => (
      <span className="title">
        <TuneIcon />
        {t('filters')}
      </span>
    ),
    [t]
  );

  const toggleVariant = useCallback((key: OrderStatus) => {
    setSelectedStatuses((old) => ({
      ...old,
      [key]: !old[key],
    }));
  }, []);

  const clearAllStatuses = useCallback(() => {
    setSelectedStatuses((old) =>
      Object.keys(old).reduce((acc, key) => {
        acc[key as OrderStatus] = false;
        return acc;
      }, {} as ButtonVariants)
    );
    setSortByCriteria('expected-date');
    setSort('desc');
    setExecutionStatus('ACTIVE');
  }, []);

  const updateQParams = useCallback(() => {
    removeMultipleQParams(orderStatusArray);

    const activeStatuses = Object.entries(selectedStatuses)
      .filter(([, isActive]) => isActive)
      .reduce((acc, [key]) => ({ ...acc, [key]: 'true' }), {});

    setSelectedOrderId(0);
    setMultipleQParams(activeStatuses);
    setQParam(Q_PARAM.SORT_CRITERIA, sortByCriteria);
    setQParam(Q_PARAM.SORT, sort);
    setQParam(Q_PARAM.EXECUTION_STATUS, executionStatus);

    onClose();
  }, [
    executionStatus,
    onClose,
    removeMultipleQParams,
    selectedStatuses,
    setMultipleQParams,
    setQParam,
    setSelectedOrderId,
    sort,
    sortByCriteria,
  ]);

  const handleChangeExecutionStatus = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement).value;
      setExecutionStatus(value as ExecutionStatusType);
    },
    []
  );

  return (
    <Styled.FiltersModalContainer
      title={filterTitle}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="statuses">
        {filterButtonsConfig.map(({ key, label, variant }) => (
          <Chip
            key={key}
            className={classNames('filter-button', key)}
            label={label}
            variant="outlined"
            onClick={() => toggleVariant(key)}
            style={{
              backgroundColor:
                variant === 'filled' ? theme.SECONDARY_2 : theme.PRIMARY_1,
            }}
          />
        ))}
      </div>
      <Divider color={theme.SECONDARY_2} />
      <label id="sort-by-label">{t('sort-by')}</label>
      <Select
        labelId="sort-by-label"
        id="sort-by-criteria"
        value={sortByCriteria}
        onChange={(event: SelectChangeEvent) =>
          setSortByCriteria(event.target.value as SortCriteriaType)
        }
        className="custom-select"
      >
        <MenuItem value="expected-date">{t('sort-by-expected-date')}</MenuItem>
        <MenuItem value="creation-date">{t('sort-by-creation-date')}</MenuItem>
      </Select>

      <label id="sort-order-label">{t('sort-order')}</label>
      <Select
        labelId="sort-order-label"
        id="sort-by-select"
        value={sort}
        onChange={(event: SelectChangeEvent) =>
          setSort(event.target.value as SortType)
        }
        className="custom-select"
      >
        <MenuItem value="desc">{t('newest-to-oldest')}</MenuItem>
        <MenuItem value="asc">{t('oldest-to-newest')}</MenuItem>
      </Select>
      <Divider />
      <RadioGroup
        value={executionStatus}
        className="archive-radio"
        row
        onChange={handleChangeExecutionStatus}
      >
        <FormControlLabel
          value="ACTIVE"
          control={<Radio />}
          label={t('active-orders')}
        />
        <FormControlLabel
          value="ARCHIVED"
          control={<Radio />}
          label={t('archive-orders')}
        />
      </RadioGroup>
      <Divider />
      <div className="actions">
        <Button
          className="clear-button"
          variant="outlined"
          color="info"
          onClick={clearAllStatuses}
        >
          {t('clear')}
        </Button>
        <Button
          className="submit-button"
          variant="contained"
          color="secondary"
          onClick={updateQParams}
        >
          {t('apply')}
        </Button>
      </div>
    </Styled.FiltersModalContainer>
  );
};

export default FiltersModal;
