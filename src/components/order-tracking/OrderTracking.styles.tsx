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
      display: flex;
      flex-direction: column;
      gap: 16px;

      border-bottom: 1px solid black;
      padding: 32px;

      h2 {
        font-size: 32px;
        font-weight: 600;
      }
      h3 {
        font-size: 18px;
        font-weight: 300;
      }
    }

    &__body {
      padding: 32px;

      &__grid {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 32px;
        gap: 16px;

        ${mobile(css`
          flex-direction: column;
          gap: 16px;
        `)}

        &__ending-date,
        &__left-to-pay,
        &__shipping,
        &__shipping-code,
        &__last-update,
        &__status {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        &__shipping {
          display: flex;
          flex-direction: column;

          &--postal-service {
            font-weight: 600;
          }

          &--code {
            &--copy-icon {
              padding: 0;
            }
          }
        }

        .value {
          font-weight: 600;
        }
      }
    }
  }
`;
