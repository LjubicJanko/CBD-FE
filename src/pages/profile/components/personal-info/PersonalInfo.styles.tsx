import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { mobile, tablet } from '../../../../util/breakpoints';

export const PersonalInfoContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 32px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  ${tablet(css`
    max-width: 100%;
  `)}

  ${mobile(css`
    padding: 20px;
  `)}

  h3 {
    margin: 0 0 24px 0;
    color: ${theme.PRIMARY_2};
    font-size: 20px;
    font-weight: 700;
  }

  .change-password {
    &__form {
      &__fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      &__input {
        color: ${theme.SECONDARY_2};
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;

        &--oldPassword,
        &--newPassword {
          margin-left: 0;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.05);

          .MuiOutlinedInput-notchedOutline {
            border-color: rgba(255, 255, 255, 0.2) !important;
          }

          &:hover .MuiOutlinedInput-notchedOutline {
            border-color: ${theme.PRIMARY_2}80 !important;
          }

          &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: ${theme.PRIMARY_2} !important;
            border-width: 1px !important;
          }

          input {
            color: ${theme.SECONDARY_1};
          }

          .MuiIconButton-root {
            color: ${theme.SECONDARY_2};
          }
        }
      }

      &__button {
        margin-top: 24px;
        width: 100%;
        padding: 12px 32px;
        border-radius: 10px;
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        font-weight: 700;
        font-size: 14px;

        &:hover {
          background-color: ${theme.PRIMARY_2}D9;
        }

        &--disabled {
          background-color: ${theme.SECONDARY_3} !important;
          color: ${theme.PRIMARY_1};
          opacity: 0.5;
        }
      }
    }
  }
`;
