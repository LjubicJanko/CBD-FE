import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { tablet } from '../../../../util/breakpoints';

export const PersonalInfoContainer = styled.div`
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

  .change-password {
    &__form {
      &__input {
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
        /* background-color: ${theme.SECONDARY_3}; */
        width: fit-content;
        padding: 16px 32px;
      }
    }
  }
`;
