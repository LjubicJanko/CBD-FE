import styled, { css } from 'styled-components';
import { tablet } from '../../util/breakpoints';

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
      gap: 4px;
    }
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
