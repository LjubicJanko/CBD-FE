import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';

export const OrderDetailsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;

  .execution-chip {
    width: fit-content;
    background-color: #ffeb3b;

    &--canceled {
      background-color: #b71c1c;
      color: white;
    }

    ${mobile(css`
      align-self: center;
    `)}
  }

  .tracking-id {
    display: flex;
    align-items: center;
    margin-left: 0;
    width: fit-content;
    padding: 4px;
    border-radius: 10px;
  }

  .status-history-butons {
    display: flex;
    justify-content: space-between;
    ${mobile(css`
      flex-direction: column-reverse;
      gap: 8px;

      button {
        width: 100%;
      }
    `)};
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;

    ${tablet(css`
      position: relative;
    `)};

    ${mobile(css`
      flex-direction: column;
      button {
        width: 100%;
      }
    `)}

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 4px;
    }
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
