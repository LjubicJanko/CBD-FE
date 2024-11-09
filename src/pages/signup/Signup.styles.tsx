import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 16px;
  padding: 32px;

  ${mobile(css`
    padding: 16px;
  `)};

  form {
    width: 800px;

    ${mobile(css`
      max-width: unset;
      width: 100%;
    `)};

    display: flex;
    flex-direction: column;

    gap: 16px;
  }
`;
