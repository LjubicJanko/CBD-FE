import { createGlobalStyle, css } from 'styled-components';
import { mobile } from './util/breakpoints';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.SECONDARY_2} ${(props) =>
  props.theme.PRIMARY_1};
  }

  body {
    font-family: 'Afacad', serif;
  }

  .MuiCircularProgress-root {
    color: ${(props) => props.theme.PRIMARY_2} !important;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${(props) => props.theme.PRIMARY_1};
  }

  *::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.SECONDARY_2};
    border-radius: 4px;
    transition: background 0.3s ease-in-out;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.SECONDARY_3};
  }

  html, body {
    margin: 0;
    height: 100%;
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
    overflow-y: auto !important;

    h2, h3, p {
      margin: 0;
    }

    background-color: ${(props) => props.theme.PRIMARY_1}; 

    .MuiPopover-paper {
      background-color: ${(props) => props.theme.PRIMARY_1}; 
      color: ${(props) => props.theme.SECONDARY_1}; 
    }
  }

  #root {
    min-height: 100vh; 
    display: flex;
    flex-direction: column;

    main {
      flex: 1;
      padding-top: 100px;

      ${mobile(css`
        padding-top: 80px;
      `)};

      font-optical-sizing: auto;
      text-decoration-skip-ink: none;
    }
  }

  .MuiOutlinedInput-root {
    
    color: ${(props) => props.theme.SECONDARY_1} !important;
    
    .MuiOutlinedInput-notchedOutline {
      border-color: ${(props) => props.theme.SECONDARY_1} !important;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${(props) => props.theme.PRIMARY_2} !important;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${(props) => props.theme.PRIMARY_2} !important;
    }
  }

  .MuiInputLabel-root {
    color: ${(props) => props.theme.SECONDARY_1} !important;
  }

  .spinner-wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-menu {
    .MuiPopover-paper {
      width: 180px;

      li {
        display: flex;
        justify-content: space-between;
      }
    }

    .user-menu__language {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      border-bottom: 1px solid ${(props) => props.theme.SECONDARY_3};

      .user-menu__language__btn {
        padding: 4px;
        border-radius: 4px;
        opacity: 0.5;

        &--selected {
          opacity: 1;
          outline: 2px solid ${(props) => props.theme.PRIMARY_2};
        }
      }

      .user-menu__language__flag {
        width: 20px;
        height: 14px;
        object-fit: cover;
        border-radius: 2px;
        image-rendering: pixelated;
      }
    }
  }

  .MuiButtonBase-root {
    &.role-item {
      color: ${(props) => props.theme.SECONDARY_1};
    }
  }

  .MuiPickersPopper-root {
    .MuiPaper-root {
      background-color: ${(props) => props.theme.PRIMARY_1};
      color: ${(props) => props.theme.SECONDARY_1};
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
    }

    .MuiPickersCalendarHeader-label {
      color: ${(props) => props.theme.SECONDARY_1};
    }

    .MuiPickersArrowSwitcher-button {
      color: ${(props) => props.theme.SECONDARY_1};
    }

    .MuiDayCalendar-weekDayLabel {
      color: ${(props) => props.theme.SECONDARY_2};
    }

    .MuiPickersDay-root {
      color: ${(props) => props.theme.SECONDARY_1};

      &:hover {
        background-color: rgba(212, 255, 0, 0.15);
      }

      &.Mui-selected {
        background-color: ${(props) => props.theme.PRIMARY_2} !important;
        color: ${(props) => props.theme.PRIMARY_1} !important;
        font-weight: 700;
      }

      &.MuiPickersDay-today {
        border-color: ${(props) => props.theme.PRIMARY_2} !important;
      }
    }

    .MuiPickersYear-yearButton,
    .MuiPickersMonth-monthButton {
      color: ${(props) => props.theme.SECONDARY_1};

      &:hover {
        background-color: rgba(212, 255, 0, 0.15);
      }

      &.Mui-selected {
        background-color: ${(props) => props.theme.PRIMARY_2} !important;
        color: ${(props) => props.theme.PRIMARY_1} !important;
      }
    }

    .MuiIconButton-root {
      color: ${(props) => props.theme.SECONDARY_1};
    }
  }

  .MuiDialog-root .MuiPaper-root:has(.MuiDateCalendar-root) {
    background-color: ${(props) => props.theme.PRIMARY_1};
    color: ${(props) => props.theme.SECONDARY_1};

    .MuiPickersToolbar-root {
      background-color: rgba(212, 255, 0, 0.1);

      .MuiTypography-root {
        color: ${(props) => props.theme.SECONDARY_1};
      }

      .MuiTypography-overline {
        color: ${(props) => props.theme.SECONDARY_2};
      }
    }

    .MuiPickersCalendarHeader-label {
      color: ${(props) => props.theme.SECONDARY_1};
    }

    .MuiPickersArrowSwitcher-button {
      color: ${(props) => props.theme.SECONDARY_1};
    }

    .MuiDayCalendar-weekDayLabel {
      color: ${(props) => props.theme.SECONDARY_2};
    }

    .MuiPickersDay-root {
      color: ${(props) => props.theme.SECONDARY_1};

      &:hover {
        background-color: rgba(212, 255, 0, 0.15);
      }

      &.Mui-selected {
        background-color: ${(props) => props.theme.PRIMARY_2} !important;
        color: ${(props) => props.theme.PRIMARY_1} !important;
        font-weight: 700;
      }

      &.MuiPickersDay-today {
        border-color: ${(props) => props.theme.PRIMARY_2} !important;
      }
    }

    .MuiPickersYear-yearButton,
    .MuiPickersMonth-monthButton {
      color: ${(props) => props.theme.SECONDARY_1};

      &:hover {
        background-color: rgba(212, 255, 0, 0.15);
      }

      &.Mui-selected {
        background-color: ${(props) => props.theme.PRIMARY_2} !important;
        color: ${(props) => props.theme.PRIMARY_1} !important;
      }
    }

    .MuiDialogActions-root .MuiButton-root {
      color: ${(props) => props.theme.PRIMARY_2};
    }

    .MuiIconButton-root {
      color: ${(props) => props.theme.SECONDARY_1};
    }
  }
`;
