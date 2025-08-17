import styled from 'styled-components';
import theme from '../../styles/theme';

export const CompanyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 16px;

  .back-btn {
    width: fit-content;
  }

  .company-info {
    display: grid;
    grid-template-columns: 200px 1fr;
    /* Todo responsive */
    gap: 16px;
    height: 100%;

    &__heading {
      display: flex;
      gap: 16px;
      align-items: center;

      &__back-btn {
        width: fit-content;
        color: ${theme.PRIMARY_2};
      }
      &__title {
        font-weight: 400;
        font-size: 32px;
        line-height: 25px;
        color: ${theme.PRIMARY_2};
        margin: 0;
      }
    }


    &__content-column {
      flex: 1;
      background-color: ${theme.PRIMARY_1};
      border: 1px solid ${theme.SECONDARY_2};
      border-radius: 8px;
      padding: 2rem;
      color: ${theme.SECONDARY_1};
    }
  }
`;
