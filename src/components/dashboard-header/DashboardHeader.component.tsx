import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Button, Pagination, Tooltip } from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useHasPrivilege } from '../../hooks/useHasPrivilege';
import useQueryParams from '../../hooks/useQueryParams';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import { orderPriorityArray, orderStatusArray } from '../../types/Order';
import { xxsMax } from '../../util/breakpoints';
import { Q_PARAM } from '../../util/constants';
import { privileges } from '../../util/util';
import FiltersModal from '../modals/filters/FiltersModal.component';
import OrderSearchComponent from '../order-search/OrderSearch.component';
import * as Styled from './DashboardHeader.styles';

const DashboardHeader = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { paginationConfig, changeSelectedOrderId, updatePaginationConfig } =
    useContext(CompanyContext);

  const { page, total, totalElements } = paginationConfig;

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
      updatePaginationConfig({ ...paginationConfig, page: value - 1 });
      changeSelectedOrderId(-1);
    },
    [updatePaginationConfig, paginationConfig, changeSelectedOrderId]
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
