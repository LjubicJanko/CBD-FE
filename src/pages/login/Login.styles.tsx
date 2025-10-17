import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 124px;
  align-items: center;
  background-color: ${theme.PRIMARY_1};

  ${mobile(css`
    padding: 32px 16px 16px 16px;
  `)}

  .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    color: ${theme.PRIMARY_2};
    border-color: ${theme.PRIMARY_2} !important;
    border-width: 2px;
    border-radius: 25px;
    -webkit-text-fill-color: ${theme.PRIMARY_2};
    caret-color: ${theme.PRIMARY_2};
  }

  .MuiInputBase-input {
    padding: 8px;
    caret-color: ${theme.PRIMARY_2};
    color: ${theme.PRIMARY_2};

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px ${theme.PRIMARY_1} inset;
      -webkit-text-fill-color: ${theme.PRIMARY_2};
      caret-color: ${theme.PRIMARY_2};
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  label {
    color: ${theme.PRIMARY_2};
    font-weight: 400;
    font-size: 20px;
    line-height: 25px;
    margin-left: 8px;

    ${mobile(css`
      font-size: 16px;
    `)}
  }

  .login-container {
    &__username,
    &__password {
      display: flex;
      flex-direction: column;
      width: 100%;

      .MuiInputBase-root {
        border-radius: 25px;
        background-color: ${theme.PRIMARY_1};
      }
    }

    &__title {
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      text-align: center;
      color: ${theme.PRIMARY_2};

      ${mobile(css`
        font-size: 24px;
      `)}
    }

    &__loader-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  }

  .login-container__password {
    .MuiButtonBase-root {
      color: ${theme.PRIMARY_2};
    }
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 607px;
    gap: 32px;
    background-color: ${theme.PRIMARY_1};
    border-radius: 20px;
    border: 2px solid ${theme.PRIMARY_2};
    padding: 48px 32px;

    ${tablet(css`
      padding: 32px;
    `)}

    ${mobile(css`
      padding: 24px 16px;
      gap: 24px;
    `)}

    .fields {
      display: flex;
      flex-direction: column;
      gap: 30px;

      ${mobile(css`
        gap: 16px;
      `)}
    }

    .login-btn {
      background-color: ${theme.PRIMARY_2};
      color: black;
      width: 100%;
      max-width: 200px;
      align-self: center;
      padding: 12px 24px;

      ${mobile(css`
        max-width: 100%;
      `)}
    }
  }
`;
