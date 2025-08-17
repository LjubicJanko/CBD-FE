import styled from 'styled-components';
import theme from '../../styles/theme';

export const ChipConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .chip-config {
    &__add-btn {
      width: fit-content;
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
      align-self: flex-end;
    }

    &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      &__item {
        width: fit-content;
        background-color: ${theme.SECONDARY_2};
      }
    }
  }
`;
