import styled from 'styled-components';
import theme from '../../styles/theme';

export const CompaniesPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  gap: 64px;
  padding-top: 86px;

  &.companies-overview {
    h1 {
      font-weight: 400;
      font-size: 32px;
      line-height: 25px;
      text-align: center;
      vertical-align: middle;
      margin: 0;
      color: ${theme.PRIMARY_2};
    }
  }
  .companies-overview {
    &__list {
      display: flex;
      flex-direction: column;
      gap: 26px;

      &__company {
        width: 386px;
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: ${theme.PRIMARY_1};
        border: 3px solid ${theme.PRIMARY_2};
        border-radius: 8px;
        color: ${theme.PRIMARY_2};
        font-size: 24px;
        cursor: pointer;

        
        &:hover {
          background-color: ${theme.PRIMARY_2};
          color: ${theme.PRIMARY_1};
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
`;
