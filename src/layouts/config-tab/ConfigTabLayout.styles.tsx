import styled from 'styled-components';
import theme from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.SECONDARY_2};
  padding: 1rem;

  h2 {
    margin: 0;
    color: ${theme.SECONDARY_1};
    font-size: 1.25rem;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.SECONDARY_1};
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid ${theme.SECONDARY_2};
  padding: 1rem;

`;
