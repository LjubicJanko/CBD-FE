import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.dashboard-page {
    padding: 16px;
    padding-left: 32px;
    padding-right: 32px;
    gap: 32px;

    ${mobile(css`
      padding: 16px;
    `)}

    .loader-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .search {
      height: 40px;
      display: flex;
      justify-self: end;
      padding: 2px 4px;
      display: 'flex';
      align-items: 'center';
      width: 400px;
      ${tablet(css`
        width: 100%;
      `)}

      .input-base {
        margin-left: 1px;
        flex: 1;
      }
      .icon-button {
        padding: 10px;
      }
    }

    .orders {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding: 8px;
    }

    .details {
      ${tablet(css`
        position: absolute;
        left: 0;
        top: 80px;
      `)}
      background-color: ${theme.SECONDARY_2};
      border-radius: 20px;
      border: 2px solid ${theme.PRIMARY_2};
      width: 100%;

      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      padding: 16px;
      padding-bottom: 16px;
      height: fit-content;
      margin-bottom: 16px;
    }
  }

  .dashboard-page {
    display: flex;
    flex-direction: column;

    &__body {
      display: flex;
      justify-content: space-between;
      gap: 64px;

      ${tablet(css`
        flex-direction: column;
        gap: 64px;
      `)}
    }
  }
`;
