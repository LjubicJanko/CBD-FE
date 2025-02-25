import { TableCell, TableContainer } from '@mui/material';
import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  color: ${theme.SECONDARY_1};

  .pause {
    font-weight: 800;
    color: ${theme.SECONDARY_1};
  }

  .pausing-value {
    text-align: end !important;
  }
`;

export const DesktopContainer = styled(TableContainer)`
  .order-info-table {
    th,
    td {
      color: ${theme.SECONDARY_1};
    }
    .pause {
      font-weight: 800;
      font-size: 18px;
    }
  }
  .pausing-value {
    font-weight: 800;
    color: ${theme.SECONDARY_1};
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
