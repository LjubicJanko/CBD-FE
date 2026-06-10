import styled, { css } from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import { tablet } from '../../../util/breakpoints';
import theme from '../../../styles/theme';

export const FiltersModalContainer = styled(CbdModal)`
  min-width: unset;
  display: flex;
  flex-direction: column;

  gap: 10px;

  padding: 24px 48px;

  background-color: ${theme.PRIMARY_1};

  color: ${theme.SECONDARY_1};

  min-width: 788px;

  max-height: 100%;

  overflow: auto;

  ${tablet(css`
    min-width: unset;
    padding: 24px 36px;
  `)}

  h2 {
    color: ${theme.SECONDARY_1};
    span {
      font-family: 'Afacad', serif;
    }
    padding-bottom: 12px;
    border-bottom: 1px solid ${theme.SECONDARY_2};
    margin-bottom: 16px;

    ${tablet(css`
      margin-bottom: 20px;
    `)};

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .modal-close-button {
    color: ${theme.SECONDARY_1};
    top: 24px;
    right: 48px;
    ${tablet(css`
      top: 24px;
      right: 36px;
    `)}
  }

  .statuses,
  .priorities {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;

    ${tablet(css`
      margin-bottom: 20px;
      gap: 10px;
    `)}

    .filter-button {
      white-space: nowrap;
      width: fit-content;
      color: ${theme.SECONDARY_1};
      border-color: ${theme.SECONDARY_1};
      padding: 6px 24px;

      ${tablet(css`
        flex: 1 1 calc(50% - 5px);
        width: auto;
      `)}
    }
  }

  .sort-row {
    display: flex;
    gap: 16px;
    width: 100%;

    .sort-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    ${tablet(css`
      flex-direction: column;
      gap: 10px;
    `)}
  }

  .archive-radio .MuiFormControlLabel-label {
    color: ${theme.SECONDARY_1};
  }

  .archive-radio .MuiRadio-root {
    color: ${theme.SECONDARY_1};
  }

  .archive-radio .Mui-checked {
    color: ${theme.SECONDARY_1};
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .clear-button {
      border-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_2};
    }
    .submit-button {
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
    }
  }

  .custom-select {
    color: ${theme.SECONDARY_1};
    border: 1px solid ${theme.SECONDARY_1};
  }

  .custom-select .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.SECONDARY_1};
  }

  .custom-select:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.SECONDARY_1};
  }

  .custom-select.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.SECONDARY_1};
  }

  /* Custom styles for MenuItem */
  .MuiMenuItem-root {
    color: ${theme.SECONDARY_1};
    background-color: ${theme.PRIMARY_1};
  }

  .MuiMenuItem-root:hover {
    background-color: ${theme.SURFACE_SOLID};
  }
`;
