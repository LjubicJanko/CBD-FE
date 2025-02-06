import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const OrdersListContainer = styled.div`
  grid-area: orders;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 32px;

  .pagination-total {
    font-size: 18px;
  }

  .pagination {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;

    ${mobile(css`
      flex-direction: column;
    `)}
  }

  .no-content {
    width: 250px;
  }
`;
