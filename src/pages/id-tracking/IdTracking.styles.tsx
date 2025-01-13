import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const LoaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

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
      .order-id-search-btn:disabled {
        background-color: ${theme.SECONDARY_2};
        color: rgb(100, 100, 100);
        opacity: 0.6;
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
    background-color: ${theme.PRIMARY_1};

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
      width: 70%;
      display: flex;
      flex-direction: column;
      gap: 6px;

      ${mobile(css`
        width: 100%;
      `)}

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
      width: 70%;
      background-color: rgba(255, 255, 255, 0.12);
      margin-top: 10px;
      border-radius: 8px;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 60px 100px;
      gap: 12px;

      ${tablet(css`
        flex-direction: column;
        gap: 0;
      `)}

      ${mobile(css`
        width: 100%;
        padding: 60px 16px;
        margin-top: 15px;
      `)}

      img {
        margin-bottom: 50px;
        max-width: 50%;

        ${tablet(css`
          max-width: 100%;
        `)}
      }

      &--text {
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 14px;
        color: ${theme.SECONDARY_1};
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        max-width: 50%;

        ${tablet(css`
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: unset;
        `)}

        .title {
          font-family: Satoshi;
          font-size: 22px;
          font-weight: 900;
          text-align: left;

          ${tablet(css`
            text-align: center;
          `)}
        }
      }
    }

    &__order-info {
      width: 70%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      ${mobile(css`
        width: 100%;
      `)}

      &--title {
        padding-left: 8px;
        color: ${theme.SECONDARY_1};
        font-size: 12px;
        font-weight: 700;
      }

      &__container {
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.12);
        padding: 70px;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        row-gap: 12px;
        justify-content: center;
        margin-bottom: 50px;
        max-width: 100%;

        &--description {
          grid-column: span 4;
          max-width: 100%;
          white-space: pre-line;
          overflow: auto;
          ${tablet(css`
            grid-column: span 2;
          `)}
        }

        &--link-btn {
          color: ${theme.SECONDARY_1};
          border-color: ${theme.PRIMARY_1};
        }

        ${tablet(css`
          padding: 24px;
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
