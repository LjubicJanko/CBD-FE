import { useCallback, useContext, useMemo, useState } from 'react';
import * as Styled from './DashboardHeader.styles';
import { Tooltip, Button, Pagination } from '@mui/material';
import OrderSearchComponent from '../order-search/OrderSearch.component';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHasPrivilege } from '../../hooks/useHasPrivilege';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import { privileges } from '../../util/util';
import FiltersModal from '../modals/filters/FiltersModal.component';
import useQueryParams from '../../hooks/useQueryParams';
import { orderPriorityArray, orderStatusArray } from '../../types/Order';
import { Q_PARAM } from '../../util/constants';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { xxsMax } from '../../util/breakpoints';

const DashboardHeader = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { totalElements, page, total, setPage, setSelectedOrderId } =
    useContext(OrdersContext);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const canAddOrder = useHasPrivilege(privileges.ORDER_CREATE);

  const { params } = useQueryParams();

  const width = useResponsiveWidth();

  const isOnMobile = width < xxsMax;

  const activeFilters = useMemo(
    () => Object.keys(params).filter((key) => orderStatusArray.includes(key)),
    [params]
  );

  const activePriorities = useMemo(
    () => Object.keys(params).filter((key) => orderPriorityArray.includes(key)),
    [params]
  );

  const toggleFiltersModal = useCallback(
    () => setIsFiltersModalOpen((old) => !old),
    []
  );

  const handleChangePage = useCallback(
    (_event: unknown, value: number) => {
      setPage(value - 1);
      setSelectedOrderId(-1);
    },
    [setPage, setSelectedOrderId]
  );

  return (
    <Styled.Container className="dashboard-header">
      <Tooltip title={t('filters-tooltip')}>
        <Button
          variant="outlined"
          className="dashboard-header__filter"
          onClick={toggleFiltersModal}
        >
          filtriraj
          <FilterAltIcon />
        </Button>
      </Tooltip>
      <p className="dashboard-header__total">
        {t('pagination-total', { TOTAL: totalElements })}
      </p>
      <div className="dashboard-header__search">
        <OrderSearchComponent />
      </div>
      <div className="dashboard-header__create">
        {canAddOrder && (
          <Tooltip title={t('create-order')}>
            <Button
              variant="contained"
              className="dashboard-header__create--btn"
              onClick={() => navigate('/createOrder')}
            >
              <p>{t(isOnMobile ? 'create' : 'create-order')}</p>
              <AddIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      <div className="dashboard-header__pagination">
        <Pagination count={total} page={page + 1} onChange={handleChangePage} />
      </div>
      <div className="dashboard-header__active-filters">
        <div className="dashboard-header__active-filters--chip">
          {t(
            params[Q_PARAM.EXECUTION_STATUS] === 'ARCHIVED'
              ? 'archive-orders'
              : 'active-orders'
          )}
        </div>
        {activeFilters.map((activeFilter, index) => (
          <div
            className="dashboard-header__active-filters--chip"
            key={`filter-${index}`}
          >
            {t(activeFilter)}
          </div>
        ))}
        {activePriorities.map((activePriority, index) => (
          <div
            className="dashboard-header__active-filters--chip"
            key={`priority-${index}`}
          >
            {`${t(activePriority)} ${t('priority')}`}
          </div>
        ))}
      </div>
      {isFiltersModalOpen && (
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={toggleFiltersModal}
        />
      )}
    </Styled.Container>
  );
};

export default DashboardHeader;
