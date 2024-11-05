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


  .archive-radio {
    display: flex;
  }
`;
