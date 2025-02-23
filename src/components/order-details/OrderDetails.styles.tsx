import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const OrderDetailsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: ${theme.SECONDARY_2};

  .order-details {
    display: flex;

    &__header {
      display: flex;
      justify-content: space-between;

      ${tablet(css`
        flex-direction: column-reverse;
        gap: 16px;
      `)}

      &__tracking-id {
        display: flex;
        align-items: center;
        margin-left: 0;
        width: fit-content;
        padding: 4px;
        border-radius: 10px;

        color: ${theme.SECONDARY_1};
        font-weight: bold;

        button {
          color: ${theme.PRIMARY_2};
        }
      }

      &__actions {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 8px;

        &--btn {
          border-radius: 50%;
          color: ${theme.PRIMARY_1};
          background-color: ${theme.PRIMARY_2};
          margin: 0;
          padding: 5px;
        }
      }
    }

    &__stepper-container {
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

      svg {
        color: ${theme.SECONDARY_1};

        text {
          color: ${theme.PRIMARY_1};
          fill: ${theme.PRIMARY_1};
          font-size: 16px;
        }

        &.Mui-active {
          color: ${theme.PRIMARY_2};
        }

        &.Mui-completed {
          color: ${theme.PRIMARY_2};
        }
      }

      .MuiStepLabel-label {
        color: ${theme.SECONDARY_1};
      }

      .MuiStep-root {
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

      &__stepper-mobile {
        .MuiStep-root {
          border-radius: 50%;
          height: 20px;
          width: 20px;
          background-color: ${theme.SECONDARY_1};
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

      &__buttons {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        button {
          border-radius: 20px;
          color: ${theme.PRIMARY_1};
          background-color: ${theme.PRIMARY_2};
          gap: 4px;

          ${mobile(css`
            width: 100%;
          `)};
        }
      }
    }

    &__tabs-box {
      border-bottom: 1px solid ${theme.SECONDARY_1};

      button {
        color: ${theme.SECONDARY_1};
        text-transform: capitalize;

        &.Mui-selected {
          color: ${theme.PRIMARY_2};
        }
      }

      .MuiTabs-indicator {
        background-color: ${theme.PRIMARY_2};
        height: 2px;
      }
    }
  }

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

  hr {
    border-color: ${theme.SECONDARY_1};
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
