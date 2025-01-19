import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile, tablet } from '../../util/breakpoints';

export const Container = styled.div`
  display: grid;

  width: 100%;

  justify-content: space-between;

  align-items: center;

  grid-template-areas:
    'filter total search create'
    'pagination pagination active-filters active-filters';

  row-gap: 20px;

  ${tablet(css`
    grid-template-areas:
      'filter total'
      'search create'
      'pagination active-filters';
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 8px;
  `)}

  ${mobile(css`
    grid-template-areas:
      'filter create'
      'active-filters active-filters'
      'search search'
      'pagination pagination'
      'total total';

    /* display: flex; */
    /* flex-direction: column; */

    /* >* {
			width: 100%;
			display: flex;
			justify-content: center;
		} */
  `)}
	

  .dashboard-header {
    &__filter {
      grid-area: filter;

      border-radius: 20px;
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
      align-items: end;

      ${tablet(css`
        width: fit-content;
      `)}

      ${mobile(css`
        width: 100%;
      `)}
    }

    &__total {
      grid-area: total;

      color: ${theme.PRIMARY_2};
      font-size: 24px;
      text-transform: uppercase;
      align-items: end;
      text-align: right;

      ${tablet(css`
        text-align: left;
      `)}

      ${mobile(css`
        width: 100%;
        text-align: center;
      `)}
    }

    &__search {
      grid-area: search;
			display: flex;
      ${tablet(css`
        align-items: start;
        justify-content: left;
      `)}
    }

    &__create {
      grid-area: create;

      display: flex;
      justify-content: end;
      width: 100%;

      ${tablet(css`
        justify-content: left;
      `)}

      &--btn {
        color: ${theme.PRIMARY_1};
        background-color: ${theme.PRIMARY_2};
        border-radius: 20px;
        width: fit-content;
        ${mobile(css`
          width: 100%;
        `)}
      }
    }

    &__pagination {
      grid-area: pagination;

      ${mobile(css`
        display: flex;
        justify-content: center;
      `)}

      button {
        color: ${theme.PRIMARY_2};
        &.Mui-selected {
          background-color: ${theme.PRIMARY_2};
          color: ${theme.PRIMARY_1};
        }
      }
    }

    &__active-filters {
      grid-area: active-filters;

      display: flex;
      gap: 14px;

      ${tablet(css`
        justify-content: left;
        flex-wrap: wrap;
      `)}

      ${mobile(css`
        display: none;
      `)}

      &--chip {
        color: ${theme.PRIMARY_2};
        border: 2px solid ${theme.PRIMARY_2};
        border-radius: 20px;
        padding: 8px 12px;
        white-space: nowrap;
        text-transform: lowercase;
      }
    }
  }
`;
