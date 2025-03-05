import { createGlobalStyle, css } from 'styled-components';
import { mobile } from './util/breakpoints';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: ${(props) => props.theme.SECONDARY_2} ${(props) =>
  props.theme.PRIMARY_1}; /* Firefox */
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px; /* Vertical scrollbar width */
    height: 8px; /* Horizontal scrollbar height */
  }

  *::-webkit-scrollbar-track {
    background: ${(props) => props.theme.PRIMARY_1}; /* Track color */
  }

  *::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme.SECONDARY_2}; /* Scrollbar handle color */
    border-radius: 4px;
    transition: background 0.3s ease-in-out;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.theme.SECONDARY_3}; /* Darker color on hover */
  }

  html, body {
    margin: 0;
    height: 100%;
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
    height: 100%;

    main {
      height: 100%;
      padding-top: 100px;

      ${mobile(css`
        padding-top: 80px;
      `)};

      font-family: "Afacad", serif;
      font-optical-sizing: auto;
      text-decoration-skip-ink: none;
    }
  }

  .MuiOutlinedInput-root {
    &.Mui-focused {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.theme.PRIMARY_2};
      }
    }
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
      width: 200px;

      ${mobile(css`
        width: unset;
      `)};

      li {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .MuiButtonBase-root {
    &.role-item {
      color: ${(props) => props.theme.SECONDARY_1}; 
    }
  }
`;
