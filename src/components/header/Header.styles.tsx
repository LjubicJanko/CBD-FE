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
  height: 104px;
  padding: 32px;
  background-color: ${theme.primaryBackground};
  box-shadow: 0px 2px 6px 2px #00000040;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px;
    min-height: 30px;
    height: 80px;
  `)}

  .header {
    &__logo {
      width: 50px;
      cursor: pointer;
    }
    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;

      ${mobile(css`
        width: 100%;
        justify-content: space-between;
      `)}

      &__language {
        display: flex;
        gap: 8px;

        &__menu-item {
          background-color: ${theme.primaryBackground};
        }

        &__button {
          cursor: pointer;

          &__flag {
            width: 25px;

            ${mobile(css`
              width: 20px;
            `)}

            &--selected {
              position: relative;
              display: inline-block;
              box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
                rgba(0, 0, 0, 0.23) 0px 6px 6px;
              width: 30px;

              ${mobile(css`
                width: 25px;
              `)}
            }
          }
        }
      }
    }
  }
`;
