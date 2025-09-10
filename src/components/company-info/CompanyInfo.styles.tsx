import styled from 'styled-components';

export const CompanyInfoContainer = styled.div`
  .company-info-form {
    display: grid;
    grid-template-areas:
      'logo logo logo'
      'nameInput currencyInput vatInput'
      'link link link'
      'colors colors colors'
      'actions actions actions';

    grid-column-gap: 100px;
    grid-row-gap: 20px;

    &__logo {
      grid-area: logo;
    }
    &__name-input {
      grid-area: nameInput;
      .MuiFormControl-root {
        margin: 0;
      }
    }
    &__currency-input {
      grid-area: currencyInput;
    }
    &__vat-input {
      grid-area: vatInput;
    }

    &__link {
      grid-area: link;
    }

    &__colors {
      grid-area: colors;
      .MuiInputBase-input {
        padding: 0;
      }

      .MuiOutlinedInput-notchedOutline {
        border-width: 0px;
      }
    }

    &__actions {
      grid-area: actions;
      display: flex;
      justify-content: space-between;
    }
  }
`;
