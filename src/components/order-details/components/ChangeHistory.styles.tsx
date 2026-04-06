import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const ChangeHistoryContainer = styled.div`
  color: ${theme.SECONDARY_1};

  .change-history {
    font-family: 'Afacad', serif;
    color: ${theme.SECONDARY_1};

    &__table {
      width: 100%;
    }

    &__header-cell {
      font-weight: bold;
      color: ${theme.SECONDARY_1};
    }

    &__row {
      &:hover {
        background-color: ${theme.SECONDARY_1}1A;
      }

      &--paused {
        background-color: #ff990015;
      }

      &--reactivated {
        background-color: #4caf5015;
      }
    }

    &__cell {
      color: ${theme.SECONDARY_1};
      padding: 16px;

      &--status {
        font-weight: bold;
      }

      &--execution-status {
        font-style: italic;
      }

      &--timestamp {
        white-space: nowrap;

        p {
          display: inline;
          margin: 0;
        }

        svg {
          color: ${theme.PRIMARY_2};
          vertical-align: middle;
          margin-left: 8px;
        }
      }
    }
  }

  ${tablet(css`
    .change-history__header {
      display: none;
    }

    .change-history__table {
      min-width: unset !important;
    }

    .change-history__row {
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

    .change-history__cell--timestamp {
      white-space: normal;
    }
  `)}
`;
