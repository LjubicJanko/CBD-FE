import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const ProfilePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 32px;

  width: 100%;

  .profile {
    &__cards {
      display: flex;
      flex-direction: column;
      width: fit-content;
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: ${theme.SECONDARY_2};

    }

    &__change-password {
      width: fit-content;
      background-color: ${theme.SECONDARY_2};
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

export const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 8px;
  width: 50%;

  gap: 16px;
  padding: 32px;
  background-color: ${theme.SECONDARY_2};

  ${tablet(css`
    padding: 16px;
    width: 100%;
  `)};

  form {
    max-width: unset;
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 16px;
    .add-user {
      margin-top: 16px;
      /* background-color: ${theme.SECONDARY_3}; */
      width: fit-content;
      padding: 16px 32px;
    }
  }
  &.signup-container {
    .role-item {
      color: white;
    }
  }
`;

export const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  border-radius: 8px;
  width: 100%;

  gap: 16px;
  padding: 32px;
  background-color: ${theme.SECONDARY_2};
`;
