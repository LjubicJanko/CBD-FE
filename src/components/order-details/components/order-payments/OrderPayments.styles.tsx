import styled from 'styled-components';

export const OrderPaymentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  h2 {
    font-weight: 600;
    margin-bottom: 32px;
  }

  .no-content {
    width: 200px;
  }

  .data {
    display: flex;
    flex-direction: column;
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 32px;
    justify-self: end;
  }

  .edit {
    padding: 0;
    button {
      padding: 0;
      width: fit-content;
    }
  }
`;
