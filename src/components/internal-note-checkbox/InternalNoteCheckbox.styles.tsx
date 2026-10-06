import styled from 'styled-components';
import theme from '../../styles/theme';

export const InternalNoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  .internal-note {
    &__label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    &__hint {
      margin: 0 0 0 32px;
      color: ${theme.PRIMARY_2};
      font-size: 12px;
      font-weight: 400;
    }
  }

  .MuiCheckbox-root {
    color: ${theme.PRIMARY_2};
  }

  .Mui-checked {
    color: ${theme.PRIMARY_2};
  }
`;
