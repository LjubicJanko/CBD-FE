import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile } from '../../util/breakpoints';

export const ConfigPageContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  padding: 16px;
  gap: 16px;
  height: 100%;

  &.config-page--general {
    ${mobile(css`
      display: flex;
      flex-direction: column;
    `)}
  }

  .config-page {
    &__content {
      flex: 1;
      background-color: ${theme.PRIMARY_1};
      border: 1px solid ${theme.SECONDARY_2};
      border-radius: 8px;
      padding: 2rem;
      color: ${theme.SECONDARY_1};

      /* this should only apply if class is not ending in --general */
      &:not([class$='--general']) {
        ${mobile(css`
          position: absolute;
          left: 0;
          top: 80px;
          width: 100%;
          height: 100%;
        `)};
      }
    }
  }
`;
