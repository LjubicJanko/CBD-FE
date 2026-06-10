import styled from 'styled-components';
import theme from '../../../styles/theme';

// Styled components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  background-color: ${theme.PRIMARY_1};
  color: ${theme.ERROR_TEXT};
  padding: 20px;
  border: 1px solid ${theme.ERROR};
  border-radius: 10px;
  box-shadow: 0 4px 8px ${theme.SHADOW};
`;

export const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

export const Message = styled.p`
  font-size: 1.25rem;
  margin: 5px 0;
`;

export const ErrorMessage = styled.i`
  font-style: italic;
  font-size: 1rem;
`;
