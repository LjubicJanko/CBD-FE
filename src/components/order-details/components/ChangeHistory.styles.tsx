import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const ChangeHistoryContainer = styled.div`
  color: ${theme.SECONDARY_1};

  ${tablet(css`
    overflow-x: auto;
  `)}

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
`;
