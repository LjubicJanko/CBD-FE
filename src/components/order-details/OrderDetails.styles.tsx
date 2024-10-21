import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  p {
    margin: 0;
  }

  form {
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
  }

  .tracking-id {
    display: flex;
    align-items: center;
    margin-left: 0;
    width: fit-content;
    padding: 4px;
    border-radius: 10px;
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
