import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const DeleteModalContainer = styled(CbdModal)`
  min-width: 250px;
  background-color: ${theme.SECONDARY_2};

  &.delete-modal {
    h2 {
      font-weight: 400;
      font-size: 20px;
      color: ${theme.SECONDARY_1};
    }
  }

  .actions {
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    &__cancel {
      color: ${theme.SECONDARY_1};
    }
    &__confirm {
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
    }
  }
`;
