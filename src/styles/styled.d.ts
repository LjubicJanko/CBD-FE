// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
  }
}
