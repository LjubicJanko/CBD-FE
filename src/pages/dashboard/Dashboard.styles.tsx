import styled, { css } from 'styled-components';
import { tablet } from '../../util/breakpoints';

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

    &__header {
      display: flex;
      justify-content: space-between;
      ${tablet(css`
        flex-direction: column;
      `)}
    }

    &__body {
      display: flex;
      justify-content: space-between;
      ${tablet(css`
        flex-direction: column;
      `)}
    }
  }
`;
