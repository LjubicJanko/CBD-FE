import styled from 'styled-components';

// Styled components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  background-color: #f8d7da; /* Light red background */
  color: #721c24; /* Dark red text */
  padding: 20px;
  border: 1px solid #f5c6cb; /* Light red border */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
