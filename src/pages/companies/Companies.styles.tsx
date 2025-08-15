import styled from 'styled-components';
import theme from '../../styles/theme';

export const CompaniesPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  .companies-overview {
    &__company {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      background-color: ${theme.SECONDARY_1};
      border: 1px solid ${theme.SECONDARY_2};
      border-radius: 8px;
    }
  }
`;
