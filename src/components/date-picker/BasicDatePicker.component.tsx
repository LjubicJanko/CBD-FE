import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export type BasicDatePickerProps = {
  value?: Dayjs;
  label?: string;
  errorMessage?: string;
  onChange: (value: Dayjs | null) => void;
};

const BasicDatePickerComponent = ({
  label,
  value,
  onChange,
}: BasicDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="date-picker"
        sx={{ marginTop: '8px' }}
        format='DD.MM.YYYY'
        label={label}
        onChange={onChange}
        value={value}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePickerComponent;
