import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import companyService from '../../api/services/companies';
import {
  SortCriteriaType,
  SortType,
} from '../../components/modals/filters/FiltersModal.component';
import useQueryParams from '../../hooks/useQueryParams';
import { Company } from '../../types/Company';
import {
  Order,
  OrderOverview,
  orderPriorityArray,
  orderStatusArray,
} from '../../types/Order';
import { Q_PARAM } from '../../util/constants';
import CompanyContext from './Company.context';

export type PaginationConfig = {
  page: number;
  perPage: number;
  total: number;
  totalElements: number;
};

const CompanyProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { id } = useParams<{ id: string }>();
  const { params } = useQueryParams();
  const [company, setCompany] = useState<Company | undefined>();
  const [orders, setOrders] = useState<OrderOverview[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);

  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    page: 0,
    perPage: 5,
    total: 0,
    totalElements: 0,
  });
  const lastPageValueRef = useRef<number>(paginationConfig.page);

  const fetchOrders = useCallback(async () => {
    if (!id) return;

    try {
      const isPageUnchanged =
        lastPageValueRef.current === paginationConfig?.page;

      const statuses = Object.keys(params).filter((key) =>
        orderStatusArray.includes(key)
      );

      const priorities = Object.keys(params).filter((key) =>
        orderPriorityArray.includes(key)
      );

      const executionStatuses = params[Q_PARAM.EXECUTION_STATUS];

      const response = await companyService.getCompanyOrders(+id, {
        statuses,
        priorities,
        searchTerm: params[Q_PARAM.SEARCH_TERM],
        sortCriteria: params[Q_PARAM.SORT_CRITERIA] as SortCriteriaType,
        sort: params[Q_PARAM.SORT] as SortType,
        executionStatuses:
          executionStatuses === 'ARCHIVED' ? ['ARCHIVED', 'CANCELED'] : [],
        page: isPageUnchanged ? 0 : paginationConfig?.page,
        perPage: paginationConfig?.perPage,
      });

      setPaginationConfig({ ...response });
      setOrders(response.data);
      lastPageValueRef.current = response.page;
    } catch (error) {
      console.error(error);
    }
  }, [id, paginationConfig?.page, paginationConfig?.perPage, params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // todo change to fetch more details
  const fetchCompany = useCallback(async () => {
    if (!id) return;

    const response = await companyService.getCompany(+id);
    setCompany(response);
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const changeSelectedOrderId = useCallback((newId: number) => {
    setSelectedOrderId(newId);
  }, []);

  const updatePaginationConfig = useCallback(
    (newPaginationConfig: PaginationConfig) => {
      setPaginationConfig(newPaginationConfig);
    },
    []
  );

  return (
    <CompanyContext.Provider
      value={{
        orders,
        company,
        selectedOrder,
        paginationConfig,
        changeSelectedOrderId,
        updatePaginationConfig,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
