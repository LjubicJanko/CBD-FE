import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';

export const OrderDetailsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;

  .tracking-id {
    display: flex;
    align-items: center;
    margin-left: 0;
    width: fit-content;
    padding: 4px;
    border-radius: 10px;
  }

  /* form {
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
  } */

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;

    ${tablet(css`
      position: relative;
    `)};

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
