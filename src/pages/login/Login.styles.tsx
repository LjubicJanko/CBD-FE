import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 124px;
  align-items: center;
  background-color: ${theme.PRIMARY_1};

  ${mobile(css`
    padding: 8px;
    padding-top: 32px;
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
  }

  .login-container {
    &__username,
    &__password {
      display: flex;
      flex-direction: column;
      .MuiInputBase-root {
        border-radius: 25px;
        background-color: ${theme.PRIMARY_1};
      }
    }

    &__title {
      font-weight: 400;
      font-size: 32px;
      line-height: 25px;
      text-align: center;
      vertical-align: middle;
      color: ${theme.PRIMARY_2};
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

    &__instagram {
      color: ${theme.PRIMARY_2};
      position: absolute;
      bottom: 36px;
      left: 50%;
      right: 50%;
      gap: 4px;
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
    width: fit-content;
    gap: 32px;
    background-color: ${theme.PRIMARY_1};
    border-radius: 20px;
    border: 2px solid ${theme.PRIMARY_2};
    padding: 48px 100px;
    width: 607px;
    height: 424px;

    ${tablet(css`
      padding: 32px;
    `)}

    .fields {
      display: flex;
      flex-direction: column;
      gap: 30px;
      width: 100%;
    }

    .login-btn {
      background-color: ${theme.PRIMARY_2};
      color: black;
      width: fit-content;
      align-self: center;
    }
  }
`;