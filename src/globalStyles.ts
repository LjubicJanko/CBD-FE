import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

    * {
      box-sizing: border-box;
    };  

    html, body {
        margin: 0;
        height: 100%;
        h2,
        h3,
        p {
          margin: 0;
        }
    }

    #root {
      height: 100%;

      main {
        height: 100%;
      }
    };

    
    .spinner-wrapper {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }


`;
