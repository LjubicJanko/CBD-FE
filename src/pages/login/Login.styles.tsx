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

  .login-container {
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

  form {
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 32px;
    background-color: #ffffff1f;
    padding: 40px;
    border-radius: 20px;

    ${tablet(css`
      padding: 32px;
    `)}

    .MuiInputBase-root {
      color: white;
      border-color: white;
    }

    .fields {
      display: flex;
      flex-direction: column;
      width: fit-content;
      gap: 8px;
    }

    .login-btn {
      background-color: ${theme.PRIMARY_2};
      color: black;
      width: fit-content;
      align-self: center;
    }
  }
`;
