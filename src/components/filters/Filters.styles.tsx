import styled, { css } from 'styled-components';
import { mobile, tablet } from '../../util/breakpoints';

export const FiltersComponentContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  ${tablet(css`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `)};

  ${mobile(css`
    display: flex;
    flex-direction: column;
  `)}

  .add-button {
    margin-right: 32px;
    ${tablet(css`
      margin-right: 0;
    `)};
  }

  .filter-button,
  .reset-filters {
    border-radius: 16px;
    height: 32px;
    box-sizing: border-box;
    max-width: 100%;
    height: 40px;

    white-space: nowrap;
    min-width: fit-content;
  }
`;
