import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const OrderTrackingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  ${mobile(css`
    width: 100%;
  `)}

  .order {
    &__header {
      border-bottom: 1px solid black;
      padding: 32px;
    }

    &__body {
      padding: 32px;

      &__shipping {
        display: flex;
        align-items: center;

        margin-bottom: 32px;
        gap: 4px;

        &--postal-service {
          font-weight: 600;
        }

        &--code {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;

          &--copy-icon {
            padding: 0;
          }
        }
      }
    }
  }
`;
