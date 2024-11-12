import styled from 'styled-components';

export const OrderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.1) 0px 6px 10px -1px;
  transform: translateY(-2px);

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

    .status-chip {
      width: 60%;
    }

    &--paused {
      background-color: rgba(255, 255, 102, 0.1);
    }
    &--selected {
      box-shadow: inset rgba(0, 0, 0, 0.2) 0px 4px 6px -1px,
        inset rgba(0, 0, 0, 0.1) 0px 6px 10px -1px;
      transform: translateY(1px);

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
