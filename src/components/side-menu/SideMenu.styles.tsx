import styled from 'styled-components';
import theme from '../../styles/theme';

export const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .side-menu__item {
    background: ${theme.PRIMARY_1};
    color: ${theme.PRIMARY_2};
    border-radius: 8px;
    cursor: pointer;
    padding: 1rem;
    text-align: left;
    font-weight: 500;

    &:hover {
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
    }

    &--active {
      background: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
    }
  }
`;
