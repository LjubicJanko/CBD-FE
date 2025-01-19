import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { tablet } from '../../../../util/breakpoints';

export const OrderPaymentsContainer = styled.div`
  color: ${theme.SECONDARY_1};

  .order-payments {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__data {
      flex: 1;
      overflow-x: auto;

      ${tablet(css`
        overflow-x: auto;
      `)}
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
    }

    &__header-cell {
      font-weight: bold;
      color: ${theme.SECONDARY_1};
    }

    &__row {
      &:hover {
        background-color: ${theme.SECONDARY_1}1A;
      }
    }

    &__cell {
      color: ${theme.SECONDARY_1};
      padding: 16px;

      &--payer,
      &--amount,
      &--method,
      &--date,
      &--note {
        font-size: 14px;
      }

      &--edit,
      &--delete {
        text-align: center;
        padding: 0;

        button {
          color: ${theme.PRIMARY_2};
          padding: 0;
          width: fit-content;
        }
      }
    }

    &__no-content {
      display: block;
      margin: 0 auto;
      width: 50%;
    }

    &__actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
      position: sticky;
      bottom: 0;
      padding: 8px 0;

      &__add-button {
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        border-radius: 20px;
        gap: 8px;

        &:hover {
          background-color: ${theme.PRIMARY_2}D9;
        }
      }
    }
  }
`;
