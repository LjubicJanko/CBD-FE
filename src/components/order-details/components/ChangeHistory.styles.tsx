import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const ChangeHistoryContainer = styled.div`
  color: ${theme.SECONDARY_1};

  ${tablet(css`
    overflow-x: auto;
  `)}

  .change-history {
    font-family: 'Roboto', sans-serif;
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
    }

    &__cell {
      color: ${theme.SECONDARY_1};
      padding: 16px;

      &--status {
        font-weight: bold;
      }

      &--timestamp {
        display: flex;
        align-items: center;
        gap: 8px;

        svg {
          color: ${theme.PRIMARY_2};
        }
      }
    }
  }
`;
