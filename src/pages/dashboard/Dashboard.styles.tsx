import styled, { css } from 'styled-components';
import { laptop, mobile, tablet } from '../../util/breakpoints';
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
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
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
      background-color: ${theme.SECONDARY_2};
      border-radius: 20px;
      border: 2px solid ${theme.PRIMARY_2};
      width: 100%;
      /* flex-grow: 1; */
      /* max-width: 60%; */

      ${laptop(css`
        /* max-width: 80%; */
      `)}

      ${tablet(css`
        /* max-width: 100%; */
      `)}

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
