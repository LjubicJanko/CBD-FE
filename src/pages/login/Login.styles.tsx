import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 124px;
  align-items: center;

  ${mobile(css`
    padding: 8px;
    padding-top: 32px;
  `)}

  form {
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 32px;

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
    }
  }
`;
