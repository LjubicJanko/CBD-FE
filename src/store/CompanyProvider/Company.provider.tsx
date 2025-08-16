import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import companyService from '../../api/services/companies';
import { GetAllPaginatedResponse, OrderOverview } from '../../types/Order';
import CompanyContext from './Company.context';
import { useParams } from 'react-router-dom';
import { Company } from '../../types/Company';

const CompanyProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | undefined>();
  const [orders, setOrders] = useState<OrderOverview[]>([]);
  const [paginationConfig, setPaginationConfig] = useState<{
    page: number;
    perPage: number;
    total: number;
    totalElements: number;
  }>();

  console.log({ paginationConfig });

  const fetchOrders = useCallback(async () => {
    if (!id) return;
    const response: GetAllPaginatedResponse =
      await companyService.getCompanyOrders(+id, {
        page: 0,
        perPage: 10,
      });
    setPaginationConfig({ ...response });
    setOrders(response.data);
  }, [id]);

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

  return (
    <CompanyContext.Provider
      value={{
        orders,
        company,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
