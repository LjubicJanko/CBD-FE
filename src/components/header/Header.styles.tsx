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
  align-items: center;
  justify-content: center;
  width: 100%;
  font-family: 'Afacad', serif;
  height: 80px;
  padding: 0 20px;
  background-color: ${theme.PRIMARY_1};
  box-shadow: 0px 2px 6px 2px #00000040;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;

  ${mobile(css`
    padding: 0 16px;
  `)}

  .header__menu-btn {
    position: absolute;
    right: 20px;
    color: ${theme.PRIMARY_2};
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(89%) sepia(47%) saturate(587%) hue-rotate(19deg) brightness(104%) contrast(104%);
  }

`;

export const PublicHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 20px;
  background-color: ${theme.PRIMARY_1};
  box-shadow: 0px 2px 6px 2px #00000040;
  font-family: 'Afacad', serif;

  ${mobile(css`
    padding: 0 16px;
  `)}

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(89%) sepia(47%) saturate(587%) hue-rotate(19deg) brightness(104%) contrast(104%);
  }

  .public-header {
    &__with-back-btn {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 8px;

      &--btn {
        color: ${theme.PRIMARY_2};
        width: 24px;
        padding: 0;
      }
      &--title {
        font-size: 14px;
        font-weight: 700;
        color: ${theme.PRIMARY_2};
        margin-left: auto;
        margin-right: auto;
      }
    }

    &__home {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 8px;

      &__login-btn {
        white-space: nowrap;
        background-color: ${theme.PRIMARY_2};
        color: black;
        font-size: 14px;
        font-weight: 700;
        margin-left: auto;
      }
    }
  }
`;
