import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasPrivilege } from '../../hooks/useHasPrivilege';
import { privileges } from '../../util/util';
import FiltersModal from '../modals/filters/FiltersModal.component';
import * as Styled from './Filters.styles';
import { useTranslation } from 'react-i18next';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import useQueryParams from '../../hooks/useQueryParams';
import { orderStatusArray } from '../../types/Order';

const FiltersComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setShouldShowArchived, setSelectedOrderId } =
    useContext(OrdersContext);
  const { removeMultipleQParams } = useQueryParams();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const canAddOrder = useHasPrivilege(privileges.ORDER_CREATE);

  const toggleFiltersModal = useCallback(
    () => setIsFiltersModalOpen((old) => !old),
    []
  );

  const handleChangeExecutionStatus = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement).value;
      removeMultipleQParams(orderStatusArray);
      setSelectedOrderId(0);
      setShouldShowArchived(value === 'ARCHIVED');
    },
    [removeMultipleQParams, setSelectedOrderId, setShouldShowArchived]
  );

  return (
    <Styled.FiltersComponentContainer className="filters">
      {canAddOrder && (
        <Tooltip title="add order">
          <Button
            variant="contained"
            size="large"
            className="add-button"
            onClick={() => navigate('/createOrder')}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      )}
      <Tooltip title="filter orders">
        <Button variant="outlined" onClick={toggleFiltersModal}>
          <FilterAltIcon />
        </Button>
      </Tooltip>
      <RadioGroup
        defaultValue="ACTIVE"
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
      {isFiltersModalOpen && (
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={toggleFiltersModal}
        />
      )}
    </Styled.FiltersComponentContainer>
  );
};

export default FiltersComponent;
