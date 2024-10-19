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

const FiltersComponent = () => {
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
        label: 'Design',
        key: 'DESIGN',
        variant: 'DESIGN' in params ? 'contained' : 'outlined',
      },
      {
        label: 'Print ready',
        key: 'PRINT_READY',
        variant: 'PRINT_READY' in params ? 'contained' : 'outlined',
      },
      {
        label: 'Printing',
        key: 'PRINTING',
        variant: 'PRINTING' in params ? 'contained' : 'outlined',
      },
      {
        label: 'Printed',
        key: 'PRINTED',
        variant: 'PRINTED' in params ? 'contained' : 'outlined',
      },
      {
        label: 'Shipped',
        key: 'SHIPPED',
        variant: 'SHIPPED' in params ? 'contained' : 'outlined',
      },
      {
        label: 'Done',
        key: 'DONE',
        variant: 'DONE' in params ? 'contained' : 'outlined',
      },
    ],
    [params]
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
    </Styled.FiltersComponentContainer>
  );
};

export default FiltersComponent;