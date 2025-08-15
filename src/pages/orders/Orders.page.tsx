import { useContext } from 'react';
import * as Styled from './Orders.styles';
import CompanyContext from '../../store/CompanyProvider/Company.context';
import DashboardHeader from '../../components/dashboard-header/DashboardHeader.component';

const OrdersPage = () => {
  const { orders } = useContext(CompanyContext);
  return (
    <Styled.OrdersPageContainer>
      <DashboardHeader />
      <div>
        {orders?.map((x, idx) => (
          <div className="order" key={idx}>
            {x.name}
          </div>
        ))}
      </div>
    </Styled.OrdersPageContainer>
  );
};

export default OrdersPage;
