import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';

export const ConfirmModalContainer = styled(CbdModal)`
  min-width: 250px;

  &.confirm-modal {
    h2 {
      font-weight: 400;
      font-size: 20px;
    }
  }

  .actions {
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
  }
`;
