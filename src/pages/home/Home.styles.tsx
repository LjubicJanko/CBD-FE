import styled, { css } from 'styled-components';
import { laptop, mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 72px;
  padding: 40px;

  ${laptop(css`
    gap: 48px;
    padding: 32px;
  `)}

  ${tablet(css`
    flex-direction: row;
    gap: 8px;
    height: 80vh;
    padding: 0;
  `)}

  ${mobile(css`
    flex-direction: column;
    max-height: 80vh;
    padding-top: 16px;
  `)}

  .home {
    &__tracking-panel {
      background-image: url('id_tracking.png');
    }

    &__order-panel {
      background-image: url('order_shirt.jpg');
    }

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

    &__instagram {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 32px;
      width: fit-content;

      font-weight: 400;
      font-size: 24px;
      letter-spacing: 0%;
      text-align: center;
      color: ${theme.PRIMARY_2};

      ${tablet(css`
        bottom: 8px;
        font-size: 18px;
      `)}

      ${mobile(css`
        bottom: 2px;
        font-size: 12px;
      `)}
    }
  }
`;
