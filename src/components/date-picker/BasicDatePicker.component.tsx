import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export type BasicDatePickerProps = {
  onChange: (value: Dayjs | null) => void;
  label?: string;
};

const BasicDatePickerComponent = ({
  label,
  onChange,
}: BasicDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label={label} onChange={onChange} />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default BasicDatePickerComponent;
