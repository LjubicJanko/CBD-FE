import styled, { css } from 'styled-components';
import { tablet } from '../../../../util/breakpoints';
import theme from '../../../../styles/theme';

export const OrderInfoFormContainer = styled.form`
  display: flex;

  gap: 10%;

  width: 100%;

  ${tablet(css`
    flex-direction: column;
    gap: 16px;
  `)}

  color: ${theme.SECONDARY_1};

  .order-info {
    &__left,
    &__right {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 12px;
    }

    &__calculations {
      display: grid;
      grid-column-gap: 30px;
      grid-template-columns: max-content;
      grid-row-gap: 8px;
      font-size: 20px;
      margin: 0;

      dt {
        font-weight: bold;
      }
      dd {
        margin: 0;
        grid-column-start: 2;
      }
    }

    &__is-legal {
      margin: 0;

      .MuiCheckbox-root {
        padding: 0;
        color: ${theme.PRIMARY_2};
      }

      .Mui-checked {
        color: ${theme.PRIMARY_2};
      }
    }

    &__save-changes {
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .MuiTextField-root {
    color: ${theme.SECONDARY_1};
  }

  .MuiOutlinedInput-root {
    color: ${theme.SECONDARY_1};
    border-color: ${theme.SECONDARY_1};
  }

  .MuiOutlinedInput-root.Mui-focused {
    border-color: ${theme.SECONDARY_1};
  }

  .MuiFormLabel-root {
    color: ${theme.SECONDARY_1};
  }

  .MuiFormHelperText-root {
    color: ${theme.SECONDARY_1};
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.SECONDARY_1};
  }
`;
