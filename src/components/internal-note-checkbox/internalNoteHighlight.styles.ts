import { css } from 'styled-components';
import theme from '../../styles/theme';

export const internalNoteHighlight = css`
  .note--internal {
    background-color: ${theme.ACCENT_SOFT};
    border-radius: 4px;

    .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.PRIMARY_2};
      border-width: 2px;
    }
  }
`;
