import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const IdTrackingContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 132px;
  gap: 50px;

  background-color: ${theme.PRIMARY_1};

  ${mobile(css`
    padding: 16px;
    gap: 52px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 200px;
  `)}

  .id-tracking {
    &__title {
      font-family: Satoshi;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      white-space: pre-wrap;
      color: ${theme.SECONDARY_2};
      padding: 0;
      max-width: 460px;

      ${mobile(css`
        font-size: 12px;
        white-space: unset;
      `)}
    }

    &__search-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 50%;

      ${mobile(css`
        width: 100%;
        gap: 10px;
        justify-content: flex-start;
      `)}

      .MuiInputBase-root {
        color: ${theme.SECONDARY_1};
        border-color: white;
        height: 41px;
      }

      .order-id-input {
        color: white;
        width: 100%;
      }

      .order-id-search-btn {
        width: 400px;
        background-color: ${theme.PRIMARY_2};
        color: #2d2d2d;
        font-size: 14px;
        ${mobile(css`
          width: 100%;
          font-size: 12px;
        `)}
      }
    }
  }
`;

export const IdTrackingDetailsContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 46px;

  background-color: ${theme.PRIMARY_1};

  ${mobile(css`
    padding: 16px;
    padding-top: 36px;
  `)}

  .id-tracking-details {
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
        margin-bottom: 36px;
      `)}
    }

    &__stepper {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;

      &--title {
        padding-left: 8px;
        color: ${theme.SECONDARY_1};
        font-size: 12px;
        font-weight: 700;
      }

      &--container {
        background-color: rgba(255, 255, 255, 0.12);
        padding: 12px;
        border-radius: 8px;

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
    }

    &__status-info {
      background-color: rgba(255, 255, 255, 0.12);
      margin-top: 10px;
      border-radius: 8px;

      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px 0px;

      ${mobile(css`
        flex-direction: column;
      `)}

      img {
        margin-bottom: 50px;
      }

      &--text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 14px;
        color: ${theme.SECONDARY_1};
        font-size: 16px;
        font-weight: 400;

        .title {
          font-family: Satoshi;
          font-size: 22px;
          font-weight: 900;
        }
      }
    }

    &__order-info {
      width: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &--title {
        padding-left: 8px;
        color: ${theme.SECONDARY_1};
        font-size: 12px;
        font-weight: 700;
      }

      &__container {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.12);
        padding: 24px;

        display: grid;
        grid-template-columns: 1fr;
        justify-content: center;
        margin-bottom: 50px;

        ${mobile(css`
          grid-template-columns: 1fr 1fr;
          grid-row-gap: 18px;
          grid-column-gap: 18px;
        `)}

        div {
          display: flex;
          gap: 4px;
          flex-direction: column;
        }

        p:first-child {
          color: ${theme.SECONDARY_2};
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
        p:last-child {
          color: ${theme.SECONDARY_1};
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
  }
`;
