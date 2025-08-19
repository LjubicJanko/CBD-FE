import styled from 'styled-components';
import theme from '../../styles/theme';

export const GearContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .MuiTableCell-body {
    border-bottom: none;
  }
  .gear {
    &__add-btn {
      width: fit-content;
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
      align-self: flex-end;
      border-radius: 25px;
    }

    &__table {
      color: ${theme.PRIMARY_2};

      &__header-cell {
        color: ${theme.SECONDARY_1};
        font-family: Afacad;
        font-weight: 700;
        font-size: 24px;
        line-height: 25px;
        border-bottom: none;
      }

      &__body {
        &__row {
          td {
            color: ${theme.SECONDARY_1};
          }
          &__action-cell {
            width: 50px;
            text-align: center;
            svg {
              color: ${theme.PRIMARY_2};
            }
          }
        }
      }
    }
  }
`;
