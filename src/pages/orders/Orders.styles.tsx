import styled, { css } from 'styled-components';
import { tablet } from '../../util/breakpoints';

export const OrdersPageContainer = styled.div`
  padding: 16px 32px;
  gap: 32px;

  .orders {
    &__content {
      display: flex;
      justify-content: space-between;
      gap: 64px;
      padding-top: 30px;

      ${tablet(css`
        flex-direction: column;
        gap: 64px;
      `)}
    }
  }
`;
