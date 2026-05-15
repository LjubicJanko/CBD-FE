import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const OrderExtensionContainer = styled.div`
  max-width: 1000px;
  margin: 32px auto;
  padding: 32px;
  background: ${theme.SECONDARY_3};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  .order-extension__title {
    text-align: center;
    margin-bottom: 24px;
    color: ${theme.PRIMARY_2};
  }

  .order-extension__form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;

    ${tablet(css`
      grid-template-columns: 1fr;
    `)};
  }

  .order-extension__left,
  .order-extension__right {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .extension-page-instagram-button {
    ${tablet(css`
      position: relative;
      margin-top: 32px;
    `)}
  }

  .order-extension {
    &__loader {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    &__brand {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 8px 0 20px;
      margin-bottom: 24px;
      border-bottom: 1px solid ${theme.PRIMARY_2}33;

      ${tablet(css`
        gap: 14px;
        padding-bottom: 16px;
        margin-bottom: 20px;
      `)};

      &__logo {
        width: 72px;
        height: 72px;
        object-fit: contain;

        ${tablet(css`
          width: 56px;
          height: 56px;
        `)};
      }

      &__name {
        margin: 0;
        color: ${theme.PRIMARY_2};
        font-family: 'Afacad', serif;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 0.5px;
        line-height: 1.1;

        ${tablet(css`
          font-size: 28px;
        `)};
      }
    }

    &__disclaimer {
      border-radius: 8px;
      padding: 8px;
      grid-column: 1 / span 2;
      ${tablet(css`
        grid-column: span 1;
      `)};
    }
    &__form {
      &__submit {
        grid-column: span 2;
        margin-top: 16px;
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        width: fit-content;
        justify-self: flex-end;

        ${tablet(css`
          grid-column: span 1;
        `)};

        &--disabled {
          background-color: ${theme.SECONDARY_2};
          opacity: 0.7;
        }
      }
    }
  }
`;
