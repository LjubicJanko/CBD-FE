import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const EditPrintFilesModalContainer = styled(CbdModal)`
  background-color: ${theme.SECONDARY_2};

  &.edit-print-files-modal {
    h2 {
      font-weight: 400;
      font-size: 20px;
      color: ${theme.SECONDARY_1};
    }
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .print-files-input {
      width: 100%;
    }

    p {
      color: ${theme.ERROR};
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;

      &__cancel {
        color: ${theme.SECONDARY_1};
      }

      &__clear {
        color: ${theme.ERROR};
        margin-right: auto;
      }

      &__save {
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
      }
    }
  }
`;
