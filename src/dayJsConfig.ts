import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});
