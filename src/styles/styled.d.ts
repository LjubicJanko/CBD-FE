// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    logo: string;
    PRIMARY_1: string;
    PRIMARY_2: string;
    SECONDARY_1: string;
    SECONDARY_2: string;
    SECONDARY_3: string;
  }
}
