import styled from 'styled-components';
import theme from '../../styles/theme';

export const SideMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .side-menu__item {
    background: ${theme.SECONDARY_3};
    color: ${theme.PRIMARY_1};
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid ${theme.SECONDARY_2};
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
