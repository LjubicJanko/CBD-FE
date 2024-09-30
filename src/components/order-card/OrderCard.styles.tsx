import styled from 'styled-components';

export const OrderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 400px;
  cursor: pointer;

  &.order-card {
    h2,
    h3,
    p {
      margin: 0;
    }

    .title {
      font-size: 22px;
      color: #726d68;
      margin-bottom: 8px;
    }

    .description {
      font-size: 18px;
      color: #5e554d;
    }

    .status {
      width: fit-content;
      display: flex;
      align-self: flex-end;
      margin-top: 8px;
    }

    &--selected {
      border: 2px solid red;
    }
  }
`;
