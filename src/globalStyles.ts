import { createGlobalStyle, css } from 'styled-components';
import { mobile } from './util/breakpoints';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.SECONDARY_2} ${(props) =>
  props.theme.PRIMARY_1};
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
