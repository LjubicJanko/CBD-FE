import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { mobile, tablet } from '../../../../util/breakpoints';

export const OrderPaymentsContainer = styled.div`
  color: ${theme.SECONDARY_1};

  .order-payments {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__data {
      flex: 1;
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

      &--actions-cell {
        text-align: center;
        padding: 0;
        white-space: nowrap;

        button {
          color: ${theme.PRIMARY_2};
          padding: 0;
          min-width: unset;
        }
      }
    }

    &__no-content {
      display: block;
      margin: 0 auto;
      width: 15%;

      ${mobile(css`
        width: 30%;
      `)}
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

  ${tablet(css`
    .order-payments__table-header {
      display: none;
    }

    .order-payments__row {
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 16px;
        border: none;
        color: ${theme.SECONDARY_1} !important;

        &::before {
          content: attr(data-label);
          font-weight: 500;
          color: ${theme.PRIMARY_2} !important;
          font-size: 13px;
          margin-right: 12px;
          flex-shrink: 0;
        }
      }
    }

    .order-payments__cell--actions-cell {
      justify-content: flex-end !important;

      &::before {
        display: none;
      }
    }
  `)}
`;
