import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { tablet } from '../../../../util/breakpoints';

export const PersonalInfoContainer = styled.div`
  width: fit-content;
  padding: 32px;
  border-radius: 8px;
  background-color: ${theme.SECONDARY_2};

  ${tablet(css`
    width: 100%;
  `)}

  h3 {
    margin-bottom: 18px;
    color: ${theme.SECONDARY_1};
  }

  .change-password {
    &__form {
      &__input {
        color: ${theme.SECONDARY_1};
        display: flex;
        justify-content: space-between;
        align-items: center;
        &--oldPassword,
        &--newPassword {
          margin-left: 16px;
        }
      }

      &__button {
        margin-top: 16px;
        width: fit-content;
        padding: 16px 32px;
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        &--disabled {
          background-color: ${theme.SECONDARY_3};
          color: ${theme.PRIMARY_1};
          opacity: 0.7;
        }
      }
    }
  }
`;
