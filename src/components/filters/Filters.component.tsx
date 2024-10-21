import { Button } from '@mui/material';
import classNames from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import useQueryParams from '../../hooks/useQueryParams';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import * as Styled from './Filters.styles';
import { OrderStatus } from '../../types/Order';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import { useTranslation } from 'react-i18next';

const FiltersComponent = () => {
  const { t } = useTranslation();
  const { setSelectedOrderId } = useContext(OrdersContext);
  const { params, setQParam, removeQParam, removeMultipleQParams } =
    useQueryParams();
  const navigate = useNavigate();

  const filterButtonsConfig: {
    label: string;
    key: OrderStatus;
    variant: 'contained' | 'outlined';
  }[] = useMemo(
    () => [
      {
        label: t('DESIGN'),
        key: 'DESIGN',
        variant: 'DESIGN' in params ? 'contained' : 'outlined',
      },
      {
        label: t('PRINT_READY'),
        key: 'PRINT_READY',
        variant: 'PRINT_READY' in params ? 'contained' : 'outlined',
      },
      {
        label: t('PRINTING'),
        key: 'PRINTING',
        variant: 'PRINTING' in params ? 'contained' : 'outlined',
      },
      {
        label: t('PRINTED'),
        key: 'PRINTED',
        variant: 'PRINTED' in params ? 'contained' : 'outlined',
      },
      {
        label: t('SHIPPED'),
        key: 'SHIPPED',
        variant: 'SHIPPED' in params ? 'contained' : 'outlined',
      },
      {
        label: t('DONE'),
        key: 'DONE',
        variant: 'DONE' in params ? 'contained' : 'outlined',
      },
    ],
    [params, t]
  );

  const updateQParam = useCallback(
    (param: string) => {
      if (param in params) {
        removeQParam(param);
      } else {
        setQParam(param, 'true');
      }
    },
    [params, removeQParam, setQParam]
  );

  return (
    <Styled.FiltersComponentContainer className="filters">
      <Button
        variant="contained"
        size="large"
        className="add-button"
        onClick={() => navigate('/createOrder')}
      >
        <AddIcon />
      </Button>
      <Button
        className="reset-filters"
        variant={'outlined'}
        startIcon={<ClearOutlinedIcon />}
        onClick={() => {
          removeMultipleQParams(filterButtonsConfig.map((x) => x.key));
          setSelectedOrderId(0);
        }}
      >
        Reset
      </Button>
      {filterButtonsConfig.map(({ key, label, variant }) => (
        <Button
          key={key}
          className={classNames('filter-button', key)}
          variant={variant}
          onClick={() => {
            updateQParam(key);
            setSelectedOrderId(0);
          }}
        >
          {label}
        </Button>
      ))}
    </Styled.FiltersComponentContainer>
  );
};

export default FiltersComponent;
