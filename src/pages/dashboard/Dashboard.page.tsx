import { CircularProgress } from '@mui/material';
import { useContext } from 'react';
import { OrderDetailsComponent, OrdersListComponent } from '../../components';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import * as Styled from './Dashboard.styles';
import DashboardHeader from '../../components/dashboard-header/DashboardHeader.component';

const DashboardPage = () => {
  const { selectedOrder, isLoading } = useContext(OrdersContext);

  return (
    <Styled.DashboardContainer className="dashboard-page">
      <DashboardHeader />
      {isLoading && (
        <div className="loader-wrapper">
          <CircularProgress />
        </div>
      )}
      <div className="dashboard-page__body">
        <OrdersListComponent />
        {selectedOrder && (
          <div className="details">
            <OrderDetailsComponent key={selectedOrder.id} />
          </div>
        )}
      </div>
    </Styled.DashboardContainer>
  );
};

export default DashboardPage;
