import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 62px;
  gap: 32px;

  .search-container {
    display: flex;
    flex-direction: column;
    width: 600px;
    .order-id-input {
      color: white;
      width: 100%;
    }
    .order-id-search {
      width: 100%;
    }
  }
`;
