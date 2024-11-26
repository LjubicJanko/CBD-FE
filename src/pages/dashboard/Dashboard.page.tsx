import { CircularProgress } from '@mui/material';
import { useContext } from 'react';
import {
  FiltersComponent,
  OrderDetailsComponent,
  OrderSearchComponent,
  OrdersListComponent,
} from '../../components';
import OrdersContext from '../../store/OrdersProvider/Orders.context';
import * as Styled from './Dashboard.styles';

const DashboardPage = () => {
  const { selectedOrder, isLoading, handleSearch } = useContext(OrdersContext);

  return (
    <Styled.DashboardContainer className="dashboard-page">
      <style>
        {`
          html, body {
            background-color: white;
            .MuiPopover-paper {
              background-color: white;
            }
          }
        `}
      </style>
      <div className="dashboard-page__header">
        <FiltersComponent />
        <OrderSearchComponent onSearch={handleSearch} />
      </div>
      {isLoading && (
        <div className="loader-wrapper">
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <div className="dashboard-page__body">
          <OrdersListComponent />
          {selectedOrder && (
            <div className="details">
              <OrderDetailsComponent key={selectedOrder.id} />
            </div>
          )}
        </div>
      )}
    </Styled.DashboardContainer>
  );
};

export default DashboardPage;
