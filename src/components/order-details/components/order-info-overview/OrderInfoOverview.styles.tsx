import { TableCell, TableContainer } from '@mui/material';
import styled from 'styled-components';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .pause {
    color: gray;
  }

  .pausing-value {
    text-align: end !important;
  }
`;

export const DesktopContainer = styled(TableContainer)`
  .pausing-value {
    text-align: end !important;
  }
`;

export const TableCellContainer = styled(TableCell)`
  max-width: 200px;
  white-space: normal;
  padding: 6px !important;
  &.value {
    text-align: end !important;
  }
`;
