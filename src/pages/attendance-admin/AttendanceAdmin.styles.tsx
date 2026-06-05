import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile } from '../../util/breakpoints';

export const Container = styled.div`
  width: 100%;
  padding: 24px 32px 48px;
  color: ${(props) => props.theme.SECONDARY_1};

  ${mobile(css`
    padding: 16px 12px 32px;
  `)}

  .attendance-admin__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 16px;

    ${mobile(css`
      flex-direction: column;
      align-items: stretch;
    `)}
  }

  .attendance-admin__title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .attendance-admin__count {
    color: ${(props) => props.theme.PRIMARY_2};
    font-weight: 700;
  }

  /* ---- Filter panel ---------------------------------------------------- */
  .attendance-admin__panel {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;

    /* Inputs (day picker + selects) styled to match the reports page. */
    .MuiOutlinedInput-root {
      font-size: 14px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 10px;

      .MuiOutlinedInput-notchedOutline {
        border-color: rgba(255, 255, 255, 0.12) !important;
      }

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.theme.PRIMARY_2}80 !important;
      }

      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.theme.PRIMARY_2} !important;
        border-width: 1px !important;
      }
    }

    .MuiOutlinedInput-input,
    .MuiSelect-select {
      color: ${(props) => props.theme.SECONDARY_1};
    }

    .MuiInputLabel-root {
      color: ${(props) => props.theme.SECONDARY_2} !important;
      font-size: 14px;

      &.Mui-focused {
        color: ${(props) => props.theme.PRIMARY_2} !important;
      }
    }

    /* Only the picker calendar icon + select arrow — not the day-step
       chevrons or the refresh icon, which theme themselves. */
    .MuiSelect-icon,
    .MuiInputAdornment-root .MuiSvgIcon-root {
      color: ${(props) => props.theme.SECONDARY_2};
    }
  }

  .attendance-admin__day-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .MuiTextField-root {
      width: 160px;
    }
  }

  .attendance-admin__day-step {
    color: ${(props) => props.theme.SECONDARY_1};
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;

    &:hover {
      color: ${(props) => props.theme.PRIMARY_2};
      border-color: ${(props) => props.theme.PRIMARY_2};
      background-color: rgba(212, 255, 0, 0.08);
    }

    &.Mui-disabled {
      opacity: 0.4;
    }
  }

  .attendance-admin__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;

    .MuiTextField-root {
      min-width: 190px;

      ${mobile(css`
        min-width: 0;
        flex: 1 1 100%;
      `)}
    }
  }

  .attendance-admin__open-only {
    align-self: center;
  }

  .attendance-admin__open-only .MuiCheckbox-root {
    color: ${(props) => props.theme.SECONDARY_2};

    &.Mui-checked {
      color: ${(props) => props.theme.PRIMARY_2};
    }
  }

  .attendance-admin__open-only .MuiFormControlLabel-label {
    color: ${(props) => props.theme.SECONDARY_1};
  }

  .attendance-admin__filters-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .attendance-admin__filters-actions-spacer {
    flex: 1;
  }

  /* ---- Buttons: align MUI buttons to the lime/dark theme --------------- */
  .attendance-admin__btn {
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    box-shadow: none;
  }

  .MuiButton-contained.attendance-admin__btn {
    background-color: ${(props) => props.theme.PRIMARY_2};
    color: ${(props) => props.theme.PRIMARY_1};

    &:hover {
      background-color: ${(props) => props.theme.PRIMARY_2};
      opacity: 0.9;
      box-shadow: none;
    }

    &.Mui-disabled {
      background-color: ${(props) => props.theme.PRIMARY_2};
      color: ${(props) => props.theme.PRIMARY_1};
      opacity: 0.4;
    }
  }

  .MuiButton-outlined.attendance-admin__btn {
    color: ${(props) => props.theme.PRIMARY_2};
    border-color: ${(props) => props.theme.PRIMARY_2};

    &:hover {
      border-color: ${(props) => props.theme.PRIMARY_2};
      background-color: rgba(212, 255, 0, 0.1);
    }
  }

  .attendance-admin__refresh {
    color: ${(props) => props.theme.SECONDARY_1};
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;

    &:hover {
      color: ${(props) => props.theme.PRIMARY_2};
      border-color: ${(props) => props.theme.PRIMARY_2};
      background-color: rgba(212, 255, 0, 0.08);
    }

    &.Mui-disabled {
      opacity: 0.4;
    }
  }

  .attendance-admin__loader {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .attendance-admin__empty {
    text-align: center;
    color: ${(props) => props.theme.SECONDARY_2};
    padding: 48px 0;
  }

  /* ---- Table ---------------------------------------------------------- */
  .attendance-admin__table-wrapper {
    background-color: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;

    ${mobile(css`
      background-color: transparent;
      border: none;
      border-radius: 0;
      overflow: visible;
    `)}
  }

  .attendance-admin__table {
    width: 100%;

    .MuiTableCell-root {
      color: ${(props) => props.theme.SECONDARY_1};
      border-color: rgba(255, 255, 255, 0.08);
      font-size: 14px;
      padding: 14px 20px;
    }

    .MuiTableHead-root .MuiTableCell-root {
      color: ${(props) => props.theme.PRIMARY_2};
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background-color: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .MuiTableBody-root .MuiTableRow-root {
      transition: background-color 0.15s ease-in-out;

      &:hover {
        background-color: rgba(212, 255, 0, 0.04);
      }

      &:last-child .MuiTableCell-root {
        border-bottom: none;
      }
    }

    /* Mobile: collapse each row into a labelled card (matches the
       platform/locations tables) so nothing scrolls off-screen. */
    ${mobile(css`
      display: block;

      .MuiTableHead-root {
        display: none;
      }

      .MuiTableBody-root,
      .MuiTableBody-root .MuiTableRow-root,
      .MuiTableCell-root {
        display: block;
        width: 100%;
      }

      .MuiTableBody-root .MuiTableRow-root {
        background-color: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 8px 16px;
        margin-bottom: 12px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.04);
        }
      }

      .MuiTableCell-root {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        text-align: right;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        &::before {
          content: attr(data-label);
          color: ${theme.SECONDARY_2};
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          flex-shrink: 0;
        }
      }

      .attendance-admin__chips {
        justify-content: flex-end;
      }

      .attendance-admin__actions-cell {
        justify-content: flex-end;
      }

      .attendance-admin__empty {
        justify-content: center;
        text-align: center;
        padding: 32px 0;

        &::before {
          content: none;
        }
      }
    `)}
  }

  .attendance-admin__employee {
    font-weight: 600;
  }

  .attendance-admin__muted {
    color: ${(props) => props.theme.SECONDARY_2};
  }

  .attendance-admin__edit {
    color: ${(props) => props.theme.SECONDARY_2};

    &:hover {
      color: ${(props) => props.theme.PRIMARY_2};
      background-color: rgba(212, 255, 0, 0.08);
    }
  }

  /* ---- Status chips --------------------------------------------------- */
  .attendance-admin__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .attendance-admin__chip {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;

    &--open {
      background-color: rgba(212, 255, 0, 0.18);
      color: ${(props) => props.theme.PRIMARY_2};
      border: 1px solid ${(props) => props.theme.PRIMARY_2};
    }

    &--auto {
      background-color: rgba(255, 165, 0, 0.18);
      color: #ffa500;
      border: 1px solid #ffa500;
    }

    &--closed {
      background-color: rgba(255, 255, 255, 0.06);
      color: ${(props) => props.theme.SECONDARY_2};
      border: 1px solid ${(props) => props.theme.SECONDARY_3};
    }
  }

  .attendance-admin__pagination {
    display: flex;
    justify-content: center;
    padding-top: 24px;

    .MuiPaginationItem-root {
      color: ${(props) => props.theme.SECONDARY_1};

      &.Mui-selected {
        background-color: ${(props) => props.theme.PRIMARY_2};
        color: ${(props) => props.theme.PRIMARY_1};

        &:hover {
          background-color: ${(props) => props.theme.PRIMARY_2};
          opacity: 0.9;
        }
      }
    }
  }
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px 0;
  min-width: 320px;

  .attendance-dialog__note {
    font-size: 12px;
    color: ${(props) => props.theme.SECONDARY_3};
  }
`;
