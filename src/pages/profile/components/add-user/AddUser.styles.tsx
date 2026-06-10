import styled, { css } from 'styled-components';
import theme, { withAlpha } from '../../../../styles/theme';
import { mobile, tablet } from '../../../../util/breakpoints';

export const AddUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  gap: 32px;

  form {
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px;
    border-radius: 12px;
    background-color: ${theme.SURFACE_2};
    border: 1px solid ${theme.BORDER};

    ${tablet(css`
      max-width: 100%;
    `)}

    ${mobile(css`
      padding: 20px;
    `)}

    h3 {
      margin: 0;
      color: ${theme.PRIMARY_2};
      font-size: 20px;
      font-weight: 700;
    }

    .MuiOutlinedInput-root {
      border-radius: 10px;
      background-color: ${theme.SURFACE_2};

      .MuiOutlinedInput-notchedOutline {
        border-color: ${theme.BORDER_STRONG} !important;
      }

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${withAlpha(theme.PRIMARY_2, 0.5)} !important;
      }

      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${theme.PRIMARY_2} !important;
        border-width: 1px !important;
      }

      input {
        color: ${theme.SECONDARY_1};
      }

      .MuiIconButton-root {
        color: ${theme.SECONDARY_2};
      }
    }

    .MuiInputLabel-root {
      color: ${theme.SECONDARY_2} !important;

      &.Mui-focused {
        color: ${theme.PRIMARY_2} !important;
      }
    }

    .MuiSelect-select {
      color: ${theme.SECONDARY_1};
    }

    .MuiSelect-icon {
      color: ${theme.SECONDARY_2};
    }

    .add-user {
      margin-top: 8px;
      width: 100%;
      padding: 12px 32px;
      border-radius: 10px;
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
      font-weight: 700;
      font-size: 14px;

      &:hover {
        background-color: ${withAlpha(theme.PRIMARY_2, 0.85)};
      }

      &--disabled {
        background-color: ${theme.SECONDARY_3} !important;
        color: ${theme.PRIMARY_1};
        opacity: 0.5;
      }
    }
  }
`;

export const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;

  h3 {
    margin: 0;
    color: ${theme.SECONDARY_1};
    font-size: 18px;
    font-weight: 700;
  }
`;
