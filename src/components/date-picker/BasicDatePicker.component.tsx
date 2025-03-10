import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export type BasicDatePickerProps = {
  value?: Dayjs | string;
  label?: string;
  errorMessage?: string;
  disablePast?: boolean;
  onChange: (value: Dayjs | null) => void;
};

const BasicDatePickerComponent = ({
  label,
  value,
  disablePast = false,
  onChange,
}: BasicDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="date-picker"
        sx={{ marginTop: '8px' }}
        format="DD.MM.YYYY"
        label={label}
        onChange={onChange}
        disablePast={disablePast}
        value={dayjs(value)}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePickerComponent;
