import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const IdTrackingContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 62px;
  gap: 32px;

  background-color: ${theme.primaryBackground};

  ${mobile(css`
    padding: 16px;
    gap: 16px;
    width: 100%;
    display: flex;
    gap: 32px;
    align-items: center;
  `)}

  .id-tracking {
    &__title {
      font-size: 36px;
      word-break: break-word;
      text-align: center;
      ${mobile(css`
        font-size: 24px;
      `)}
    }

    &__search-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      width: 50%;

      ${mobile(css`
        width: 100%;
        justify-content: flex-start;
      `)}

      .order-id-input {
        color: white;
        width: 100%;
      }

      .order-id-search {
        width: 50%;
        ${mobile(css`
          width: 100%;
        `)}
      }
    }
  }
`;
