import { useContext } from 'react';
import { OrderDetailsComponent, OrdersListComponent } from '../../components';
import DashboardHeader from '../../components/dashboard-header/DashboardHeader.component';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import * as Styled from './Orders.styles';
import { CircularProgress } from '@mui/material';

const OrdersPage = () => {
  const { selectedOrder, isLoading, company } = useContext(CompanyContext);

  console.log({company})
  return (
    <Styled.OrdersPageContainer className="orders">
      <DashboardHeader />
      {isLoading && (
        <div className="loader-wrapper">
          <CircularProgress />
        </div>
      )}
      <div className="orders__content">
        <OrdersListComponent />
        {selectedOrder && (
          <div className="details">
            <OrderDetailsComponent key={selectedOrder.id} />
          </div>
        )}
      </div>
    </Styled.OrdersPageContainer>
  );
};

export default OrdersPage;
