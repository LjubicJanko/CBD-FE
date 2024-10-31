import styled from 'styled-components';

export const OrderPaymentsContainer = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-weight: 600;
    margin-bottom: 32px;
  }

  .no-content {
    width: 200px;
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 32px;
  }
`;
