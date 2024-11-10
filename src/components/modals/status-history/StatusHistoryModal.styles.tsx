import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';

export const StatusChangeModalContainer = styled(CbdModal)`
  display: flex;
  flex-direction: column;
  width: unset;

  padding: 32px;

  .status-chip {
    width: fit-content;
  }

  h2 {
    font-weight: 600;
    margin-bottom: 32px;
  }

  .stepper {
    margin-bottom: 32px;
  }
`;
