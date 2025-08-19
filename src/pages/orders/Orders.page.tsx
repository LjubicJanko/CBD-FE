import { useContext } from 'react';
import { OrderDetailsComponent, OrdersListComponent } from '../../components';
import DashboardHeader from '../../components/dashboard-header/DashboardHeader.component';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import * as Styled from './Orders.styles';

const OrdersPage = () => {
  const { selectedOrder } = useContext(CompanyContext);
  return (
    <Styled.OrdersPageContainer className='orders'>
      <DashboardHeader />
      <div className='orders__content'>
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
