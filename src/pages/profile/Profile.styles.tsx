import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const ProfilePageContainer = styled.div`
  display: grid;
  grid-template-areas: 'cards panel';
  grid-template-columns: fit-content(40%) auto;
  flex-direction: column;
  padding: 32px;
  gap: 32px;

  width: 100%;

  ${tablet(css`
    display: flex;
    flex-direction: column;
  `)}

  .profile {
    &__cards {
      grid-area: cards;

      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 8px;

      h3 {
        font-size: 32px;
        color: ${theme.SECONDARY_2};
        padding-bottom: 16px;
        text-align: center;
      }

      button {
        color: ${theme.SECONDARY_2};

        &.selected {
          border-right: 3px solid ${theme.PRIMARY_2};
          border-bottom: 1px solid ${theme.PRIMARY_2};
        }
      }
    }

    &__panel {
      grid-area: panel;
    }

    &__change-password {
      width: fit-content;
      background-color: ${theme.SECONDARY_1};
      padding: 32px;
      border-radius: 8px;

      ${tablet(css`
        width: 100%;
      `)}

      h3 {
        margin-bottom: 18px;
      }

      &__input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &--newPassword,
        &--confirmPassword {
          margin-left: 16px;
        }
      }

      &__button {
        margin-top: 16px;
        /* background-color: ${theme.SECONDARY_3}; */
        width: fit-content;
        padding: 16px 32px;
      }
    }
  }
`;
