import { createGlobalStyle, css } from 'styled-components';
import { mobile } from './util/breakpoints';
import theme from './styles/theme';

export const GlobalStyle = createGlobalStyle`
    * {
      box-sizing: border-box;
    };  

    html, body {
      margin: 0;
      height: 100%;
      overflow-y: auto !important;
      h2,
      h3,
      p {
        margin: 0;
      }
      background-color: ${theme.PRIMARY_1};

      .MuiPopover-paper {
        background-color: ${theme.PRIMARY_1};
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
        font-family: Satoshi;
        text-decoration-skip-ink: none;
      }
    };

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
      `)}
      li {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .MuiButtonBase-root {
    &.role-item {
      color: white;
    }
  }
`;
