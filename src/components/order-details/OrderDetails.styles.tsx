import styled, { css } from 'styled-components';
import { laptop, mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

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

  .stepper-container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__status {
      width: 300px;
      border-radius: 20px;
      background-color: ${theme.PRIMARY_2};
      font-family: Satoshi;
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      color: ${theme.PRIMARY_1};
      padding: 12px;
      margin-bottom: 14px;

      ${mobile(css`
        width: 100%;
      `)}
    }

    &__stepper-mobile {
      .MuiStep-root {
        border-radius: 50%;
        height: 20px;
        width: 20px;
        background-color: ${theme.SECONDARY_2};
        padding: 0;

        &.active {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #d4ff004d; //30% of #D4FF00
          height: 40px;
          width: 40px;

          .step {
            background-color: ${theme.PRIMARY_2};
            border-radius: 50%;
            height: 24px;
            width: 24px;
          }
        }
      }
    }

    .status-history-butons {
      display: flex;
      justify-content: space-between;
      ${mobile(css`
        flex-direction: column;
        justify-content: end;
        gap: 8px;

        button {
          width: 100%;
        }
      `)};
    }
  }

  .order-info-container {
    display: flex;
    justify-content: space-between;
    gap: 32px;

    ${tablet(css`
      flex-direction: column;
    `)};

    &__data {
      width: 40%;
      ${laptop(css`
        width: 50%;
      `)}

      ${tablet(css`
        width: 100%;
      `)}
    }
    &__payments {
      flex-grow: 1;
      border-left: 1px solid ${theme.PRIMARY_1};
      padding-left: 16px;
      ${laptop(css`
        width: 50%;
      `)}

      ${tablet(css`
        width: 100%;
        border-top: 1px solid ${theme.PRIMARY_1};
        padding-top: 16px;
        border-left: unset;
        padding-left: unset;
      `)}
    }
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
