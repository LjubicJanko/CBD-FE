import { MenuItem, Select } from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { SortType } from '../modals/filters/FiltersModal.component';

export type ReportSortSelectProps = {
    value: SortType;
    options: { value: SortType; label: string }[];
    onChange: (sort: SortType) => void;
};

// Label above a Select, as in the orders FiltersModal sort row. Styled by
// ReportTableContainer.
const ReportSortSelect = ({
    value,
    options,
    onChange,
}: ReportSortSelectProps) => {
    const { t } = useTranslation();
    const labelId = useId();

    return (
        <div className="report-table__field">
            <label id={labelId} className="report-table__label">
                {t('sort-order')}
            </label>
            <Select
                labelId={labelId}
                size="small"
                className="report-table__select"
                value={value}
                onChange={(event) => onChange(event.target.value as SortType)}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default ReportSortSelect;
