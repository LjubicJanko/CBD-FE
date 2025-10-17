import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { laptop, belowTablet, mobile, tablet } from '../../util/breakpoints';

export const SectionContainer = styled.section`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: fit-content;

  ${tablet(css`
    max-width: unset;
    max-height: 100%;
  `)}

  ${mobile(css`
    flex: 1;
  `)}

  .section {
    flex: 0 0 auto;
    padding: 32px;

    &__panel {
      position: relative;
      width: 432px;
      height: 623px;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      overflow: hidden;
      outline: none;
      border: 2px solid ${theme.PRIMARY_2};

      ${laptop(css`
        width: 320px;
        height: 460px;
      `)}

      ${tablet(css`
        max-height: unset;
        height: 100%;
        width: 100%;
      `)}

      ${mobile(css`
        height: 40vh;
        width: 100%;
      `)}


      &__title {
        font-weight: 400;
        font-size: 40px;
        letter-spacing: 0%;
        color: ${theme.PRIMARY_2};
        font-family: Afacad;
        line-height: 75px;
        text-align: center;
        text-transform: uppercase;
        z-index: 2;
        position: relative;

        ${belowTablet(css`
          font-size: 28px;
          line-height: 1.2;
        `)}

        ${mobile(css`
          font-size: 24px;
        `)}
      }

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        transition: opacity 0.3s ease;
        z-index: 1;
      }

      &:hover::before,
      &:focus-visible::before {
        opacity: 0.1;
      }

      &:hover,
      &:focus-visible {
        transform: scale(1.05);
        z-index: 10;
        cursor: pointer;
      }
    }
  }
`;
