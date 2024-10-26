import styled, { css } from 'styled-components';
import { mobile } from '../../../../util/breakpoints';

export const OrderInfoFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .date-input-container {
    display: flex;
    gap: 16px;
    align-items: end;

    ${mobile(css`
      flex-direction: column;
      gap: 8px;
    `)};

    div {
      padding-top: 0;
    }
  }
`;
