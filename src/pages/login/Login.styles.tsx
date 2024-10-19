import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 64px;
  align-items: center;
  justify-content: center;

  ${mobile(css`
    padding: 8px;
    padding-top: 32px;
  `)}

  form {
    display: flex;
    flex-direction: column;
    width: fit-content;
    padding: 32px;
    gap: 32px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    .fields {
      display: flex;
      flex-direction: column;
      width: fit-content;
      gap: 8px;
    }
  }
`;
