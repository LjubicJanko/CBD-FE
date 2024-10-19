import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 60px;
  padding: 32px;
  background-color: gray;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    min-height: 40px;
  `)}

  .header {
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
