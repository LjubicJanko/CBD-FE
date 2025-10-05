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

  .order-extension {
    &__form {
      &__submit {
        grid-column: span 2;
        margin-top: 16px;
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};

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
