import styled from 'styled-components';

export const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.dashboard-page {
    display: grid;
    grid-template-areas:
      'filters search'
      'orders details';
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
    padding: 16px;
    padding-left: 32px;
    padding-right: 32px;

    .loader-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    .filters {
      grid-area: filters;
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .filter-button,
      .reset-filters {
        border-radius: 16px;
        height: 40px;
        box-sizing: border-box;
        max-width: 100%;
      }
      .reset-filters {
        margin-left: 16px;
      }
    }

    .search {
      grid-area: search;
      height: 40px;
      display: flex;
      justify-self: end;
      padding: 2px 4px;
      display: 'flex';
      align-items: 'center';
      width: 400px;

      .input-base {
        margin-left: 1px;
        flex: 1;
      };
      .icon-button {
        padding: 10px;
      }
    }

    .orders {
      grid-area: orders;
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding: 8px;
    }

    .details {
      grid-area: details;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      padding: 8px;
      padding-bottom: 16px;
      height: fit-content;
    }
  }
`;
