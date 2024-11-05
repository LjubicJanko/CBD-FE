import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';

export const FiltersModalContainer = styled(CbdModal)`
  min-width: unset;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .statuses {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;

    .filter-button {
      white-space: nowrap;
    }
  }

  .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;
