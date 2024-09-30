import styled from 'styled-components';

export const OrderTrackingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* width: 60%; */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  p {
    margin: 0;
  }
  .order-header {
    /* background-color: gray; */
    border-bottom: 1px solid black;
    padding: 32px;
  }
  .order-body {
    padding: 32px;
  }
`;
