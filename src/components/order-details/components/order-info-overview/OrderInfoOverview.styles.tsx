import { TableCell, TableContainer } from '@mui/material';
import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  color: ${theme.SECONDARY_1};

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    &:last-child {
      border-bottom: none;
    }

    strong {
      font-size: 12px;
      color: ${theme.PRIMARY_2};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    span {
      font-size: 15px;
      color: ${theme.SECONDARY_1};
      word-break: break-word;
    }
  }

  .pause {
    font-weight: 800;
    color: ${theme.SECONDARY_1};
  }

  .pausing-value {
    text-align: start;
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
