import styled from 'styled-components';

export const NoContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .no-content-img {
    width: 200px;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 10px;
  font-size: 18px;
  color: #f44336;
  font-weight: bold;
`;
