import { css } from 'styled-components';
import theme from '../../styles/theme';

// Outlined toggle chip (ReportFilterChip), also used outside the table container.
const reportChipStyles = css`
    .report-table__chip.MuiChip-root {
        height: 32px;
        border-radius: 20px;
        color: ${theme.SECONDARY_1};
        border: 1px solid ${theme.SECONDARY_1};
        background-color: transparent;
        font-size: 14px;

        &:hover {
            background-color: ${theme.SURFACE_3};
        }

        &:focus-visible {
            outline: 2px solid ${theme.PRIMARY_2};
            outline-offset: 2px;
        }

        &.report-table__chip--active {
            color: ${theme.PRIMARY_2};
            border-color: ${theme.PRIMARY_2};
            background-color: ${theme.ACCENT_SOFT};
        }
    }
`;

export default reportChipStyles;
