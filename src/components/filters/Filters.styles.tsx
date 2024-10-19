import styled from 'styled-components';

export const FiltersComponentContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  .add-button {
    margin-right: 32px;
  };

  .filter-button,
  .reset-filters {
    border-radius: 16px;
    height: 32px;
    box-sizing: border-box;
    max-width: 100%;
  }
  .reset-filters {
    margin-left: 8px;
  }
`;
