import { Chip } from '@mui/material';
import classNames from 'classnames';

export type ReportFilterChipProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

// Toggle chip, same outlined-chip look as the orders filters. Styled by
// ReportTableContainer.
const ReportFilterChip = ({
    label,
    isActive,
    onClick,
}: ReportFilterChipProps) => (
    <Chip
        className={classNames('report-table__chip', {
            'report-table__chip--active': isActive,
        })}
        label={label}
        variant="outlined"
        aria-pressed={isActive}
        onClick={onClick}
    />
);

export default ReportFilterChip;
