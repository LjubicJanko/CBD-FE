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
  errorMessage,
  disablePast = false,
  onChange,
}: BasicDatePickerProps) => {
  // dayjs('Invalid Date') and dayjs(null/'') all produce invalid Dayjs objects
  // that MUI renders as the literal "Invalid Date" string. Pass undefined
  // instead so the picker shows its empty state and lets validation drive the
  // user to pick a real date.
  const parsed = value ? dayjs(value) : null;
  const safeValue = parsed && parsed.isValid() ? parsed : null;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="date-picker"
        sx={{ marginTop: '8px' }}
        format="DD.MM.YYYY"
        label={label}
        onChange={onChange}
        disablePast={disablePast}
        value={safeValue}
        slotProps={{
          textField: {
            error: Boolean(errorMessage),
            helperText: errorMessage,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePickerComponent;
