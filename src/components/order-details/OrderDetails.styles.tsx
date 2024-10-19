import styled from 'styled-components';

export const OrderDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  p {
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .tracking-id {
    display: flex;
    align-items: center;
    margin-left: 0;
    width: fit-content;
    padding: 4px;
    border-radius: 10px;
  }

  button {
    width: fit-content;
    display: flex;
    align-self: flex-end;
  }
`;
