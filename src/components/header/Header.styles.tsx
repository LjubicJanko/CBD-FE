import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 20px;
  background-color: ${theme.PRIMARY_1};
  box-shadow: 0px 2px 6px 2px #00000040;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;

  ${mobile(css`
    align-items: center;
    gap: 4px;
    padding: 16px;
    min-height: 30px;
    height: 80px;
  `)}

  .user-button {
    background-color: ${theme.SECONDARY_3};
  }
`;

export const PublicHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 20px;
  background-color: ${theme.PRIMARY_1};
  box-shadow: 0px 2px 6px 2px #00000040;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px;
    min-height: 30px;
    height: 80px;
  `)}

  .public-header {
    &__with-back-btn {
      display: flex;
      width: 100%;
      align-items: center;

      &--btn {
        color: ${theme.SECONDARY_1};
        width: 24px;
        padding: 0;
      }
      &--title {
        padding: 0;
        /* font-family: Satoshi; */
        font-size: 14px;
        font-weight: 700;
        color: ${theme.SECONDARY_1};
        margin-left: auto;
        margin-right: auto;
      }
    }

    &__language {
      align-self: flex-start;
    }
  }
`;
