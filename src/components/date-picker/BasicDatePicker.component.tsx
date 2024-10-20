import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export type BasicDatePickerProps = {
  onChange: (value: Dayjs | null) => void;
  value?: Dayjs;
  label?: string;
};

const BasicDatePickerComponent = ({
  label,
  value,
  onChange,
}: BasicDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          className="date-picker"
          label={label}
          onChange={onChange}
          value={value}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BasicDatePickerComponent;
