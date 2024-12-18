import styled, { css } from 'styled-components';
import { tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const CreateOrderPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 64px;
  align-items: center;

  ${tablet(css`
    padding: 32px;
    padding-top: 64px;
  `)}

  .title {
    font-size: 32px;
    color: ${theme.SECONDARY_1};
    font-weight: 400;
  }

  .create-order {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 48px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 50%;
    background-color: ${theme.SECONDARY_3};
    text-align: center;

    ${tablet(css`
      width: 100%;
      padding: 16px;
    `)}

    p {
      font-size: 12px;
      color: red;
      font-weight: 600;
    }

    &--ending-date-input {
      height: 45px;
      width: 200px;
    }

    &__footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 32px;

      &--submit-button {
        /* background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1}; */
      }

      &--cancel-button {
        color: ${theme.PRIMARY_1};
        border-color: ${theme.PRIMARY_1};
      }
    }
  }
`;
