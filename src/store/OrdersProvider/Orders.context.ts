import { createContext } from 'react';
import { Order } from '../../types/Order';

interface OrdersContext {
  orders: Order[];
}

export default createContext<OrdersContext>({
  orders: [],
});
