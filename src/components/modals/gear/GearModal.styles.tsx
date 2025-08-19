import styled, { css } from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const GearModalContainer = styled(CbdModal)`
  min-width: 250px;
  background-color: ${theme.PRIMARY_1};
  width: 770px;
  padding: 48px 80px 32px 80px;
  justify-content: space-between;

  ${tablet(css`
    padding: 24px 40px 16px 40px;
  `)}

  &.gear-modal {
    h2 {
      font-weight: 400;
      color: ${theme.SECONDARY_1};
      font-size: 32px;
      line-height: 25px;
      text-align: center;
      vertical-align: middle;
      margin-top: 48px;
      margin-bottom: 48px;
    }

    .MuiTextField-root,
    .MuiFormControl-marginNormal {
      margin: 0;
    }

    .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      color: ${theme.PRIMARY_2};
      border-color: ${theme.SECONDARY_1} !important;
      border-width: 2px;
      border-radius: 8px;
      -webkit-text-fill-color: ${theme.SECONDARY_1};
      caret-color: ${theme.SECONDARY_1};
    }

    .MuiInputBase-input {
      padding: 8px;
      caret-color: ${theme.PRIMARY_2};
      color: ${theme.SECONDARY_1};
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px ${theme.PRIMARY_1} inset;
        -webkit-text-fill-color: ${theme.PRIMARY_2};
        caret-color: ${theme.PRIMARY_2};
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }

  .gear-modal {
    &__fields {
      display: flex;
      flex-direction: column;
      gap: 32px;

      &__categories {
        max-width: 50%;
        ${tablet(css`
          max-width: unset;
        `)}
      }
      &__confirm {
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        margin-top: 32px;
        margin-right: -50px;
        align-self: flex-end;
        border-radius: 25px;
        font-family: Afacad;
        font-weight: 400;
        font-size: 24px;
        line-height: 25px;
        letter-spacing: 0%;

        ${tablet(css`
          margin-right: unset;
        `)}
      }
    }
  }
`;
