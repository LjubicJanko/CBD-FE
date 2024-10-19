import styled from 'styled-components';

export const CreateOrderPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  .title {
    font-size: 48px;
    color: cadetblue;
    font-weight: 400;
  }

  .create-order {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 48px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 50%;
    height: 100%;

    &--ending-date-input {
      height: 45px;
      width: 200px;
    }

    &__footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
    }
  }
`;
