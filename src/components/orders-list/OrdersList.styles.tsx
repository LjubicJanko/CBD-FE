import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const OrdersListContainer = styled.div`
  grid-area: orders;
  display: flex;
  flex-direction: column;
  gap: 32px;

  .pagination {
    display: flex;
    gap: 16px;
    align-items: center;

    ${mobile(css`
      flex-direction: column;
    `)}
  }

  .no-content {
    width: 250px;
  }
`;
