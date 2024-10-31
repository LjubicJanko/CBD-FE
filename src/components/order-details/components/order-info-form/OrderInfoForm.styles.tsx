import styled, { css } from 'styled-components';
import { mobile } from '../../../../util/breakpoints';

export const OrderInfoFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .order-const-difference {
    display: grid;
    grid-gap: 4px 16px;
    grid-template-columns: max-content;
    grid-row-gap: 8px;
    font-size: 18px;
    margin: 0;

    dt {
      font-weight: bold;
    }
    dd {
      margin: 0;
      grid-column-start: 2;
    }
  }

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
