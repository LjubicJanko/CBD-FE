import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 124px;
  background-color: ${theme.PRIMARY_1};

  ${mobile(css`
    padding: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 130px;
  `)}

  .home {
    &__title {
      font-family: Inter;
      font-size: 14px;
      font-weight: 300;
      text-align: left;
      text-decoration-skip-ink: none;
      color: ${theme.SECONDARY_1};
      margin-top: 30px;
      margin-bottom: 60px;

      ${mobile(css`
        margin-top: 18px;
        margin-bottom: 27px;
        font-weight: 200;
      `)}
    }

    &__actions {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &__login-btn,
      &__track-btn {
        white-space: nowrap;
      }

      &__login-btn {
        background-color: ${theme.PRIMARY_2};
        color: black;
      }
      &__track-btn {
        color: ${theme.PRIMARY_2};
        background-color: transparent;
        border-color: ${theme.PRIMARY_2};
      }
    }
  }
`;
