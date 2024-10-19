import styled from 'styled-components';

export const OrderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  max-width: 400px;
  cursor: pointer;

  &.order-card {
    min-width: 300px;

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
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

      border: 1px solid rgba(32, 38, 42, 0.15);
    }
  }

  .order-card {
    &__footer {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;
